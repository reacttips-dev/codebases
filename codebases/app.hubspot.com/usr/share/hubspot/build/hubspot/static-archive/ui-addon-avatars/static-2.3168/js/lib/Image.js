'use es6';

var fetched = {};
export function isFetched(src) {
  return fetched[src];
}
export function fetchImage(src) {
  if (isFetched(src)) {
    return Promise.resolve();
  }

  return new Promise(function (resolve, reject) {
    var img = new Image();

    var onload = function onload() {
      fetched[src] = true;
      resolve();
    };

    img.onerror = reject;
    img.onload = onload;
    img.src = src;
  });
}