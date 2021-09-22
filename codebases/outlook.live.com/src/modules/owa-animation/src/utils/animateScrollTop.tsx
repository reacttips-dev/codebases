import * as trace from 'owa-trace';

export function animateScrollTop(
    scrollElement: HTMLDivElement,
    newScrollTop: number,
    scrollDuration: number
) {
    if (scrollDuration < 0) {
        trace.debugErrorThatWillShowErrorPopupOnly(
            'animateScrollTop should not be called with a negative scrollDuration'
        );
        return;
    }

    if (scrollDuration == 0) {
        scrollElement.scrollTop = newScrollTop;
        return;
    }

    let initialScrollTop = scrollElement.scrollTop;
    let startTime: number;

    function onAnimationFrame() {
        let progress = Math.min((Date.now() - startTime) / scrollDuration, 1);
        scrollElement.scrollTop = initialScrollTop + (newScrollTop - initialScrollTop) * progress;
        if (progress < 1) {
            window.requestAnimationFrame(function () {
                onAnimationFrame();
            });
        }
    }

    startTime = Date.now();
    window.requestAnimationFrame(function () {
        onAnimationFrame();
    });
}
