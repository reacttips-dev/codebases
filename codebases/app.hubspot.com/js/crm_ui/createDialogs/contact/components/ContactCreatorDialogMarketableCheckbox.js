'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIFormControl from 'UIComponents/form/UIFormControl';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var ContactCreatorDialogMarketableCheckbox = function ContactCreatorDialogMarketableCheckbox(_ref) {
  var checked = _ref.checked,
      onChange = _ref.onChange,
      disabled = _ref.disabled;
  return /*#__PURE__*/_jsx(UIFormControl, {
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "objectCreator.contactCreatorDialogMarketableCheckbox.formControlLabel"
    }),
    children: /*#__PURE__*/_jsx(UITooltip, {
      disabled: !disabled,
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "objectCreator.contactCreatorDialogMarketableCheckbox.disabledTooltip"
      }),
      children: /*#__PURE__*/_jsx(UICheckbox, {
        checked: checked,
        onChange: onChange,
        disabled: disabled,
        "data-unit-test": "contact-creator-dialog-marketable-checkbox",
        "data-selenium-test": "contact-creator-dialog-marketable-checkbox",
        "data-selenium-test-marketable-checked": checked,
        children: /*#__PURE__*/_jsx(UIHelpIcon, {
          title: /*#__PURE__*/_jsxs("span", {
            children: [/*#__PURE__*/_jsx(FormattedMessage, {
              message: "objectCreator.contactCreatorDialogMarketableCheckbox.tooltipBody"
            }), /*#__PURE__*/_jsx(UILink, {
              href: "https://knowledge.hubspot.com/contacts/marketing-contacts",
              external: true,
              className: "p-left-1",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "objectCreator.contactCreatorDialogMarketableCheckbox.tooltipLink"
              })
            })]
          }),
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "objectCreator.contactCreatorDialogMarketableCheckbox.helpLabel"
          })
        })
      })
    })
  });
};

ContactCreatorDialogMarketableCheckbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
export default ContactCreatorDialogMarketableCheckbox;