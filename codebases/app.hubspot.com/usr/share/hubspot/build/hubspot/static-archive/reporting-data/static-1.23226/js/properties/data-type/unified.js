'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
import { fromJS } from 'immutable';
import prefix from '../../lib/prefix';
import { Promise } from '../../lib/promise';
import { load } from '../../dataTypeDefinitions';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getSourcesGroups from '../partial/contacts-sources';
/**
 * Shared people spec
 *
 * @constant {object}
 * @returns {string} Normalized translation key
 * @private
 */

var peopleSpec = {
  deleted: 'boolean',
  email: 'string',
  first_conversion_date: 'datetime',
  first_conversion_event_name: 'string',
  firstname: 'string',
  guids: 'string',
  hs_analytics_first_timestamp: 'datetime',
  hs_analytics_source_data_1: 'string',
  hs_analytics_source_data_2: 'string',
  hs_analytics_source: function hs_analytics_source() {
    return getSourcesGroups().toJS();
  },
  isContact: 'boolean',
  lastname: 'string',
  lifecyclestage: 'enumeration',
  people: 'enumeration',
  recent_conversion_date: 'datetime',
  recent_conversion_event_name: 'string',
  vid: 'enumeration',
  hs_marketable_status: 'boolean',
  hs_marketable_reason_id: 'enumeration',
  hs_marketable_reason_type: 'enumeration'
};
/**
 * Create translation key from data type
 *
 * @param {string} dataType Data type
 * @returns {string} Normalized translation key
 * @private
 */

export var createUnifiedTranslationKey = function createUnifiedTranslationKey(dataType) {
  return dataType.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^analytics-/, '');
};
/**
 * Get property type from spec
 *
 * @param {(string|object)} type Type or options
 * @returns {string} Property type
 * @private
 */

var getPropertyType = function getPropertyType(type) {
  return typeof type === 'string' ? type : 'enumeration';
};
/**
 * Create options from options definition
 *
 * @param {object} options Options
 * @returns {object[]} Formatted options
 * @private
 */


var createOptions = function createOptions(options) {
  return Object.keys(options).reduce(function (memo, key) {
    return [].concat(_toConsumableArray(memo), [{
      value: key,
      label: options[key]
    }]);
  }, []);
};
/**
 * Used to inverse deltas on Data Well reports
 */


var metricsToInverse = ['bounces', 'pageBounces', 'bounceRate', 'pageBounceRate', 'exits', 'exitsPerPageview', 'unsubscribedratio'];

var getAdditionalPropertyInfo = function getAdditionalPropertyInfo(types, property) {
  if (types[property] === 'duration') {
    return {
      durationUnit: 'seconds'
    };
  }

  if (typeof types[property] === 'function') {
    return {
      options: types[property]()
    };
  } else if (typeof types[property] === 'object') {
    return {
      options: createOptions(types[property])
    };
  }

  if (metricsToInverse.includes(property)) {
    return {
      inverseDeltas: true
    };
  }

  return {};
};
/**
 * Create properties from list of definitions and translator
 *
 * @param {object[]} objects List of property definitions
 * @param {function} translate Property label translator
 * @returns {object[]} Properties
 * @private
 */


export var createPropertiesFromUnifiedObjects = function createPropertiesFromUnifiedObjects(objects, translate) {
  return objects.reduce(function (memo, types) {
    return [].concat(_toConsumableArray(memo), _toConsumableArray(Object.keys(types).map(function (property) {
      return Object.assign({
        name: property,
        label: translate(property),
        type: getPropertyType(types[property])
      }, getAdditionalPropertyInfo(types, property));
    })));
  }, []);
};
/**
 * Create current properties interface from data type
 *
 * @param {string} dataType Data type
 * @returns {object} Properties interface
 */

export var createUnifiedProperties = function createUnifiedProperties(dataType) {
  var getPropertyGroups = function getPropertyGroups() {
    return load(dataType).then(function (module) {
      var _module$getUnifiedSpe = module.getUnifiedSpecForConfig({
        dataType: dataType
      }),
          _module$getUnifiedSpe2 = _module$getUnifiedSpe.breakdowns,
          breakdowns = _module$getUnifiedSpe2 === void 0 ? {} : _module$getUnifiedSpe2,
          _module$getUnifiedSpe3 = _module$getUnifiedSpe.filters,
          filters = _module$getUnifiedSpe3 === void 0 ? {} : _module$getUnifiedSpe3,
          _module$getUnifiedSpe4 = _module$getUnifiedSpe.metrics,
          metrics = _module$getUnifiedSpe4 === void 0 ? {} : _module$getUnifiedSpe4,
          _module$getUnifiedSpe5 = _module$getUnifiedSpe.metadata,
          metadata = _module$getUnifiedSpe5 === void 0 ? {} : _module$getUnifiedSpe5,
          _module$getUnifiedSpe6 = _module$getUnifiedSpe.calculated,
          calculated = _module$getUnifiedSpe6 === void 0 ? {} : _module$getUnifiedSpe6;

      var key = createUnifiedTranslationKey(dataType);
      var specProperties = createPropertiesFromUnifiedObjects([breakdowns, metrics, filters, metadata, calculated], prefix("reporting-data.properties." + key));
      var peopleProperties = createPropertiesFromUnifiedObjects([peopleSpec], prefix("reporting-data.properties.unified.person"));
      return Promise.resolve(fromJS([{
        name: 'unifiedAnalyticsInfo',
        displayName: I18n.text('reporting-data.groups.unified.group'),
        displayOrder: 0,
        hubspotDefined: true,
        properties: [].concat(_toConsumableArray(specProperties), _toConsumableArray(peopleProperties))
      }]));
    });
  };

  return {
    getPropertyGroups: getPropertyGroups,
    getProperties: createPropertiesGetterFromGroups(getPropertyGroups)
  };
};
/**
 * Testable internals
 *
 * @constant {object}
 */

export var __TESTABLE__ = {
  createTranslateKey: createUnifiedTranslationKey,
  createProperties: createPropertiesFromUnifiedObjects
};