/**
 * Build an error object.
 *
 * @example
 * const myError = buildError('its broken', { usefulDataThatWillReportToSentry: true }, { moreUsefulData: 'is good' });
 *
 * @param {String} message - error message
 * @param {...Object} errorProps - props to add to the error
 *
 * @return {Error}
 */
export var buildError = function buildError(message) {
  for (var _len = arguments.length, errorProps = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    errorProps[_key - 1] = arguments[_key];
  }

  return Object.assign.apply(Object, [new Error()].concat(errorProps, [{
    message: message
  }]));
};