export const renderSidebar = (): string => {
    return `
    <aside class="md:col-span-4 space-y-10">
        <div class="bg-blue-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 class="font-black text-xl uppercase mb-4 italic">Найти инфу</h3>
            <form class="flex flex-col gap-4">
                <input id="blog-search" type="text" placeholder="Поиск по блогу..." 
                    class="bg-white border-4 border-black p-3 font-bold outline-none focus:bg-yellow-100 placeholder:text-black/50">
            </form>
        </div>

        <div class="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 class="font-black text-xl uppercase mb-4">Облако тегов</h3>
            <div id="tags-container" class="flex flex-wrap gap-3 font-bold uppercase text-sm">
                </div>
        </div>

        <div class="bg-blue-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 class="font-black text-xl uppercase mb-4 italic">Управление</h3>
            <div class="space-y-3 font-bold text-sm uppercase">
                <div class="flex justify-between items-center border-b-2 border-black/20 pb-1">
                    <span>Поиск</span>
                    <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">CTRL + /</kbd>
                </div>
                <div class="flex justify-between items-center border-b-2 border-black/20 pb-1">
                    <span>Новый пост</span>
                    <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">ALT + N</kbd>
                </div>
                <div class="flex justify-between items-center border-b-2 border-black/20 pb-1">
                    <span>Коммент</span>
                    <div class="flex gap-1">
                        <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">C</kbd>
                    </div>
                </div>
                <div class="flex justify-between items-center border-b-2 border-black/20 pb-1">
                    <span>Изменить</span>
                    <div class="flex gap-1">
                        <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">E</kbd>
                    </div>
                </div>
                <div class="flex justify-between items-center border-b-2 border-black/20 pb-1">
                    <span>Удалить</span>
                    <div class="flex gap-1">
                        <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">DEL</kbd>
                        <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">BackSpace</kbd>
                    </div>
                </div>
                <div class="flex justify-between items-center border-b-2 border-black/20 pb-1">
                    <span>Лайк</span>
                    <div class="flex gap-1">
                        <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">SPACE</kbd>
                        <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">ENTER</kbd>
                    </div>
                </div>
                <div class="flex justify-between items-center border-b-2 border-black/20 pb-1">
                    <span>Навигация</span>
                    <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">↑ ↓ TAB</kbd>
                </div>
                <div class="flex justify-between items-center">
                    <span>Закрыть</span>
                    <kbd class="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px]">ESC</kbd>
                </div>
            </div>
        </div>

        <div class="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 class="font-black text-xl uppercase mb-4 italic">Мой профиль</h3>
            <button id="btn-open-user-modal" type="button" class="w-full bg-blue-400 text-black border-4 border-black p-3 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                Настройки аккаунта
            </button>
        </div>
    </aside>`;
};