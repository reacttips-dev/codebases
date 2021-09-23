'use es6';

import { useUpgradeModal } from 'ui-addon-upgrades/ums/useUpgradeModal';
import PropTypes from 'prop-types';
export var UpgradeModalWrapper = function UpgradeModalWrapper(_ref) {
  var children = _ref.children,
      upgradeKey = _ref.upgradeKey;

  var _useUpgradeModal = useUpgradeModal(upgradeKey),
      openUpgradeModal = _useUpgradeModal.openUpgradeModal;

  return children(openUpgradeModal);
};
UpgradeModalWrapper.propTypes = {
  children: PropTypes.func,
  upgradeKey: PropTypes.string
};