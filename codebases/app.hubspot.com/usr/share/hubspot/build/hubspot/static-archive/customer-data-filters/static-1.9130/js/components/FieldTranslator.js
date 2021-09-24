'use es6';

import * as propertyDescriptionTranslator from 'property-description-translator';
import * as propertyTranslator from 'property-translator/propertyTranslator';
import { ObjectTypeIdRegex } from 'customer-data-filters/filterQueryFormat/ObjectTypeId';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
export var getTranslatedFieldDescription = function getTranslatedFieldDescription(_ref) {
  var fieldDescription = _ref.fieldDescription,
      fieldName = _ref.fieldName,
      filterFamily = _ref.filterFamily;
  // propertyDescriptionTranslator will throw an error if it gets an
  // objectTypeId that doesn't start with 0 (which means it's hubspot defined)
  var objectTypeId = ObjectTypeIdRegex.test(filterFamily) && filterFamily[0] === '0' ? filterFamily : ObjectTypesToIds[filterFamily];
  return objectTypeId && fieldDescription && fieldName && propertyDescriptionTranslator.propertyDescriptionTranslator({
    name: fieldName,
    description: fieldDescription,
    objectTypeId: objectTypeId
  }) || fieldDescription;
};
export var getTranslatedFieldLabel = function getTranslatedFieldLabel(_ref2) {
  var fieldLabel = _ref2.fieldLabel,
      fieldName = _ref2.fieldName;
  return propertyTranslator.propertyLabelTranslator(fieldLabel || fieldName);
};