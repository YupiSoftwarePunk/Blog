export const renderPostList = (): string => {
    return `
    <section class="md:col-span-8">
        <div class="flex items-center gap-3 mb-8">
            <h2 class="bg-black text-white px-6 py-2 text-2xl font-black uppercase skew-x-[-10deg] shadow-[6px_6px_0px_0px_rgba(168,85,247,1)]">
                Свежие мысли:
            </h2>
        </div>
        <ul id="post-list" class="flex flex-col space-y-12 list-none p-0"></ul>
    </section>`;
};