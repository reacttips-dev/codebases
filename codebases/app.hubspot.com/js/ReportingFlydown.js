'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Fragment } from 'react';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';
import FeatureFlydown from './FeatureFlydown';
import FlydownCard from './FlydownCard';
import RelatedFeaturesIcon from './RelatedFeaturesIcon';
import { tracker } from './tracker';

function ReportingFlydown(_ref) {
  var setCurrentObjective = _ref.setCurrentObjective,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  return /*#__PURE__*/_jsx(FeatureFlydown, {
    setCurrentObjective: setCurrentObjective,
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
    guideLink: "https://knowledge.hubspot.com/articles/kcs_article/reports/getting-started-with-reports",
    guideSmallText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.learnMoreAboutReporting"
    }),
    header: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.reporting"
    }),
    cards: /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(FlydownCard, {
        header: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.whatItIs"
        }),
        iconName: "bulb",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.reportingWhat"
        })
      }), /*#__PURE__*/_jsx(FlydownCard, {
        header: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.howYouCouldUseIt"
        }),
        iconName: "test",
        children: /*#__PURE__*/_jsxs(UIList, {
          childClassName: "m-bottom-2",
          children: [/*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'reportingAnalyzeTraffic'
              });
              setCurrentObjective('REPORTING_ANALYZE');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.analyzeTraffic"
            })
          }), /*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'reportingMeasureCampaigns'
              });
              setCurrentObjective('REPORTING_MEASURE');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.measureCampaigns"
            })
          }), /*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'reportingFindGaps'
              });
              setCurrentObjective('REPORTING_FIND');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.findGaps"
            })
          }), /*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'reportingRelevantData'
              });
              setCurrentObjective('REPORTING_ENSURE');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.relevantData"
            })
          })]
        })
      }), /*#__PURE__*/_jsxs(FlydownCard, {
        header: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.relatedFeatures"
        }),
        iconName: "switcher",
        children: [/*#__PURE__*/_jsx("div", {
          className: "m-bottom-2",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "trial-banner-ui.contextualFlydown.reportingRelatedFeatures"
          })
        }), /*#__PURE__*/_jsxs(UIList, {
          childClassName: "m-bottom-2",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "email"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.trafficAnalytics"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "lists"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.campaignAnalytics"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "forms"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.customReporting"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "ctas"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.emailAnalytics"
            })]
          })]
        })]
      })]
    })
  });
}

export default ReportingFlydown;