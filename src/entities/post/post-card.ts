export const renderPostCard = (post: any): string => {
    return `
    <li class="post-card bg-white border-4 border-black p-5 mb-8 list-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]" data-id="${post.id}">
        <div class="flex justify-between items-start mb-4">
            <h3 class="post-title font-black text-xl uppercase tracking-tight text-black decoration-yellow-400 decoration-4 hover:underline cursor-pointer">${post.title}</h3>
            <button class="btn-delete-post border-2 border-black bg-red-400 p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 active:translate-y-0.5 active:shadow-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
        </div>

        ${post.image ? `
            <div class="mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <img src="${post.image}" class="w-full h-auto block object-cover" alt="post-img">
            </div>
        ` : ''}

        <p class="post-content font-medium text-md leading-relaxed mb-6 text-black/80">${post.content}</p>
        
        <div class="flex flex-wrap gap-2 mb-6">
            ${post.tags && post.tags.length > 0 
                ? post.tags.map((tag: string) => `
                    <span class="bg-purple-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">#${tag}</span>
                `).join('') 
                : '<span class="bg-green-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">#NEOBRUTALISM</span>'}
        </div>

        <div class="flex gap-4 border-t-4 border-black pt-4">
            <button onclick="window.likePost(${post.id})" class="bg-yellow-400 border-2 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                👍 ЛАЙК <span id="likes-${post.id}" class="ml-1">${post.views || 0}</span>
            </button>
            <button class="bg-white border-2 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                💬 МНЕНИЕ
            </button>
        </div>
    </li>`;
};