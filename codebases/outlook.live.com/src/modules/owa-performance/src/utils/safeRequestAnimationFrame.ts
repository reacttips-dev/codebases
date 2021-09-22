export default function (
    callback: (isVisible: boolean) => void
): ReturnType<typeof window.requestAnimationFrame> | undefined {
    // requestAnimationFrame won't get called if the page is not visible. So let's make sure the page is
    // currently visible. If not, then let's end the action here as there is no render time
    if (window.document && window.document.visibilityState == 'visible') {
        return window.requestAnimationFrame(function endActionWithTime() {
            callback(true);
        });
    } else {
        callback(false);
        return undefined;
    }
}
