const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
};

const htmlEscaper = /[&<>"'\/]/g;

export default function escapeStringForHtml(value: string) {
    return value.replace(htmlEscaper, function (match: string) {
        return htmlEscapes[match];
    });
}
