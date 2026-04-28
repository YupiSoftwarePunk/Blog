import './style.css'
import { renderHeader } from './widgets/header/header.ts';
import { renderPostList } from './widgets/post-list/post-list.ts';
import { renderSidebar } from './widgets/sidebar/sidebar.ts';

const initApp = () => {
    const root = document.body;

    root.innerHTML = `
        ${renderHeader()}
        <main class="grid grid-cols-1 md:grid-cols-12 gap-6">
            ${renderPostList()}
            ${renderSidebar()}
        </main>
        <div id="post-modal-overlay" class="fixed inset-0 bg-black/40 flex items-center justify-center hidden z-50">...</div>
    `;

    console.log("Приложение загружено");
};

document.addEventListener('DOMContentLoaded', initApp);