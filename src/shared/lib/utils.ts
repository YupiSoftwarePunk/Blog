import { parseMarkdown } from './text-formatter';

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

    applyFullFormatting: (text: string, keywords: string[] = []): string => {
        if (typeof text !== 'string') return '';

        let processedText = TextFormatter.escapeHtml(text);

        if (keywords.length > 0) {
            processedText = TextFormatter.highlightKeywords(keywords)(processedText);
        }

        return parseMarkdown(processedText);
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