'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UIList from 'UIComponents/list/UIList';
import UILink from 'UIComponents/link/UILink';
import UIButton from 'UIComponents/button/UIButton';
import UIAlert from 'UIComponents/alert/UIAlert';
import { UsageTrackingLinkTypes, UsageTrackingActions, AlertTypes } from '../../../enums/Video2MigrationUsageTrackingProps';
import { VIYDARD_UPGRADE_LINK, LEARN_ABOUT_HS_VIDEO_LINK } from '../../../Constants';

var getI18nKey = function getI18nKey(suffix) {
  return "FileManagerCore.videoIsChangingAlert.freeVidyardAccount." + suffix;
};

var FreeVyAccountVideoIsChangingAlert = function FreeVyAccountVideoIsChangingAlert(_ref) {
  var wrapperClassName = _ref.wrapperClassName,
      onTrackInteraction = _ref.onTrackInteraction,
      optInHubSpotVideo2 = _ref.optInHubSpotVideo2;
  return /*#__PURE__*/_jsx("div", {
    className: wrapperClassName,
    children: /*#__PURE__*/_jsxs(UIAlert, {
      type: "warning",
      titleText: /*#__PURE__*/_jsx("div", {
        className: "p-top-3",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: getI18nKey('title')
        })
      }),
      children: [/*#__PURE__*/_jsx("div", {
        className: "p-top-3",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: getI18nKey('messagePart1')
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "p-top-3",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: getI18nKey('messagePart2')
        })
      }), /*#__PURE__*/_jsxs(UIList, {
        styled: true,
        childClassName: "m-y-1 m-x-0",
        firstChildClassName: "m-top-1 m-x-0",
        lastChildClassName: "",
        children: [/*#__PURE__*/_jsx("span", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('featureList.item1')
          })
        }), /*#__PURE__*/_jsx("span", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('featureList.item2')
          })
        }), /*#__PURE__*/_jsx("span", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('featureList.item3')
          })
        })]
      }), /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: getI18nKey('featureList.moreItems_jsx'),
        elements: {
          Link: UILink
        },
        options: {
          limitedTimeOfferLink: VIYDARD_UPGRADE_LINK,
          onLimitedTimeOfferLinkClick: function onLimitedTimeOfferLinkClick() {
            return onTrackInteraction(UsageTrackingActions.CLICK_LINK, {
              alert: AlertTypes.FREE_VY_ACCOUNT_ALERT,
              linkType: UsageTrackingLinkTypes.UPGRADE_VIYDARD_ACCOUNT
            });
          }
        }
      }), /*#__PURE__*/_jsx("div", {
        className: "p-top-3",
        children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: getI18nKey('messagePart3_jsx'),
          elements: {
            Link: UILink
          },
          options: {
            hubspotVideoLearnMoreLink: LEARN_ABOUT_HS_VIDEO_LINK,
            onHubSpotVideoLearnMoreClick: function onHubSpotVideoLearnMoreClick() {
              return onTrackInteraction(UsageTrackingActions.CLICK_LINK, {
                alert: AlertTypes.FREE_VY_ACCOUNT_ALERT,
                linkType: UsageTrackingLinkTypes.VIDEO_2_LEARN_MORE_LINK
              });
            }
          }
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-y-3",
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          external: true,
          href: VIYDARD_UPGRADE_LINK,
          onClick: function onClick() {
            onTrackInteraction(UsageTrackingActions.CLICK_LINK, {
              alert: AlertTypes.FREE_VY_ACCOUNT_ALERT,
              linkType: UsageTrackingLinkTypes.UPGRADE_VIYDARD_ACCOUNT
            });
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('upgradeToVidyardButton')
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "secondary",
          onClick: function onClick() {
            onTrackInteraction(UsageTrackingActions.OPT_IN, {
              alert: AlertTypes.FREE_VY_ACCOUNT_ALERT
            });
            optInHubSpotVideo2();
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('dismissButton')
          })
        })]
      })]
    })
  });
};

FreeVyAccountVideoIsChangingAlert.propTypes = {
  wrapperClassName: PropTypes.string,
  optInHubSpotVideo2: PropTypes.func.isRequired,
  onTrackInteraction: PropTypes.func.isRequired
};
export default FreeVyAccountVideoIsChangingAlert;