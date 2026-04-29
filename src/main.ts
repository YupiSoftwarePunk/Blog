import './style.css'
import { renderHeader } from './widgets/header/header.ts';
import { renderPostList } from './widgets/post-list/post-list.ts';
import { renderSidebar } from './widgets/sidebar/sidebar.ts';
import { renderCreatePostForm } from './features/create-post/create-post.ts';
import { renderPostCard } from './entities/post/post-card.ts';
import { Post } from './entities/post/post.ts';

let allPosts: any[] = [];

const updatePostFeed = () => {
    const listElement = document.getElementById('post-list');
    if (listElement) {
        listElement.innerHTML = allPosts.map(post => renderPostCard(post)).join('');
    }
};

const initApp = () => {
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
    const openBtn = document.querySelector('.bg-win-gray.shadow-win-outset.px-3.py-1.font-bold'); // Кнопка "Пуск" как триггер (или добавь свою)
    
    const toggleModal = (show: boolean) => {
        modal.classList.toggle('hidden', !show);
    };

    document.getElementById('close-modal')?.addEventListener('click', () => toggleModal(false));
    document.getElementById('cancel-post')?.addEventListener('click', () => toggleModal(false));

    const form = document.getElementById('create-post-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const newPostInstance = new Post(
            formData.get('title') as string,
            formData.get('content') as string,
            'admin_1',
            ['news', 'win95']
        );

        const finalPost = newPostInstance.createNewPost();
        (finalPost as any).image = formData.get('image');

        allPosts.unshift(finalPost);
        updatePostFeed();
        toggleModal(false);
        form.reset();
    });

    openBtn?.addEventListener('click', () => toggleModal(true));
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