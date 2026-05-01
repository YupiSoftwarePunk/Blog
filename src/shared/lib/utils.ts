export interface TextStats {
    chars: number;
    words: number;
    complexity: "Легкий" | "Средний" | "Сложный";
}

export const TextFormatter = {
    escapeHtml: (text: string): string => {
        if (typeof text !== 'string') return '';
        const replacements: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return text.replace(/[&<>"'/]/g, (match) => replacements[match]);
    },

    truncate: (maxLengthOrText: number | string, ellipsis: string | number = '...') => {
        if (typeof maxLengthOrText === 'string') {
            const text = maxLengthOrText;
            const limit = typeof ellipsis === 'number' ? ellipsis : 100;
            return text.length > limit ? text.substring(0, limit).trim() + '...' : text;
        }

        return (text: string): string => {
            if (typeof text !== 'string') return '';
            const maxLength = maxLengthOrText as number;
            return text.length > maxLength 
                ? text.substring(0, maxLength).trim() + (ellipsis as string) 
                : text;
        };
    },

    highlightKeywords: (keywords: string[] = [], className: string = 'highlight') => {
        return (text: string): string => {
            if (!text) return '';
            const safeText = TextFormatter.escapeHtml(text);
            if (!keywords.length) return safeText;

            const pattern = keywords
                .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                .join('|');
            
            const regex = new RegExp(`(${pattern})`, 'gi');
            return safeText.replace(regex, `<mark class="${className}">$1</mark>`);
        };
    },

    syntaxHighlight: (code: string): string => {
        let html = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return html
            .replace(/("(.*?)"|'(.*?)'|`(.*?)`)/g, '<span class="token-string">$1</span>')
            .replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>')
            .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|class|new|async|await)\b/g, '<span class="token-keyword">$1</span>')
            .replace(/\b(console|window|document|Math|JSON|Object|Array)\b/g, '<span class="token-builtin">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
    },

    applyFullFormatting: (text: string): string => {
        if (!text) return '';

        const codeRegex = /\`\`\`(?:(\w+)\n)?([\s\S]*?)\`\`\`/g;
        let parts: Array<{type: 'text' | 'code', content: string, lang?: string}> = [];
        let lastIndex = 0;
        let match;

        while ((match = codeRegex.exec(text)) !== null) {
            parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
            parts.push({ type: 'code', lang: match[1] || 'javascript', content: match[2].trim() });
            lastIndex = codeRegex.lastIndex;
        }
        parts.push({ type: 'text', content: text.substring(lastIndex) });

        const keywordHighlighter = TextFormatter.highlightKeywords(['js', 'текст', 'реакт', 'код']);
        let resultHtml = "";

        parts.forEach(part => {
            if (part.type === 'code') {
                const highlightedCode = TextFormatter.syntaxHighlight(part.content);
                resultHtml += `<pre class="code-block shadow-win-inset p-2 bg-black text-white overflow-x-auto" data-lang="${part.lang}"><code>${highlightedCode}</code></pre>`;
            } 
            else {
                let textContent = keywordHighlighter(part.content);
                textContent = textContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                textContent = textContent.replace(/\*(.*?)\*/g, '<em>$1</em>');

                const lines = textContent.replace(/\r/g, '').split('\n');
                let inList = false;
                let listType: 'ul' | 'ol' | '' = '';
                let processedLines: string[] = [];

                lines.forEach(line => {
                    const ulMatch = line.match(/^[ \t]*[-*][ \t]+(.*)$/);
                    const olMatch = line.match(/^[ \t]*\d+\.[ \t]+(.*)$/);

                    if (ulMatch || olMatch) {
                        const currentType = ulMatch ? 'ul' : 'ol';
                        const content = ulMatch?.[1] ?? olMatch?.[1] ?? '';

                        if (!inList || listType !== currentType) {
                            if (inList) processedLines.push(`</${listType}>`);
                            processedLines.push(`<${currentType} class="list-inside list-disc ml-4">`);
                            inList = true;
                            listType = currentType;
                        }
                        processedLines.push(`<li>${content}</li>`);
                    } 
                    else {
                        if (inList) {
                            processedLines.push(`</${listType}>`);
                            inList = false;
                            listType = '';
                        }
                        processedLines.push(line.trim() !== '' ? `${line}<br>` : '<br>');
                    }
                });

                if (inList) processedLines.push(`</${listType}>`);
                resultHtml += processedLines.join('\n');
            }
        });

        return resultHtml.replace(/(<br>\n*)+$/, '');
    },

    getStats: (text: string): TextStats => {
        if (typeof text !== 'string' || !text.trim()) {
            return { chars: 0, words: 0, complexity: "Легкий" };
        }
        const chars = text.length;
        const words = text.trim().split(/\s+/).length;
        let complexity: TextStats["complexity"] = "Легкий";
        if (words > 50 || chars > 300) complexity = "Средний";
        if (words > 100 || text.includes("```")) complexity = "Сложный";
        return { chars, words, complexity };
    }
};

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 300) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}