// adapted from https://www.npmjs.com/package/react-sticky-box
// https://github.com/codecks-io/react-sticky-box/blob/67600d1ed56dfc5432c1f10a9738367457c36278/src/index.js#L4-L11
// licensed ISC

const isScrollContainer = (container: HTMLElement) => {
  const overflowY = getComputedStyle(container, null).getPropertyValue(
    'overflow-y',
  );

  return overflowY === 'auto' || overflowY === 'scroll';
};

export const getScrollParent = (el: HTMLElement) => {
  let parent = el;

  while (parent.offsetParent) {
    if (!(parent.offsetParent instanceof HTMLElement)) {
      break;
    }

    parent = parent.offsetParent;

    if (isScrollContainer(parent)) {
      return parent;
    }
  }

  return window;
};
