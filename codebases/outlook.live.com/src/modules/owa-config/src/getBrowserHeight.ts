// we will cache the height of the page to avoid layouts
let cachedBrowserHeight: number;

export function getBrowserHeight(skipCache?: boolean): number {
    /**
     * The reason we are getting min of height here is because we have seen cases
     * where the window.innerHeight is not ready (and the value is bigger than the actual window height)
     * by the time we want to calculate the available height.
     * So far documentElement.clientHeight is showing correct value, but we are not switching to relying totally
     * on it as this is the way the browser height is being calculated.
     */
    if (!cachedBrowserHeight || skipCache) {
        const documentElementClientHeight = document?.documentElement?.clientHeight;
        cachedBrowserHeight =
            window.innerHeight && documentElementClientHeight
                ? Math.min(window.innerHeight, documentElementClientHeight)
                : window.innerHeight || documentElementClientHeight || document?.body?.clientHeight;
    }
    return cachedBrowserHeight;
}
