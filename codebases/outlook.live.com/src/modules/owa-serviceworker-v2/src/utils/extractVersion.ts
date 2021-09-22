export default function extractVersion(url: URL): string | null {
    if (typeof URLSearchParams == 'function') {
        const searchParams = new URLSearchParams(url.search);
        return searchParams.get('version');
    }
    return null;
}
