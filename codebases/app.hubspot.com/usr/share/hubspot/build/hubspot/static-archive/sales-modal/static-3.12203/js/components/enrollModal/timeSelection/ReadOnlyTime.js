'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import UIIcon from 'UIComponents/icon/UIIcon';
export var ReadOnlyTime = function ReadOnlyTime(props) {
  return /*#__PURE__*/_jsxs("span", {
    "data-unit-test": props['data-unit-test'],
    children: [props.showIcon && /*#__PURE__*/_jsx(UIIcon, {
      name: "time",
      size: 16
    }), /*#__PURE__*/_jsx("span", {
      style: {
        fontSize: '16px',
        padding: '9px 10px'
      },
      children: I18n.moment.utc(0).minutes(props.value).format('LT')
    })]
  });
};