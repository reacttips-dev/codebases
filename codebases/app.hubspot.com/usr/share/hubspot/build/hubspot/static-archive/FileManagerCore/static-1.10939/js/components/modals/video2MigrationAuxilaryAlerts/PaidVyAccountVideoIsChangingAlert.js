'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import UIButton from 'UIComponents/button/UIButton';
import UIAlert from 'UIComponents/alert/UIAlert';
import { UsageTrackingLinkTypes, UsageTrackingActions, AlertTypes } from '../../../enums/Video2MigrationUsageTrackingProps';
import { LEARN_ABOUT_HS_VIDEO_LINK, USE_HS_WITH_VY_LINK } from '../../../Constants';

var getI18nKey = function getI18nKey(suffix) {
  return "FileManagerCore.videoIsChangingAlert.paidVidyardAccount." + suffix;
};

var PaidVyAccountVideoIsChangingAlert = function PaidVyAccountVideoIsChangingAlert(_ref) {
  var wrapperClassName = _ref.wrapperClassName,
      givePermissionToManuallyMigrate = _ref.givePermissionToManuallyMigrate,
      setUpReminderInOneWeek = _ref.setUpReminderInOneWeek,
      onTrackInteraction = _ref.onTrackInteraction;
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
        children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: getI18nKey('messagePart2_jsx'),
          elements: {
            Link: UILink
          },
          options: {
            updateVideosLearnMoreLink: 'husbpot.com',
            howToUseVyWithHsLink: USE_HS_WITH_VY_LINK,
            onUpdateVideosLearnMoreClick: function onUpdateVideosLearnMoreClick() {
              return onTrackInteraction(UsageTrackingActions.CLICK_LINK, {
                linkType: UsageTrackingLinkTypes.USE_VIDYARD_WITH_HUBSPOT,
                alert: AlertTypes.PAID_VY_ACCOUNT_ALERT
              });
            },
            onHowToUseVyWithHsClick: function onHowToUseVyWithHsClick() {
              return onTrackInteraction(UsageTrackingActions.CLICK_LINK, {
                alert: AlertTypes.PAID_VY_ACCOUNT_ALERT,
                linkType: UsageTrackingLinkTypes.VIDEO_2_LEARN_MORE_LINK
              });
            }
          }
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "p-top-3",
        children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: getI18nKey('messagePart3_jsx'),
          elements: {
            Link: UILink
          },
          options: {
            learnMoreAboutHsVideoLink: LEARN_ABOUT_HS_VIDEO_LINK,
            onHowToUseVyWithHsClick: function onHowToUseVyWithHsClick() {
              return onTrackInteraction(UsageTrackingActions.CLICK_LINK, {
                alert: AlertTypes.PAID_VY_ACCOUNT_ALERT,
                linkType: UsageTrackingLinkTypes.USE_VIDYARD_WITH_HUBSPOT
              });
            }
          }
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-y-3",
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          onClick: function onClick() {
            onTrackInteraction(UsageTrackingActions.PERMISSION_TO_MANUALLY_MIGRATE, {
              alert: AlertTypes.PAID_VY_ACCOUNT_ALERT
            });
            givePermissionToManuallyMigrate();
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('migrateVideosToVidyardButton')
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "secondary",
          external: true,
          href: LEARN_ABOUT_HS_VIDEO_LINK,
          onClick: function onClick() {
            onTrackInteraction(UsageTrackingActions.CLICK_LINK, {
              alert: AlertTypes.PAID_VY_ACCOUNT_ALERT,
              linkType: UsageTrackingLinkTypes.MANUAL_MIGRATION_LEARN_MORE
            });
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('learnMoreButton')
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "link",
          onClick: function onClick() {
            onTrackInteraction(UsageTrackingActions.REMIND_ME_LATER, {
              alert: AlertTypes.PAID_VY_ACCOUNT_ALERT
            });
            setUpReminderInOneWeek();
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('remindMeInOneWeekButton')
          })
        })]
      })]
    })
  });
};

PaidVyAccountVideoIsChangingAlert.propTypes = {
  wrapperClassName: PropTypes.string,
  givePermissionToManuallyMigrate: PropTypes.func.isRequired,
  setUpReminderInOneWeek: PropTypes.func.isRequired,
  onTrackInteraction: PropTypes.func.isRequired
};
export default PaidVyAccountVideoIsChangingAlert;