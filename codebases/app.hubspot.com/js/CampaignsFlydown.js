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

function CampaignsFlydown(_ref) {
  var preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct,
      setCurrentObjective = _ref.setCurrentObjective;
  return /*#__PURE__*/_jsx(FeatureFlydown, {
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
    setCurrentObjective: setCurrentObjective,
    guideLink: "https://knowledge.hubspot.com/articles/kcs_article/campaigns/create-campaigns",
    guideSmallText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.learnMoreAboutCampaigns"
    }),
    header: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.contextualFlydown.campaigns"
    }),
    cards: /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(FlydownCard, {
        header: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.whatTheyAre"
        }),
        iconName: "bulb",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.campaignsWhat"
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
                feature: 'campaignsCaptureFeedback'
              });
              setCurrentObjective('CAMPAIGNS_CAPTURE');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.captureFeedback"
            })
          }), /*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'campaignsRaiseAwareness'
              });
              setCurrentObjective('CAMPAIGNS_RAISE');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.raiseAwareness"
            })
          }), /*#__PURE__*/_jsx(UILink, {
            onClick: function onClick() {
              tracker.track('interaction', {
                action: 'showObjectiveClick',
                feature: 'campaignsPromoteEvent'
              });
              setCurrentObjective('CAMPAIGNS_PROMOTE');
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.promoteEvent"
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
            message: "trial-banner-ui.contextualFlydown.campaignsRelatedFeatures"
          })
        }), /*#__PURE__*/_jsxs(UIList, {
          childClassName: "m-bottom-2",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "website"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.landingPages"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "tag"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.ads"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "social"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.social"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "blog"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.blogPosts"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "email"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.email"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(RelatedFeaturesIcon, {
              name: "ctas"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.contextualFlydown.CTAs"
            })]
          })]
        })]
      })]
    })
  });
}

export default CampaignsFlydown;