export function renderCommentSection(postId: number, comments: string[] = []): string {
    return `
    <div class="mt-6 border-t-4 border-black pt-4">
        <div class="comments-list space-y-2 mb-4">
            ${comments.map(c => `
                <div class="bg-blue-100 border-2 border-black p-2 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    ${c}
                </div>
            `).join('')}
        </div>
        <div class="flex gap-2">
            <input type="text" id="input-comment-${postId}" placeholder="Напиши коммент..." 
                class="flex-1 border-2 border-black p-2 text-xs outline-none focus:bg-yellow-50">
            <button onclick="window.addComment(${postId})" 
                class="bg-black text-white px-4 py-2 text-xs font-black uppercase hover:bg-purple-600 transition-all">
                OK
            </button>
        </div>
    </div>`;
}