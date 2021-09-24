import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import enviro from 'enviro';
import { Map as ImmutableMap } from 'immutable';
import PortalIdParser from 'PortalIdParser';
import { safe } from './safe';
import * as global from './global';
/**
 * Report cache
 *
 * @constant {Map}
 * @private
 */

var cache = ImmutableMap();
/**
 * Create base URL
 *
 * @param {boolean} local Local variant
 * @returns {string} Base URL
 * @private
 */

var createBase = function createBase(local) {
  var portal = PortalIdParser.get();
  var subdomain = local ? 'local' : 'app';
  var environment = enviro.isQa() ? 'qa' : '';
  return ["https://" + subdomain + ".hubspot" + environment + ".com", "reporting-sandbox/" + portal + "/build/playground"].join('/');
};
/**
 * Create sandbox URL
 *
 * @param {Map} report Report to link
 * @returns {object} Sandbox links
 * @private
 */
// @ts-expect-error need to create typed version of a report


var createUrl = function createUrl(report) {
  var encoded = btoa(JSON.stringify(report, null, 2));
  var query = "encoded=" + encoded;
  return {
    local: createBase(true) + "?" + query,
    deployed: createBase(false) + "?" + query
  };
};
/**
 * Create sensible name from report
 *
 * @param {Map} report Report to name
 * @returns {string} Sandbox links
 * @private
 */
// @ts-expect-error need to create typed version of a report


var createName = function createName(report) {
  var name = report.get('name');
  var chartType = report.get('chartType');
  var dataType = report.getIn(['config', 'dataType']);
  var configType = report.getIn(['config', 'configType']);
  return [].concat(_toConsumableArray(name ? [name] : [dataType, configType]), [chartType]).filter(Boolean).join(' | ');
};
/**
 * Report setter
 *
 * @param {Map} report Report to process
 * @returns {object} Processed report information
 * @private
 */


var process = safe(function (report) {
  return {
    name: createName(report),
    sandbox: createUrl(report),
    timestamp: new Date(),
    input: report
  };
});
/**
 * Report setter
 *
 * @param {Map} report Report to set
 * @returns {void}
 */
// @ts-expect-error need to create typed version of a report

export var register = function register(report) {
  cache = cache.set(report, process(report));
};
/**
 * Global access to sandbox helper
 *
 * @constant {object}
 */

global.set('sandbox', {
  show: function show(clear) {
    if (clear) {
      console.clear();
    }

    var style = 'font-weight: bold; font-size: 1.6rem; color: #fea58e';
    console.log('%cSandbox Links', style);
    cache.filter(function (_ref) {
      var error = _ref.error;
      return error == null;
    }).forEach(function (_ref2) {
      var name = _ref2.name,
          sandbox = _ref2.sandbox,
          timestamp = _ref2.timestamp,
          input = _ref2.input;
      console.groupCollapsed(name);
      console.log('Local:', sandbox.local);
      console.log('Deployed:', sandbox.deployed);
      console.log('Timestamp:', timestamp);
      console.log('Input:', input);
      console.groupEnd();
    });
    return cache;
  }
});