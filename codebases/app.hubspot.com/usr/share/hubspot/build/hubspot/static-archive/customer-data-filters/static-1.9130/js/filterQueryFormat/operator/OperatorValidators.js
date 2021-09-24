'use es6';

import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
var dateString = /^\d{4}-\d{2}-\d{2}$/;
var numberString = /^\d+(\.\d+)?$/;
export function defaultIsValue(value, field) {
  if (!field) {
    return value !== undefined;
  }

  switch (field.type) {
    case PropertyTypes.BOOLEAN:
      return typeof value === 'boolean';

    case PropertyTypes.DATE:
    case PropertyTypes.DATE_TIME:
      return dateString.test(value);

    case PropertyTypes.ENUMERATION:
      return value !== undefined && value !== null;

    case PropertyTypes.NUMBER:
      return typeof value === 'number' && !isNaN(value) || numberString.test(value);

    case PropertyTypes.STRING:
      return typeof value === 'string' && value !== '';

    default:
      return value !== undefined;
  }
}