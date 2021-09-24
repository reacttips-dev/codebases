import enviro from 'enviro';
import * as overrides from './overrides';
/**
 * Whether environment is running locally
 *
 * @returns {boolean} Is running locally
 * @private
 */

var isLocal = function isLocal() {
  return !enviro.deployed();
};
/**
 * Whether development mode is forced
 *
 * @returns {boolean} Development mode forced
 * @private
 */


var isForced = function isForced() {
  return overrides.development.enabled;
};
/**
 * Whether environment is in development mode
 *
 * @returns {boolean} Is development mode
 */


export default (function () {
  try {
    return isLocal() || isForced();
  } catch (err) {
    console.error("[reporting-data]:", err);
    return false;
  }
});