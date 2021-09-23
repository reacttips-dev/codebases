import { buildErrorMetaObject } from './buildErrorMetaObject';

/**
 * @description Build a error meta action to silence floating error alerts
 * @returns {Object} Meta Action
 *
 * @example
 * const pollThreadListFailed = createAction(
 *   POLL_THREAD_LISTS_FAILED,
 *   error => ({ error }),
 *   silenceErrorAlert
 *  );
 */
export var silenceErrorAlert = function silenceErrorAlert() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$isVisibleToUser = _ref.isVisibleToUser,
      isVisibleToUser = _ref$isVisibleToUser === void 0 ? false : _ref$isVisibleToUser;

  return buildErrorMetaObject({
    silent: true,
    isVisibleToUser: isVisibleToUser
  });
};