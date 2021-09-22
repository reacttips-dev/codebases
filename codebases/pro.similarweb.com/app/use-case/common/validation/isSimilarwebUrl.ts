type AnyFunction = (...args: any[]) => any;

const fallbackOnError = <F extends AnyFunction>(func: F, fallback: ReturnType<F>) => (
    ...args: Parameters<F>
) => {
    try {
        return func(...args);
    } catch (e) {
        return fallback;
    }
};

export const isSimilarwebUrl = fallbackOnError((url: string): boolean => {
    const parsedUrl = new URL(url, location.origin);
    return !!parsedUrl.hostname.match(/^.*similarweb\.(dev|com|ninja)$/);
}, false);
