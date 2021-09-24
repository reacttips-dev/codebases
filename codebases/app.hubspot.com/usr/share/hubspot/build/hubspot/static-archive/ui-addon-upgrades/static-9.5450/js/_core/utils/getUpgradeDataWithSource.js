'use es6';

import { getCorrectedUpgradeData } from './getCorrectedUpgradeData';
export var getUpgradeDataWithSource = function getUpgradeDataWithSource(upgradeData, source) {
  return Object.assign({}, getCorrectedUpgradeData(upgradeData), {
    source: upgradeData.app + "-" + upgradeData.screen + "-" + source + "-" + upgradeData.uniqueId
  });
};