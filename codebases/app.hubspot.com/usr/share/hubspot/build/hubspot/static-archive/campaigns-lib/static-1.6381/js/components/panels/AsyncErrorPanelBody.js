'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import { EDIT_PANEL_WIDTH } from 'campaigns-lib/constants/campaignEditPanel';
export default function AsyncErrorPanelBody() {
  return /*#__PURE__*/_jsx(UIPanelBody, {
    width: EDIT_PANEL_WIDTH,
    children: /*#__PURE__*/_jsx(UIErrorMessage, {
      type: "badRequest"
    })
  });
}