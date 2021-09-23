'use es6';

var MAX_STRING_LEGNTH = 2000;
var KEYS_TO_OMIT = [// added by IE
'number', 'description', // added by safari
'line', 'column'];
/**
 * @description
 * Copied from https://git.hubteam.com/HubSpot/conversations-error-reporting/blob/master/static/js/error-reporting/getExtraErrorData.js
 *
 * Extract useful metadata from error actions provided that they are primitive values.
 * Strings are truncated at 2000 characters.
 * Mainly useful for parsing helpful data out of API failures.
 *
 * @param {Error} error A JavaScript Exception
 * @returns {Object} Additional data defined on the exception
 */

export function getExtraErrorData(error) {
  if (!error) return null;
  var errorData = {};

  if (error.options) {
    errorData.request = {
      body: error.options.data,
      query: error.options.query,
      method: error.options.method
    };
  }

  var keys = Object.keys(error).filter(function (key) {
    return !KEYS_TO_OMIT.includes(key);
  });
  if (!keys.length) return null;
  return keys.reduce(function (acc, key) {
    switch (typeof error[key]) {
      case 'boolean':
      case 'number':
        {
          acc[key] = error[key];
          break;
        }

      case 'string':
        {
          // truncate string error properties after the max length
          var suffix = error[key].length > MAX_STRING_LEGNTH ? '...' : '';
          acc[key] = "" + error[key].substr(0, MAX_STRING_LEGNTH) + suffix;
          break;
        }

      case 'function':
        {
          acc[key] = 'function() { /* Function removed */ }';
          break;
        }

      case 'object':
        {
          if (error[key] === null) {
            acc[key] = error[key];
          } else {
            acc[key] = '/* Object, Error, or Array removed */';
          }

          break;
        }

      default:
        break;
    }

    return acc;
  }, errorData);
}