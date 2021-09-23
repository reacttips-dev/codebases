'use es6';

import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
export var getPropertyLabel = function getPropertyLabel(_ref) {
  var hubspotDefined = _ref.hubspotDefined,
      label = _ref.label;
  return hubspotDefined ? propertyLabelTranslator(label) : label;
};