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

function WorkflowsFlydown(_ref) {
  var setCurrentObjective = _ref.setCurrentObjective,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  return /*#__PURE__*/_jsx(FeatureFlydown, {
    setCurrentObjective: setCurrentObjective,
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
    guideLink: "https://knowledge.hubspot.com/articles/kcs_article/workflows/get-started-with-workflows",
    guideSmallText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.learnMoreAboutWorkflows"
    }),
    header: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.workflows"
    }),
    cards: /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(FlydownCard, {
        header: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.whatTheyAre"
        }),
        iconName: "bulb",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.workflowsWhat"
        })
      }), /*#__PURE__*/_jsx(FlydownCard, {
        header: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.howYouCouldUseThem"
        }),
        iconName: "test",
        children: /*#__PURE__*/_jsxs(UIList, {
          childClassName: "m-bottom-2",
          children: [/*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'workflowsNurtureLeads'
              });
              setCurrentObjective('WORKFLOWS_NURTURE');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.nurtureLeads"
            })
          }), /*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'workflowsUpdateLifecycleStages'
              });
              setCurrentObjective('WORKFLOWS_UPDATE');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.updateLifecycleStages"
            })
          }), /*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'workflowsHandOffLeads'
              });
              setCurrentObjective('WORKFLOWS_HAND_OFF');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.handOffLeads"
            })
          })]
        })
      }), /*#__PURE__*/_jsx(FlydownCard, {
        header: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.relatedFeatures"
        }),
        iconName: "switcher",
        children: /*#__PURE__*/_jsxs(UIList, {
          childClassName: "m-bottom-2",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "email"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.email"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "lists"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.listSegmentation"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "forms"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.forms"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "ctas"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.callsToAction"
            })]
          })]
        })
      })]
    })
  });
}

export default WorkflowsFlydown;