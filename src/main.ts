import './style.css'
import { renderHeader } from './widgets/header/header.ts';
import { renderPostList } from './widgets/post-list/post-list.ts';
import { renderSidebar } from './widgets/sidebar/sidebar.ts';
import { renderCreatePostForm } from './features/create-post/create-post.ts';
import { renderPostCard } from './features/post-card/post-card.ts';
import { Post } from './entities/post/post.ts';

import { SaveData } from './shared/lib/storage.ts';
import { debounce } from './shared/lib/utils.ts';
import { initFormatting } from './features/formatting/formatterLogic.ts';
import { initKeyboardShortcuts, setupPostInteractions } from './features/shortcuts/shortcuts.ts';
import { showConfirmDelete } from './features/delete-post/delete-post.ts';
import { renderFooter } from './widgets/footer/footer.ts';
import { applyFilters, updateTagCloud, initFilterLogic} from './features/tag-filter/tag-filter.ts';
import { initSearchLogic, applyHighlighting, getSearchQuery } from './features/post-search/post-search.ts';
import { ApiClient } from './shared/api/api-client.ts';
import { renderLoginForm } from './features/auth/login-form.ts';
import { ApiService } from './shared/api/api-service.ts';

const blogStorage = new SaveData('Blog_');

let refreshAttributes: () => void = () => {};
let allPosts: any[] = [];
let currentCommentPostId: number | null = null;
const POSTS_PER_PAGE = 3; 
let currentVisibleCount = POSTS_PER_PAGE;

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

// const updatePostList = (reset = false) => {
//     if (reset) {
//         currentVisibleCount = POSTS_PER_PAGE;
//     }

//     const listElement = document.getElementById('post-list');
//     if (listElement) {
//         const visiblePosts = allPosts.slice(0, currentVisibleCount);
//         listElement.innerHTML = visiblePosts.map(post => renderPostCard(post)).join('');
        
//         updateTagCloud(allPosts);
//         applyFilters();
//         applyHighlighting();
//         refreshAttributes(); 
//         syncFormatting();

//         const observerTarget = document.getElementById('observer-target');
//         if (observerTarget) {
//             observerTarget.style.display = currentVisibleCount >= allPosts.length ? 'none' : 'flex';
//         }
//     }
// };

const fetchPostsFromApi = async () => {
    try {
        const apiPosts = await ApiClient.request<any[]>('/posts/getall', {
            method: 'POST',
            body: JSON.stringify({ page: 1, limit: 100, category: "" })
        });
        
        if (apiPosts && apiPosts.length > 0) {
            allPosts = apiPosts;
            savePostsToLocalStorage();
            updatePostList(true);
        }
    } 
    catch (error) {
        console.warn("Не удалось получить свежие данные, используем кэш LocalStorage.");
    }
};

const updatePostList = (reset = false) => {
    if (reset) {
        currentVisibleCount = POSTS_PER_PAGE;
    }

    const listElement = document.getElementById('post-list');
    if (listElement) {
        const visiblePosts = allPosts.slice(0, currentVisibleCount);
        listElement.innerHTML = visiblePosts.map(post => renderPostCard(post)).join('');
        
        updateTagCloud(allPosts);
        applyFilters();
        applyHighlighting();
        refreshAttributes(); 
        syncFormatting();

        const observerTarget = document.getElementById('observer-target');
        if (observerTarget) {
            observerTarget.style.display = currentVisibleCount >= allPosts.length ? 'none' : 'flex';
        }
    }
    
    const footerContainer = document.querySelector('footer');
    if (footerContainer) footerContainer.innerHTML = renderFooter(allPosts);
};


const setupIntersectionObserver = () => {
    const observerTarget = document.getElementById('observer-target');
    const loadingIndicator = document.getElementById('loading-indicator');

    if (!observerTarget) return;

    const observer = new IntersectionObserver((entries) => {
        const target = entries[0];

        if (target.isIntersecting && currentVisibleCount < allPosts.length) {

            loadingIndicator?.classList.remove('hidden');

            setTimeout(() => {
                currentVisibleCount += POSTS_PER_PAGE;
                updatePostList();
                loadingIndicator?.classList.add('hidden');
            }, 600);
        }
    }, {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    });

    observer.observe(observerTarget);
};


const initApp = () => {
    const savedPosts = blogStorage.get<any[]>('dynamic_posts');
    if (savedPosts) allPosts = savedPosts;

    const root = document.body;
    root.innerHTML = `
        ${renderHeader()}
        <div class="container mx-auto px-4">
            <main class="grid grid-cols-1 md:grid-cols-12 gap-10 pb-20">
                <div class="md:col-span-8 flex flex-col">
                    ${renderPostList()}
                    
                    <div id="observer-target" class="w-full justify-center py-10" style="display: none;">
                        <div id="loading-indicator" class="hidden bg-yellow-400 border-4 border-black px-8 py-3 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                            Загрузка...
                        </div>
                    </div>
                </div>
                ${renderSidebar()}
            </main>
        </div>
        
        <div id="post-modal-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4">
            ${renderCreatePostForm()}
        </div>
        ${renderLoginForm()} <div id="comment-modal-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4">
            <div class="bg-white border-4 border-black p-6 w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 class="font-black text-2xl uppercase mb-4 italic">Оставить мнение</h2>
                <textarea id="comment-textarea" rows="4" placeholder="Пиши по фактам..." 
                    class="w-full border-4 border-black p-3 font-bold outline-none focus:bg-yellow-100 resize-none mb-4"></textarea>
                <div class="flex justify-end gap-4">
                    <button id="cancel-comment" class="bg-red-400 text-white border-4 border-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">ОТМЕНА</button>
                    <button id="submit-comment" class="bg-purple-400 border-4 border-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">ОТПРАВИТЬ</button>
                </div>
            </div>
        </div>
        </div>

        <footer class="bg-yellow-400 border-t-4 border-black p-4 mt-10 text-center">
            ${renderFooter(allPosts)}
        </footer>
    `;

    initFilterLogic(() => allPosts);
    initSearchLogic(() => { updatePostList(true); applyHighlighting(); });
    initKeyboardShortcuts(blogStorage);

    const interactions = setupPostInteractions();
    if (interactions) refreshAttributes = interactions.refreshPostAttributes;

    updatePostList();
    setupIntersectionObserver();

    fetchPostsFromApi();

const postModal = document.getElementById('post-modal-overlay')!;
    const togglePostModal = (show: boolean) => postModal.classList.toggle('hidden', !show);
    document.getElementById('btn-create-post')?.addEventListener('click', () => togglePostModal(true));
    document.getElementById('close-modal')?.addEventListener('click', () => togglePostModal(false));
    document.getElementById('cancel-post')?.addEventListener('click', () => togglePostModal(false));

    const form = document.getElementById('create-post-form') as HTMLFormElement;
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const categoryid = 1; 

        try {
            const newPost = await ApiClient.request<any>('/posts', {
                method: 'PUT',
                body: JSON.stringify({ title, content, categoryid })
            });

            allPosts.unshift(newPost);
            savePostsToLocalStorage();
            updatePostList(true);
            togglePostModal(false);
            form.reset();
        } 
        catch (error) {
            alert("Ошибка при создании поста! Проверьте авторизацию.");
        }
    });

    const loginModal = document.getElementById('login-modal-overlay')!;
    const toggleLoginModal = (show: boolean) => loginModal.classList.toggle('hidden', !show);

    document.getElementById('btn-login')?.addEventListener('click', () => toggleLoginModal(true));
    document.getElementById('close-login-modal')?.addEventListener('click', () => toggleLoginModal(false));

    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const login = formData.get('login') as string;
        const password = formData.get('password') as string;
        const apikey = formData.get('apikey') as string;

        if (apikey) localStorage.setItem('api_key', apikey);

        try {
            const token = await ApiClient.request<string>('/users/auth', {
                method: 'POST',
                body: JSON.stringify({ login, password })
            });
            localStorage.setItem('jwt_token', token);
            alert("Успешный вход!");
            toggleLoginModal(false);
            loginForm.reset();
        } 
        catch (error) {
            alert("Неверный логин или пароль!");
        }
    });

    const commentModal = document.getElementById('comment-modal-overlay')!;
    const commentTextarea = document.getElementById('comment-textarea') as HTMLTextAreaElement;

    const closeCommentModal = () => {
        currentCommentPostId = null;
        commentModal.classList.add('hidden');
    };
    document.getElementById('cancel-comment')?.addEventListener('click', closeCommentModal);

    document.getElementById('submit-comment')?.addEventListener('click', async () => {
        if (currentCommentPostId === null) return;
        const text = commentTextarea.value.trim();

        if (text) {
            try {
                const newComment = await ApiService.Comments.create(text, currentCommentPostId, 1);

                const post = allPosts.find(p => p.id === currentCommentPostId);
                if (post) {
                    if (!post.comments) post.comments = [];
                    post.comments.push(newComment); 
                    savePostsToLocalStorage();
                    updatePostList();
                }
                closeCommentModal();
            } 
            catch (error) {
                alert("Ошибка! Вы авторизованы?");
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

    window.addEventListener('scroll', () => {
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        }
    });

    // const form = document.getElementById('create-post-form') as HTMLFormElement;
    // form?.addEventListener('submit', async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData(form);

    //     const imageInput = form.querySelector('input[name="imageFile"]') as HTMLInputElement;
    //     let finalImage = (formData.get('imageLink') as string) || null;

    //     if (imageInput.files?.[0]) {
    //         finalImage = await convertFileToBase64(imageInput.files[0]);
    //     }

    //     const newPostInstance = new Post(
    //         formData.get('title') as string,
    //         formData.get('content') as string,
    //         'user_95',
    //         (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(t => t),
    //         finalImage
    //     );

    //     allPosts.unshift(newPostInstance.createNewPost());
    //     savePostsToLocalStorage();
    //     updatePostList(true);
    //     toggleModal(false);
    //     form.reset();
    // });
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
        post.likesCount = (parseInt(post.likesCount) + 1).toString();
        const counter = document.getElementById(`likes-${id}`);
        if (counter) counter.innerText = post.likesCount;
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

(window as any).refreshAppUI = () => {
    const updated = blogStorage.get<any[]>('dynamic_posts');
    if (updated) {
        allPosts = updated;
        updatePostList();
    }
};

(window as any).initFormatting = initFormatting;

document.addEventListener('DOMContentLoaded', initApp);