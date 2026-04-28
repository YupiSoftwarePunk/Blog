export const renderSidebar = (): string => {
    return `
    <aside class="md:col-span-4 space-y-4">
        <div class="bg-win-gray shadow-win-outset p-1">
            <div class="bg-win-border-dark p-1 text-white px-2 font-bold mb-2 uppercase tracking-wider text-[10px]">Поиск</div>
            <div class="p-2">
                <form class="flex flex-col gap-2">
                    <input type="text" placeholder="Введите запрос..." class="bg-white shadow-win-inset p-2 outline-none focus:ring-1 ring-win-blue">
                    <button type="submit" class="bg-win-gray shadow-win-outset py-1 hover:active:shadow-win-inset">Найти</button>
                </form>
            </div>
        </div>
        <fieldset class="border-2 border-win-border-light shadow-[1px_1px_0_#808080] p-4">
            <legend class="px-2 font-bold">Теги</legend>
            <div id="tags-container" class="flex flex-wrap gap-2 text-blue-800 underline"></div>
        </fieldset>
    </aside>`;
};