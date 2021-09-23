import MarkdownIt from 'markdown-it';
import MarkdownItEmoji from 'markdown-it-emoji/light';
import MarkdownItSanitizer from 'markdown-it-sanitizer';

const safeMarkdown = MarkdownIt({
        html: true
    })
    .use(MarkdownItSanitizer)
    .use(MarkdownItEmoji);

const unsafeMarkdown = MarkdownIt({
    html: true
}).use(MarkdownItEmoji);

const markdownExtensions = new Set(['md', 'markdown', 'mdown']);

export function isFileMarkdown(file) {
    if (file === undefined || file === null) {
        return false;
    }
    const extension = file.extension().toLowerCase();
    return markdownExtensions.has(extension);
}

export function render(md) {
    return safeMarkdown.render(md);
}

export function renderUnsafe(md) {
    return unsafeMarkdown.render(md);
}