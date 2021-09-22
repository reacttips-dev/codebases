const rdecode = /(%[0-9A-Z]{2})+/g;

export function getCookie(key: string): string | undefined {
    // eslint-disable-next-line @microsoft/sdl/no-cookies
    const cookies = document?.cookie ? document.cookie.split('; ') : [];
    for (let ii = 0; ii < cookies.length; ii++) {
        const parts = cookies[ii].split('=');
        const name = parts[0].replace(rdecode, decodeURIComponent);
        if (name == key) {
            let value = parts.slice(1).join('=');
            if (value.charAt(0) === '"') {
                value = value.slice(1, -1);
            }
            return value.replace(rdecode, decodeURIComponent);
        }
    }

    return undefined;
}
