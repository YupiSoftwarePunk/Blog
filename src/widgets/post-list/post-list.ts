export const renderPostList = (): string => {
    return `
    <section class="md:col-span-8 bg-win-gray shadow-win-outset">
        <div class="bg-gradient-to-r from-win-blue to-win-blue-light p-1 flex justify-between items-center text-white px-2">
            <span class="font-bold">Feed.exe</span>
            <div class="flex gap-1">
                <button id="btn-create-post" class="bg-win-gray text-black shadow-win-outset px-2 h-4 flex items-center justify-center text-[10px] font-bold mr-4">
                    [*] Создать пост
                </button>
                <button class="bg-win-gray text-black shadow-win-outset w-4 h-4 flex items-center justify-center text-[10px]">_</button>
                <button class="bg-win-gray text-black shadow-win-outset w-4 h-4 flex items-center justify-center text-[10px]">X</button>
            </div>
        </div>
        <div class="p-4 bg-white m-1 shadow-win-inset min-h-[400px]">
            <ul id="post-list" class="space-y-4"></ul>
        </div>
    </section>`;
};