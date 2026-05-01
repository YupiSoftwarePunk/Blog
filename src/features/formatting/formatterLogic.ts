import { TextFormatter } from "../../shared/lib/utils.ts";

interface PostView {
    element: HTMLElement;
    content: string;
    originalTitle?: string;
}

export function initFormatting(posts: PostView[]): void {
    const btn = document.getElementById('format-posts-btn') as HTMLButtonElement | null;
    const modal = document.getElementById('format-modal') as HTMLElement | null;
    const overlay = document.getElementById('modal-overlay') as HTMLElement | null;
    const modalContent = document.getElementById('modal-content') as HTMLElement | null;

    if (!btn || !modal || !modalContent || !overlay) return;

    btn.addEventListener('click', () => {
        modalContent.innerHTML = '';
        let hasChanges = false;

        posts.forEach(post => {
            if (post.element.style.display === 'none') return;

            const originalText = post.content;
            const formattedHtml = TextFormatter.applyFullFormatting(originalText);

            if (originalText !== formattedHtml) {
                hasChanges = true;
                const postBox = document.createElement('div');
                postBox.className = 'border-b border-win-white pb-4 mb-4';

                postBox.innerHTML = `
                    <h4 class="font-bold text-sm mb-2">${post.originalTitle || 'Без названия'}</h4>
                    <div class="grid grid-cols-2 gap-4 text-[10px]">
                        <div class="p-2 bg-gray-100 border shadow-inner overflow-hidden">
                            <b class="block mb-1">До:</b>
                            <pre class="whitespace-pre-wrap">${TextFormatter.escapeHtml(originalText)}</pre>
                        </div>
                        <div class="p-2 bg-white border shadow-inner overflow-hidden">
                            <b class="block mb-1 text-blue-800">После (Preview):</b>
                            <div class="format-preview">${formattedHtml}</div>
                        </div>
                    </div>
                `;
                modalContent.append(postBox);
            }
        });

        if (!hasChanges) {
            modalContent.innerHTML = '<p class="text-center py-4 text-xs italic">Система не обнаружила изменений в разметке текущих постов.</p>';
        }

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        modal.style.display = 'block';
    });
}