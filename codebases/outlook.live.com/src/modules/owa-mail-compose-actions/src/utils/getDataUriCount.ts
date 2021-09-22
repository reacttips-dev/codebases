const dataUriRegex = new RegExp(
    '<img[^>]*\\s+src=["\']data:image\\/[^<]+;base64,\\s*[a-zA-Z0-9+\\/=&#;]+["\'][^>]*>',
    'gi'
);

export default function getDataUriCount(html: string): number {
    let result = 0;

    if (html) {
        const match = html.match(dataUriRegex);
        result = match ? match.length : 0;
    }

    return result;
}
