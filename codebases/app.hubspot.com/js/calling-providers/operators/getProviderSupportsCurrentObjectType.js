'use es6';

import isLegacyHubSpotObject from 'customer-data-objects/crmObject/isLegacyHubSpotObject';
export var getProviderSupportsCurrentObjectType = function getProviderSupportsCurrentObjectType(_ref) {
  var selectedCallProvider = _ref.selectedCallProvider,
      objectTypeId = _ref.objectTypeId;

  if (!isLegacyHubSpotObject(objectTypeId)) {
    return selectedCallProvider.supportsCustomObjects;
  }

  return true;
};