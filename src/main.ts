import './style.css'
import { renderHeader } from './widgets/header/header.ts';
import { renderPostList } from './widgets/post-list/post-list.ts';
import { renderSidebar } from './widgets/sidebar/sidebar.ts';
import { renderCreatePostForm } from './features/create-post/create-post.ts';
import { renderPostCard } from './features/post-card/post-card.ts';
import { type PostDTO } from './entities/post/post.ts';

import { SaveData } from './shared/lib/storage.ts';
import { initFormatting } from './features/formatting/formatterLogic.ts';
import { initKeyboardShortcuts, setupPostInteractions } from './features/shortcuts/shortcuts.ts';
import { showConfirmDelete } from './features/delete-post/delete-post.ts';
import { renderFooter } from './widgets/footer/footer.ts';
import { applyFilters, updateTagCloud, initFilterLogic} from './features/tag-filter/tag-filter.ts';
import { initSearchLogic, applyHighlighting, getSearchQuery } from './features/post-search/post-search.ts';
import { renderLoginForm } from './features/auth/login-form.ts';
import { ApiService } from './shared/api/api-service.ts';
import {createLike} from './features/toggle-like/post-like.ts';

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

const getLocalImagesMap = () => blogStorage.get<Record<number, string>>('post_images_map') || {};
const saveImageToLocal = (postId: number, base64: string) => {
    const map = getLocalImagesMap();
    map[postId] = base64;
    blogStorage.set('post_images_map', map);
};

const TAGS_MAP_KEY = 'post_tags_map';
const IMAGES_MAP_KEY = 'post_images_map';

const getLocalTags = () => blogStorage.get<Record<number, string[]>>(TAGS_MAP_KEY) || {};
const getLocalImages = () => blogStorage.get<Record<number, string>>(IMAGES_MAP_KEY) || {};

const saveMetadata = (postId: number, tags: string[], image: string | null) => {
    const tagsMap = getLocalTags();
    const imagesMap = getLocalImages();
    
    if (tags.length) tagsMap[postId] = tags;
    if (image) imagesMap[postId] = image;
    
    blogStorage.set(TAGS_MAP_KEY, tagsMap);
    blogStorage.set(IMAGES_MAP_KEY, imagesMap);
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

let myLikes: number[] = blogStorage.get<number[]>('my_liked_posts') || [];
(window as any).myLikes = blogStorage.get<number[]>('my_liked_posts') || [];

const saveMyLikes = () => {
    blogStorage.set('my_liked_posts', myLikes);
};

const fetchPostsFromApi = async () => {
    try {
        const apiPosts = await ApiService.Posts.getAll(1, 50);
        const imagesMap = getLocalImagesMap();

        if (apiPosts) {
            allPosts = apiPosts.map(apiPost => ({
                ...apiPost,
                localImage: imagesMap[apiPost.id] || apiPost.localImage || null,
            }));
            
            savePostsToLocalStorage();
            updatePostList(true);
        }
    } 
    catch (error) {
        console.warn("Сервер недоступен, показываем кэш из localStorage");
        updatePostList(true);
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

        visiblePosts.forEach(post => {
            const container = document.getElementById(`like-placeholder-${post.id}`);
            if (container) {
                const isLiked = myLikes.includes(post.id);

                container.innerHTML = ''; 
                container.appendChild(createLike(post, isLiked));
            }
        });

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

        const tagString = formData.get('tags') as string;
        const tagsArray = tagString.split(',').map(t => t.trim().toLowerCase()).filter(t => t);

        const imageInput = form.querySelector('input[name="imageFile"]') as HTMLInputElement;
        const imageLink = formData.get('imageLink') as string;
        let base64Image: string | null = imageLink || null;
        if (imageInput.files?.[0]) {
            base64Image = await convertFileToBase64(imageInput.files[0]);
        }

        const categoryName = tagsArray[0] || "Общее";
        const categoryId = await getCategoryIdByName(categoryName);

        try {
            const serverPost = await ApiService.Posts.create(
                formData.get('title') as string,
                formData.get('content') as string,
                categoryId
            );
            saveMetadata(serverPost.id, tagsArray, base64Image);

            allPosts.unshift(serverPost);
            savePostsToLocalStorage();
            updatePostList(true);
            
            document.getElementById('post-modal-overlay')?.classList.add('hidden');
            form.reset();
        } 
        catch (err) {
            alert("Ошибка при сохранении поста на сервере");
        }
    });


    const loginModal = document.getElementById('login-modal-overlay')!;
    const toggleLoginModal = (show: boolean) => loginModal.classList.toggle('hidden', !show);

    document.getElementById('btn-login')?.addEventListener('click', () => toggleLoginModal(true));
    document.getElementById('close-login-modal')?.addEventListener('click', () => toggleLoginModal(false));

    const tabLogin = document.getElementById('tab-login')!;
    const tabReg = document.getElementById('tab-register')!;
    const authForm = document.getElementById('auth-form') as HTMLFormElement;
    const regForm = document.getElementById('register-form') as HTMLFormElement;

    const switchTab = (mode: 'login' | 'reg') => {
        if (mode === 'login') {
            authForm.classList.remove('hidden');
            regForm.classList.add('hidden');
            tabLogin.className = "flex-1 p-3 font-black uppercase text-sm bg-yellow-400 text-black border-r-4 border-black transition-all";
            tabReg.className = "flex-1 p-3 font-black uppercase text-sm bg-black text-white hover:bg-zinc-800 transition-all";
        } 
        else {
            regForm.classList.remove('hidden');
            authForm.classList.add('hidden');
            tabReg.className = "flex-1 p-3 font-black uppercase text-sm bg-yellow-400 text-black transition-all";
            tabLogin.className = "flex-1 p-3 font-black uppercase text-sm bg-black text-white border-r-4 border-black hover:bg-zinc-800 transition-all";
        }
    };

    tabLogin.onclick = () => switchTab('login');
    tabReg.onclick = () => switchTab('reg');

    authForm.onsubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(authForm);
        const login = data.get('login') as string;
        const password = data.get('password') as string;

        try {
            const token = await ApiService.Users.auth(login, password);
            localStorage.setItem('jwt_token', token);
            alert("Вход выполнен!");
            location.reload(); 
        } 
        catch (err) {
            alert("Ошибка входа! Проверьте данные.");
        }
    };

    regForm.onsubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(regForm);
        try {
            await ApiService.Users.register(
                data.get('login') as string,
                data.get('email') as string,
                data.get('password') as string,
                data.get('bio') as string
            );
            alert("Регистрация завершена! Теперь войдите.");
            switchTab('login');
            regForm.reset();
        } 
        catch (err) {
            alert("Ошибка регистрации! Логин или Email может быть занят.");
        }
    };

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
                const postIndex = allPosts.findIndex(p => p.id === currentCommentPostId);
                if (postIndex !== -1) {
                    if (!allPosts[postIndex].comments) allPosts[postIndex].comments = [];

                    allPosts[postIndex].comments.push(newComment); 

                    savePostsToLocalStorage();
                    updatePostList(); 
                }
                closeCommentModal();
                commentTextarea.value = '';
            } 
            catch (error) {
                alert("Не удалось отправить комментарий. Проверьте авторизацию.");
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

const getCategoryIdByName = async (name: string): Promise<number> => {
    try {
        const categories = await ApiService.Categories.getAll();
        const found = categories.find(c => c.name.toLowerCase() === name.toLowerCase().trim());
        return found ? found.id : 1; 
    } 
    catch {
        return 1;
    }
};

(window as any).updateGlobalPostState = (postId: number, updates: Partial<PostDTO>) => {
    const postIndex = allPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        allPosts[postIndex] = { ...allPosts[postIndex], ...updates };
        savePostsToLocalStorage();
    }
};

(window as any).likePost = async (id: number) => {
    try {
        const newCountStr = await ApiService.Posts.toggleLike(id);
        const newCount = parseInt(newCountStr);

        let myLikes = (window as any).myLikes;
        if (myLikes.includes(id)) {
            myLikes = myLikes.filter((itemId: number) => itemId !== id);
        }
        else {
            myLikes.push(id);
        }
        (window as any).myLikes = myLikes;
        blogStorage.set('my_liked_posts', myLikes);

        const btn = document.getElementById(`like-btn-${id}`);
        const counter = document.getElementById(`likes-${id}`);
        
        if (btn) {
            const isNowLiked = myLikes.includes(id);
        }

        if (counter) {
            counter.innerText = newCount.toString();
        }

        (window as any).updateGlobalPostState(id, { likesCount: newCount });

    } 
    catch (error) {
        alert("Не удалось поставить лайк. Вы вошли в систему?");
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

(window as any).deleteComment = async (commentId: number, postId: number) => {
    if (!confirm('Удалить этот комментарий безвозвратно?')) return;

    try {
        await ApiService.Comments.delete(commentId);

        const postIndex = allPosts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
            allPosts[postIndex].comments = allPosts[postIndex].comments.filter(
                (c: any) => c.id !== commentId
            );

            savePostsToLocalStorage();

            updatePostList();
        }

        console.log(`Мнение #${commentId} стерто из истории.`);
    } catch (error) {
        console.error(error);
        alert("Не удалось удалить комментарий. Возможно, у вас недостаточно прав.");
    }
};


(window as any).initFormatting = initFormatting;

document.addEventListener('DOMContentLoaded', initApp);