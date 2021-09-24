import {easeInOutQuad} from '../library/animation/timing';

export const scrollTo = (element, position, duration = 300, callback) => {
  const startPos = typeof element.scrollTop === 'undefined' ? element.scrollY : element.scrollTop;
  let startTime = null;

  const go = ts => {
    if (!startTime) {
      startTime = ts;
    }
    const value = (position - startPos) * easeInOutQuad((ts - startTime) / duration) + startPos;
    if (typeof element.scrollTo === 'function') {
      element.scrollTo(0, value);
    } else {
      element.scrollTop = value;
    }

    if (ts - startTime < duration) {
      requestAnimationFrame(go);
    } else {
      callback && requestAnimationFrame(callback);
    }
  };
  requestAnimationFrame(go);
};

export const scrollIntoView = (scrollTarget, element, padding = 0, duration = 300, callback) => {
  const elementBounds = element.getBoundingClientRect();
  const scrollTargetBounds = scrollTarget.getBoundingClientRect();
  let scrollDistance;
  const scrollOffset =
    scrollTarget.scrollTop + scrollTargetBounds.top === 0 ? scrollTarget.scrollTop : 0;
  if (elementBounds.top < scrollTargetBounds.top + scrollTarget.scrollTop) {
    // Element is out of view above the scrollTarget
    scrollDistance = elementBounds.top - scrollTargetBounds.top - scrollOffset - padding;
  } else if (elementBounds.bottom > scrollTargetBounds.bottom + scrollTarget.scrollTop) {
    // Element is out of view below scrollTarget
    scrollDistance = elementBounds.bottom - scrollTargetBounds.bottom - scrollOffset + padding;
  } else {
    // Element is already in view, so execute the callback
    callback && callback();
    return;
  }
  const position = scrollTarget.scrollTop + scrollDistance;
  scrollTo(scrollTarget, position, duration, callback);
};
