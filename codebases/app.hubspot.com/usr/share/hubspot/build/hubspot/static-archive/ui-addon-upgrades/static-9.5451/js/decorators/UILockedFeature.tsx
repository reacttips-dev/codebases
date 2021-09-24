import { jsx as _jsx } from "react/jsx-runtime";
import { Children, cloneElement } from 'react';
import UpgradeModal from './UpgradeModal';
import { getCorrectedUpgradeData } from '../_core/utils/getCorrectedUpgradeData';

/**
 * @deprecated All usages of `UILockedFeature` should transition to use
 * `useUpgradeModal` and the Upgrade Management System (`go/ums`).
 *
 * For any questions, feel free to reach out to
 * [#growth-embedded-buying-ebx](https://hubspot.slack.com/archives/CC04HSNNQ).
 */
function UILockedFeature(_ref) {
  var upgradeData = _ref.upgradeData,
      _children = _ref.children,
      feature = _ref.feature,
      isDropdownOption = _ref.isDropdownOption,
      modalKey = _ref.modalKey;
  var correctedUpgradeData = getCorrectedUpgradeData(upgradeData);
  return /*#__PURE__*/_jsx(UpgradeModal, {
    upgradeData: correctedUpgradeData,
    modalKey: modalKey,
    feature: feature,
    children: function children(_ref2) {
      var openUpgradeModal = _ref2.openUpgradeModal,
          preloadUpgradeModal = _ref2.preloadUpgradeModal;
      return Children.map(_children, function (child) {
        return /*#__PURE__*/cloneElement(child, {
          onMouseOver: function onMouseOver() {
            if (child.props.onMouseOver) {
              var _child$props;

              (_child$props = child.props).onMouseOver.apply(_child$props, arguments);
            }

            preloadUpgradeModal();
          },
          onClick: function onClick() {
            if (child.props.onClick) {
              var _child$props2;

              (_child$props2 = child.props).onClick.apply(_child$props2, arguments);
            }

            openUpgradeModal();
          },
          className: isDropdownOption ? child.props.className + " p-y-2 p-x-5" : child.props.className,
          use: isDropdownOption ? 'unstyled' : child.props.use || 'secondary'
        });
      });
    }
  });
}

export default UILockedFeature;