'use es6';

import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
export var getPropertyLabel = function getPropertyLabel(property) {
  if (!property) {
    return null;
  }

  return property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;
};