import { ApiClient } from './api-client.ts';
import { type PostDTO } from '../../entities/post/post.ts';
import { type CategoryDTO } from '../../entities/category/category.ts';
import { type CommentDTO } from '../../entities/comment/comment.ts';

export interface UserDTO {
    id: number;
    username: string;
    email: string;
    bio: string;
}

export const ApiService = {
    // АУТЕНТИФИКАЦИЯ И КЛЮЧИ
    Keys: {
        create: (bio: string, group: string) => 
            ApiClient.request<string>('/keys', { method: 'PUT', body: JSON.stringify({ bio, group }) })
    },

    Users: {
        auth: (login: string, password: string) => 
            ApiClient.request<string>('/users/auth', { method: 'POST', body: JSON.stringify({ login, password }) }),
        
        register: (login: string, email: string, password: string, bio: string) => 
            ApiClient.request<UserDTO>('/users', { method: 'PUT', body: JSON.stringify({ login, email, password, bio }) }),
        
        getById: (id: number) => 
            ApiClient.request<UserDTO>(`/users/${id}`),
        
        update: (login: string, email: string, bio: string, password?: string) => 
            ApiClient.request<UserDTO>('/users/update', { method: 'POST', body: JSON.stringify({ login, email, bio, password }) }),
        
        delete: () => 
            ApiClient.request<UserDTO>('/users', { method: 'DELETE' })
    },

    // КАТЕГОРИИ
    Categories: {
        getAll: () => 
            ApiClient.request<CategoryDTO[]>('/categories'),
        
        create: (name: string, slug: string) => 
            ApiClient.request<CategoryDTO>('/categories', { method: 'PUT', body: JSON.stringify({ name, slug }) }),
        
        delete: (id: number) => 
            ApiClient.request<CategoryDTO>(`/categories/${id}`, { method: 'DELETE' })
    },

    // ПОСТЫ
    Posts: {
        getAll: (page = 1, limit = 20, category = "") => 
            ApiClient.request<PostDTO[]>('/posts/getall', { method: 'POST', body: JSON.stringify({ page, limit, category }) }),
        
        getById: (id: number) => 
            ApiClient.request<PostDTO>(`/posts/${id}`),
        
        create: (title: string, content: string, categoryid: number) => 
            ApiClient.request<PostDTO>('/posts', { method: 'PUT', body: JSON.stringify({ title, content, categoryid }) }),
        
        update: (id: number, title: string, content: string, categoryid: number) => 
            ApiClient.request<PostDTO>(`/posts/${id}`, { method: 'POST', body: JSON.stringify({ title, content, categoryid: String(categoryid) }) }),
        
        delete: (id: number) => 
            ApiClient.request<PostDTO>(`/posts/${id}`, { method: 'DELETE' }),
        
        toggleLike: (id: number) => 
            ApiClient.request<string>(`/posts/${id}/likes`, { method: 'POST' })
    },

    // КОММЕНТАРИИ
    Comments: {
        create: (content: string, postId: number, authorId: number) => 
            ApiClient.request<CommentDTO>('/posts/comments', { method: 'PUT', body: JSON.stringify({ content, postId, authorId }) }),
        
        delete: (id: number) => 
            ApiClient.request<CommentDTO>(`/posts/comments/${id}`, { method: 'DELETE' })
    }
};