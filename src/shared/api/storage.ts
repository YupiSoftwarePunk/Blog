export class SaveData {
    #prefix: string;

    constructor(prefix: string = 'app_') {
        this.#prefix = prefix;
    }

    public set<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(`${this.#prefix}${key}`, serializedValue);
        } catch (error) {
            console.error('LocalStorage Write Error:', error);
        }
    }

    public get<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const item = localStorage.getItem(`${this.#prefix}${key}`);
            if (item === null) return defaultValue;
            return JSON.parse(item) as T;
        } catch (error) {
            console.error('LocalStorage Read Error:', error);
            return defaultValue;
        }
    }

    public remove(key: string): void {
        localStorage.removeItem(`${this.#prefix}${key}`);
    }

    public clear(): void {
        Object.keys(localStorage)
            .filter(k => k.startsWith(this.#prefix))
            .forEach(k => localStorage.removeItem(k));
    }

    public has(key: string): boolean {
        return localStorage.getItem(`${this.#prefix}${key}`) !== null;
    }
}