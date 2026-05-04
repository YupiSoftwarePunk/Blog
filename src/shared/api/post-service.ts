// shared/api/postService.ts
import { ApiClient } from './api-client';

export const PostService = {
    // Получение всех постов с пагинацией (Публичный)
    getAll: (page = 1, limit = 20, category = "") => {
        return ApiClient.request<any[]>('/posts/getall', {
            method: 'POST',
            body: JSON.stringify({ page, limit, category })
        });
    },

    // Создание поста (API ключ + JWT)
    create: (title: string, content: string, categoryid: number) => {
        return ApiClient.request('/posts', {
            method: 'PUT',
            body: JSON.stringify({ title, content, categoryid })
        });
    },

    // Удаление поста (API ключ + JWT)
    delete: (id: number) => {
        return ApiClient.request(`/posts/${id}`, {
            method: 'DELETE'
        });
    },

    // Лайк (API ключ + JWT)
    toggleLike: (id: number) => {
        return ApiClient.request(`/posts/${id}/likes`, {
            method: 'POST'
        });
    },

    // Добавление комментария (API ключ)
    addComment: (postId: number, authorId: number, content: string) => {
        return ApiClient.request('/posts/comments', {
            method: 'PUT',
            body: JSON.stringify({ content, postId, authorId })
        });
    }
};