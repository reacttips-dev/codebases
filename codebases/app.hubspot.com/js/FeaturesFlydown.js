'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { GREAT_WHITE, GYPSUM } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import H4 from 'UIComponents/elements/headings/H4';
import { app, screen } from './queryParamUtils';
import ContactSalesButton from './ContactSalesButton';
import LinkCards from './LinkCards';
import BizObjectivesAndFeaturesList from './BizObjectivesAndFeaturesList';
import { trialIdsWithTrialGuide, upgradeProductToTrialIds } from 'self-service-api/constants/Trials';
var Container = styled.div.withConfig({
  displayName: "FeaturesFlydown__Container",
  componentId: "zwwmhr-0"
})(["background-color:white;width:100%;z-index:1110;display:flex;box-shadow:rgba(0,0,0,0.11) 0 30px 30px 0,rgba(0,0,0,0.08) 0 15px 15px 0;"]);
var Features = styled.div.withConfig({
  displayName: "FeaturesFlydown__Features",
  componentId: "zwwmhr-1"
})(["display:flex;flex:1;justify-content:space-between;max-width:1300px;& >:not(:last-child){margin-right:8px;}"]);
var FeaturesContainer = styled.div.withConfig({
  displayName: "FeaturesFlydown__FeaturesContainer",
  componentId: "zwwmhr-2"
})(["display:flex;justify-content:center;flex:1;padding:60px 50px;flex-basis:80%;"]);
var HelpContainer = styled.div.attrs({
  className: 'text-center'
}).withConfig({
  displayName: "FeaturesFlydown__HelpContainer",
  componentId: "zwwmhr-3"
})(["display:flex;flex-direction:column;align-items:center;justify-content:center;width:400px;background-color:", ";border-left:2px solid ", ";"], GYPSUM, GREAT_WHITE);
var HelpHeader = styled(H4).withConfig({
  displayName: "FeaturesFlydown__HelpHeader",
  componentId: "zwwmhr-4"
})(["font-size:24px;max-width:250px;"]);
var LinksContainer = styled.div.withConfig({
  displayName: "FeaturesFlydown__LinksContainer",
  componentId: "zwwmhr-5"
})(["width:20%;padding:60px 50px 60px 50px;background-color:", ";"], GYPSUM);

function FeaturesFlydown(_ref) {
  var preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  var isTrialWithTrialGuide = trialIdsWithTrialGuide.includes(upgradeProductToTrialIds[preferredTrialUpgradeProduct]);
  return /*#__PURE__*/_jsxs(Container, {
    children: [/*#__PURE__*/_jsx(FeaturesContainer, {
      children: /*#__PURE__*/_jsx(Features, {
        children: /*#__PURE__*/_jsx(BizObjectivesAndFeaturesList, {
          upgradeProduct: preferredTrialUpgradeProduct
        })
      })
    }), isTrialWithTrialGuide ? /*#__PURE__*/_jsx(LinksContainer, {
      children: /*#__PURE__*/_jsx(LinkCards, {
        preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
        showFeatureGuide: false
      })
    }) : /*#__PURE__*/_jsxs(HelpContainer, {
      children: [/*#__PURE__*/_jsx(HelpHeader, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.help"
        })
      }), /*#__PURE__*/_jsx(ContactSalesButton, {
        use: "link",
        upgradeData: {
          app: app,
          screen: screen,
          uniqueId: 'flydown',
          upgradeProduct: preferredTrialUpgradeProduct
        },
        "data-test-id": "flydown-contact-sales-button"
      })]
    })]
  });
}

export default FeaturesFlydown;