'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ObjectiveFlydown from './ObjectiveFlydown';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FlydownCard from './FlydownCard';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FactCard from './FactCard';

function ReportingMeasureFlydown(_ref) {
  var setCurrentObjective = _ref.setCurrentObjective,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  return /*#__PURE__*/_jsx(ObjectiveFlydown, {
    guideLink: "https://knowledge.hubspot.com/articles/kcs_article/reports/getting-started-with-reports",
    guideSmallText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.learnMoreAboutReporting"
    }),
    setCurrentObjective: setCurrentObjective,
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
    primaryBreadcrumb: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.reporting"
    }),
    secondaryBreadcrumb: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.measureCampaigns"
    }),
    primaryCard: /*#__PURE__*/_jsx(FlydownCard, {
      header: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.measureCampaigns"
      }),
      iconName: "conditional",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "trial-banner-ui.contextualFlydown.measureCampaignsBlurb"
      })
    }),
    secondaryCard: /*#__PURE__*/_jsx(FactCard, {
      text: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.measureCampaignsDidYouKnow"
      })
    })
  });
}

export default ReportingMeasureFlydown;