'use es6';

import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
export var getGroupLabel = function getGroupLabel(_ref) {
  var hubspotDefined = _ref.hubspotDefined,
      displayName = _ref.displayName;
  return hubspotDefined ? propertyLabelTranslator(displayName) : displayName;
};