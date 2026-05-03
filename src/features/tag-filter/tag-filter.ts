import { debounce } from '../../shared/lib/utils.ts';

let activeTag: string | null = null;
let searchQuery: string = "";

export const applyFilters = () => {
    const postCards = document.querySelectorAll('.post-card');
    
    postCards.forEach(card => {
        const htmlCard = card as HTMLElement;
        const text = htmlCard.textContent?.toLowerCase() || '';
        const tags = htmlCard.dataset.tags?.toLowerCase() || '';
        
        const matchesSearch = text.includes(searchQuery.toLowerCase());
        const matchesTag = !activeTag || tags.includes(activeTag.toLowerCase());

        if (matchesSearch && matchesTag) {
            htmlCard.style.display = 'block';
        } 
        else {
            htmlCard.style.display = 'none';
        }
    });
};

export const updateTagCloud = (allPosts: any[]) => {
    const tagsContainer = document.getElementById('tags-container');
    if (!tagsContainer) return;

    const allTags = new Set<string>();
    allPosts.forEach(post => {
        if (post.tags) post.tags.forEach((t: string) => allTags.add(t));
    });

    const tagsHtml = Array.from(allTags).map(tag => `
        <span class="tag-filter cursor-pointer bg-white border-2 border-black px-2 py-1 hover:bg-yellow-400 transition-all ${activeTag === tag ? 'bg-yellow-400 shadow-none translate-x-0.5' : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}" data-tag="${tag}">
            #${tag}
        </span>
    `).join('');

    const resetHtml = `<span class="tag-filter cursor-pointer bg-red-400 text-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] font-black">СБРОС ✕</span>`;
    
    tagsContainer.innerHTML = resetHtml + tagsHtml;
};

export const initFilterLogic = (getPosts: () => any[]) => {
    const searchInput = document.getElementById('blog-search') as HTMLInputElement;
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e: Event) => {
            searchQuery = (e.target as HTMLInputElement).value;
            applyFilters();
        }, 400));
    }

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('tag-filter') || target.classList.contains('tag-badge')) {
            const tagText = target.dataset.tag || target.textContent?.replace('#', '').trim();
            
            if (target.textContent?.includes('СБРОС')) {
                activeTag = null;
            } 
            else {
                activeTag = tagText || null;
            }

            updateTagCloud(getPosts());
            applyFilters();
        }
    });
};