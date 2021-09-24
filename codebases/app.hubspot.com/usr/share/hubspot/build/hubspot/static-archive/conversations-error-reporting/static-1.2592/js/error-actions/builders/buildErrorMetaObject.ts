/**
 * @description Build a error meta action to silence floating error alerts
 *
 * @example
 * const pollThreadListFailed = createAction(
 *   POLL_THREAD_LISTS_FAILED,
 *   error => ({ error }),
 *   error => buildErrorMetaObject({ titleText: 'Any string you want', message: 'A react node or string' })
 *  );
 */
export var buildErrorMetaObject = function buildErrorMetaObject(_ref) {
  var _ref$ignore = _ref.ignore,
      ignore = _ref$ignore === void 0 ? false : _ref$ignore,
      message = _ref.message,
      _ref$silent = _ref.silent,
      silent = _ref$silent === void 0 ? false : _ref$silent,
      titleText = _ref.titleText,
      _ref$displayEventId = _ref.displayEventId,
      displayEventId = _ref$displayEventId === void 0 ? true : _ref$displayEventId,
      _ref$isVisibleToUser = _ref.isVisibleToUser,
      isVisibleToUser = _ref$isVisibleToUser === void 0 ? true : _ref$isVisibleToUser;
  return {
    error: {
      ignore: ignore,
      message: message,
      silent: silent,
      titleText: titleText,
      displayEventId: displayEventId,
      isVisibleToUser: isVisibleToUser
    }
  };
};