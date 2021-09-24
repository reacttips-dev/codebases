import emptyFunction from 'react-utils/emptyFunction';

var isPromise = function isPromise(obj) {
  return obj && typeof obj.then === 'function';
};

export default function handleCallback(callback) {
  var doAfter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;
  var callbackParams = arguments.length > 2 ? arguments[2] : undefined;
  var chainable = arguments.length > 3 ? arguments[3] : undefined;

  if (Array.isArray(callback)) {
    var results = [];
    var promises = callback.reduce(function (promiseList, callbackFunction) {
      var result = callbackFunction(callbackParams);

      if (isPromise(result)) {
        return promiseList.concat(result);
      }

      results.push(result);
      return promiseList;
    }, []);

    if (promises.length > 0) {
      var promise = Promise.all(promises).then(doAfter).catch(function (err) {
        doAfter();
        throw err;
      });

      if (chainable) {
        return promise;
      }

      return promise.done();
    }

    doAfter();
    return results;
  }

  var result = callback(callbackParams);

  if (isPromise(result)) {
    return result.then(doAfter).catch(function (error) {
      doAfter();
      throw error;
    }).done();
  }

  doAfter();
  return result;
}