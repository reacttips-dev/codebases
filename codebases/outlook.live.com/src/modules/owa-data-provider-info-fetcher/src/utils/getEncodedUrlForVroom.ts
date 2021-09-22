export function getEncodedUrlForVroom(location: string): string {
    let base64Value: string;
    try {
        base64Value = btoa(location);
    } catch {
        base64Value = btoa(unescape(encodeURIComponent(location)));
    } finally {
        return 'u!' + base64Value.replace(/=+$/, '').replace('/', '_').replace('+', '-');
    }
}
