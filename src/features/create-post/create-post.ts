export const renderCreatePostForm = (): string => {
    return `
    <div id="post-modal-overlay" class="fixed inset-0 z-[1000] bg-black/10 flex items-center justify-center p-4 transition-all">
        <div class="bg-white border-4 border-black p-0 max-w-2xl w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in duration-150">
            
            <div class="bg-yellow-400 border-b-4 border-black p-2 flex justify-between items-center">
                <span class="text-sm font-black uppercase italic tracking-tight text-black">Новый пост</span>
                <button id="close-modal" class="bg-white border-2 border-black w-6 h-6 flex items-center justify-center font-black hover:bg-red-400 transition-colors">
                    ✕
                </button>
            </div>
            
            <form id="create-post-form" class="p-4 space-y-3">
                <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-black uppercase text-black/50 italic">Заголовок:</label>
                    <input type="text" name="title" required 
                        class="bg-white border-2 border-black p-2 text-sm outline-none focus:bg-yellow-50 transition-all"
                        placeholder="О чем думаешь?">
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-black uppercase text-black/50 italic">Картинка (Link/File):</label>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" name="imageLink" 
                            class="border-2 border-black p-1.5 text-[11px] outline-none focus:bg-blue-50 transition-colors"
                            placeholder="URL картинки">
                        <input type="file" name="imageFile" accept="image/*" 
                            class="border-2 border-black p-1 text-[9px] cursor-pointer bg-blue-50 file:hidden transition-colors">
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-black uppercase text-black/50 italic">Теги:</label>
                    <input type="text" name="tags" placeholder="dev, lifestyle..." 
                        class="border-2 border-black p-1.5 text-sm outline-none focus:bg-purple-50 transition-colors">
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-black uppercase text-black/50 italic">Контент:</label>
                    <textarea name="content" rows="3" required 
                        class="border-2 border-black p-2 text-sm outline-none resize-none focus:bg-green-50 transition-colors"
                        placeholder="Текст поста..."></textarea>
                </div>

                <div class="flex gap-3 pt-1">
                    <button type="submit" class="flex-1 bg-black text-white py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(251,191,36,1)] hover:bg-yellow-400 hover:text-black active:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all font-black uppercase text-xs">
                        Опубликовать
                    </button>
                    <button type="button" id="cancel-post" class="px-4 border-2 border-black font-black uppercase text-[10px] hover:bg-red-400 transition-colors">
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    </div>`;
};