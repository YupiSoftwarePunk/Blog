export const renderFooter = (): string => {
    return `
    <footer class="mt-12 w-full border-t-4 border-black bg-white">
        <div class="h-2 w-full bg-yellow-400 border-b-2 border-black"></div>
        
        <div class="max-w-[1200px] mx-auto px-6 py-10">
            <div class="flex flex-col md:flex-row justify-center items-start md:items-center gap-12 md:gap-32">
                
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