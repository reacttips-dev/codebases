'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Map as ImmutableMap, List } from 'immutable';
import { load } from '../dataTypeDefinitions';
import settled from '../lib/settled';
import { HYDRATE } from '../constants/phases';
import * as DataTypes from '../constants/dataTypes';
import { connectedPhase } from '../redux/resolve/connected';
import getProperties from '../properties';
import getCrossObjectProperties from '../retrieve/inboundDb/aggregate/cross-object/properties';
import { adapt } from '../references/adapt';
import ownerReferences from '../references/owner';
import getUnhydratedUniqueValues from '../dataset/getUnhydratedUniqueValues';
import { makeOption } from '../references/Option';
import hydrateDataset from './dataset';
import { formatForScientificNotation } from '../v2/dataset/utils';
/*
 * NOTE: we could set up the `global` reference manager to follow a similar
 * pattern where we define a `referencedObjectType` field on properties to
 * indicate when it should be used for reference lookup rather than setting it
 * on the module level
 */

var referencedObjectTypes = {
  OWNER: adapt(ownerReferences)
};

var getReferences = function getReferences(_ref) {
  var _ref$config = _ref.config,
      config = _ref$config === void 0 ? ImmutableMap() : _ref$config,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? List() : _ref$data,
      _ref$properties = _ref.properties,
      properties = _ref$properties === void 0 ? ImmutableMap() : _ref$properties,
      _ref$referenceGetters = _ref.referenceGetters,
      getters = _ref$referenceGetters === void 0 ? ImmutableMap() : _ref$referenceGetters,
      response = _ref.response;
  var dataType = config.get('dataType');
  return load(dataType).then(function (module) {
    var metricProperties = config.get('metrics', List()).map(function (metric) {
      return metric.get('property');
    });
    var reportProperties = config.get('dimensions', List()).concat(config.get('properties', List())).concat(metricProperties);

    var promises = _toConsumableArray(reportProperties).reduce(function (result, property) {
      var getter = getters.get(property);

      if (getter) {
        return [].concat(_toConsumableArray(result), [getter(config, property, data, response, undefined, {
          excludeNull: properties.getIn([dataType, property, 'reportingOverwrittenNumericType'])
        })]);
      }

      var referenceDataType = module.getIn(['referenceProperties', property], null);

      if (referenceDataType) {
        var ids = getUnhydratedUniqueValues(property, data).toList().map(formatForScientificNotation);
        var referencePromise = load(referenceDataType).then(function (referenceModule) {
          return referenceModule.get('hydrate')(ids, config).then(function (labelsById) {
            return ImmutableMap({
              key: property,
              value: labelsById.map(function (label, id) {
                return makeOption(id, label);
              })
            });
          });
        });
        return [].concat(_toConsumableArray(result), [referencePromise]);
      }

      return result;
    }, []);

    return settled(promises).then(function (resolves) {
      return resolves.reduce(function (result, _ref2) {
        var state = _ref2.state,
            value = _ref2.value;

        if (state === 'fulfilled' && value) {
          var props = result.properties;
          return {
            properties: props.setIn([dataType, value.get('key'), 'options'], value.get('value'))
          };
        }

        return result;
      }, {
        properties: properties
      });
    }).then(function (result) {
      return Object.assign({}, result);
    });
  });
};

export var hydrate = function hydrate(_ref3) {
  var dataConfig = _ref3.dataConfig,
      dataset = _ref3.dataset,
      response = _ref3.response;
  var dataType = dataConfig.get('dataType');
  return load(dataType).then(function (module) {
    var propertiesPromise = dataType === DataTypes.CROSS_OBJECT ? getCrossObjectProperties(dataConfig) : getProperties(dataType);
    var updatedPropertiesPromise = propertiesPromise.then(function (properties) {
      var referencedObjectTypeGetters = properties.get(dataType).filter(function (property) {
        return referencedObjectTypes.hasOwnProperty(property.get('referencedObjectType'));
      }).map(function (property) {
        return referencedObjectTypes[property.get('referencedObjectType')];
      }); // NOTE: references object type getters should only pull in getters for
      // required data types rather than flattening every which can cause
      // getters to be overriden by other properties with the same key (RA-1413)

      var referenceGetters = referencedObjectTypeGetters.merge(module.get('references', ImmutableMap()));
      return getReferences({
        config: dataConfig,
        data: dataset,
        properties: properties,
        referenceGetters: referenceGetters,
        response: response
      });
    }).then(function (_ref4) {
      var properties = _ref4.properties;
      return properties;
    });
    return updatedPropertiesPromise.then(function (updatedProperties) {
      return hydrateDataset(dataConfig, updatedProperties, dataset);
    });
  });
};
export var connectedHydrate = connectedPhase(HYDRATE, hydrate);