'use es6';

export function getAsyncDimensions(url) {
  return new Promise(function (resolve) {
    var img = new window.Image();
    img.src = url;

    var handleLoad = function handleLoad() {
      var dimensions = {
        width: img.width,
        height: img.height
      };
      resolve(dimensions);
    };

    var handleError = function handleError() {
      resolve({
        width: 0,
        height: 0
      });
    };

    img.addEventListener('load', handleLoad, {
      once: true
    });
    img.addEventListener('error', handleError, {
      once: true
    });
  });
}