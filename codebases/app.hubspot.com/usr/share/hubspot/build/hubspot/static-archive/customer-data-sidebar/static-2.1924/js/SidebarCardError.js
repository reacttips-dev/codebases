'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
export default function SidebarCardError() {
  return /*#__PURE__*/_jsx("p", {
    className: "p-x-5 p-top-4 reagan-test-sidebar-error",
    "data-unit-test": "SidebarCardError",
    children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "customerDataSidebar.sidebarCardError_jsx",
      options: {
        href: window.location.href
      },
      elements: {
        Link: UILink
      }
    })
  });
}