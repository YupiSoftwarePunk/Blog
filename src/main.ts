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
    const createBtn = document.getElementById('btn-create-post');
    
    const toggleModal = (show: boolean) => {
        modal.classList.toggle('hidden', !show);
    };

    createBtn?.addEventListener('click', () => toggleModal(true));
    document.getElementById('close-modal')?.addEventListener('click', () => toggleModal(false));
    document.getElementById('cancel-post')?.addEventListener('click', () => toggleModal(false));

    updatePostList();

    const form = document.getElementById('create-post-form') as HTMLFormElement;
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const tagsRaw = formData.get('tags') as string;
        const tagsArray = tagsRaw 
            ? tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag !== "") 
            : [];

        const imageInput = form.querySelector('input[name="imageFile"]') as HTMLInputElement;
        const imageLink = formData.get('imageLink') as string;
        
        let finalImage: string | null = imageLink || null;

        if (imageInput.files && imageInput.files[0]) {
            finalImage = await convertFileToBase64(imageInput.files[0]);
        }

        const newPostInstance = new Post(
            formData.get('title') as string,
            formData.get('content') as string,
            'user_95',
            tagsArray,
            finalImage
        );

        const finalPost = newPostInstance.createNewPost();
        
        allPosts.unshift(finalPost);
        savePostsToLocalStorage();
        updatePostList();

        toggleModal(false);
        form.reset();
    });
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