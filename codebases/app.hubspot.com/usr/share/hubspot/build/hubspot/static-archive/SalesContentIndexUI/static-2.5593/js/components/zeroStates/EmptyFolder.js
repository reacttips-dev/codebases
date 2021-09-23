'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import imageUrl from 'bender-url!SalesContentIndexUI/images/empty-folder.svg';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIImage from 'UIComponents/image/UIImage';
export default function EmptyFolder() {
  return /*#__PURE__*/_jsxs(UIFlex, {
    align: "center",
    direction: "column",
    className: "m-top-6 sales-content-index-zero-state sales-content-index-empty-folder",
    children: [/*#__PURE__*/_jsx(UIImage, {
      className: "m-y-10",
      width: 100,
      src: imageUrl,
      responsive: false
    }), /*#__PURE__*/_jsx("h4", {
      className: "m-bottom-3",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.emptyState.folder.folderIsEmpty"
      })
    })]
  });
}