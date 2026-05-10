import { SaveData } from "../../shared/lib/storage";
import { Post } from "../../entities/post/post";
import { TextFormatter } from "../../shared/lib/utils";
import { ApiService } from "../../shared/api/api-service";

const TAGS_MAP_KEY = 'post_tags_map';
const IMAGES_MAP_KEY = 'post_images_map';
const DYNAMIC_POSTS_KEY = 'dynamic_posts';

const calculateStats = (content: string) => {
    const symbols = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    
    let complexity = "Легкий";
    if (words > 200) complexity = "Средний";
    if (words > 500) complexity = "Сложный";

    return { symbols, words, complexity };
};

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
    });
};

async function getOrCreateCategoryId(tagName: string): Promise<number> {
    try {
        const categories = await ApiService.Categories.getAll();
        const existing = categories.find(c => c.name.toLowerCase() === tagName.toLowerCase().trim());
        if (existing) return existing.id;

        const slug = tagName.toLowerCase().trim().replace(/\s+/g, '-');
        const newCat = await ApiService.Categories.create(tagName, slug);
        return newCat.id;
    } 
    catch (e) {
        return 1;
    }
}

export function openEditModal(postId: string | number, allPosts: any[], storage: SaveData, updateCallback: () => void) {
    const post = allPosts.find(p => String(p.id) === String(postId));
    if (!post) return;

    // Используем wrapper SaveData для получения данных
    const imagesMap = storage.get<Record<string, string>>(IMAGES_MAP_KEY) || {};
    const tagsMap = storage.get<Record<string, string[]>>(TAGS_MAP_KEY) || {};
    
    const localImage = imagesMap[postId] || post.localImage || '';
    const localTags = tagsMap[postId] || post.tags || [];

    const stats = calculateStats(post.content);

    const overlay = document.createElement('div');
    overlay.id = 'edit-modal-overlay';
    overlay.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10001] p-4';
    
    overlay.innerHTML = `
        <div class="bg-white border-4 border-black p-0 max-w-2xl w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div class="bg-purple-500 border-b-4 border-black p-3 flex justify-between items-center">
                <span class="text-white font-black text-lg uppercase italic">Редактирование</span>
                <button id="close-edit" class="bg-white border-2 border-black w-8 h-8 flex items-center justify-center font-black hover:bg-red-400 transition-colors">✕</button>
            </div>

            <div class="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                <div class="bg-gray-100 border-2 border-black p-4 flex flex-wrap gap-6 justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div><span class="font-black uppercase text-xs block">Лайки:</span> <span class="font-bold">${post.likesCount || 0}</span></div>
                    <div><span class="font-black uppercase text-xs block">Символов:</span> <span id="stat-symbols" class="font-bold">${stats.symbols}</span></div>
                    <div><span class="font-black uppercase text-xs block">Слов:</span> <span id="stat-words" class="font-bold">${stats.words}</span></div>
                    <div><span class="font-black uppercase text-xs block">Сложность:</span> <span id="stat-complexity" class="font-bold text-purple-600">${stats.complexity}</span></div>
                </div>

                <form id="edit-post-form" class="space-y-4">
                    <div>
                        <label class="block font-black uppercase text-sm mb-1">Название поста:</label>
                        <input type="text" name="title" required value="${post.title}" class="w-full border-4 border-black p-2 font-bold focus:bg-yellow-50 outline-none">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-black uppercase text-sm mb-1">Визуал (Link/File):</label>
                            <div class="flex gap-2">
                                <input type="text" name="imageLink" placeholder="URL картинки" value="${localImage.startsWith('data:') ? '' : localImage}" class="w-1/2 border-4 border-black p-2 font-bold focus:bg-blue-50 outline-none text-xs">
                                <input type="file" name="imageFile" accept="image/*" class="w-1/2 border-4 border-black p-1 text-[10px] cursor-pointer bg-blue-50 transition-colors file:hidden">
                            </div>
                        </div>
                        <div>
                            <label class="block font-black uppercase text-sm mb-1">Теги (через запятую):</label>
                            <input type="text" name="tags" required value="${localTags.join(', ')}" class="w-full border-4 border-black p-2 font-bold focus:bg-green-50 outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block font-black uppercase text-sm mb-1">Текст поста:</label>
                        <textarea name="content" id="edit-content" required rows="6" class="w-full border-4 border-black p-3 font-bold focus:bg-yellow-50 outline-none resize-none">${post.content}</textarea>
                        <div id="edit-preview-container" class="hidden min-h-[150px] p-4 border-4 border-dashed border-black bg-gray-50 overflow-y-auto max-h-[300px]"></div>
                    </div>

                    <div class="flex flex-wrap gap-3 pt-4">
                        <button type="button" id="format-edit" class="bg-blue-500 text-white border-4 border-black px-4 py-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Форматировать всё
                        </button>
                        <div class="flex-1"></div>
                        <button type="submit" class="bg-green-500 text-white border-4 border-black px-6 py-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Сохранить
                        </button>
                        <button type="button" id="cancel-edit" class="bg-red-500 text-white border-4 border-black px-6 py-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Закрыть
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const form = overlay.querySelector('#edit-post-form') as HTMLFormElement;
    const textarea = overlay.querySelector('#edit-content') as HTMLTextAreaElement;
    const formatBtn = overlay.querySelector('#format-edit');
    const previewContainer = overlay.querySelector('#edit-preview-container') as HTMLElement;

    textarea.addEventListener('input', () => {
        const newStats = calculateStats(textarea.value);
        overlay.querySelector('#stat-symbols')!.textContent = String(newStats.symbols);
        overlay.querySelector('#stat-words')!.textContent = String(newStats.words);
        overlay.querySelector('#stat-complexity')!.textContent = newStats.complexity;
    });

    formatBtn?.addEventListener('click', () => {
        const isPreviewing = !previewContainer.classList.contains('hidden');

        if (isPreviewing) {
            previewContainer.classList.add('hidden');
            textarea.classList.remove('hidden');
            formatBtn.textContent = 'ПРЕДПРОСМОТР';
            formatBtn.classList.remove('bg-green-400');
        } 
        else {
            const formatted = TextFormatter.applyFullFormatting(textarea.value);
            previewContainer.innerHTML = formatted || '<span class="italic text-gray-400">Пусто...</span>';
            
            previewContainer.classList.remove('hidden');
            textarea.classList.add('hidden');
            formatBtn.textContent = 'РЕДАКТИРОВАТЬ';
            formatBtn.classList.add('bg-green-400');
        }
    });

    const close = () => overlay.remove();
    overlay.querySelector('#close-edit')?.addEventListener('click', close);
    overlay.querySelector('#cancel-edit')?.addEventListener('click', close);

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Сохранение...";
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const tagsString = formData.get('tags') as string;
        
        const tagsArray = tagsString.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
        const categoryName = tagsArray[0] || "Общее";

        const imageInput = form.querySelector('input[name="imageFile"]') as HTMLInputElement;
        const imageLink = formData.get('imageLink') as string;

        let finalImage: string | null = localImage; 

        if (imageInput.files?.[0]) {
            finalImage = await convertFileToBase64(imageInput.files[0]);
        } 
        else if (imageLink.trim() !== '') {
            finalImage = imageLink.trim();
        } 
        else if (imageLink.trim() === '' && !localImage.startsWith('data:')) {
            finalImage = null;
        }

        try {
            const categoryId = await getOrCreateCategoryId(categoryName);
            // Серверное обновление
            const updatedPostServer = await ApiService.Posts.update(Number(postId), title, content, categoryId);

            // Работа с метаданными через SaveData
            const currentImagesMap = storage.get<Record<string, string>>(IMAGES_MAP_KEY) || {};
            if (finalImage) currentImagesMap[postId] = finalImage;
            else delete currentImagesMap[postId];
            storage.set(IMAGES_MAP_KEY, currentImagesMap);

            const currentTagsMap = storage.get<Record<string, string[]>>(TAGS_MAP_KEY) || {};
            currentTagsMap[postId] = tagsArray;
            storage.set(TAGS_MAP_KEY, currentTagsMap);

            // Обновляем объект в массиве (по ссылке)
            post.title = updatedPostServer?.title || title;
            post.content = updatedPostServer?.content || content;
            post.categoryName = updatedPostServer?.categoryName || categoryName;
            post.tags = tagsArray;
            post.localImage = finalImage;

            // Синхронизируем весь список постов в localStorage
            storage.set(DYNAMIC_POSTS_KEY, allPosts);
            
            updateCallback();
            close();
        } 
        catch (err) {
            console.error("[Edit Error]:", err);
            alert("Ошибка сохранения на сервере. Проверьте данные и авторизацию.");
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    };
}