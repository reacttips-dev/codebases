'use es6';

import * as checked from '../../lib/checked';
export var Dataset = checked.record({
  key: checked.string().optional(),
  data: checked.list().fromJS().defaultValue([]),
  properties: checked.map(checked.map()).fromJS().defaultValue({}),
  // The # of documents in a search table
  paginationSize: checked.number().optional(),
  searchDimension: checked.string().optional(),
  dataAge: checked.number().optional()
}, 'Dataset');
export var getProperty = function getProperty(dataset, property) {
  return dataset.getIn(['properties', property]);
};
export var getPropertyLabel = function getPropertyLabel(dataset, property) {
  return dataset.getIn(['properties', property, 'label'], property);
};
export var getPropertyType = function getPropertyType(dataset, property) {
  return dataset.getIn(['properties', property, 'type']);
};
export var getReference = function getReference(dataset, property, key) {
  return dataset.getIn(['properties', property, 'references', String(key)]);
};
export var getReferenceLabel = function getReferenceLabel(dataset, property, key) {
  var fallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : key;
  return dataset.getIn(['properties', property, 'references', String(key), 'label'], String(fallback));
};
export var getReferenceLink = function getReferenceLink(dataset, property, key) {
  return dataset.getIn(['properties', property, 'references', String(key), 'link'], undefined);
};