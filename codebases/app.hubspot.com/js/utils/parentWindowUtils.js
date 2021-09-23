'use es6';

export var isCrossOriginFrame = function isCrossOriginFrame() {
  try {
    return !window.top.location.hostname;
  } catch (e) {
    return e;
  }
};
export var getParentWindow = function getParentWindow() {
  try {
    if (window.parent.location.hostname) {
      return window.parent;
    }

    return undefined;
  } catch (__e) {
    return undefined;
  }
};