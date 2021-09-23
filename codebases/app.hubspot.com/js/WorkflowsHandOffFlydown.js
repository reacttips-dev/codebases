'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ObjectiveFlydown from './ObjectiveFlydown';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FlydownCard from './FlydownCard';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FactCard from './FactCard';

function WorkflowsHandOffFlydown(_ref) {
  var setCurrentObjective = _ref.setCurrentObjective,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  return /*#__PURE__*/_jsx(ObjectiveFlydown, {
    guideLink: "https://knowledge.hubspot.com/articles/kcs_article/workflows/get-started-with-workflows",
    guideSmallText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.learnMoreAboutWorkflows"
    }),
    setCurrentObjective: setCurrentObjective,
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
    primaryBreadcrumb: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.workflows"
    }),
    secondaryBreadcrumb: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.handOffLeads"
    }),
    primaryCard: /*#__PURE__*/_jsx(FlydownCard, {
      header: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.handOffLeads"
      }),
      iconName: "conditional",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "trial-banner-ui.contextualFlydown.handOffLeadsBlurb"
      })
    }),
    secondaryCard: /*#__PURE__*/_jsx(FactCard, {
      text: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.handOffLeadsDidYouKnow"
      })
    })
  });
}

export default WorkflowsHandOffFlydown;