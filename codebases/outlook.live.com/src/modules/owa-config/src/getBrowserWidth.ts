// we will cache the width of the page to avoid layouts
let cachedBrowserWidth: number;

export function getBrowserWidth(skipCache?: boolean): number {
    /**
     * The reason we are getting min of widths here is because we have seen cases
     * where the window.innerWidth is not ready (and the value is bigger than the actual window width)
     * by the time we want to calculate the available width.
     * So far documentElement.clientWidth is showing correct value, but we are not switching to relying totally
     * on it as this is the way the browser width is being calculated.
     */
    if (!cachedBrowserWidth || skipCache) {
        const documentElementClientWidth = document?.documentElement?.clientWidth;
        cachedBrowserWidth =
            window.innerWidth && documentElementClientWidth
                ? Math.min(window.innerWidth, documentElementClientWidth)
                : window.innerWidth || documentElementClientWidth || document?.body?.clientWidth;
    }
    return cachedBrowserWidth;
}
