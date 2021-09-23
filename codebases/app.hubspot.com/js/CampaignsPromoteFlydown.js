'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ObjectiveFlydown from './ObjectiveFlydown';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FlydownCard from './FlydownCard';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FactCard from './FactCard';

function CampaignsPromoteFlydown(_ref) {
  var setCurrentObjective = _ref.setCurrentObjective,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  return /*#__PURE__*/_jsx(ObjectiveFlydown, {
    guideLink: "https://knowledge.hubspot.com/articles/kcs_article/campaigns/create-campaigns",
    guideSmallText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.learnMoreAboutCampaigns"
    }),
    setCurrentObjective: setCurrentObjective,
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
    primaryBreadcrumb: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.campaigns"
    }),
    secondaryBreadcrumb: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.promoteEvent"
    }),
    primaryCard: /*#__PURE__*/_jsx(FlydownCard, {
      header: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.promoteEvent"
      }),
      iconName: "conditional",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "trial-banner-ui.contextualFlydown.promoteEventBlurb"
      })
    }),
    secondaryCard: /*#__PURE__*/_jsx(FactCard, {
      text: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.promoteEventDidYouKnow"
      })
    })
  });
}

export default CampaignsPromoteFlydown;