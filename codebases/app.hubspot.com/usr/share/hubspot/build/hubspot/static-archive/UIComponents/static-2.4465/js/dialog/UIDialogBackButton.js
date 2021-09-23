'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import UIDialogButton from './UIDialogButton';
export default function UIDialogBackButton(props) {
  return /*#__PURE__*/_jsx(UIDialogButton, Object.assign({
    "aria-label": I18n.text('ui.UIPanelNavigator.backButton'),
    iconName: "left",
    iconSize: 18
  }, props));
}
UIDialogBackButton.displayName = 'UIDialogBackButton';