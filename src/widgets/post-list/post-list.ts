export const renderPostList = (): string => {
    return `
    <section class="md:col-span-8">
        <div class="flex items-center gap-3 mb-6">
            <h2 class="bg-black text-white px-4 py-1 text-xl font-black uppercase skew-x-[-10deg]">Свежие мысли:</h2>
        </div>
        <ul id="post-list" class="space-y-0"></ul>
    </section>`;
};