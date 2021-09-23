'use es6';

import { UPGRADE_DATA_INVALID, UPGRADE_DATA_VALID } from 'ui-addon-upgrades/_core/common/data/upgradeData/upgradeDataStates';
import { validateApp } from 'ui-addon-upgrades/_core/common/data/upgradeData/validators/validateApp';
import { validateScreen } from 'ui-addon-upgrades/_core/common/data/upgradeData/validators/validateScreen';
import { validateUpgradeProduct } from 'ui-addon-upgrades/_core/common/data/upgradeData/validators/validateUpgradeProduct';
import { validateUniqueId } from 'ui-addon-upgrades/_core/common/data/upgradeData/validators/validateUniqueId';

var _getValidationStatus = function _getValidationStatus(properties, validators) {
  var validationStatuses = [];
  Object.keys(properties).forEach(function (key) {
    var validator = validators[key];

    if (!validator) {
      return UPGRADE_DATA_VALID;
    }

    validationStatuses.push(validator(properties[key]));
    return undefined;
  });

  if (validationStatuses.indexOf(UPGRADE_DATA_INVALID) !== -1) {
    return UPGRADE_DATA_INVALID;
  }

  return UPGRADE_DATA_VALID;
};

export default (function (upgradeData) {
  var PROPERTIES = {
    app: upgradeData.app,
    screen: upgradeData.screen,
    upgradeProduct: upgradeData.upgradeProduct,
    uniqueId: upgradeData.uniqueId
  };
  var PROPERTY_VALIDATORS = {
    app: validateApp,
    screen: validateScreen,
    uniqueId: validateUniqueId,
    upgradeProduct: validateUpgradeProduct
  };
  return _getValidationStatus(PROPERTIES, PROPERTY_VALIDATORS);
});