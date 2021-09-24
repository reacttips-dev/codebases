'use es6';

export default (function (err) {
  var extras = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var hasRaven = window && window.Raven && typeof window.Raven.captureException === 'function' && typeof window.Raven.captureMessage === 'function';

  if (hasRaven) {
    window.Raven.captureException(err, extras);
  }
});