'use es6';

import getIn from 'transmute/getIn';
import isLegacyHubSpotObject from '../crmObject/isLegacyHubSpotObject';
import { translateObjectName, translateObjectNameUnknownNumber } from './translateObjectName';

var getLegacyHubSpotObjectTypeName = function getLegacyHubSpotObjectTypeName(objectType, _ref) {
  var isCapitalized = _ref.isCapitalized,
      isPlural = _ref.isPlural;
  return isPlural ? translateObjectNameUnknownNumber(objectType, {
    isCapitalized: isCapitalized
  }) : translateObjectName(objectType, {
    isCapitalized: isCapitalized
  });
};

var translateObjectTypeName = function translateObjectTypeName(_ref2) {
  var _ref2$isCapitalized = _ref2.isCapitalized,
      isCapitalized = _ref2$isCapitalized === void 0 ? false : _ref2$isCapitalized,
      _ref2$isPlural = _ref2.isPlural,
      isPlural = _ref2$isPlural === void 0 ? false : _ref2$isPlural,
      objectType = _ref2.objectType,
      _ref2$objectTypeDefin = _ref2.objectTypeDefinition,
      objectTypeDefinition = _ref2$objectTypeDefin === void 0 ? {} : _ref2$objectTypeDefin;

  if (isLegacyHubSpotObject(objectType)) {
    return getLegacyHubSpotObjectTypeName(objectType, {
      isCapitalized: isCapitalized,
      isPlural: isPlural
    });
  }

  var singularForm = getIn(['singularForm'], objectTypeDefinition);

  if (!singularForm) {
    singularForm = getIn(['name'], objectTypeDefinition);
  }

  var pluralForm = getIn(['pluralForm'], objectTypeDefinition);

  if (!pluralForm) {
    pluralForm = getIn(['name'], objectTypeDefinition);
  }

  return isPlural ? pluralForm : singularForm;
};

export default translateObjectTypeName;