import { SaveData } from "../../shared/lib/storage";
import { ApiClient } from "../../shared/api/api-client";

export function showConfirmDelete(postId: string | number, postElement: HTMLElement, storage: SaveData): void {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'delete-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[10000] p-4';

    const dialog = document.createElement('div');
    dialog.className = 'bg-white border-4 border-black p-0 max-w-sm w-full shadow-[12px_12px_0px_0px_rgba(239,68,68,1)]';
    dialog.innerHTML = `
        <div class="bg-red-500 border-b-4 border-black p-2 flex justify-between items-center">
            <span class="text-white font-black text-sm uppercase italic">Внимание!</span>
            <button class="bg-white border-2 border-black w-6 h-6 flex items-center justify-center font-bold text-xs" onclick="this.closest('.delete-overlay').remove()">✕</button>
        </div>
        <div class="p-6">
            <div class="flex gap-4 items-center mb-6">
                <div class="bg-yellow-400 border-4 border-black w-12 h-12 flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">!</div>
                <p class="font-bold text-sm leading-tight uppercase">Удалить пост №${postId} безвозвратно?</p>
            </div>
            <div class="flex gap-3">
                <button id="confirm-yes" class="flex-1 bg-black text-white py-2 font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    Да, удаляй
                </button>
                <button id="confirm-no" class="flex-1 bg-white border-4 border-black py-2 font-black uppercase hover:bg-gray-100 transition-all">
                    Нет, стоп
                </button>
            </div>
        </div>
    `;

    confirmOverlay.appendChild(dialog);
    document.body.appendChild(confirmOverlay);

    const yesBtn = dialog.querySelector('#confirm-yes') as HTMLButtonElement;
    const noBtn = dialog.querySelector('#confirm-no') as HTMLButtonElement;

    noBtn.onclick = () => confirmOverlay.remove();

    yesBtn.onclick = async () => {
        try {
            await ApiClient.request(`/posts/${postId}`, { method: 'DELETE' });

            postElement.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                postElement.remove();
                const currentDynamic = storage.get<any[]>('dynamic_posts') || [];
                const updatedDynamic = currentDynamic.filter(p => String(p.id) !== String(postId));
                storage.set('dynamic_posts', updatedDynamic);
                confirmOverlay.remove();
            }, 300);
        } 
        catch (error) {
            console.error("Ошибка при удалении поста:", error);
            alert("Не удалось удалить пост. Проверьте права доступа.");
            confirmOverlay.remove();
        }
    };
}