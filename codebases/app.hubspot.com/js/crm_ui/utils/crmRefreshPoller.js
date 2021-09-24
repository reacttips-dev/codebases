'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import { CrmLogger } from 'customer-data-tracking/loggers';
var FIRST_APPEARANCE = 'FIRST_APPEARANCE';
var REPEAT_APPEARANCE = 'REPEAT_APPEARANCE';

var reload = function reload() {
  return window.location.reload();
};

var addAlert = function addAlert(appearanceType) {
  CrmLogger.log('recordInteractions', {
    action: 'shown outdated version banner'
  }); // to delete

  CrmLogger.log('record-interaction', {
    action: 'outdated version banner',
    subAction: appearanceType === FIRST_APPEARANCE ? 'first display' : 'repeat display'
  });
  FloatingAlertStore.addAlert({
    titleText: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "outdatedVersion.title"
    }),
    message: /*#__PURE__*/_jsxs(UIButtonWrapper, {
      children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "outdatedVersion.message"
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: reload,
        size: "extra-small",
        use: "tertiary",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "outdatedVersion.refresh"
        })
      })]
    }),
    sticky: true,
    type: 'tip',
    use: 'inline',
    onClose: function onClose() {
      CrmLogger.log('record-interaction', {
        action: 'outdated version banner',
        subAction: 'dismissed banner'
      });
      setTimeout(function () {
        return addAlert(REPEAT_APPEARANCE);
      }, I18n.moment.duration(3, 'hour').valueOf());
    }
  });
};

export function startOutdatedVersionPoll() {
  // https://git.hubteam.com/HubSpot/CRM/pull/14881#discussion_r733088
  // this value is stored as a 32-bit integer and overflows past 24.8 days.
  // Don't let people go 24.8 days without refreshing the CRM. PLease.
  setTimeout(function () {
    return addAlert(FIRST_APPEARANCE);
  }, I18n.moment.duration(1, 'week').valueOf());
}