import { GLOBAL_NULL } from '../constants/defaultNullValues';
import { ENUMERATION, STRING } from '../constants/property-types';

var shouldTreatAsEmpty = function shouldTreatAsEmpty(value, type) {
  return value === GLOBAL_NULL || value === '' && [ENUMERATION, STRING].includes(type);
};

export var filterOutEmptySearchValues = function filterOutEmptySearchValues(row, typesByProperty) {
  return row.filter(function (value, property) {
    return !shouldTreatAsEmpty(value, typesByProperty.get(property));
  });
};
export var normalizeDatasetEmptiness = function normalizeDatasetEmptiness(dataset) {
  var typesByProperty = dataset.get('properties').map(function (property) {
    return property.get('type');
  });
  dataset = dataset.update('data', function (rows) {
    return rows.map(function (row) {
      return filterOutEmptySearchValues(row, typesByProperty);
    });
  });
  dataset = dataset.update('properties', function (properties) {
    return properties.map(function (property, propertyName) {
      var type = typesByProperty.get(propertyName);
      return property.update('references', function (references) {
        return references.filter(function (_, key) {
          return !shouldTreatAsEmpty(key, type);
        });
      });
    });
  });
  return dataset;
};