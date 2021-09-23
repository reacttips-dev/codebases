'use es6';

export default (function (oldUpgradeData, newUpgradeData) {
  var upgradeDataIsSame = Boolean(oldUpgradeData.app === newUpgradeData.app && oldUpgradeData.screen === newUpgradeData.screen && oldUpgradeData.upgradeProduct === newUpgradeData.upgradeProduct && oldUpgradeData.uniqueId === newUpgradeData.uniqueId && oldUpgradeData.bundleUrl === newUpgradeData.bundleUrl);
  return !upgradeDataIsSame;
});