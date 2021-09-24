'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import increment from '../../lib/increment';
import invariant from '../../lib/invariant';
import prefix from '../../lib/prefix';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { makeOption } from '../Option';
import { GLOBAL_NULL } from '../../constants/defaultNullValues';
var translate = prefix('reporting-data.references.cta');
/**
 * CTA endpoint
 *
 * @type {string}
 * @constant
 */

var URL = 'ctas/v3/ctas';
/**
 * Reference cache
 *
 * @type {Map<string, Promise<Property>>}
 * @constant
 */

var cache = ImmutableMap();
/**
 * Transform CTA results to options
 *
 * @param {RawCtaResult[]} ctas List of raw CTA results
 * @returns {OptionRecord[]} Promise holding transformed options
 * @private
 */

var transform = function transform(ctas) {
  var numberIncrement = increment(1);
  var letterIncrement = increment('A');

  var getLabel = function getLabel(_ref) {
    var isDefault = _ref.isDefault,
        type = _ref.type;

    switch (type) {
      case 'VARIATION':
        {
          return translate('variation', {
            version: letterIncrement()
          });
        }

      case 'DEFAULT':
      default:
        return isDefault ? translate('default') : translate('smartRule', {
          version: numberIncrement()
        });
    }
  };

  return ctas.map(function (cta) {
    return makeOption(cta.guid, getLabel(cta));
  });
};
/**
 * Index options with corresponding property
 *
 * @param {List<ImmutableOption>} options Transformed options
 * @returns {Property}
 * @private
 */


var index = function index(options) {
  return ImmutableMap({
    key: 'ctaId',
    type: 'enumeration',
    value: options
  });
};
/**
 * Get query params for request
 *
 * @param {string} guid CTA placement guid
 * @param {number} offset Pagination offset
 * @returns {object} Query params
 * @private
 */


var getQuery = function getQuery(guid, offset) {
  return {
    placement_guid: guid,
    property: ['guid', 'name', 'type', 'isDefault'],
    order: 'created_at',
    offset: offset
  };
};
/**
 * Request to fetch CTAs
 *
 * @param {string} guid CTA placement guid
 * @param {object[]} [data=[]] Current dataset
 * @returns {Promise<RawCtaResult[]>}
 * @private
 */


var requestCtas = function requestCtas(guid) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return http.get(URL, {
    query: getQuery(guid, data.length)
  }).then(toJS).then(function (_ref2) {
    var hasMore = _ref2.hasMore,
        results = _ref2.results;
    return hasMore ? requestCtas(guid, [].concat(_toConsumableArray(data), _toConsumableArray(results))) : [].concat(_toConsumableArray(data), _toConsumableArray(results));
  });
};
/**
 * Fetch CTAs, transform to options, and index as property
 *
 * @param {string} guid CTA placement guid
 * @returns {Promise<Property>} Promise holding property
 * @private
 */


var fetchCtas = function fetchCtas(guid) {
  return requestCtas(guid).then(transform).then(fromJS).then(index).catch(function () {
    return ImmutableMap();
  });
};
/**
 * Find CTA placement guid in report filters
 *
 * @param {ReportConfiguration} config Report configuration
 * @returns {?string} Maybe CTA placement guid
 * @private
 */


var findPlacementGuid = function findPlacementGuid(config) {
  return config.getIn(['filters', 'custom'], List()).find(function (filter) {
    return filter.get('property') === 'placementId';
  }, null, ImmutableMap()).get('value');
};
/**
 * Get CTA references
 *
 * @param {ReportConfiguration} config Report configuration
 * @returns {Promise<Property>} Promise holding property
 * @throws InvariantViolation
 */


export var get = function get(placementGuid) {
  if (placementGuid && !cache.has(placementGuid)) {
    cache = cache.set(placementGuid, fetchCtas(placementGuid));
  }

  return cache.get(placementGuid);
};
export var hydrateCtaIds = function hydrateCtaIds(config) {
  var placementGuid = findPlacementGuid(config);
  invariant(Boolean(placementGuid), "cta/references: expected placement guid filter to be provided, but got none.");
  return get(placementGuid);
};
export var generateCtaLabel = function generateCtaLabel(cta, key) {
  var immutableCta = fromJS(cta);
  return immutableCta.get('name', key === GLOBAL_NULL ? null : key);
};