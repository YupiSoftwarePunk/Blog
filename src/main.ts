import './style.css'
import { renderHeader } from './widgets/header/header.ts';
import { renderPostList } from './widgets/post-list/post-list.ts';
import { renderSidebar } from './widgets/sidebar/sidebar.ts';
import { renderCreatePostForm } from './features/create-post/create-post.ts';
import { renderPostCard } from './entities/post/post-card.ts';
import { Post } from './entities/post/post.ts';
import { SaveData } from './shared/api/storage';

const blogStorage = new SaveData('Blog_');

let allPosts: any[] = [];

const updatePostList = () => {
    const listElement = document.getElementById('post-list');
    if (listElement) {
        listElement.innerHTML = allPosts.map(post => renderPostCard(post)).join('');
    }
};

const savePostsToLocalStorage = () => {
    blogStorage.set('dynamic_posts', allPosts);
};

const initApp = () => {
    const savedPosts = blogStorage.get<any[]>('dynamic_posts');
    
    if (savedPosts && savedPosts.length > 0) {
        allPosts = savedPosts;
    } 
    else {
        console.log('No saved posts found, initializing with default data.');
    }

    const root = document.body;
    root.innerHTML = `
        ${renderHeader()}
        <main class="grid grid-cols-1 md:grid-cols-12 gap-6">
            ${renderPostList()}
            ${renderSidebar()}
        </main>
        <div id="post-modal-overlay" class="fixed inset-0 bg-black/40 flex items-center justify-center hidden z-50">
            ${renderCreatePostForm()}
        </div>
    `;

    const modal = document.getElementById('post-modal-overlay')!;
    const openBtn = document.querySelector('.bg-win-gray.shadow-win-outset.px-3.py-1.font-bold');
    
    const toggleModal = (show: boolean) => {
        modal.classList.toggle('hidden', !show);
    };

    document.getElementById('close-modal')?.addEventListener('click', () => toggleModal(false));
    document.getElementById('cancel-post')?.addEventListener('click', () => toggleModal(false));

    updatePostList();

    const form = document.getElementById('create-post-form') as HTMLFormElement;
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        // Извлекаем данные из полей
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const imageInput = form.querySelector('input[name="image"]') as HTMLInputElement;
        
        let imageToSave: string | null = null;

        // Если пользователь выбрал файл, конвертируем его в строку Base64
        if (imageInput.files && imageInput.files[0]) {
            imageToSave = await convertFileToBase64(imageInput.files[0]);
        } else {
            // Если вставлена просто ссылка (URL), берем её как текст
            imageToSave = formData.get('image') as string || null;
        }

        // Создаем экземпляр, передавая все параметры в конструктор, как ты и настроил
        // Порядок: title, content, authorId, tags (пустой массив по дефолту), image
        const newPostInstance = new Post(
            title,
            content,
            'admin_1',
            [], 
            imageToSave
        );

        const finalPost = newPostInstance.createNewPost();
        
        allPosts.unshift(finalPost);
        savePostsToLocalStorage();
        updatePostList();

        document.getElementById('post-modal-overlay')?.classList.add('hidden');
        form.reset();
    });

    openBtn?.addEventListener('click', () => toggleModal(true));
};

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

(window as any).likePost = (id: number) => {
    const post = allPosts.find(p => p.id === id);
    if (post) {
        post.views = (parseInt(post.views) + 1).toString();
        const likeCounter = document.getElementById(`likes-${id}`);
        if (likeCounter) likeCounter.innerText = post.views;
    }
};

document.addEventListener('DOMContentLoaded', initApp);