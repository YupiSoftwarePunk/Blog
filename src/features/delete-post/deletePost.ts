import { SaveData } from "../../shared/api/storage";

export function showConfirmDelete(postId: string | number, postElement: HTMLElement, storage: SaveData): void {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'delete-overlay fixed inset-0 bg-black/70 flex justify-center items-center z-[10000]';
    confirmOverlay.setAttribute('role', 'alertdialog');
    confirmOverlay.setAttribute('aria-modal', 'true');

    const dialog = document.createElement('div');
    dialog.className = 'bg-win-gray border-2 border-white shadow-win-outset p-4 max-w-sm w-full text-black';
    dialog.innerHTML = `
        <div class="flex justify-between items-center bg-blue-900 px-2 py-1 mb-4">
            <span class="text-white font-bold text-xs">Confirm File Delete</span>
            <button class="bg-win-gray border border-black text-[10px] px-1" onclick="this.closest('.delete-overlay').remove()">X</button>
        </div>
        <div class="flex gap-4 items-start mb-4">
            <div class="bg-yellow-400 p-2 border-2 border-black font-bold text-xl">!</div>
            <p class="text-xs">Вы уверены, что хотите навсегда удалить пост №${postId}?</p>
        </div>
        <div class="flex gap-2 justify-end">
            <button id="confirm-yes" class="bg-win-gray border-b-2 border-r-2 border-black border-t border-l border-white px-4 py-1 text-xs active:shadow-win-inset">Да</button>
            <button id="confirm-no" class="bg-win-gray border-b-2 border-r-2 border-black border-t border-l border-white px-4 py-1 text-xs active:shadow-win-inset">Отмена</button>
        </div>
    `;

    confirmOverlay.appendChild(dialog);
    document.body.appendChild(confirmOverlay);

    const yesBtn = dialog.querySelector('#confirm-yes') as HTMLButtonElement;
    const noBtn = dialog.querySelector('#confirm-no') as HTMLButtonElement;

    yesBtn.focus();

    noBtn.onclick = () => confirmOverlay.remove();
    
    yesBtn.onclick = () => {
        postElement.remove();

        const currentDynamic = storage.get<any[]>('dynamic_posts') || [];
        const updatedDynamic = currentDynamic.filter(p => String(p.id) !== String(postId));
        storage.set('dynamic_posts', updatedDynamic);

        (window as any).initTags?.();

        confirmOverlay.remove();
        console.log(`Пост ${postId} удален`);
    };
}