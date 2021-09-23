'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import unescapedText from 'I18n/utils/unescapedText';
import { CROSS_OBJECT } from '../../../../constants/dataTypes';
import { Promise } from '../../../../lib/promise';
import cached from '../../../../lib/cached';
import sortInboundDataTypesByEnum from '../../../../lib/sortInboundDataTypesByEnum';
import getProperties from '../../../../properties';
import { namespaceProperty, getObjectId } from '../../../../properties/namespaceProperty';

var getNamespacedProperties = function getNamespacedProperties(dataType, properties) {
  return properties.mapEntries(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];

    var namespaced = namespaceProperty(dataType, name);
    return [namespaced, value.set('name', namespaced).update('label', function (label) {
      return unescapedText('reporting-data.properties.common.namespacedProperty', {
        propertyLabel: label || namespaced,
        dataTypeLabel: unescapedText("reporting-data.dataTypes." + dataType)
      });
    })];
  });
};

var getJoinedProperties = function getJoinedProperties(dataTypes, properties) {
  return dataTypes.map(function (dataType, index) {
    return getNamespacedProperties(dataType, properties[index].get(dataType));
  }).reduce(function (allProperties, namespacedProperties) {
    return allProperties.merge(namespacedProperties);
  }, ImmutableMap());
};

var getObjectIdProperties = function getObjectIdProperties(dataTypes) {
  var _sortInboundDataTypes = sortInboundDataTypesByEnum(dataTypes),
      _sortInboundDataTypes2 = _slicedToArray(_sortInboundDataTypes, 2),
      firstDataType = _sortInboundDataTypes2[0],
      secondDataType = _sortInboundDataTypes2[1];

  return [{
    name: 'firstObjectId',
    dataType: firstDataType
  }, {
    name: 'secondObjectId',
    dataType: secondDataType
  }].concat(_toConsumableArray(dataTypes.map(function (dataType) {
    return {
      name: getObjectId(dataType),
      dataType: dataType
    };
  }))).reduce(function (result, _ref3) {
    var name = _ref3.name,
        dataType = _ref3.dataType;
    return result.set(name, ImmutableMap({
      name: name,
      label: unescapedText("reporting-data.dataTypes." + dataType),
      type: 'number',
      hidden: true
    }));
  }, ImmutableMap());
};

var getCountProperty = function getCountProperty() {
  return ImmutableMap({
    count: ImmutableMap({
      key: 'count',
      label: I18n.text('reporting-data.properties.common.count', {
        object: I18n.text("reporting-data.dataTypes." + CROSS_OBJECT)
      }),
      type: 'number'
    })
  });
};

var getTotalProperty = function getTotalProperty() {
  return ImmutableMap({
    total: ImmutableMap({
      key: 'total',
      label: I18n.text('reporting-data.properties.common.total'),
      type: 'number'
    })
  });
};

var getCrossObjectProperties = function getCrossObjectProperties(dataTypes) {
  return Promise.all(dataTypes.map(function (dataType) {
    return getProperties(dataType);
  }).toArray()).then(function (properties) {
    var joinedProperties = getJoinedProperties(dataTypes, properties).merge(getObjectIdProperties(dataTypes)).merge(getCountProperty()).merge(getTotalProperty());
    return ImmutableMap(_defineProperty({}, CROSS_OBJECT, joinedProperties));
  });
};

export default cached('default', function (config) {
  var dataTypes = config.getIn(['crossObject', 'dataTypes']);
  return getCrossObjectProperties(dataTypes);
});