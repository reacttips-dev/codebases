'use es6';

import * as UpgradeProducts from 'self-service-api/constants/UpgradeProducts';
import { validateProperty } from 'ui-addon-upgrades/_core/common/data/upgradeData/validators/validateProperty';
export var validateUpgradeProduct = function validateUpgradeProduct(upgradeProduct) {
  var upgradeProductValues = Object.values(UpgradeProducts);
  var isValidUpgradeProduct = upgradeProductValues.indexOf(upgradeProduct) !== -1;
  return validateProperty(isValidUpgradeProduct, "expected upgradeProduct to be one of " + upgradeProductValues + " but got " + upgradeProduct, 'upgradeProduct');
};