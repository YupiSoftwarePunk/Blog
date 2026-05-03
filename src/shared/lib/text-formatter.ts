export const parseMarkdown = (text: string): string => {
    if (!text) return "";

    let html = text;

    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<div class="relative my-6 group"><div class="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black z-10">${lang || 'code'}</div><pre class="bg-black text-white p-4 pt-6 overflow-x-auto border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono text-sm"><code>${code.trim()}</code></pre></div>`;
    });

    html = html.replace(/^# (.*$)/gm, '<h1 class="text-4xl font-black uppercase italic border-b-4 border-black pb-2 mt-8 mb-4">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-black uppercase border-b-2 border-black pb-1 mt-6 mb-3">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-black uppercase mt-4 mb-2">$1</h3>');

    html = html.replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>');

    html = html.replace(/(<li class=".*list-disc.*">.*<\/li>\n?)+/g, (match) => {
        return `<ul class="my-4 space-y-1 ml-4">${match}</ul>`;
    });
    html = html.replace(/(<li class=".*list-decimal.*">.*<\/li>\n?)+/g, (match) => {
        return `<ol class="my-4 space-y-1 ml-4">${match}</ol>`;
    });

    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-8 border-black bg-yellow-200 p-4 my-6 italic font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">$1</blockquote>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic font-bold">$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<del class="line-through decoration-4 decoration-red-500">$1</del>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-purple-300 border-2 border-black px-1.5 py-0.5 font-mono text-sm font-bold mx-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">$1</code>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/(?<!<\/?(ul|ol|li)[^>]*>)\n(?!<\/?(ul|ol|li)[^>]*>)/g, '<br>');

    return html;
};