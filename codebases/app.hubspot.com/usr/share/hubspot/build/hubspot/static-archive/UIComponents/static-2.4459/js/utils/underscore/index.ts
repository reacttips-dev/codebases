// ⚠️ Hello HubSpotters, Please don't import from this module. ☠️
var uniqueIdCounter = 0;
/** @returns {string} a unique id string with the given prefix */

export var uniqueId = function uniqueId(prefix) {
  return "" + (prefix == null ? '' : prefix) + ++uniqueIdCounter;
};
/** @returns {boolean} whether the given value is the constant NaN */

export var isNaN = function isNaN(value) {
  return typeof value === 'number' && value !== +value;
};

/** @returns {*} the first element of an Array or NodeList */
export var first = function first(list) {
  return list == null || list.length === 0 ? undefined : list[0];
};
/** @returns {*} the last element of an Array or NodeList */

export var last = function last(list) {
  return list == null || list.length === 0 ? undefined : list[list.length - 1];
};