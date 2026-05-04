export const renderLoginForm = (): string => {
    return `
    <div id="login-modal-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4 transition-all">
        <div class="bg-white border-4 border-black p-0 w-full max-w-sm shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-150">
            
            <div class="bg-blue-400 border-b-4 border-black p-3 flex justify-between items-center">
                <span class="text-lg font-black uppercase italic tracking-tight text-black">Вход в систему</span>
                <button id="close-login-modal" type="button" class="bg-white border-2 border-black w-8 h-8 flex items-center justify-center font-black hover:bg-red-400 transition-colors">
                    ✕
                </button>
            </div>
            
            <form id="login-form" class="p-6 space-y-5">
                <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-black uppercase text-black/50 italic">Логин (API):</label>
                    <input type="text" name="login" required 
                        class="bg-white border-4 border-black p-3 text-sm font-bold outline-none focus:bg-yellow-50 transition-all"
                        placeholder="john_doe">
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-black uppercase text-black/50 italic">Пароль:</label>
                    <input type="password" name="password" required 
                        class="border-4 border-black p-3 text-sm font-bold outline-none focus:bg-blue-50 transition-colors"
                        placeholder="••••••••">
                </div>

                <div class="flex flex-col gap-1 mb-4">
                    <label class="text-[10px] font-black uppercase text-black/50 italic">API Ключ (Опционально):</label>
                    <input type="text" name="apikey" 
                        class="border-4 border-black p-2 text-xs font-mono outline-none focus:bg-green-50 transition-colors"
                        placeholder="a1b2c3d4e5f6...">
                </div>

                <div class="pt-2">
                    <button type="submit" class="w-full bg-black text-white py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:bg-blue-400 hover:text-black active:shadow-none active:translate-x-1 active:translate-y-1 transition-all font-black uppercase text-lg">
                        ВОЙТИ
                    </button>
                </div>
            </form>
        </div>
    </div>`;
};