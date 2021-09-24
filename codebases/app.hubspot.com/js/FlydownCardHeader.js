'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment } from 'react';
import UICardHeader from 'UIComponents/card/UICardHeader';
import UIIcon from 'UIComponents/icon/UIIcon';
import { LORAX } from 'HubStyleTokens/colors';

function FlydownCardHeader(_ref) {
  var text = _ref.text,
      iconName = _ref.iconName;
  return /*#__PURE__*/_jsx(UICardHeader, {
    title: /*#__PURE__*/_jsxs(Fragment, {
      children: [iconName && /*#__PURE__*/_jsx(UIIcon, {
        name: iconName,
        size: "xs",
        className: "m-right-2",
        color: LORAX
      }), text]
    })
  });
}

export default FlydownCardHeader;