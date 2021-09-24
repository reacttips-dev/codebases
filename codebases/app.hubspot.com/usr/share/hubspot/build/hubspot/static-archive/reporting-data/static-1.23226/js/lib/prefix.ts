import I18n from 'I18n';
/**
 * Prefixed I18n text implementation
 *
 * @param {string} keys Prefix keys
 * @returns {Function} Prefixed text implementation
 */

export default (function (keys) {
  return function (key) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    return I18n.text.apply(I18n, [keys + "." + key].concat(rest));
  };
});