import type { Post } from "../../entities/post/post";

export function createLike(data: Post, isLikedInitial: boolean): HTMLDivElement {
    const likeContainer = document.createElement('div');
    likeContainer.className = `post-like-container ${isLikedInitial ? 'is-liked' : ''}`;
    likeContainer.setAttribute('data-post-id', data.authorId.toString());

    likeContainer.innerHTML = `
        <svg class="heart-icon w-4 h-4" viewBox="0 0 24 24" fill="${isLikedInitial ? 'red' : 'none'}" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    `;

    return likeContainer;
}