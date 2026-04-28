export class User {
    public id: number | string;
    public name: string;
    public role: string;

    constructor(id: number | string, name: string, role: string = 'user') {
        this.id = id;
        this.name = name;
        this.role = role;
    }

    public hasRole(role: string): boolean {
        return this.role === role;
    }

    public getInfo(): string {
        return `Пользователь: ${this.name} (ID: ${this.id}), роль: ${this.role}`;
    }
}