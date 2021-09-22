export default function formatTextToHTML(content: string): string {
    if (!content) {
        return content;
    }

    content = content.replace(/&/g, '&amp;');
    content = content.replace(/</g, '&lt;');
    content = content.replace(/>/g, '&gt;');
    content = content.replace(/'/g, '&#39;');
    content = content.replace(/"/g, '&quot;');
    content = content.replace(/^ /gm, '&nbsp;');
    content = content.replace(/(\n|\r\n)/g, '<br></div><div>');
    content = content.replace(/\s\s/g, ' &nbsp;');
    return `<div>${content}<br></div>`;
}
