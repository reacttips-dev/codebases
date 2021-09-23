'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIAlert from 'UIComponents/alert/UIAlert';

var TemplatesAlert = function TemplatesAlert() {
  return /*#__PURE__*/_jsx(UIAlert, {
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.sidebarTemplateList.maxTemplatesTitle"
    }),
    type: "danger",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.sidebarTemplateList.maxTemplatesSubtitle"
    })
  });
};

export default TemplatesAlert;