import type { Post } from "../../entities/post/post";
import { ApiClient } from "../../shared/api/api-client";

export function createLike(data: Post, isLikedInitial: boolean): HTMLDivElement {
    const likeContainer = document.createElement('div');
    likeContainer.className = `post-like-container cursor-pointer transition-transform active:scale-90 ${isLikedInitial ? 'is-liked' : ''}`;
    likeContainer.setAttribute('data-post-id', data.authorId.toString());

    likeContainer.innerHTML = `
        <svg class="heart-icon w-6 h-6 transition-colors" viewBox="0 0 24 24" fill="${isLikedInitial ? '#ff0000' : 'none'}" stroke="black" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    `;

    likeContainer.onclick = async (e) => {
        e.stopPropagation();
        try {

            await ApiClient.request(`/posts/${data.authorId}/likes`, { method: 'POST' });

            const svg = likeContainer.querySelector('svg');
            const isNowLiked = likeContainer.classList.toggle('is-liked');
            if (svg) {
                svg.setAttribute('fill', isNowLiked ? '#ff0000' : 'none');
            }
        } 
        catch (error) {
            console.error("Не удалось поставить лайк:", error);
        }
    };

    return likeContainer;
}