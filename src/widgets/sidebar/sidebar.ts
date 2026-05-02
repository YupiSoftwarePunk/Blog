export const renderSidebar = (): string => {
    return `
    <aside class="md:col-span-4 space-y-10">
        <div class="bg-blue-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 class="font-black text-xl uppercase mb-4 italic">Найти инфу</h3>
            <form class="flex flex-col gap-4">
                <input id="blog-search" type="text" placeholder="Поиск по блогу..." 
                    class="bg-white border-4 border-black p-3 font-bold outline-none focus:bg-yellow-100 placeholder:text-black/50">
                <button type="submit" class="bg-black text-white py-3 font-black uppercase hover:bg-white hover:text-black border-4 border-black transition-colors">
                    Искать!
                </button>
            </form>
        </div>

        <div class="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 class="font-black text-xl uppercase mb-4">Облако тегов</h3>
            <div id="tags-container" class="flex flex-wrap gap-3 font-bold uppercase text-sm">
                </div>
        </div>
    </aside>`;
};