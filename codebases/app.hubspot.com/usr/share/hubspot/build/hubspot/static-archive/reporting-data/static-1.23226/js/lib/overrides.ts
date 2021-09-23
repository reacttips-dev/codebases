import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { set, remove, has } from './storage';
import * as global from './global';
/**
 * Global access to override managers
 *
 * @constant {object}
 */

global.set('overrides', {});
/**
 * Create normalized reporting data override key
 *
 * @param {string} override Name of the override
 * @returns {string} Localstorage key
 */

var key = function key(override) {
  return "@@reporting-data:override:" + override;
};
/**
 * Create override
 *
 * @param {string} override Name of the override
 * @param {?string} description Optional description
 * @returns {object} Override manager
 */


var create = function create(override, description) {
  var manager = Object.assign({
    on: function on() {
      return set(key(override), true);
    },
    off: function off() {
      return remove(key(override));
    },

    // @ts-expect-error Update all coding code using enabled to enabled()
    get enabled() {
      return has(key(override));
    }

  }, description ? {
    description: description
  } : {});
  global.update('overrides', function (overrides) {
    return Object.assign({}, overrides, _defineProperty({}, override, manager));
  });
  return manager;
};

export var development = create('development', 'force development mode in the platform');
export var unified = create('unified', 'use unified implementation of data types if avaialble');
export var newrelic = create('newrelic', 'enable platform level debug new relic tracking');
export var batchRequests = create('batchRequests', 'Enable batching of contacts-search requests');
export var unifiedMetricFilters = create('unifiedMetricFilters', 'Enables metric level (post-aggregation) filtering for analytics reports');
export var disableHighchartsAnimation = create('disableHighchartsAnimation', 'Disables Highcharts animations (for automated testing only)');