import { SaveData } from '../../shared/api/storage';
import { showConfirmDelete } from '../delete-post/deletePost'; 

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    id?: string;
    label?: string;
}

type ShortcutMap = Record<string, ShortcutConfig>;

export function initKeyboardShortcuts(storage: SaveData): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        const defaultShortcuts: ShortcutMap = {
            search: { key: '/', ctrl: true, alt: false },
            newPost: { key: 'n', ctrl: false, alt: true },
            editPost: { key: 'e', ctrl: false, alt: false },
            scrollUp: { key: 'w', ctrl: false, alt: false },
            scrollDown: { key: 's', ctrl: false, alt: false }
        };
        
        const rawData = storage.get<any>('user_shortcuts') || storage.get<any>('user_shortcuts_map');
        let userShortcuts: ShortcutMap = defaultShortcuts;

        if (rawData) {
            if (Array.isArray(rawData)) {
                userShortcuts = rawData.reduce((acc, curr) => {
                    acc[curr.id] = curr;
                    return acc;
                }, {} as ShortcutMap);
            }
            else {
                userShortcuts = rawData;
            }
        }

        const isShortcut = (config: ShortcutConfig | undefined): boolean => {
            if (!config) return false;
            return e.key.toLowerCase() === config.key.toLowerCase() && 
                e.ctrlKey === !!config.ctrl && 
                e.altKey === !!config.alt;
        };

        const modalOverlay = document.getElementById('post-modal-overlay') as HTMLElement | null;
        const postForm = document.getElementById('create-post-form') as HTMLFormElement | null;
        const titleInput = document.getElementsByName('title')[0] as HTMLInputElement | null;

        const isTyping = e.target instanceof HTMLInputElement || 
                        e.target instanceof HTMLTextAreaElement || 
                        (e.target as HTMLElement).isContentEditable;

        if (isTyping && e.key !== 'Escape') return;

        if (e.key === 'Escape') {
            if (modalOverlay) modalOverlay.classList.add('hidden');
            if (postForm) postForm.reset();
            
            document.querySelectorAll('.modal-window, .delete-overlay').forEach(m => m.remove());
            return;
        }

        if (isShortcut(userShortcuts.search)) {
            e.preventDefault();
            const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
            searchInput?.focus();
            return;
        }

        if (isShortcut(userShortcuts.newPost)) {
            e.preventDefault();
            if (modalOverlay) {
                modalOverlay.classList.remove('hidden');
                titleInput?.focus();
            }
            return;
        }

        if (!isTyping) {
            const scrollStep = 200;
            if (isShortcut(userShortcuts.scrollUp) || e.key.toLowerCase() === 'ц') {
                window.scrollBy({ top: -scrollStep, behavior: 'smooth' });
            }
            if (isShortcut(userShortcuts.scrollDown) || e.key.toLowerCase() === 'ы') {
                window.scrollBy({ top: scrollStep, behavior: 'smooth' });
            }
        }

        const activePost = (document.activeElement as HTMLElement)?.closest('.focusable-post') as HTMLElement | null;
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const allFocusable = Array.from(document.querySelectorAll('.focusable-post')) as HTMLElement[];
            if (allFocusable.length === 0) return;

            e.preventDefault();
            const currentIndex = activePost ? allFocusable.indexOf(activePost) : -1;
            
            if (e.key === 'ArrowDown' && currentIndex < allFocusable.length - 1) {
                allFocusable[currentIndex + 1].focus();
            } 
            else if (e.key === 'ArrowUp' && currentIndex > 0) {
                allFocusable[currentIndex - 1].focus();
            } 
            else if (currentIndex === -1) {
                allFocusable[0].focus();
            }
        }
    }, true);
}


export function setupPostInteractions(storage: SaveData) {
    const postList = document.querySelector('.posts-container');
    if (!postList) return;

    const refreshPostAttributes = () => {
        const posts = document.querySelectorAll('.post-item');
        posts.forEach(post => {
            if (!post.hasAttribute('tabindex')) {
                post.setAttribute('tabindex', '0');
                post.classList.add('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-800');
            }
        });
    };

    refreshPostAttributes();

    window.addEventListener('keydown', (e: KeyboardEvent) => {
        const activeElement = document.activeElement as HTMLElement;
        
        if (activeElement?.classList.contains('post-item')) {
            const postId = activeElement.dataset.id;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (postId) {
                    showConfirmDelete(postId, activeElement, storage);
                }
            }
        }
    });

    return { refreshPostAttributes };
}