import { TextFormatter } from "../../shared/lib/utils";

export function renderCommentSection(postId: number, comments: string[] = []): string {
    return `
    <div class="mt-6 border-t-4 border-black pt-4">
        <div class="comments-list space-y-2 mb-4">
            ${comments.map(c => `
                <div class="bg-blue-100 border-2 border-black p-2 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    ${TextFormatter.applyFullFormatting(c)}
                </div>
            `).join('')}
        </div>
    </div>`;
}