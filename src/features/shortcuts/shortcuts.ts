import { SaveData } from '../../shared/lib/storage';
import { showConfirmDelete } from '../delete-post/delete-post'; 
import { openEditModal } from '../edit-post/edit-post';

export function initKeyboardShortcuts(storage: SaveData): void {
    console.log('Система горячих клавиш инициализирована');

    window.addEventListener('keydown', (e: KeyboardEvent) => {
        const isTyping = e.target instanceof HTMLInputElement || 
                        e.target instanceof HTMLTextAreaElement || 
                        (e.target as HTMLElement).isContentEditable;

        if (isTyping && e.key !== 'Escape') return;

        console.log(`[KEY_EVENT]: Клавиша: "${e.key}", Code: "${e.code}", Ctrl: ${e.ctrlKey}, Alt: ${e.altKey}`);

        if (e.key === 'Escape') {
            console.log('-> Действие: Закрытие всех окон');
            const modalOverlay = document.getElementById('post-modal-overlay');
            if (modalOverlay) modalOverlay.classList.add('hidden');
            document.querySelectorAll('.delete-overlay, #comment-modal-overlay').forEach(m => m.classList.add('hidden'));

            const dynamicModals = document.querySelectorAll('#edit-modal-overlay, .delete-overlay');
            dynamicModals.forEach(modal => {
                modal.remove();
            });

            const logReg = document.getElementById('login-modal-overlay');
            if (logReg) logReg.classList.add('hidden');

            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
            return;
        }

        // --- ГЛОБАЛЬНЫЕ СОЧЕТАНИЯ ---
        if ((e.key === '/' || e.code === 'Slash') && e.ctrlKey) {
            e.preventDefault();
            const searchInput = document.getElementById('blog-search') as HTMLInputElement | null;
            if (searchInput) {
                console.log('Действие: Фокус и прокрутка к поиску');
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                searchInput.focus();
            } 
            else {
                console.error(' ОШИБКА: Элемент #blog-search не найден в DOM');
            }
            return;
        }

        if (e.key.toLowerCase() === 'n' && e.altKey) {
            e.preventDefault();
            console.log('-> Действие: Открытие формы поста');
            document.getElementById('post-modal-overlay')?.classList.remove('hidden');
            (document.getElementsByName('title')[0] as HTMLElement)?.focus();
            return;
        }

        const scrollStep = 250;
        if (e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 'ц') {
            window.scrollBy({ top: -scrollStep, behavior: 'smooth' });
        }
        if (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'ы') {
            window.scrollBy({ top: scrollStep, behavior: 'smooth' });
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const allPosts = Array.from(document.querySelectorAll('.post-card')) as HTMLElement[];
            if (allPosts.length === 0) return;

            e.preventDefault();
            const activePost = document.activeElement as HTMLElement;
            const currentIndex = allPosts.indexOf(activePost);
            
            if (e.key === 'ArrowDown' && currentIndex < allPosts.length - 1) {
                allPosts[currentIndex + 1].focus();
            } 
            else if (e.key === 'ArrowUp' && currentIndex > 0) {
                allPosts[currentIndex - 1].focus();
            } 
            else if (currentIndex === -1) {
                allPosts[0].focus();
            }
            return;
        }

        // --- ДЕЙСТВИЯ С ВЫДЕЛЕННЫМ ПОСТОМ ---
        const focusedPost = document.activeElement?.closest('.post-card') as HTMLElement | null;
        if (focusedPost) {
            const postId = focusedPost.dataset.id;
            if (!postId) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                console.log(`-> Действие: Удаление поста ${postId}`);
                showConfirmDelete(postId, focusedPost, storage);
            }

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log(`-> Действие: Лайк поста ${postId}`);
                (window as any).likePost(Number(postId));
            }

            if (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'с') {
                e.preventDefault();
                console.log(`-> Действие: Комментирование поста ${postId}`);
                (window as any).openCommentEditor(Number(postId));
            }

            if (e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'у') {
                e.preventDefault();
                console.log(`-> Действие: Редактирование поста ${postId}`);
                const allPosts = storage.get<any[]>('dynamic_posts') || [];
    
                openEditModal(postId, allPosts, storage, () => {
                    (window as any).refreshAppUI?.();
                });
            }
        }
    }, true);
}

export function setupPostInteractions() {
    const refreshPostAttributes = () => {
        console.log('Обновление атрибутов фокуса для постов...');
        const posts = document.querySelectorAll('.post-card');
        posts.forEach(post => {
            if (!post.hasAttribute('tabindex')) {
                post.setAttribute('tabindex', '0');
            }
        });
    };

    return { refreshPostAttributes };
}