'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
export default function SidebarError() {
  return /*#__PURE__*/_jsx(UIErrorMessage, {
    type: "403",
    illustration: "errors/general",
    illustrationProps: {
      width: 150
    },
    className: "reagan-test-sidebar-error",
    children: /*#__PURE__*/_jsx("p", {
      className: "p-x-5",
      children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "customerDataSidebar.sidebarError_jsx",
        options: {
          href: window.location.href
        },
        elements: {
          Link: UILink
        }
      })
    })
  });
}