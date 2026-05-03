export const renderFooter = (posts: any[]): string => {
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + (parseInt(post.views) || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    const activityData = last7Days.map(dayDate => {
        const dayStr = dayDate.toDateString();
        
        const count = posts.filter(p => {
            if (!p.date) return false;
            const postDate = new Date(p.date);
            return postDate.toDateString() === dayStr;
        }).length;

        return { 
            label: dayDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' }),
            count 
        };
    });

    const maxCount = Math.max(...activityData.map(d => d.count), 1);

    return `
    <footer class="mt-12 w-full border-t-4 border-black bg-white">
        <div class="h-2 w-full bg-yellow-400 border-b-2 border-black"></div>
        
        <div class="max-w-[1200px] mx-auto px-6 py-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                
                <div class="space-y-6">
                    <h3 class="text-2xl font-black uppercase italic border-b-4 border-black inline-block">Статистика блога</h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div class="text-3xl font-black">${totalPosts}</div>
                            <div class="text-[10px] uppercase font-bold text-gray-500">Посты</div>
                        </div>
                        <div class="border-4 border-black p-4 bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div class="text-3xl font-black">${totalLikes}</div>
                            <div class="text-[10px] uppercase font-bold">Просмотры</div>
                        </div>
                        <div class="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div class="text-3xl font-black">${totalComments}</div>
                            <div class="text-[10px] uppercase font-bold text-gray-500">Комм.</div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3 class="text-2xl font-black uppercase italic border-b-4 border-black inline-block">Активность (7д)</h3>
                    <div class="flex items-end justify-between h-32 bg-gray-100 border-4 border-black p-4 pb-8 relative overflow-hidden">
                        <div class="absolute inset-0 opacity-10 pointer-events-none" 
                            style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 10px 10px;"></div>
                        
                        ${activityData.map(d => `
                            <div class="group relative flex flex-col items-center w-full h-full justify-end">
                                <div class="bg-black w-3/4 transition-all duration-1000 ease-out animate-[barGrow_1.5s_ease-in-out] relative" 
                                     style="height: ${(d.count / maxCount) * 80}%; min-height: 4px;">
                                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-1 z-20">
                                        ${d.count}
                                    </span>
                                </div>
                                <span class="text-[8px] font-bold mt-1 absolute -bottom-5">${d.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="flex flex-col md:flex-row justify-center items-start md:items-center gap-12 md:gap-32 border-t-2 border-black pt-10">
                <div class="space-y-4 flex flex-col items-center md:items-start">
                    <div class="inline-block bg-black text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]">
                        <span class="text-xl font-black uppercase tracking-tighter">DENISKIS_BLOG</span>
                    </div>
                    <p class="text-sm font-bold leading-tight italic uppercase text-center md:text-left">
                        Сделано на коленке, но с душой.
                    </p>
                </div>
            </div>
        </div>

        <div class="border-t-4 border-black p-4 bg-black text-white flex flex-col md:flex-row justify-between items-center gap-4">
            <span class="text-xs font-black uppercase tracking-widest italic text-center md:text-left">
                © 2026 ALL RIGHTS RESERVED. NO BUGS, ONLY FEATURES.
            </span>
            <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" 
                class="bg-yellow-400 text-black border-2 border-black px-4 py-1 text-[10px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                Back_to_top
            </button>
        </div>
    </footer>`;
};