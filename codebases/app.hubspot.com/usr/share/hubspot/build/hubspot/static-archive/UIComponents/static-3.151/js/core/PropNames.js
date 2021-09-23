'use es6';

import memoize from 'react-utils/memoize';
/**
 * @param  {string}
 * @return {string}
 */

var capitalize = function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
};
/**
 * @param  {string}
 * @return {string}
 */


var uncapitalize = function uncapitalize(str) {
  return str[0].toLowerCase() + str.slice(1);
};
/**
 * @param  {string}
 * @return {string}
 */


export var getDefaultPropName = memoize(function (field) {
  return "default" + capitalize(field);
});
/**
 * @param  {string}
 * @return {string}
 */

export var getOnChangeName = memoize(function (field) {
  if (field === 'value') {
    return 'onChange';
  }

  return "on" + capitalize(field) + "Change";
});
/**
 * @param  {string}
 * @return {string}
 */

export var getPropFromDefaultName = memoize(function (defaultProp) {
  if (!defaultProp) {
    return '';
  }

  return uncapitalize(defaultProp.replace('default', ''));
});