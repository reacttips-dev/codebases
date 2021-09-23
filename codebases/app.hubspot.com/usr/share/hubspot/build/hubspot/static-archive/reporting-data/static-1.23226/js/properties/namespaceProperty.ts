import { Map as ImmutableMap } from 'immutable';
import propertyNamespaces from './constants/propertyNamespaces';
export var getNamespace = function getNamespace(dataType) {
  return propertyNamespaces[dataType];
};
export var getObjectId = function getObjectId(dataType) {
  return "hs_" + getNamespace(dataType) + "_object_id";
};
var objectIds = Object.keys(propertyNamespaces).map(getObjectId);
export var isObjectId = function isObjectId(property) {
  return objectIds.includes(property);
};
export var namespaceProperty = function namespaceProperty(dataType, propertyName) {
  if (isObjectId(propertyName)) {
    return propertyName;
  }

  var namespace = getNamespace(dataType);
  return namespace + "_" + propertyName;
};
var namespaceDataTypes = ImmutableMap(propertyNamespaces).flip();
export var getDataTypeFromNamespacedProperty = function getDataTypeFromNamespacedProperty(namespacedProperty) {
  return namespaceDataTypes.find(function (_, namespace) {
    return namespacedProperty.startsWith(namespace);
  });
};
export var extractPropertyNamespace = function extractPropertyNamespace(namespacedProperty) {
  if (isObjectId(namespacedProperty)) {
    var _dataType = getDataTypeFromNamespacedProperty(namespacedProperty.split('hs_')[1]);

    return {
      dataType: _dataType,
      namespace: getNamespace(_dataType),
      propertyName: namespacedProperty
    };
  }

  var dataType = getDataTypeFromNamespacedProperty(namespacedProperty);

  if (!dataType) {
    return {
      dataType: undefined,
      namespace: '',
      propertyName: namespacedProperty
    };
  }

  return {
    dataType: dataType,
    namespace: getNamespace(dataType),
    propertyName: namespacedProperty.slice(getNamespace(dataType).length + 1)
  };
};