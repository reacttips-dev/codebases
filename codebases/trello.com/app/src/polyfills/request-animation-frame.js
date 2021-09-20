// We don't officially support any browser that doesn't have
// requestAnimationFrame. But... we had one very nice person
// write in who was using Opera for Linux (latest version was
// released in 2011, what). It doesn't hurt us to polyfill
// here, and if we don't then dinosaur people will just see
// a big blank Trello.
const injectRequestAnimationFramePolyfill = function () {
  let fns = {};
  let timeout = null;
  let animationFrameIndex = 0;

  const performEnqueuedFunctions = function () {
    for (const id of Object.keys(fns || {})) {
      const fn = fns[id];
      fn();
    }
    timeout = null;
    fns = {};
  };

  window.requestAnimationFrame = function (fn) {
    const id = animationFrameIndex++;
    if (timeout === null) {
      timeout = setTimeout(performEnqueuedFunctions);
    }
    fns[id] = fn;

    return id;
  };

  window.cancelAnimationFrame = function (id) {
    delete fns[id];
  };
};

if (!('requestAnimationFrame' in window)) {
  injectRequestAnimationFramePolyfill();
}
