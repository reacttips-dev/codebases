'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { List, Map as ImmutableMap, OrderedMap } from 'immutable';
import { COUNT } from '../../../../constants/metricTypes';
import { currency as formatCurrency } from '../../../../hydrate/numberFormatter';
import indexBy from '../../../../lib/indexBy';
import { CURRENCY_PROPERTY_NAME, LEGACY_DEAL_AMOUNT_PROPERTIES, CURRENCY_CODE_BY_DATA_TYPE } from '../../../../properties/constants/multiCurrencyProperties';
import { extractPropertyNamespace, getObjectId, namespaceProperty } from '../../../../properties/namespaceProperty';
import { getCurrencyInformation } from '../../../../public/currency';
import normalizeProperty from '../../common/normalizeProperty';
import getCrossObjectProperties from '../../aggregate/cross-object/properties';
import { CROSS_OBJECT } from '../../../../constants/dataTypes/inboundDb';

var isIdProperty = function isIdProperty(dataTypes, property) {
  return dataTypes.map(getObjectId).includes(property);
};

var getObjectIdValue = function getObjectIdValue(objectIds, property) {
  var namespace = extractPropertyNamespace(property).namespace.toUpperCase();
  return objectIds.get(namespace);
};

var getValue = function getValue(objectIds, objects, property, multiCurrencyEnabled, crossObjectProperties) {
  var _extractPropertyNames = extractPropertyNamespace(property),
      propertyName = _extractPropertyNames.propertyName,
      namespace = _extractPropertyNames.namespace,
      dataType = _extractPropertyNames.dataType;

  var objectType = namespace.toUpperCase();
  var objectId = objectIds.get(objectType);
  var rawValue = objects.getIn([objectType, objectId, 'properties', propertyName, 'value']);
  var value = normalizeProperty(rawValue, property);
  var currencyPropertyName = crossObjectProperties.getIn([CROSS_OBJECT, namespaceProperty(dataType, propertyName), CURRENCY_PROPERTY_NAME]);
  var currencyCode = currencyPropertyName ? objects.getIn([objectType, objectId, 'properties', currencyPropertyName, 'value']) : CURRENCY_CODE_BY_DATA_TYPE[dataType] && objects.getIn([objectType, objectId, 'properties', CURRENCY_CODE_BY_DATA_TYPE[dataType], 'value']);
  return multiCurrencyEnabled && (currencyPropertyName || LEGACY_DEAL_AMOUNT_PROPERTIES.includes(propertyName)) ? ImmutableMap({
    raw: value,
    formatted: formatCurrency(value, {
      currencyCode: currencyCode
    }),
    propertyMeta: {
      type: 'currency',
      currencyCode: currencyCode
    }
  }) : value;
};

export var transform = function transform(config, response) {
  return Promise.all([getCurrencyInformation(), getCrossObjectProperties(config)]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        information = _ref2[0],
        crossObjectProperties = _ref2[1];

    var _ref3 = information || {},
        hasMulticurrencyActive = _ref3.hasMulticurrencyActive;

    var dataTypes = config.getIn(['crossObject', 'dataTypes']);
    var objectIndex = response.get('objects').map(function (objects) {
      return indexBy(function (object) {
        return object.get('objectId');
      }, objects);
    });
    return ImmutableMap({
      total: response.get('total'),
      dimension: ImmutableMap({
        property: 'associationId',
        buckets: response.get('crossObjectAssociations').map(function (association) {
          var objectIds = association.get('objectTypeAndIds').reduce(function (acc, item) {
            return acc.set(item.get('objectType'), item.get('objectId'));
          }, ImmutableMap());
          return ImmutableMap({
            key: objectIds.map(function (id) {
              return id;
            }).join('__'),
            keyLabel: objectIds.map(function (id, type) {
              return type;
            }).join('__'),
            metrics: OrderedMap(config.get('metrics').map(function (metric) {
              var property = metric.get('property');
              return List([property, ImmutableMap(_defineProperty({}, COUNT, isIdProperty(dataTypes, property) ? getObjectIdValue(objectIds, property) : getValue(objectIds, objectIndex, property, hasMulticurrencyActive, crossObjectProperties)))]);
            }))
          });
        })
      })
    });
  });
};