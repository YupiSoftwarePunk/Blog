export const renderPostList = (): string => {
    return `
    <section class="md:col-span-8 bg-win-gray shadow-win-outset">
        <div class="bg-gradient-to-r from-win-blue to-win-blue-light p-1 flex justify-between items-center text-white px-2">
            <span class="font-bold">Welcome.exe</span>
            <div class="flex gap-1">
                <button class="bg-win-gray text-black shadow-win-outset w-4 h-4 flex items-center justify-center text-[10px]">_</button>
                <button class="bg-win-gray text-black shadow-win-outset w-4 h-4 flex items-center justify-center text-[10px]">X</button>
            </div>
        </div>
        <div class="p-4 bg-white m-1 shadow-win-inset min-h-[200px]">
            <p class="mb-4">Добро пожаловать в систему!</p>
            <p>Здесь вы найдете много интересной информации.</p>
            <div class="mt-8 border-t border-win-border-dark pt-4">
                <ul id="post-list" class="space-y-2"></ul>
            </div>
        </div>
    </section>`;
};