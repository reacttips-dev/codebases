'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import UIImage from 'UIComponents/image/UIImage';
import noResultsUrl from 'bender-url!FileManagerImages/images/no-results.svg';
export default function EmptySearchResults() {
  return /*#__PURE__*/_jsxs("div", {
    className: "text-center",
    children: [/*#__PURE__*/_jsx(UIImage, {
      className: "m-y-10",
      width: 100,
      src: noResultsUrl,
      responsive: false
    }), /*#__PURE__*/_jsx("h5", {
      children: I18n.text('FileManagerLib.noResults.message')
    })]
  });
}