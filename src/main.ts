import './style.css'
import { renderHeader } from './widgets/header/header.ts';
import { renderPostList } from './widgets/post-list/post-list.ts';
import { renderSidebar } from './widgets/sidebar/sidebar.ts';
import { renderCreatePostForm } from './features/create-post/create-post.ts';
import { renderPostCard } from './features/post-card/post-card.ts';
import { Post } from './entities/post/post.ts';

import { SaveData } from './shared/api/storage';
import { debounce } from './shared/lib/utils.ts';
import { initFormatting } from './features/formatting/formatterLogic.ts';
import { setupPostInteractions } from './features/shortcuts/shortcuts.ts';
import { showConfirmDelete } from './features/delete-post/deletePost.ts';
import { renderFooter } from './widgets/footer/footer.ts';
import { applyFilters, updateTagCloud, initFilterLogic} from './features/tag-filter/tag-filter.ts';

const blogStorage = new SaveData('Blog_');

let refreshAttributes: () => void = () => {};
let allPosts: any[] = [];
let currentCommentPostId: number | null = null;

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
        updateTagCloud(allPosts);
        applyFilters();
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
            ${renderCreatePostForm()}
        </div>

        <div id="comment-modal-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4">
            <div class="bg-white border-4 border-black p-6 w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 class="font-black text-2xl uppercase mb-4 italic">Оставить мнение</h2>
                <textarea id="comment-textarea" rows="4" placeholder="Пиши по фактам..." 
                    class="w-full border-4 border-black p-3 font-bold outline-none focus:bg-yellow-100 resize-none mb-4"></textarea>
                <div class="flex justify-end gap-4">
                    <button id="cancel-comment" class="bg-red-400 text-white border-4 border-black px-4 py-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                        ОТМЕНА
                    </button>
                    <button id="submit-comment" class="bg-purple-400 border-4 border-black px-4 py-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                        ОТПРАВИТЬ
                    </button>
                </div>
            </div>
        </div>

        <footer class="bg-yellow-400 border-t-4 border-black p-4 mt-10 text-center">
            ${renderFooter()}
        </footer>
    `;

    initFilterLogic(() => allPosts);

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

    const commentModal = document.getElementById('comment-modal-overlay')!;
    const commentTextarea = document.getElementById('comment-textarea') as HTMLTextAreaElement;

    const closeCommentModal = () => {
        currentCommentPostId = null;
        commentModal.classList.add('hidden');
    };
    document.getElementById('cancel-comment')?.addEventListener('click', closeCommentModal);

    document.getElementById('submit-comment')?.addEventListener('click', () => {
        if (currentCommentPostId === null) return;
        const text = commentTextarea.value.trim();

        if (text) {
            const post = allPosts.find(p => p.id === currentCommentPostId);
            if (post) {
                if (!post.comments) post.comments = [];
                post.comments.push(text);

                savePostsToLocalStorage();
                updatePostList();
                closeCommentModal();
            }
        }
    });

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

(window as any).openCommentEditor = (id: number) => {
    currentCommentPostId = id;
    const modal = document.getElementById('comment-modal-overlay');
    const textarea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
    
    if (modal && textarea) {
        textarea.value = '';
        modal.classList.remove('hidden');
        textarea.focus();
    }
};

document.addEventListener('DOMContentLoaded', initApp);