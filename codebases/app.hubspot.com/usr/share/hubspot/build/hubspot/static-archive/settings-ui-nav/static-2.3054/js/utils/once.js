'use es6';

export default function once(fn) {
  var didRun = false;
  var result;
  return function onced() {
    if (!didRun) {
      didRun = true;
      result = fn.apply(void 0, arguments);
    }

    return result;
  };
}