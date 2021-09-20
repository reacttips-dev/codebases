/* global ga */

const serializable = function(object, seen = []) {
  if (!object || typeof object !== 'object') return object;
  if (seen.indexOf(object) !== -1) return '__circular__';
  seen.push(object);
  const copy = {};
  Object.getOwnPropertyNames(object).forEach(function(prop) {
    copy[prop] = serializable(object[prop], seen);
  });
  return copy;
};

const stringifyError = function(error, spacing) {
  let serializedError = error;
  if (typeof error === 'object' && error !== null) {
    serializedError = serializable(error);
  }
  return JSON.stringify(serializedError, undefined, spacing);
};

const analytics = function(...args) {

  if (typeof ga !== 'function') return false;
  ga(...args);
  return true;
};

const logError = function(...args) {
  let error = args[0] || '(null)';

  if (typeof error === 'object') {
    if (typeof error.stopPropagation === 'function') error.stopPropagation();
    if (typeof error.preventDefault === 'function') error.preventDefault();

    // Bluebird promise rejection passes CustomEvent, contains reason and promise within detail field.
    if (error.detail) error = error.detail;

    // JS promise rejection passes PromiseRejectionEvent, which contains reason and promise in event.
    if (error.promise) args.push(error.promise);

    // Error contained in reason.
    if (typeof error.reason === 'object') error = error.reason;
  }

  const category = this.type || 'error_app';
  const action = typeof error === 'object' ? error.message || error.reason || '__unknown__' : error;
  let label = args.map(stringifyError).join(', ');

  console.error('ERROR', category, action);

  label = label
    .replace(/token=[0-9a-fA-F]*/g, 'token=<TOKEN>')
    .replace(/"X-Butler-Trello-Token":\s*"[0-9a-fA-F]*"/g, '"X-Butler-Trello-Token": "<TOKEN>"')
    .replace(/[0-9a-fA-F]{64}/g, ''); // In case we didn't take some other field into account.

  return !analytics('send', 'event', category, action, label);
};

const init = function() {
  window.onerror = logError.bind({ type: 'error_onerror' });
  $(document).ajaxError(logError.bind({ type: 'error_ajax' }));
  window.addEventListener(
    'unhandledrejection',
    logError.bind({ type: 'error_unhandledrejection' })
  );
};

const logEvent = function(category, action, label) {
  analytics('send', 'event', category, action, label);
};

const logVirtualPageview = function(anchor) {
  analytics('set', 'page', `${document.location.pathname}#${anchor}`);
  analytics('send', 'pageview');
};

const Log = {
  init,
  logError, // (error, ...)
  logEvent, // (category, label, action)
  logVirtualPageview, // (anchor)
};

window.Log = Log;
module.exports = Log;
