export const renderHeader = (): string => {
    return `
    <header class="bg-win-gray shadow-win-outset p-1 mb-6 flex items-center gap-2">
        <button class="bg-win-gray shadow-win-outset px-3 py-1 font-bold flex items-center gap-2 hover:active:shadow-win-inset">
            <img src="img/cover.jpg" class="w-4 h-4 rounded-sm" alt="Start">
            Пуск
        </button>
        <div class="h-6 w-[2px] bg-win-border-dark shadow-[1px_0_0_#fff]"></div>
        <h1 class="text-sm px-2 truncate">Блог Мистера Денискиса</h1>
    </header>`;
};