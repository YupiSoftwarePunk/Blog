import { SaveData } from "../../shared/api/storage";
import { Post } from "../../entities/post/post";
import { TextFormatter } from "../../shared/lib/utils";

const calculateStats = (content: string, views: string | number) => {
    const symbols = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    
    let complexity = "Легкий";
    if (words > 200) complexity = "Средний";
    if (words > 500) complexity = "Сложный";

    return { symbols, words, complexity };
};

export function openEditModal(postId: string | number, allPosts: any[], storage: SaveData, updateCallback: () => void) {
    const post = allPosts.find(p => String(p.id) === String(postId));
    if (!post) return;

    const stats = calculateStats(post.content, post.views);

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
                    <div><span class="font-black uppercase text-xs block">Дата:</span> <span class="font-bold">${post.date || '2024-01-15'}</span></div>
                    <div><span class="font-black uppercase text-xs block">Просмотры:</span> <span class="font-bold">${post.views}</span></div>
                    <div><span class="font-black uppercase text-xs block">Символов:</span> <span id="stat-symbols" class="font-bold">${stats.symbols}</span></div>
                    <div><span class="font-black uppercase text-xs block">Слов:</span> <span id="stat-words" class="font-bold">${stats.words}</span></div>
                    <div><span class="font-black uppercase text-xs block">Сложность:</span> <span id="stat-complexity" class="font-bold text-purple-600">${stats.complexity}</span></div>
                </div>

                <form id="edit-post-form" class="space-y-4">
                    <div>
                        <label class="block font-black uppercase text-sm mb-1">Название поста:</label>
                        <input type="text" name="title" value="${post.title}" class="w-full border-4 border-black p-2 font-bold focus:bg-yellow-50 outline-none">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-black uppercase text-sm mb-1">Визуал (Link):</label>
                            <input type="text" name="imageLink" value="${post.image || ''}" class="w-full border-4 border-black p-2 font-bold focus:bg-blue-50 outline-none">
                        </div>
                        <div>
                            <label class="block font-black uppercase text-sm mb-1">Теги (через запятую):</label>
                            <input type="text" name="tags" value="${post.tags ? post.tags.join(', ') : ''}" class="w-full border-4 border-black p-2 font-bold focus:bg-green-50 outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block font-black uppercase text-sm mb-1">Текст поста:</label>
                        <textarea name="content" id="edit-content" rows="6" class="w-full border-4 border-black p-3 font-bold focus:bg-yellow-50 outline-none resize-none">${post.content}</textarea>
                        <div id="edit-preview-container" class="hidden min-h-[150px] p-4 border-4 border-dashed border-black bg-gray-50 overflow-y-auto max-h-[300px]"></div>
                    </div>

                    <div class="flex flex-wrap gap-3 pt-4">
                        <button type="button" id="format-edit" class="bg-blue-500 text-white border-4 border-black px-4 py-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Форматировать всё
                        </button>
                        <div class="flex-1"></div>
                        <button type="submit" class="bg-green-500 text-white border-4 border-black px-6 py-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Сохранить изменения
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
        const newStats = calculateStats(textarea.value, post.views);
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

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        post.title = formData.get('title') as string;
        post.content = formData.get('content') as string;
        post.image = formData.get('imageLink') as string || null;
        post.tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t);

        storage.set('dynamic_posts', allPosts);
        updateCallback();
        close();
    };
}