export const renderCreatePostForm = (): string => {
    return `
    <div class="bg-white border-4 border-black p-0 w-full max-w-[500px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div class="bg-yellow-400 border-b-4 border-black p-3 flex justify-between items-center">
            <span class="text-lg font-black uppercase italic">Новая запись</span>
            <button id="close-modal" class="bg-red-400 border-2 border-black w-8 h-8 flex items-center justify-center font-black hover:bg-white transition-colors">
                ✕
            </button>
        </div>
        
        <form id="create-post-form" class="p-6 space-y-5">
            <div class="flex flex-col gap-2">
                <label class="text-sm">Заголовок темы:</label>
                <input type="text" name="title" required 
                    class="bg-white border-4 border-black p-3 outline-none focus:bg-yellow-50 focus:translate-x-1 focus:translate-y-1 transition-all"
                    placeholder="О чем думаешь?">
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm">Визуал (Link/File):</label>
                <div class="space-y-3">
                    <input type="text" name="imageLink" 
                        class="w-full bg-white border-4 border-black p-2 text-xs outline-none focus:bg-blue-50"
                        placeholder="https://image-url.com">
                    <div class="flex items-center gap-3 bg-blue-200 border-4 border-black p-2">
                        <span class="text-[10px] uppercase font-black">Или файл:</span>
                        <input type="file" name="imageFile" accept="image/*" class="text-[10px] cursor-pointer">
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm">Теги (через запятую):</label>
                <input type="text" name="tags" placeholder="dev, lifestyle, art" 
                    class="bg-white border-4 border-black p-2 outline-none focus:bg-purple-50">
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm">Контент:</label>
                <textarea name="content" rows="4" required 
                    class="bg-white border-4 border-black p-3 outline-none resize-none focus:bg-green-50"
                    placeholder="Напиши что-нибудь крутое..."></textarea>
            </div>

            <div class="flex gap-4 pt-2">
                <button type="submit" class="flex-1 bg-black text-white py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    Опубликовать
                </button>
                <button type="button" id="cancel-post" class="px-6 border-4 border-black font-black uppercase hover:bg-red-200 transition-colors">
                    Отмена
                </button>
            </div>
        </form>
    </div>`;
};



// обнвленная версия, но нужно добавить ввод тегов и выбор файлов для картинки 
// и кнопка закрытия пока не робит
// export const renderCreatePostForm = (): string => {
//     return `
//     <div class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//         <div class="bg-white border-4 border-black w-full max-w-[500px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-200">
//             <div class="bg-yellow-400 border-b-4 border-black p-3 flex justify-between items-center">
//                 <span class="text-lg font-black uppercase italic">New_Post.exe</span>
//                 <button id="close-modal" class="bg-red-400 border-2 border-black w-8 h-8 flex items-center justify-center font-black hover:bg-white transition-colors">
//                     ✕
//                 </button>
//             </div>
            
//             <form id="create-post-form" class="p-6 space-y-5">
//                 <div class="flex flex-col gap-2">
//                     <label class="text-sm font-black uppercase">Заголовок:</label>
//                     <input type="text" name="title" required 
//                         class="bg-white border-4 border-black p-3 outline-none focus:bg-yellow-50 focus:translate-x-1 focus:translate-y-1 transition-all">
//                 </div>

//                 <div class="flex flex-col gap-2">
//                     <label class="text-sm font-black uppercase">Визуал:</label>
//                     <input type="text" name="imageLink" placeholder="URL картинки..." 
//                         class="w-full bg-white border-4 border-black p-2 text-xs outline-none focus:bg-blue-50">
//                 </div>

//                 <div class="flex flex-col gap-2">
//                     <label class="text-sm font-black uppercase">Контент:</label>
//                     <textarea name="content" rows="4" required 
//                         class="bg-white border-4 border-black p-3 outline-none resize-none focus:bg-green-50"></textarea>
//                 </div>

//                 <div class="flex gap-4 pt-2">
//                     <button type="submit" class="flex-1 bg-black text-white py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase">
//                         Опубликовать
//                     </button>
//                 </div>
//             </form>
//         </div>
//     </div>`;
// };