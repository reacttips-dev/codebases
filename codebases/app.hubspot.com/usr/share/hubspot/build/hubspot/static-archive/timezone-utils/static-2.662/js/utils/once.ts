export default (function (func) {
  var didRun = false;
  var result;
  return function onced() {
    if (!didRun) {
      didRun = true;
      result = func.apply(void 0, arguments);
    }

    return result;
  };
});