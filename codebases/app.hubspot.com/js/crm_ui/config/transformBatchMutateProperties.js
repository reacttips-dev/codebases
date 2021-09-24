'use es6';

import { fromJS } from 'immutable';
import I18n from 'I18n';
var SELECTED_PROPERTIES = {
  TASK: {
    'metadata.status': function metadataStatus(property) {
      var updatedOptions = fromJS([{
        label: I18n.text('topbarContents.bulkEditModal.completed'),
        value: 'COMPLETED'
      }]);
      return property = property.set('options', updatedOptions);
    }
  }
};
var PROPERTY_OPTIONS = {
  TASK: {
    'metadata.status': function metadataStatus(property) {
      return property = property.set('label', I18n.text('topbarContents.bulkEditModal.markCompleted'));
    }
  }
};

var selectedProperties = function selectedProperties(properties, objectType) {
  if (properties == null) {
    return properties;
  }

  if (!SELECTED_PROPERTIES[objectType]) {
    return properties;
  }

  return properties.map(function (property) {
    var transformFn = SELECTED_PROPERTIES[objectType][property.get('name')];

    if (transformFn) {
      property = transformFn(property);
    }

    return property;
  });
};

var propertyOptions = function propertyOptions(properties, objectType) {
  if (properties == null) {
    return properties;
  }

  if (!PROPERTY_OPTIONS[objectType]) {
    return properties;
  }

  return properties.map(function (property) {
    var transformFn = PROPERTY_OPTIONS[objectType][property.get('name')];

    if (transformFn) {
      property = transformFn(property);
    }

    return property;
  });
};

export default {
  propertyOptions: propertyOptions,
  selectedProperties: selectedProperties
};