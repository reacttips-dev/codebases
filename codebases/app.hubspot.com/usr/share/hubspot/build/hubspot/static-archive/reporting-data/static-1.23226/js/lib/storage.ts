/**
 * Safe JSON parse
 *
 * @param {string} item Stringified object
 * @returns {object} Parsed object
 */
var parse = function parse(item) {
  try {
    return JSON.parse(item);
  } catch (err) {
    return item;
  }
};
/**
 * Check if key exists in localStorage
 *
 * @param   {string}  key Key to check in localStorage
 * @returns {boolean}     Whether key exists
 */


export var has = function has(key) {
  try {
    return {}.hasOwnProperty.call(localStorage, key);
  } catch (err) {
    console.warn("storage: failed to check existence of '" + key + "' in localStorage");
    return false;
  }
};
/**
 * Get key from localStorage
 *
 * @param   {string}  key Key to get from localStorage
 * @returns {?string}     Value and success pair
 */

export var get = function get(key) {
  try {
    var item = localStorage.getItem(key);
    return parse(item);
  } catch (err) {
    console.warn("storage: failed to get '" + key + "' from localStorage");
    return null;
  }
};
/**
 * Set value from localStorage
 *
 * @param   {string} key   Key to set in localStorage
 * @param   {any} value Value to set
 * @returns {void}
 */

export var set = function set(key, value) {
  try {
    var item = JSON.stringify(value);
    localStorage.setItem(key, item);
  } catch (err) {
    console.warn("storage: failed to set '" + value + "' as '" + key + "' in localStorage");
  }
};
/**
 * Remove value from localStorage
 *
 * @param   {string} key Key to remove in localStorage
 * @returns {void}
 */

export var remove = function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn("storage: failed to remove '" + key + "' in localStorage");
  }
};