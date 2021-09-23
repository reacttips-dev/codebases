'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import links from 'crm-legacy-links/links';

var RecycleBinButton = function RecycleBinButton(_ref) {
  var typeDef = _ref.typeDef,
      hasAllScopes = _ref.hasAllScopes;
  var disabled = !hasAllScopes('crm-recycling-bin-access');
  return /*#__PURE__*/_jsx(PermissionTooltip, {
    tooltipKey: "restoreObjectsDisabled.object",
    disabled: !disabled,
    children: /*#__PURE__*/_jsx(UIButton, {
      disabled: disabled,
      href: links.recyclingBin(typeDef.objectTypeId),
      external: true,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "topbarContents.recyclingBinNav.object"
      })
    })
  });
};

export default RecycleBinButton;