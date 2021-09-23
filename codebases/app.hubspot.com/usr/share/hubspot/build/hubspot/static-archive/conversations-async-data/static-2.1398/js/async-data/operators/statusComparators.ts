import curry from 'transmute/curry';
import every from 'transmute/every';
import some from 'transmute/some';
import { UNINITIALIZED, OUT_OF_SYNC, STARTED, SUCCEEDED, FAILED } from '../constants/asyncStatuses';
import { getStatus } from './getters';
var isStatus = curry(function (status, asyncData) {
  return getStatus(asyncData) === status;
});

var everyStatus = function everyStatus(status) {
  return function () {
    for (var _len = arguments.length, asyncData = new Array(_len), _key = 0; _key < _len; _key++) {
      asyncData[_key] = arguments[_key];
    }

    return every(isStatus(status), asyncData);
  };
};

var someStatus = function someStatus(status) {
  return function () {
    for (var _len2 = arguments.length, asyncData = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      asyncData[_key2] = arguments[_key2];
    }

    return some(isStatus(status), asyncData);
  };
};
/**
 * Predicate to determine if an AsyncData is uninitialized
 * @param {AsyncData}
 * @returns {Boolean}
 */


export var isUninitialized = isStatus(UNINITIALIZED);
/**
 * Predicate to determine if an AsyncData is out of sync
 * @param {AsyncData}
 * @returns {Boolean}
 */

export var isOutOfSync = isStatus(OUT_OF_SYNC);
/**
 * Predicate to determine if an AsyncData is started
 * @param {AsyncData}
 * @returns {Boolean}
 */

export var isStarted = isStatus(STARTED);
/**
 * Predicate to determine if an AsyncData is succeeded
 * @param {AsyncData}
 * @returns {Boolean}
 */

export var isSucceeded = isStatus(SUCCEEDED);
/**
 * Predicate to determine if an AsyncData is failed
 * @param {AsyncData}
 * @returns {Boolean}
 */

export var isFailed = isStatus(FAILED);
/**
 * Predicate to determine if an AsyncData is loading
 * @param {AsyncData}
 * @returns {Boolean}
 */

export var isLoading = function isLoading(asyncData) {
  return isStarted(asyncData) || isUninitialized(asyncData);
};
/**
 * Predicate to determine if all async statuses are uninitialized
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var allUninitialized = everyStatus(UNINITIALIZED);
/**
 * Predicate to determine if all async statuses are out of sync
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var allOutOfSync = everyStatus(OUT_OF_SYNC);
/**
 * Predicate to determine if all async statuses are started
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var allStarted = everyStatus(STARTED);
/**
 * Predicate to determine if all async statuses are succeeded
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var allSucceeded = everyStatus(SUCCEEDED);
/**
 * Predicate to determine if all async statuses are failed
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var allFailed = everyStatus(FAILED);
/**
 * Predicate to determine if some async status is uninitialized
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var someUninitialized = someStatus(UNINITIALIZED);
/**
 * Predicate to determine if some async status is out of sync
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var someOutOfSync = someStatus(OUT_OF_SYNC);
/**
 * Predicate to determine if some async status is started
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var someStarted = someStatus(STARTED);
/**
 * Predicate to determine if some async status is succeeded
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var someSucceeded = someStatus(SUCCEEDED);
/**
 * Predicate to determine if some async status is failed
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var someFailed = someStatus(FAILED);
/**
 * Predicate to determine if some async status is loading
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export var someLoading = function someLoading() {
  return someStarted.apply(void 0, arguments) || someUninitialized.apply(void 0, arguments);
};