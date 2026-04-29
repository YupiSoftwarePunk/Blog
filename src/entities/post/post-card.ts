import { Post as PostType } from './post.ts';

export const renderPostCard = (post: any): string => {
    return `
    <li class="bg-win-gray shadow-win-outset p-1 mb-4 list-none border-2 border-win-white" data-id="${post.id}">
        <div class="bg-gradient-to-r from-win-blue to-win-blue-light p-1 flex justify-between items-center text-white px-2 mb-1">
            <span class="font-bold text-[10px] truncate">Post_${post.id}.exe</span>
            <div class="flex gap-1">
                <button class="bg-win-gray text-black shadow-win-outset w-3 h-3 flex items-center justify-center text-[8px] font-bold">?</button>
                <button class="bg-win-gray text-black shadow-win-outset w-3 h-3 flex items-center justify-center text-[8px] font-bold">X</button>
            </div>
        </div>

        <div class="p-3 bg-white shadow-win-inset m-1">
            <h3 class="font-bold text-sm mb-2 text-black">${post.title}</h3>
            
            ${post.image ? `
                <div class="mb-3 border-2 border-win-gray shadow-win-outset p-1 bg-win-gray">
                    <img src="${post.image}" class="w-full h-auto block border border-win-border-dark" alt="post-img" style="image-rendering: pixelated;">
                </div>
            ` : ''}

            <p class="text-[12px] leading-snug mb-4 text-black">${post.content}</p>
            
            <div class="flex flex-wrap gap-2 text-[10px] text-blue-800 underline mb-1">
                ${post.tags && post.tags.length > 0 ? post.tags.map((tag: string) => `<span>#${tag}</span>`).join('') : '<span>#win95</span>'}
            </div>
        </div>

        <div class="flex gap-2 p-1">
            <button onclick="window.likePost(${post.id})" class="bg-win-gray shadow-win-outset px-3 py-1 flex items-center gap-1 hover:active:shadow-win-inset">
                👍 Лайк <span id="likes-${post.id}">${post.views || 0}</span>
            </button>
            <button class="bg-win-gray shadow-win-outset px-3 py-1 hover:active:shadow-win-inset">
                💬 Коммент
            </button>
            <button class="bg-win-gray shadow-win-outset px-3 py-1 hover:active:shadow-win-inset">
                ➡️ Репост
            </button>
        </div>
        </div>
    </li>`;
};