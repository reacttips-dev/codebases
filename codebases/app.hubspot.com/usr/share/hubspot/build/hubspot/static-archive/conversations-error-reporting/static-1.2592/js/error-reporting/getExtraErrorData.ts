var MAX_STRING_LENGTH = 2000;
var KEYS_TO_OMIT = [// added by IE
'number', 'description', // added by safari
'line', 'column'];
var KEYS_NOT_TO_CLEAN = ['graphQLErrors', 'networkError', 'error'];

var cleanProperty = function cleanProperty(value) {
  switch (typeof value) {
    case 'boolean':
    case 'number':
      {
        return value;
      }

    case 'string':
      {
        var suffix = value.length > MAX_STRING_LENGTH ? '...' : '';
        return "" + value.substr(0, MAX_STRING_LENGTH) + suffix;
      }

    case 'function':
      {
        return 'function() { /* Function removed */ }';
      }

    case 'object':
      {
        if (value === null) {
          return value;
        } else {
          return '/* Object, Error, or Array removed */';
        }
      }

    default:
      return undefined;
  }
};
/**
 * @description
 * Extract useful metadata from error actions provided that they are primitive values.
 * Strings are truncated at 2000 characters.
 *
 * @param {Error} error A JavaScript Exception
 * @returns {Object} Additional data defined on the exception
 */


export var getExtraErrorData = function getExtraErrorData(error) {
  if (!error) return null;
  var keys = Object.keys(error).filter(function (key) {
    return !KEYS_TO_OMIT.includes(key);
  });
  if (!keys.length) return null;
  return keys.reduce(function (acc, key) {
    var errorProperty = error[key];

    if (KEYS_NOT_TO_CLEAN.includes(key)) {
      // convert to string so we truncate the content
      errorProperty = JSON.stringify(errorProperty);
    }

    var property = cleanProperty(errorProperty);
    if (property !== undefined) acc[key] = property;
    return acc;
  }, {});
};