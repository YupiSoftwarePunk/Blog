import './style.css'
import { renderHeader } from './widgets/header/header.ts';
import { renderPostList } from './widgets/post-list/post-list.ts';
import { renderSidebar } from './widgets/sidebar/sidebar.ts';
import { renderCreatePostForm } from './features/create-post/create-post.ts';
import { renderPostCard } from './entities/post/post-card.ts';
import { Post } from './entities/post/post.ts';

import { SaveData } from './shared/api/storage';
import { debounce } from './shared/lib/utils.ts';
import { initFormatting } from './features/formatting/formatterLogic.ts';
import { setupPostInteractions } from './features/shortcuts/shortcuts.ts';
import { showConfirmDelete } from './features/delete-post/deletePost.ts';

const blogStorage = new SaveData('Blog_');

let refreshAttributes: () => void = () => {};

let allPosts: any[] = [];


const syncFormatting = () => {
    const postElements = document.querySelectorAll('.post-card'); 
    const postsData = Array.from(postElements).map(el => ({
        element: el as HTMLElement,
        content: (el as HTMLElement).querySelector('.post-content')?.textContent || '',
        originalTitle: (el as HTMLElement).querySelector('.post-title')?.textContent || 'Без названия'
    }));
    
    initFormatting(postsData);
};

const savePostsToLocalStorage = () => {
    blogStorage.set('dynamic_posts', allPosts);
};

const updatePostList = () => {
    const listElement = document.getElementById('post-list');
    if (listElement) {
        listElement.innerHTML = allPosts.map(post => renderPostCard(post)).join('');

        refreshAttributes(); 
        syncFormatting();
    }
};


const initApp = () => {
    const savedPosts = blogStorage.get<any[]>('dynamic_posts');
    if (savedPosts) allPosts = savedPosts;

    const root = document.body;
    root.innerHTML = `
        ${renderHeader()}
        <div class="container mx-auto px-4">
            <main class="grid grid-cols-1 md:grid-cols-12 gap-10 pb-20">
                ${renderPostList()}
                ${renderSidebar()}
            </main>
        </div>
        
        <div id="post-modal-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4">
            <div class="bg-white border-4 border-black p-8 shadow-[15px_15px_0px_0px_rgba(251,191,36,1)] w-full max-width-2xl relative">
                <button id="close-modal" class="absolute -top-4 -right-4 bg-red-400 border-4 border-black w-10 h-10 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">X</button>
                ${renderCreatePostForm()}
            </div>
        </div>
    `;

    const interactions = setupPostInteractions(blogStorage);
    if (interactions) {
        refreshAttributes = interactions.refreshPostAttributes;
    }

    const modal = document.getElementById('post-modal-overlay')!;
    const createBtn = document.getElementById('btn-create-post');
    const toggleModal = (show: boolean) => modal.classList.toggle('hidden', !show);

    createBtn?.addEventListener('click', () => toggleModal(true));
    document.getElementById('close-modal')?.addEventListener('click', () => toggleModal(false));
    document.getElementById('cancel-post')?.addEventListener('click', () => toggleModal(false));

    updatePostList();

    const searchInput = document.getElementById('blog-search') as HTMLInputElement;
    if (searchInput) {
        const handleSearch = debounce((e: Event) => {
            const query = (e.target as HTMLInputElement).value.toLowerCase();
            const postCards = document.querySelectorAll('.post-card');
            
            postCards.forEach(card => {
                const text = card.textContent?.toLowerCase() || '';
                (card as HTMLElement).style.display = text.includes(query) ? 'block' : 'none';
            });
        }, 400);
        searchInput.addEventListener('input', handleSearch);
    }

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.btn-delete-post');
        
        if (deleteBtn) {
            const postElement = deleteBtn.closest('.post-card') as HTMLElement;
            const postId = postElement?.dataset.id;
            if (postId && postElement) {
                showConfirmDelete(postId, postElement, blogStorage);
            }
        }
    });

    const form = document.getElementById('create-post-form') as HTMLFormElement;
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const imageInput = form.querySelector('input[name="imageFile"]') as HTMLInputElement;
        let finalImage = (formData.get('imageLink') as string) || null;

        if (imageInput.files?.[0]) {
            finalImage = await convertFileToBase64(imageInput.files[0]);
        }

        const newPostInstance = new Post(
            formData.get('title') as string,
            formData.get('content') as string,
            'user_95',
            (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(t => t),
            finalImage
        );

        allPosts.unshift(newPostInstance.createNewPost());
        savePostsToLocalStorage();
        updatePostList();
        toggleModal(false);
        form.reset();
    });
};

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
    });
};

(window as any).likePost = (id: number) => {
    const post = allPosts.find(p => p.id === id);
    if (post) {
        post.views = (parseInt(post.views) + 1).toString();
        const counter = document.getElementById(`likes-${id}`);
        if (counter) counter.innerText = post.views;
        savePostsToLocalStorage();
    }
};

document.addEventListener('DOMContentLoaded', initApp);