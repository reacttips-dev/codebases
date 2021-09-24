// A flydown specifically for Ops Hub Pro.
// The design differs from `FeaturesFlydown` bc Ops Pro trialers need a little more guidance than other trials.
'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import { GYPSUM } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIPricingPageRedirectButton from 'ui-addon-upgrades/button/UIPricingPageRedirectButton';
import { app, screen } from '../queryParamUtils';
import { OPERATIONS_PROFESSIONAL } from 'self-service-api/constants/UpgradeProducts';
import UISubheader from 'UIComponents/layout/UISubheader';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import { ProgressiveGuideFeatureConfigs, UpgradeProductToFeatureKeys } from '../constants/trialTasksConfigs';
import UIButton from 'UIComponents/button/UIButton';
import { OPS_HUB_OVERVIEW_URL } from '../constants/urls';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import { tracker } from '../tracker';
var Container = styled.div.withConfig({
  displayName: "OpsHubFeaturesFlydown__Container",
  componentId: "sc-1h3sj50-0"
})(["background-color:", ";width:100%;z-index:1110;display:flex;flex-direction:column;box-shadow:rgba(0,0,0,0.11) 0 30px 30px 0,rgba(0,0,0,0.08) 0 15px 15px 0;padding:20px 40px;"], GYPSUM);
var FeatureTitle = styled.span.withConfig({
  displayName: "OpsHubFeaturesFlydown__FeatureTitle",
  componentId: "sc-1h3sj50-1"
})(["font-size:20px;font-weight:600;"]);

var OpsHubFeaturesFlydown = function OpsHubFeaturesFlydown() {
  var featureKeys = UpgradeProductToFeatureKeys[OPERATIONS_PROFESSIONAL];
  var featureConfigs = ProgressiveGuideFeatureConfigs[OPERATIONS_PROFESSIONAL];
  return /*#__PURE__*/_jsxs(Container, {
    children: [/*#__PURE__*/_jsxs(UISubheader, {
      style: {
        width: '100%'
      },
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.contextualFlydown.includedInTrial"
      }),
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "link",
        onClick: function onClick() {
          // TODO track click
          window.open(OPS_HUB_OVERVIEW_URL, '_blank');
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.productOverview"
        })
      }), /*#__PURE__*/_jsx(UIPricingPageRedirectButton, {
        upgradeData: {
          app: app,
          screen: screen,
          uniqueId: 'trial-banner-flydown',
          upgradeProduct: OPERATIONS_PROFESSIONAL
        },
        use: "secondary",
        "data-test-id": "flydown-pricing-page-redirect-button"
      })]
    }), featureKeys.map(function (featureKey) {
      var featureConfig = featureConfigs[featureKey];
      return /*#__PURE__*/_jsx(UICardWrapper, {
        children: /*#__PURE__*/_jsx("div", {
          className: "p-all-5",
          children: /*#__PURE__*/_jsxs(UIFlex, {
            justify: "between",
            align: "center",
            children: [/*#__PURE__*/_jsxs(UIFlex, {
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  width: '100px'
                },
                children: /*#__PURE__*/_jsx(UIFlex, {
                  align: "center",
                  justify: "center",
                  children: /*#__PURE__*/_jsx(UIIllustration, {
                    name: featureConfig.illustrationName,
                    height: 70
                  })
                })
              }), /*#__PURE__*/_jsxs("p", {
                children: [/*#__PURE__*/_jsx(FeatureTitle, {
                  children: /*#__PURE__*/_jsx(FormattedMessage, {
                    message: featureConfig.titleKey
                  })
                }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(FormattedMessage, {
                  message: featureConfig.bodyKey
                })]
              })]
            }), /*#__PURE__*/_jsxs(UIButtonWrapper, {
              children: [/*#__PURE__*/_jsx(UIButton, {
                use: "tertiary-light",
                onClick: function onClick() {
                  window.open(featureConfig.guideUrl);
                  tracker.track('interaction', {
                    action: 'clicked read guide',
                    feature: featureKey,
                    app: app,
                    screen: screen
                  });
                },
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "trial-banner-ui.readGuide"
                })
              }), /*#__PURE__*/_jsx(UIButton, {
                use: "tertiary",
                onClick: function onClick() {
                  window.open(featureConfig.featureUrl);
                  tracker.track('interaction', {
                    action: 'clicked get started',
                    feature: featureKey,
                    app: app,
                    screen: screen
                  });
                },
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "trial-banner-ui.getStarted"
                })
              })]
            })]
          })
        })
      }, featureKey);
    })]
  });
};

export default OpsHubFeaturesFlydown;