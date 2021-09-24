'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { CALYPSO, OLAF, OZ } from 'HubStyleTokens/colors';
import styled from 'styled-components';
var BannerContainer = styled.div.withConfig({
  displayName: "Banner__BannerContainer",
  componentId: "sc-1js2ihu-0"
})(["height:50px;color:", ";background-color:", " !important;background-image:linear-gradient(89deg,", " 0,", " 100%) !important;padding:0 20px;"], OLAF, OZ, CALYPSO, OZ);
var ContentContainer = styled.div.withConfig({
  displayName: "Banner__ContentContainer",
  componentId: "sc-1js2ihu-1"
})(["display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;width:100%;height:100%;"]);

function Banner(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx(BannerContainer, {
    children: /*#__PURE__*/_jsx(ContentContainer, {
      children: children
    })
  });
}

export default Banner;