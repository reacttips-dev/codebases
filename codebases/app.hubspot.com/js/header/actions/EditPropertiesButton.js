'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import links from 'crm-legacy-links/links';

var EditPropertiesButton = function EditPropertiesButton(_ref) {
  var typeDef = _ref.typeDef,
      hasAllScopes = _ref.hasAllScopes;
  var disabled = !hasAllScopes('crm-property-settings') && !hasAllScopes('manage-users-access');
  return /*#__PURE__*/_jsx(PermissionTooltip, {
    tooltipKey: "editPropertiesDisabled",
    disabled: !disabled,
    children: /*#__PURE__*/_jsx(UIButton, {
      "data-selenium-test": "edit-properties-link",
      external: true,
      disabled: disabled,
      href: links.propertySettingsRedesign(typeDef.objectTypeId),
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "topbarContents.editPropertiesSelector"
      })
    })
  });
};

export default EditPropertiesButton;