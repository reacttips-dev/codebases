import I18n from 'I18n';
import { GENERAL } from 'self-service-api/constants/UpgradeProducts';
import { getProductNameText } from 'ui-addon-upgrades/_core/common/adapters/getProductNameText';

var _getButtonText = function _getButtonText(i18nKey, productTitle) {
  return I18n.text("upgrades.upgradeButton." + i18nKey, {
    productTitle: productTitle
  });
};

export var getUpgradeButtonText = function getUpgradeButtonText(upgradeType, upgradeProduct) {
  if (upgradeProduct === GENERAL) return I18n.text('upgrades.upgradeButton.default');
  var productTitle = getProductNameText(upgradeProduct);
  return _getButtonText(upgradeType, productTitle);
};