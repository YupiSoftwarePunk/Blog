import { debounce } from '../../shared/lib/utils.ts';

let searchQuery: string = "";

export const getSearchQuery = () => searchQuery;

export const initSearchLogic = (onUpdate: () => void) => {
    const searchInput = document.getElementById('blog-search') as HTMLInputElement;
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce((e: Event) => {
        searchQuery = (e.target as HTMLInputElement).value.trim();
        onUpdate();
    }, 300));

    searchInput.closest('form')?.addEventListener('submit', (e) => e.preventDefault());
};

export const applyHighlighting = () => {
    if (!searchQuery) return;

    const titles = document.querySelectorAll('.post-title');
    const contents = document.querySelectorAll('.post-content');

    const highlight = (el: Element) => {
        const originalText = el.textContent || "";
        if (!originalText) return;

        const regex = new RegExp(`(${searchQuery})`, 'gi');
        el.innerHTML = originalText.replace(regex, '<mark class="bg-yellow-300 px-0.5 rounded-sm">$1</mark>');
    };

    titles.forEach(highlight);
    contents.forEach(highlight);
};