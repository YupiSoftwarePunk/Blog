export const renderLoginForm = (): string => {
    return `
    <div id="login-modal-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4">
        <div class="bg-white border-4 border-black w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">

            <div class="flex border-b-4 border-black bg-black">
                <button id="tab-login" class="flex-1 p-3 font-black uppercase text-sm tracking-tighter bg-yellow-400 text-black border-r-4 border-black transition-all">Вход</button>
                <button id="tab-register" class="flex-1 p-3 font-black uppercase text-sm tracking-tighter bg-black text-white hover:bg-zinc-800 transition-all">Регистрация</button>
                <button id="close-login-modal" class="p-3 bg-white border-l-4 border-black font-black hover:bg-red-400 transition-colors">✕</button>
            </div>

            <div class="p-6">
                <form id="auth-form" class="space-y-4 block">
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-black uppercase text-black/50 italic">Логин:</label>
                        <input type="text" name="login" required class="border-4 border-black p-2.5 text-sm font-bold outline-none focus:bg-yellow-50">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-black uppercase text-black/50 italic">Пароль:</label>
                        <input type="password" name="password" required class="border-4 border-black p-2.5 text-sm font-bold outline-none focus:bg-yellow-50">
                    </div>
                    <button type="submit" 
                        class="w-full bg-blue-400 border-4 border-black py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                        hover:bg-blue-500 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none
                        active:shadow-none active:translate-x-[4px] active:translate-y-[4px] 
                        transition-all outline-none">
                        Войти в систему
                    </button>
                </form>

                <form id="register-form" class="space-y-3 hidden">
                    <div class="grid grid-cols-2 gap-3">
                        <div class="flex flex-col gap-1">
                            <label class="text-[10px] font-black uppercase text-black/50 italic">Логин:</label>
                            <input type="text" name="login" required class="border-4 border-black p-2 text-sm font-bold outline-none focus:bg-yellow-50">
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-[10px] font-black uppercase text-black/50 italic">Email:</label>
                            <input type="email" name="email" required class="border-4 border-black p-2 text-sm font-bold outline-none focus:bg-yellow-50">
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-black uppercase text-black/50 italic">Пароль:</label>
                        <input type="password" name="password" required class="border-4 border-black p-2 text-sm font-bold outline-none focus:bg-yellow-50">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-black uppercase text-black/50 italic">О себе (Bio):</label>
                        <textarea name="bio" rows="2" class="border-4 border-black p-2 text-sm font-bold outline-none focus:bg-yellow-50 resize-none"></textarea>
                    </div>
                    <button type="submit" 
                        class="w-full bg-purple-400 border-4 border-black py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                        hover:bg-purple-500 hover:translate-x-[4px] hover:translate-y-[4px] 
                        active:shadow-none active:translate-x-[4px] active:translate-y-[4px] 
                        transition-all outline-none hover:shadow-none">
                        Создать аккаунт
                    </button>
                </form>
            </div>
        </div>
    </div>`;
};