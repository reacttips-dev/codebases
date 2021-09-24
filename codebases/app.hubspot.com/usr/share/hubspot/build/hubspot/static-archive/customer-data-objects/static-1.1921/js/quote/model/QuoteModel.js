'use es6';

import { fromJS } from 'immutable';
import get from 'transmute/get';
import { getId, getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import { DEFAULT_QUOTE_ASSOCIATED_OBJECTS, INTEGER_PROPERTIES, BOOLEAN_PROPERTIES, QUOTE_ASSOCIATIONS } from '../constants/properties';
export function getQuoteId(quoteRecord) {
  return getId(quoteRecord.quote);
}
export function getDealId(quoteRecord) {
  return quoteRecord.associations[QUOTE_ASSOCIATIONS.QUOTE_TO_DEAL].first();
}
export function getQuoteProperty(quoteRecord, property) {
  var value = Object.prototype.hasOwnProperty.call(DEFAULT_QUOTE_ASSOCIATED_OBJECTS, property) ? get(property, quoteRecord.quoteAssociatedObjects) : getProperty(quoteRecord.quote, property);

  if (INTEGER_PROPERTIES.has(property)) {
    return value ? parseInt(value, 10) : null;
  } else if (BOOLEAN_PROPERTIES.has(property)) {
    return value === 'true' || value === true;
  }

  return value;
}
export function getQuoteAssociation(quoteRecord, associationType) {
  return quoteRecord.getIn(['associations', associationType]);
}
export function setQuoteAssociations(quoteRecord, associations) {
  return quoteRecord.update('associations', function (currentAssociations) {
    return currentAssociations.merge(associations);
  });
}
export function setQuoteProperty(quoteRecord, propertyPath, value, source, sourceId) {
  // propertyPath can be a String or Array - to set nested properties within the
  // quoteAssociatedObjects object
  var isArray = Array.isArray(propertyPath);
  var topLevelProperty = isArray ? get(0, propertyPath) : propertyPath;

  if (Object.prototype.hasOwnProperty.call(DEFAULT_QUOTE_ASSOCIATED_OBJECTS, topLevelProperty)) {
    var additionalPropertiesUpdatePath = isArray ? ['quoteAssociatedObjects'].concat(propertyPath) : ['quoteAssociatedObjects', propertyPath];
    return quoteRecord.setIn(additionalPropertiesUpdatePath, value);
  }

  if (isArray) {
    throw new Error('Use a string for propertyPath to set quote inboundDB properties');
  }

  return quoteRecord.update('quote', function (quote) {
    return setProperty(quote, propertyPath, value, source, sourceId);
  }).updateIn(['quote', 'stagedUpdates'], function (stagedUpdates) {
    return stagedUpdates.set(propertyPath, value);
  });
}
export function mergeQuoteProperties(quoteRecord, updates) {
  var updatesMap = fromJS(updates);
  var inboundDbUpdates = updatesMap.filterNot(function (value, key) {
    return Object.prototype.hasOwnProperty.call(DEFAULT_QUOTE_ASSOCIATED_OBJECTS, key);
  });
  var additionalPropertyUpdates = updatesMap.filter(function (value, key) {
    return Object.prototype.hasOwnProperty.call(DEFAULT_QUOTE_ASSOCIATED_OBJECTS, key);
  });
  var updatedquote = inboundDbUpdates.reduce(function (quote, updatedValue, key) {
    return setProperty(quote, key, updatedValue).update('stagedUpdates', function (stagedUpdates) {
      return stagedUpdates.set(key, updatedValue);
    });
  }, quoteRecord.quote);
  var updatedQuoteAdditionalProperties = quoteRecord.quoteAssociatedObjects.merge(additionalPropertyUpdates);
  return quoteRecord.merge({
    quote: updatedquote,
    quoteAssociatedObjects: updatedQuoteAdditionalProperties
  });
}