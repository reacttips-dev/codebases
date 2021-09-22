const SCROLL_OFFSET = 10;
export const scrollToTarget = (target, duration = 250, domPosition) => {
    if (duration < 0) {
        return;
    }
    const scrollingElement = document.scrollingElement || document.documentElement;
    const currentPosition = domPosition || scrollingElement.scrollTop;
    const isScrollingDown = target > currentPosition;
    const difference = isScrollingDown ? target - currentPosition : target + currentPosition;
    const perTick = (difference / duration) * SCROLL_OFFSET;
    const timer = setTimeout(() => {
        if ((isScrollingDown && (currentPosition >= target || currentPosition + perTick === Infinity)) ||
            (!isScrollingDown && (currentPosition <= target || currentPosition - perTick === Infinity))) {
            clearTimeout(timer);
            return;
        }
        if (isScrollingDown) {
            scrollingElement.scrollTop = currentPosition + perTick;
        }
        else {
            scrollingElement.scrollTop = currentPosition - perTick;
        }
        scrollToTarget(target, duration - SCROLL_OFFSET, scrollingElement.scrollTop);
    }, SCROLL_OFFSET);
};
export default scrollToTarget;
//# sourceMappingURL=index.js.map