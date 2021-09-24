import { buildErrorMetaObject } from './buildErrorMetaObject';

/**
 * @description Display a floating alert for a request failure.
 *
 * @example
 * const fetchContactError = createAction(
 *   ActionTypes.GET_CONTACT_FAILED,
 *   error => ({ error }),
 *   error => buildRequestErrorMetaObject({ ignoreStatusCodes: [404], error })
 * );
 */
export var buildRequestErrorMetaObject = function buildRequestErrorMetaObject(_ref) {
  var titleText = _ref.titleText,
      message = _ref.message,
      _ref$ignoreStatusCode = _ref.ignoreStatusCodes,
      ignoreStatusCodes = _ref$ignoreStatusCode === void 0 ? [] : _ref$ignoreStatusCode,
      error = _ref.error;
  var isIgnored = ignoreStatusCodes.some(function (code) {
    return code === error.status;
  });
  if (isIgnored) return buildErrorMetaObject({
    ignore: true
  });
  return buildErrorMetaObject({
    titleText: titleText,
    message: message
  });
};