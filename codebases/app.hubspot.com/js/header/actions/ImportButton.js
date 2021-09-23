'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import links from 'crm-legacy-links/links';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import UIButton from 'UIComponents/button/UIButton';
import UIColumn from 'UIComponents/column/UIColumn';
import canCreate from '../../crm_ui/utils/canCreate';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { getPluralForm } from '../../crmObjects/methods/getPluralForm';
import { isWordPress } from 'hubspot-plugin-common';

var ImportButton = function ImportButton(_ref) {
  var typeDef = _ref.typeDef,
      hasAllScopes = _ref.hasAllScopes;
  // The check after the || here is BET-specific logic
  // that seems to only apply to contacts and companies.
  var hasImportScope = hasAllScopes('crm-import');
  var hasImportAccess = hasImportScope || !hasImportScope && canCreate(typeDef.name);
  return /*#__PURE__*/_jsx(UIColumn, {
    className: "m-left-3",
    children: /*#__PURE__*/_jsx("div", {
      className: "add-control",
      children: /*#__PURE__*/_jsx(PermissionTooltip, {
        tooltipKey: "importDisabled",
        tooltipOptions: {
          objectTypeLabel: getPluralForm(typeDef)
        },
        placement: "bottom",
        disabled: hasImportAccess,
        children: /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          external: isWordPress,
          href: links.import(),
          "data-onboarding": "import-button" // Data attribute for coaching tips
          ,
          "data-coaching-tips": "import-button",
          disabled: !hasImportAccess,
          children: /*#__PURE__*/_jsx(FormattedReactMessage, {
            message: "contentToolbar.import"
          })
        })
      })
    })
  });
};

export default ImportButton;