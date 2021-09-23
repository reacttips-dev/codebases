'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UILink from 'UIComponents/link/UILink';
import { ACCOUNT_TYPES } from '../../lib/constants';
import usageEvents from '../../lib/usageEvents';
import actionTypes from './actionTypes';
import usageTracker from '../../lib/usageTracker';
import { showNotification, updateUi } from './ui';
import PortalIdParser from 'PortalIdParser';
export var trackAdsEvent = function trackAdsEvent(event, data) {
  usageTracker.track(event, data);
};
export var initBroadcastBoosting = function initBroadcastBoosting(broadcastGuid) {
  return function (dispatch) {
    dispatch(updateUi({
      boostBroadcastGuid: broadcastGuid
    }));
    trackAdsEvent(usageEvents.createAdCampaign, {
      network: ACCOUNT_TYPES.facebook.toUpperCase(),
      type: 'boosted social post'
    });
  };
};
export var initPostBoosting = function initPostBoosting(postId) {
  return function (dispatch) {
    dispatch(updateUi({
      boostPostId: postId
    }));
    trackAdsEvent(usageEvents.createAdCampaign, {
      network: ACCOUNT_TYPES.facebook.toUpperCase(),
      type: 'boosted social post'
    });
  };
};
export var closeBoostPanel = function closeBoostPanel() {
  return function (dispatch) {
    dispatch(updateUi({
      boostBroadcastGuid: null,
      boostPostId: null
    }));
    trackAdsEvent(usageEvents.boostPanel, {
      action: 'closed panel'
    });
  };
};
export var closeBoostPanelOnAdCreated = function closeBoostPanelOnAdCreated(boostedPost, boostedPostOptions) {
  return function (dispatch) {
    var campaignId = boostedPost.campaignId,
        accountId = boostedPost.accountId;
    var successNotification = {
      id: actionTypes.SHOW_NOTIFICATION,
      type: 'success',
      titleText: I18n.text('sui.notifications.boost.success.title'),
      message: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("span", {
          className: "m-right-2",
          children: I18n.text('sui.notifications.boost.success.message')
        }), /*#__PURE__*/_jsx(UILink, {
          href: "/ads/" + PortalIdParser.get() + "/accounts/facebook/" + accountId + "/campaigns/" + campaignId,
          external: true,
          children: I18n.text('sui.notifications.boost.success.viewAd')
        })]
      }),
      timeout: 10000
    };
    trackAdsEvent(usageEvents.createAdCampaignSuccess, Object.assign({
      network: ACCOUNT_TYPES.facebook.toUpperCase(),
      type: 'boosted social post'
    }, boostedPostOptions));
    dispatch(updateUi({
      boostBroadcastGuid: null
    }));
    dispatch(showNotification(successNotification));
  };
};
export var showErrorOnAdCreationFailure = function showErrorOnAdCreationFailure(error) {
  return function (dispatch) {
    var responseJSON = error.responseJSON;
    var errorMessage = responseJSON ? responseJSON.message : null;
    var errorNotification = {
      id: actionTypes.SHOW_NOTIFICATION,
      type: 'danger',
      message: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sui.notifications.boost.error.message"
        }), errorMessage && /*#__PURE__*/_jsx("span", {
          className: "m-left-2",
          children: I18n.text('sui.notifications.boost.error.response', {
            errorMessage: errorMessage
          })
        })]
      })
    };
    trackAdsEvent(usageEvents.boostPanel, {
      action: 'social post boost failed'
    });
    dispatch(showNotification(errorNotification));
  };
};