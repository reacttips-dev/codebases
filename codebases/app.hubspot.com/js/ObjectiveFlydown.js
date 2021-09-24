'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { KOALA } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import LinkCards from './LinkCards';
import Breadcrumbs from './Breadcrumbs';
var Container = styled.div.attrs({
  className: 'p-all-8'
}).withConfig({
  displayName: "ObjectiveFlydown__Container",
  componentId: "cv8w9y-0"
})(["background-color:", ";"], KOALA);

function ObjectiveFlydown(_ref) {
  var setCurrentObjective = _ref.setCurrentObjective,
      primaryBreadcrumb = _ref.primaryBreadcrumb,
      secondaryBreadcrumb = _ref.secondaryBreadcrumb,
      primaryCard = _ref.primaryCard,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct,
      secondaryCard = _ref.secondaryCard,
      guideLink = _ref.guideLink,
      guideSmallText = _ref.guideSmallText;
  var breadcrumbs = [{
    message: primaryBreadcrumb,
    onClick: function onClick() {
      return setCurrentObjective(null);
    }
  }, {
    message: secondaryBreadcrumb
  }];
  return /*#__PURE__*/_jsxs(Container, {
    children: [/*#__PURE__*/_jsx(Breadcrumbs, {
      breadcrumbs: breadcrumbs
    }), /*#__PURE__*/_jsxs("div", {
      className: "display-flex",
      children: [/*#__PURE__*/_jsx("div", {
        style: {
          width: '50%'
        },
        children: /*#__PURE__*/_jsx("div", {
          style: {
            marginRight: '32px',
            height: '100%'
          },
          children: primaryCard
        })
      }), /*#__PURE__*/_jsx("div", {
        style: {
          width: '30%'
        },
        children: secondaryCard
      }), /*#__PURE__*/_jsx("div", {
        style: {
          width: '20%'
        },
        children: /*#__PURE__*/_jsx("div", {
          style: {
            marginLeft: '32px'
          },
          children: /*#__PURE__*/_jsx(LinkCards, {
            guideLink: guideLink,
            guideSmallText: guideSmallText,
            preferredTrialUpgradeProduct: preferredTrialUpgradeProduct
          })
        })
      })]
    })]
  });
}

export default ObjectiveFlydown;