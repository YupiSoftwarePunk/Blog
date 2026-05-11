import { ApiService } from "../../shared/api/api-service";
import type { PostDTO } from "../../entities/post/post";

export function createLike(data: PostDTO, isLikedInitial: boolean): HTMLDivElement {
    const likeContainer = document.createElement('div');
    likeContainer.id = `like-container-${data.id}`;
    likeContainer.className = `post-like-container cursor-pointer transition-transform active:scale-90 ${isLikedInitial ? 'is-liked' : ''}`;
    likeContainer.setAttribute('data-post-id', data.id.toString());

    likeContainer.innerHTML = `
        <div class="flex items-center gap-2">
            <svg class="heart-icon w-6 h-6 transition-colors" viewBox="0 0 24 24" 
                fill="${isLikedInitial ? '#ff0000' : 'none'}" stroke="black" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span id="likes-count-${data.id}" class="font-black text-sm">${data.likesCount}</span>
        </div>
    `;

    likeContainer.onclick = async (e) => {
        e.stopPropagation();

        if ((window as any).handleLike) {
            await (window as any).handleLike(data.id, likeContainer);
        }
    };

    return likeContainer;
}