'use es6';

export default (function (subscribeRoot) {
  var teardown = true;
  var subscribers = [];

  var rootSubscriber = function rootSubscriber() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    subscribers.forEach(function (subscriber) {
      subscriber.apply(void 0, args);
    });
  };

  return function (subscriber) {
    if (teardown && subscribers.length === 0) {
      teardown = subscribeRoot(rootSubscriber);
    }

    subscribers.push(subscriber);

    var unsubscribe = function unsubscribe() {
      var startLen = subscribers.length;
      subscribers = subscribers.filter(function (fn) {
        return fn !== subscriber;
      });

      if (teardown && subscribers.length === 0 && startLen > 0) {
        teardown();
      }
    };

    return unsubscribe;
  };
});