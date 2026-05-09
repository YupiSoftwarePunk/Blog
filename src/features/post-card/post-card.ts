import { TextFormatter } from '../../shared/lib/utils.ts';
import { renderCommentSection } from '../comment/post-comment.ts'; 

export const renderPostCard = (post: any): string => {

    const isLiked = (window as any).myLikes?.includes(post.id);

    const localTagsMap = (JSON.parse(localStorage.getItem('Blog_post_tags_map') || '{}'));
    const localImagesMap = (JSON.parse(localStorage.getItem('Blog_post_images_map') || '{}'));
    
    const tags: string[] = localTagsMap[post.id] || [];
    const image: string | null = localImagesMap[post.id] || null;

    const searchTags = [post.categoryName, ...tags]
        .filter(Boolean)
        .map(t => t!.toLowerCase());

    return `
    <li class="focusable-post post-card bg-white border-4 border-black p-2 mb-4 outline-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
        transition-all focus:ring-4 focus:ring-purple-600 focus:shadow-none focus:translate-x-1 focus:translate-y-1" 
        data-id="${post.id}"
        data-tags="${post.tags ? post.tags.join(',') : ''}"
        tabindex="0">
        <div class="flex justify-between items-start mb-4">
            <h3 class="post-title font-black text-xl uppercase italic">${TextFormatter.applyFullFormatting(post.title)}</h3>
        </div>

        ${post.image ? `
            <div class="mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <img src="${post.image}" class="w-full max-h-80  object-cover block" alt="post-img">
            </div>
        ` : ''}

        <p class="post-content font-medium text-lg leading-relaxed mb-6 text-black/80">${TextFormatter.applyFullFormatting(post.content)}</p>
        
        <div class="flex flex-wrap gap-2 mb-6">
            ${post.tags && post.tags.length > 0 
                ? post.tags.map((tag: string) => `
                    <span class="bg-purple-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">#${tag}</span>
                `).join('') 
                : '<span class="bg-green-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">#NEOBRUTALISM</span>'}
        </div>

        <div class="flex gap-4 border-t-4 border-black pt-4">
            <button 
                onclick="window.likePost(${post.id})" 
                id="like-btn-${post.id}"
                class="post-like-btn ${isLiked ? 'is-liked bg-yellow-400' : 'bg-yellow-400'} border-2 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                👍 ЛАЙК <span id="likes-${post.id}" class="ml-1">${post.likesCount || 0}</span>
            </button>
            <button onclick="window.openCommentEditor(${post.id})" class="bg-white border-2 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
            hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                💬 МНЕНИЕ
            </button>
        </div>

        ${renderCommentSection(post.id, post.comments)}
    </li>`;
};