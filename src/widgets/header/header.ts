export const renderHeader = (): string => {
    return `
    <header class="bg-yellow-400 border-b-4 border-black p-4 mb-10 sticky top-0 z-40">
        <div class="container mx-auto flex justify-between items-center">
            <div class="flex items-center gap-4">
                <div class="bg-white border-4 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <img src="/duck.jpg" class="w-10 h-10 object-cover" alt="Logo">
                </div>
                <h1 class="font-black text-2xl uppercase tracking-tighter italic">Deniskis_Blog</h1>
            </div>
            <button id="btn-create-post" class="bg-white border-4 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                + Написать пост
            </button>
        </div>
    </header>`;
};