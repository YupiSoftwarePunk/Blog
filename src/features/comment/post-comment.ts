import { TextFormatter } from "../../shared/lib/utils";
import type { CommentDTO } from "../../entities/comment/comment";

export function renderCommentSection(postId: number, comments: CommentDTO[] = []): string {
    return `
    <div class="mt-6 border-t-4 border-black pt-4">
        <h4 class="font-black uppercase text-sm mb-3 italic">Мнения (${comments.length}):</h4>
        <div class="comments-list space-y-3 mb-4">
            ${comments.map(c => `
                <div class="bg-blue-50 border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group">
                    <div class="flex justify-between items-center mb-1">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] bg-black text-white px-1 uppercase font-black">@${c.authorLogin}</span>
                            <span class="text-[10px] text-zinc-500">${new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <button 
                            onclick="window.deleteComment(${c.id}, ${postId})"
                            class="opacity-0 group-hover:opacity-100 bg-red-500 text-white border border-black px-1.5 text-[8px] font-black uppercase hover:bg-black transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                            title="Удалить мнение"
                        >
                            Удалить ×
                        </button>
                    </div>
                    <p class="text-xs font-bold leading-tight">
                        ${TextFormatter.applyFullFormatting(c.content)}
                    </p>
                </div>
            `).join('')}
        </div>
    </div>`;
}