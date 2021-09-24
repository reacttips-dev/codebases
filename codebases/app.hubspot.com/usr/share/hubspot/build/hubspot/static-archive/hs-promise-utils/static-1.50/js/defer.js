'use es6';

function defer() {
  var reject;
  var resolve;
  var promise = new Promise(function (fst, snd) {
    resolve = fst;
    reject = snd;
  });
  return {
    promise: promise,
    reject: reject,
    resolve: resolve
  };
}

export default defer;