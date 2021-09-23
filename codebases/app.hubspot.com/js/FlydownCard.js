'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardSection from 'UIComponents/card/UICardSection';
import FlydownCardHeader from './FlydownCardHeader';
var CardWrapper = styled(UICardWrapper).withConfig({
  displayName: "FlydownCard__CardWrapper",
  componentId: "sc-1f3oq59-0"
})(["height:100%;"]);

function FlydownCard(_ref) {
  var children = _ref.children,
      header = _ref.header,
      iconName = _ref.iconName;
  return /*#__PURE__*/_jsxs(CardWrapper, {
    compact: true,
    children: [/*#__PURE__*/_jsx(FlydownCardHeader, {
      text: header,
      iconName: iconName
    }), /*#__PURE__*/_jsx(UICardSection, {
      children: children
    })]
  });
}

export default FlydownCard;