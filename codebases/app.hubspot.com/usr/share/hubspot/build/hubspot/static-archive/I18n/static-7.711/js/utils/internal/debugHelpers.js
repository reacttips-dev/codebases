'use es6';

export var debugLog = function debugLog() {
  var _console;

  if (!document) {
    return;
  }

  var enabled = this.I18N_DEBUG_LOG || window.I18N_DEBUG;

  try {
    enabled = localStorage.I18N_DEBUG_LOG === 'true' || localStorage.I18N_DEBUG === 'true';
  } catch (e) {// Do nothing
  }

  if (!enabled) return;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  args.unshift('I18n:');
  /*
  # To help prevent confusion in Marketing Grader, prefix iframe if this isn't
  # the top frame on the page
  */

  if (window.parent !== window) args.unshift('(IFRAME)');

  (_console = console).log.apply(_console, args);
};
export function initializeDebuggers(I18n) {
  I18n.debugLog = debugLog;
}