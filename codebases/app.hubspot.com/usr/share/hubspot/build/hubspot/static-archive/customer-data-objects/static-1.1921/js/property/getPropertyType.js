'use es6';

import * as ExternalOptionTypes from './ExternalOptionTypes';
import * as PropertyFieldTypes from './PropertyFieldTypes';
import * as PropertyTypes from './PropertyTypes';

var getPropertyType = function getPropertyType(property) {
  var _property$toJS = property.toJS(),
      calculated = _property$toJS.calculated,
      externalOptions = _property$toJS.externalOptions,
      fieldType = _property$toJS.fieldType,
      hubspotDefined = _property$toJS.hubspotDefined,
      referencedObjectType = _property$toJS.referencedObjectType,
      type = _property$toJS.type;

  var defaultFieldType = 'unknown';
  var isSelectWithExternalOptions = externalOptions && fieldType === PropertyFieldTypes.SELECT && referencedObjectType !== null && Object.prototype.hasOwnProperty.call(ExternalOptionTypes, referencedObjectType); // This can be removed once we have full support for the new fieldTypes: EQUATION, ROLLUP, SCORE

  var isLegacyCalculation = calculated && !hubspotDefined && fieldType === PropertyFieldTypes.NUMBER && type === PropertyTypes.NUMBER;

  if (fieldType === PropertyFieldTypes.EQUATION || fieldType === PropertyFieldTypes.ROLLUP || isLegacyCalculation) {
    return PropertyFieldTypes.CALCULATION;
  }

  return isSelectWithExternalOptions ? ExternalOptionTypes[referencedObjectType] : fieldType || defaultFieldType;
};

export default getPropertyType;