import { productsAndAddons } from 'self-service-api/core/utilities/links';
import UpgradeProductProperties from 'self-service-api/constants/UpgradeProductProperties';
export var getUpgradeLink = function getUpgradeLink(_ref) {
  var source = _ref.source,
      upgradeProduct = _ref.upgradeProduct;

  if (!upgradeProduct) {
    return productsAndAddons();
  } // `upgradeLink` takes between 0 and 2 arguments, so this casts it to always take 2.


  var _ref2 = UpgradeProductProperties[upgradeProduct],
      upgradeLink = _ref2.upgradeLink;

  if (upgradeLink) {
    return upgradeLink(source, upgradeProduct);
  }

  return productsAndAddons();
};