'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List, Map as ImmutableMap } from 'immutable';
import { SEARCH } from '../../constants/configTypes';
import { QUOTA_NAMESPACE } from '../../retrieve/custom/quotas/shared';
import { fromMetricKey } from '../dataset/datasetMetrics';
export var removeExtraCurrencyColumns = function removeExtraCurrencyColumns(config, dataset) {
  var propertiesFromConfig = config.get('dimensions', List()).concat(config.get('metrics').map(function (metric) {
    return metric.get('property');
  }));
  var propertiesToRemove = dataset.get('properties').reduce(function (acc, property, propertyName) {
    return !propertiesFromConfig.includes(propertyName) && property.getIn(['format', 'referenceMeta', 'referenceType']) === 'CURRENCY_CODE' ? acc.push(propertyName) : acc;
  }, List());
  return dataset.update('data', function (data) {
    return data.map(function (row) {
      return row.filter(function (__, propertyName) {
        return !propertiesToRemove.includes(propertyName);
      });
    });
  }).update('properties', function (properties) {
    return properties.filter(function (__, propertyName) {
      return !propertiesToRemove.includes(propertyName);
    });
  });
};
var ASSOCIATION_PROPERTIES = ['associations.company', 'associations.contact'];
export var collapseMultiVals = function collapseMultiVals(config, dataset, frontEndDataset) {
  var isSearchReport = config.get('configType') === SEARCH;
  var newListReferencesByProperty = ImmutableMap();
  var keysNotInListsByProperty = ImmutableMap();
  return dataset.update('data', function (data) {
    return data.map(function (row, index) {
      return row.map(function (value, property) {
        if (List.isList(value)) {
          /*
          These association properties are an exception where both FE and BE
          are handling lists of values the same way, so we don't want to
          collapse the lists here. This if block treats the values in the list
          as if they weren't for the property reference updating.
          https://git.hubteam.com/HubSpot/Reporting-as-a-Service/issues/1170
          */
          if (ASSOCIATION_PROPERTIES.includes(property)) {
            keysNotInListsByProperty = keysNotInListsByProperty.update(property, function (keys) {
              return keys ? keys.concat(value) : value;
            });
            return value;
          }

          var frontEndValue = frontEndDataset.getIn(['data', index, property]);
          var newValue = value.join(';') === frontEndValue ? value.join(';') : value.join('; ');
          newListReferencesByProperty = newListReferencesByProperty.update(property, function (references) {
            var newReference = ImmutableMap({
              label: value.map(function (key) {
                return dataset.getIn(['properties', property, 'references', key, 'label'], key);
              }).join(', ')
            });
            return references ? references.set(newValue, newReference) : ImmutableMap(_defineProperty({}, newValue, newReference));
          });
          return newValue;
        }

        keysNotInListsByProperty = keysNotInListsByProperty.update(property, function (keys) {
          var currencyCodeColumnName = dataset.getIn(['properties', property, 'format', 'currencyCodeColumnName']);
          var referenceKey = currencyCodeColumnName && isSearchReport ? row.get(currencyCodeColumnName) + "|" + String(value) : String(value);
          return keys ? keys.push(referenceKey) : List([referenceKey]);
        });
        return value;
      });
    });
  }).update('properties', function (properties) {
    return properties.map(function (propertyInfo, property) {
      return propertyInfo.update('references', function (references) {
        return references.filter(function (___, key) {
          return keysNotInListsByProperty.get(property, List()).includes(key);
        }).merge(newListReferencesByProperty.get(property, ImmutableMap()));
      });
    });
  });
};

var fixHsObjectIdLabel = function fixHsObjectIdLabel(_, dataset) {
  return dataset.hasIn(['properties', 'hs_object_id']) ? dataset.updateIn(['properties', 'hs_object_id', 'references'], function (references) {
    return references.map(function (v, k) {
      return v.set('label', k);
    });
  }) : dataset;
};

export var removeQuotaPropertyData = function removeQuotaPropertyData(_, dataset) {
  var isQuotaProperty = function isQuotaProperty(propertyNameWithMetricKey) {
    return fromMetricKey(propertyNameWithMetricKey).property.startsWith(QUOTA_NAMESPACE + ".");
  };

  return dataset.update('data', function (data) {
    return data.map(function (row) {
      return row.filter(function (__, property) {
        return !isQuotaProperty(property);
      });
    });
  }).update('properties', function (properties) {
    return properties.filter(function (__, property) {
      return !isQuotaProperty(property);
    });
  });
};
var backendTransformations = [collapseMultiVals, removeExtraCurrencyColumns, fixHsObjectIdLabel];
var frontendTransformations = [removeQuotaPropertyData];
export var applyFrontendValidationTransformations = function applyFrontendValidationTransformations(config, dataset) {
  return frontendTransformations.reduce(function (transformedDataset, transformation) {
    return transformedDataset.update(function (datasetObject) {
      return transformation(config, datasetObject);
    });
  }, dataset);
};
export var applyBackendValidationTransformations = function applyBackendValidationTransformations(config, dataset, frontEndDataset) {
  return backendTransformations.reduce(function (transformedDataset, transformation) {
    return transformedDataset.update(function (datasetObject) {
      return transformation(config, datasetObject, frontEndDataset);
    });
  }, dataset);
};