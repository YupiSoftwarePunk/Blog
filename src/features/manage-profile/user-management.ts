import { ApiService } from '../../shared/api/api-service';

export const renderUserManagementModal = (): string => {
    return `
    <div id="user-management-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center hidden z-[100] p-4">
        <div class="bg-white border-4 border-black w-full max-w-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
            <div class="bg-purple-500 border-b-4 border-black p-4 flex justify-between items-center">
                <span class="text-white font-black text-xl uppercase italic">Панель пользователя</span>
                <button id="close-user-modal" type="button" class="bg-white text-black border-2 border-black w-8 h-8 flex items-center justify-center font-black hover:bg-red-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">✕</button>
            </div>
            
            <div class="p-6 overflow-y-auto space-y-8 bg-yellow-50">
                
                <div class="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h4 class="font-black uppercase text-lg mb-3">Найти пользователя</h4>
                    <div class="flex gap-3">
                        <input type="number" id="search-user-id" placeholder="ID юзера" class="flex-1 border-4 border-black p-3 font-bold focus:bg-blue-50 outline-none">
                        <button id="btn-search-user" class="bg-blue-400 text-white border-4 border-black px-6 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Искать</button>
                    </div>
                    <div id="user-search-result" class="hidden mt-4 bg-gray-100 border-4 border-black border-dashed p-4 font-bold text-sm"></div>
                </div>

                <div class="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h4 class="font-black uppercase text-lg mb-3">Изменить свои данные</h4>
                    <form id="update-profile-form" class="space-y-4">
                        <div>
                            <label class="block font-black uppercase text-xs mb-1">Логин</label>
                            <input type="text" name="login" required class="w-full border-4 border-black p-3 font-bold focus:bg-yellow-100 outline-none">
                        </div>
                        <div>
                            <label class="block font-black uppercase text-xs mb-1">Email</label>
                            <input type="email" name="email" required class="w-full border-4 border-black p-3 font-bold focus:bg-yellow-100 outline-none">
                        </div>
                        <div>
                            <label class="block font-black uppercase text-xs mb-1">О себе (Bio)</label>
                            <textarea name="bio" rows="3" required class="w-full border-4 border-black p-3 font-bold focus:bg-yellow-100 outline-none resize-none"></textarea>
                        </div>
                        <div>
                            <label class="block font-black uppercase text-xs mb-1">Новый пароль (опционально)</label>
                            <input type="password" name="password" placeholder="Оставьте пустым, если не меняете" class="w-full border-4 border-black p-3 font-bold focus:bg-yellow-100 outline-none placeholder:text-black/40">
                        </div>
                        
                        <button type="submit" class="w-full bg-green-400 text-black border-4 border-black p-3 mt-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Сохранить обновления
                        </button>
                    </form>
                </div>

                <div class="bg-red-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h4 class="font-black uppercase text-lg mb-2 text-red-600">Опасная зона</h4>
                    <p class="font-bold text-xs mb-4">После удаления восстановить аккаунт будет невозможно.</p>
                    <button id="btn-delete-profile" class="w-full bg-red-500 text-white border-4 border-black p-3 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                        Удалить аккаунт навсегда
                    </button>
                </div>
                
            </div>
        </div>
    </div>
    `;
};

export const initUserManagement = () => {
    const modal = document.getElementById('user-management-overlay');
    const openBtn = document.getElementById('btn-open-user-modal');
    const closeBtn = document.getElementById('close-user-modal');

    openBtn?.addEventListener('click', () => modal?.classList.remove('hidden'));
    closeBtn?.addEventListener('click', () => modal?.classList.add('hidden'));

    const searchBtn = document.getElementById('btn-search-user');
    const searchInput = document.getElementById('search-user-id') as HTMLInputElement;
    const searchResult = document.getElementById('user-search-result');

    searchBtn?.addEventListener('click', async () => {
        const id = Number(searchInput.value);
        if (!id || !searchResult) return;

        searchResult.classList.remove('hidden');
        searchResult.innerHTML = '<span class="animate-pulse">Ищем в базе...</span>';

        try {
            const user = await ApiService.Users.getById(id);
            const name = (user as any).username || (user as any).login || 'Неизвестно'; 
            
            searchResult.innerHTML = `
                <div class="space-y-2">
                    <div class="flex justify-between border-b-2 border-black/20 pb-1">
                        <span class="text-xs uppercase opacity-60">Логин:</span>
                        <span class="text-black">${name}</span>
                    </div>
                    <div class="flex justify-between border-b-2 border-black/20 pb-1">
                        <span class="text-xs uppercase opacity-60">Email:</span>
                        <span class="text-black">${user.email}</span>
                    </div>
                    <div class="flex flex-col pt-1">
                        <span class="text-xs uppercase opacity-60 mb-1">Био:</span>
                        <span class="text-black">${user.bio || 'Пусто...'}</span>
                    </div>
                </div>
            `;
        } 
        catch (err) {
            searchResult.innerHTML = '<span class="text-red-600">Юзер с таким ID не найден!</span>';
        }
    });

    const updateForm = document.getElementById('update-profile-form') as HTMLFormElement;
    updateForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = updateForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Сохранение...';
        submitBtn.disabled = true;

        const formData = new FormData(updateForm);
        const login = formData.get('login') as string;
        const email = formData.get('email') as string;
        const bio = formData.get('bio') as string;
        const password = formData.get('password') as string;

        try {
            await ApiService.Users.update(login, email, bio, password || undefined);
            alert('ДАННЫЕ УСПЕШНО ОБНОВЛЕНЫ!');
            updateForm.reset();
            modal?.classList.add('hidden');
        } 
        catch (err) {
            console.error('Ошибка обновления:', err);
            alert('ОШИБКА: Не удалось обновить профиль. Возможно, логин или почта уже заняты.');
        } 
        finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    const deleteBtn = document.getElementById('btn-delete-profile');
    deleteBtn?.addEventListener('click', async () => {
        const isConfirmed = confirm('СТОП! Ты уверен, что хочешь удалить свой аккаунт? Это действие нельзя отменить.');
        
        if (isConfirmed) {
            try {
                await ApiService.Users.delete();
                alert('АККАУНТ УНИЧТОЖЕН.');
                localStorage.removeItem('jwt_token');
                location.reload();
            } 
            catch (err) {
                console.error('Ошибка удаления:', err);
                alert('ОШИБКА: Не удалось удалить аккаунт.');
            }
        }
    });
};