export const renderCreatePostForm = (): string => {
    return `
    <div class="bg-win-gray shadow-win-outset w-[450px] p-1">
        <div class="bg-win-blue p-1 flex justify-between items-center text-white px-2 mb-2">
            <span>NewPost.exe</span>
            <button id="close-modal" class="bg-win-gray text-black shadow-win-outset w-4 h-4 flex items-center justify-center text-[10px] font-bold">&times;</button>
        </div>
        
        <form id="create-post-form" class="p-3 space-y-4">
            <div class="flex flex-col gap-1">
                <label class="font-bold">Название:</label>
                <input type="text" name="title" required class="bg-white shadow-win-inset p-1 outline-none focus:ring-1 ring-win-blue">
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold">Изображение:</label>
                <div class="flex flex-col gap-2">
                    <input type="text" name="imageLink" placeholder="Вставьте ссылку на картинку..." class="bg-white shadow-win-inset p-1 outline-none text-[12px]">
                    <div class="flex items-center gap-2">
                        <span class="text-[11px]">или выберите файл:</span>
                        <input type="file" name="imageFile" accept="image/*" class="text-[10px]">
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold">Хештеги (через запятую):</label>
                <input type="text" name="tags" placeholder="win95, dev, blog" class="bg-white shadow-win-inset p-1 outline-none">
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold">Текст поста:</label>
                <textarea name="content" rows="4" required class="bg-white shadow-win-inset p-1 outline-none resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2">
                <button type="submit" class="bg-win-gray shadow-win-outset px-6 py-1 font-bold hover:active:shadow-win-inset">Опубликовать</button>
                <button type="button" id="cancel-post" class="bg-win-gray shadow-win-outset px-6 py-1 hover:active:shadow-win-inset">Отмена</button>
            </div>
        </form>
    </div>`;
};