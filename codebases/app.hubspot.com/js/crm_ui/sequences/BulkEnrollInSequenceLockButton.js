'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UILockedFeature from 'ui-addon-upgrades/decorators/UILockedFeature';
import UILock from 'ui-addon-upgrades/icons/UILock';
import UIButton from 'UIComponents/button/UIButton';
import { hasSequencesAccess } from 'sequences-highlight-alert-lib/SequencesPermissions';
export default function BulkEnrollInSequenceLockButton() {
  var modalKey = !hasSequencesAccess() ? 'crm-sequences-access' : 'sequences-legacy-starter-upgrade';
  return /*#__PURE__*/_jsx(UILockedFeature, {
    isDropdownOption: false,
    modalKey: modalKey,
    mountModalDelay: 0,
    upgradeData: {
      app: 'crm',
      screen: 'index',
      upgradeProduct: 'sales-professional',
      uniqueId: modalKey
    },
    children: /*#__PURE__*/_jsxs(UIButton, {
      use: "link",
      children: [/*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "topbarContents.enrollInSequence",
        className: "m-right-1"
      }), /*#__PURE__*/_jsx(UILock, {})]
    })
  });
}