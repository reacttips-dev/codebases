'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { KOALA } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import UICardGrid from 'UIComponents/card/UICardGrid';
import LinkCards from './LinkCards';
var Container = styled.div.attrs({
  className: 'p-all-8'
}).withConfig({
  displayName: "FeatureFlydown__Container",
  componentId: "sc-14t2bxu-0"
})(["background-color:", ";"], KOALA);
var CardsContainer = styled.div.withConfig({
  displayName: "FeatureFlydown__CardsContainer",
  componentId: "sc-14t2bxu-1"
})(["width:80%;"]);
var LinksContainer = styled.div.withConfig({
  displayName: "FeatureFlydown__LinksContainer",
  componentId: "sc-14t2bxu-2"
})(["width:20%;padding-left:32px;"]);

function FeatureFlydown(_ref) {
  var cards = _ref.cards,
      guideLink = _ref.guideLink,
      guideSmallText = _ref.guideSmallText,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  return /*#__PURE__*/_jsx(Container, {
    children: /*#__PURE__*/_jsxs("div", {
      style: {
        display: 'flex'
      },
      children: [/*#__PURE__*/_jsx(CardsContainer, {
        children: /*#__PURE__*/_jsx(UICardGrid, {
          style: {
            height: '100%'
          },
          columns: 3,
          children: cards
        })
      }), /*#__PURE__*/_jsx(LinksContainer, {
        children: /*#__PURE__*/_jsx(LinkCards, {
          guideLink: guideLink,
          guideSmallText: guideSmallText,
          preferredTrialUpgradeProduct: preferredTrialUpgradeProduct
        })
      })]
    })
  });
}

export default FeatureFlydown;