'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import UILink from 'UIComponents/link/UILink';
import { NavMarker } from 'react-rhumb';

var FullPageError = function FullPageError() {
  return /*#__PURE__*/_jsxs(UIErrorMessage, {
    type: "badRequest",
    className: "width-100",
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "FULL_PAGE_ERROR"
    }), /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "index.errorBoundaries.fullPage.refreshWithLink",
        options: {
          refreshLink: /*#__PURE__*/_jsx(UILink, {
            href: window.location.href,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "index.errorBoundaries.fullPage.refreshLink"
            })
          })
        }
      })
    })]
  });
};

export default FullPageError;