'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PortalIdParser from 'PortalIdParser';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISelect from 'UIComponents/input/UISelect';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UILink from 'UIComponents/link/UILink';
export var defaultRenderTypeSelect = function defaultRenderTypeSelect(props) {
  var formControlProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return /*#__PURE__*/_jsx(UIFormControl, Object.assign({
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "labels.subscriptionType"
    })
  }, formControlProps, {
    children: /*#__PURE__*/_jsx(UISelect, Object.assign({
      placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "placeholders.subscriptionType"
      }),
      dropdownClassName: "untruncate",
      "data-selenium-test": "gdpr-sub-type-select"
    }, props))
  }));
};
export var defaultRenderGroupSelect = function defaultRenderGroupSelect(props, formControlProps) {
  return /*#__PURE__*/_jsx(UIFormControl, Object.assign({
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "labels.preferenceGroup"
    }),
    help: /*#__PURE__*/_jsx(UILink, {
      href: "/settings/" + PortalIdParser.get() + "/marketing/email/preferences-center",
      external: true,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "labels.openPreferenceGroupSettings"
      })
    }),
    tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "labels.preferenceGroupHelp"
    })
  }, formControlProps, {
    children: /*#__PURE__*/_jsx(UISelect, Object.assign({
      placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "placeholders.preferenceGroup"
      })
    }, props))
  }));
};