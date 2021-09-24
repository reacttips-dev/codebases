'use es6';

import memoize from 'transmute/memoize';
import { propertyLabelTranslatorWithIsHubSpotDefined } from 'property-translator/propertyTranslator';
import { getLabel, getHubSpotDefined } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
var RECORD_PROPERTY_NAMESPACE = 'recordProperties';
export var getPropertyLabel = memoize(function (propertyName, propertyDefinition) {
  var label = getLabel(propertyDefinition);
  var isHubspotDefined = getHubSpotDefined(propertyDefinition);
  return propertyLabelTranslatorWithIsHubSpotDefined({
    label: label,
    isHubspotDefined: isHubspotDefined,
    nameSpaceKey: RECORD_PROPERTY_NAMESPACE
  });
});