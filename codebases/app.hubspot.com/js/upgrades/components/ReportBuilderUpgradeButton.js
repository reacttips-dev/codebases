'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import UIButton from 'UIComponents/button/UIButton';
import UILockBadge from 'UIComponents/badge/UILockBadge';
import { useUpgradeModal } from 'ui-addon-upgrades/ums/useUpgradeModal';

var ReportBuilderUpgradeButton = function ReportBuilderUpgradeButton(_ref) {
  var children = _ref.children;

  var _useUpgradeModal = useUpgradeModal('report-builder'),
      openUpgradeModal = _useUpgradeModal.openUpgradeModal;

  return /*#__PURE__*/_jsxs(UIButton, {
    onClick: function onClick(event) {
      event.stopPropagation();
      openUpgradeModal();
    },
    children: [children, /*#__PURE__*/_jsx(UILockBadge, {})]
  });
};

export default ReportBuilderUpgradeButton;