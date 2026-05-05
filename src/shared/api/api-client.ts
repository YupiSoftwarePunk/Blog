const BASE_URL = 'http://localhost:8080/api';

export class ApiClient {
    private static getApiKey() { return localStorage.getItem('api_key'); }
    private static getJwtToken() { return localStorage.getItem('jwt_token'); }

    static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>)
        };

        const apiKey = this.getApiKey();
        if (apiKey) headers['X-API-Key'] = apiKey;

        const token = this.getJwtToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Ошибка API: ${response.status} - ${errorData}`);
            }

            const text = await response.text();
            try {
                return (text ? JSON.parse(text) : null) as T;
            } 
            catch (e) {
                return text as unknown as T;
            }
        } 
        catch (error) {
            console.error(`[API Error] ${endpoint}:`, error);
            throw error;
        }
    }
}