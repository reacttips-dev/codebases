'use es6';

import devLogger from 'react-utils/devLogger';
import { UPGRADE_DATA_INVALID, UPGRADE_DATA_VALID } from 'ui-addon-upgrades/_core/common/data/upgradeData/upgradeDataStates';
export var validateProperty = function validateProperty(isValid, message, propName) {
  if (!isValid) {
    devLogger.warn({
      message: "createUpgradeData: " + message,
      key: "createUpgradeData: " + propName
    });
    return UPGRADE_DATA_INVALID;
  }

  return UPGRADE_DATA_VALID;
};