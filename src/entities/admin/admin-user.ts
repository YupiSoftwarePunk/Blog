import { User } from '../user/user.ts';

export default class AdminUser extends User {
    #permissions: Set<string> = new Set();
    static MAX_PERMISSIONS: number = 50;
    #storage: any;
    #logs: Array<{ timestamp: string; action: string }> = [];

    constructor(id: number | string, name: string, storage: any = null) {
        super(id, name, 'admin');
        this.#storage = storage;

        if (this.#storage) {
            const saved = this.#storage.get(`admin_${this.id}`);
            if (saved) {
                if (saved.permissions) {
                    saved.permissions.forEach((p: string) => this.#permissions.add(p));
                }
                if (saved.logs) {
                    this.#logs = saved.logs;
                }
            }
        }
    }

    public grantPermission(permission: string): boolean {
        if (permission === 'admin') {
            console.log("Попытка выдать права 'admin' обычным способом отклонена.");
            this.#addLog(`Ошибка: Лимит прав достигнут при попытке добавить ${permission}`);
            return false;
        }

        if (this.#permissions.size >= AdminUser.MAX_PERMISSIONS) {
            console.log("Достигнут лимит прав!");
            this.#addLog(`Достигнут лимит прав!`);
            return false;
        }

        if (!this.#permissions.has(permission)) {
            this.#permissions.add(permission);
            console.log(`[LOG]: Администратор ${this.name} выдал право: ${permission}`);
            this.#addLog(`Администратор ${this.name} выдал право: ${permission}`);
            this.saveState();
            return true;
        }
        return false;
    }

    public revokePermission(permission: string): void {
        if (this.#permissions.delete(permission)) {
            this.saveState();
            console.log(`[LOG]: Администратор ${this.name} отозвал право: ${permission}`);
            this.#addLog(`[LOG]: Администратор ${this.name} отозвал право: ${permission}`);
        }
    }

    public override hasRole(role: string): boolean {
        if (role === 'admin') {
            console.log('Вы уже админ');
            this.#addLog(`Вы уже админ`);
            return true;
        } 
        else {
            console.log(`у вас есть роль: ${role}`);
            this.#addLog(`у вас есть роль: ${role}`);
            return this.#permissions.has(role);
        }
    }

    public getPermissions(): string[] {
        console.log(`У вас есть разрешения: ${Array.from(this.#permissions)}`);
        this.#addLog(`У вас есть разрешения: ${Array.from(this.#permissions)}`);
        return Array.from(this.#permissions);
    }

    public canManageUsers(): boolean {
        return this.#permissions.has('manage_users');
    }

    public banUser(userId: number | string, reason: string): void {
        if (!this.canManageUsers()) {
            console.error("Недостаточно прав для блокировки пользователей!");
            this.#addLog("Недостаточно прав для блокировки пользователей!");
            return;
        }
        this.#addLog(`[LOG]: Пользователь ${userId} заблокирован админом ${this.name}. Причина: ${reason}`);
        console.log(`[LOG]: Пользователь ${userId} заблокирован админом ${this.name}. Причина: ${reason}`);
    }

    public saveState(): void {
        if (!this.#storage) {
            return;
        }

        const dataToSave = {
            id: this.id,
            name: this.name,
            permissions: Array.from(this.#permissions),
            logs: this.#logs
        };
        this.#storage.set(`admin_${this.id}`, dataToSave);
    }

    #addLog(message: string): void {
        const entry = {
            timestamp: new Date().toLocaleString(),
            action: message
        };
        this.#logs.push(entry);
        console.log(`[INTERNAL LOG]: ${message}`);
        this.saveState();
    }

    public getLogs(): Array<{ timestamp: string; action: string }> {
        return [...this.#logs];
    }

    public clearHistory(): void {
        this.#logs = [];
        this.saveState();
    }

    public externalLog(message: string): void {
        this.#addLog(message);
    }
}