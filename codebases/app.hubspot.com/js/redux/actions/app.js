'use es6';

import { push } from 'react-router-redux';
import { fetchAccountsWithChannels } from './channels';
import { fetchCampaigns } from './campaigns';
import { fetchHubSettings, fetchUsers, fetchUserAttributes, updateDismissedBanners } from './users';
import { fetchUnboxing, setRoute, updateUi } from './ui';
import { trackInteraction, trackFetchChannels } from './usage';
import { getCampaignsEnabled } from '../selectors/user';
import { getUserCanBoostPosts, getAppSection, getDataFilter, getUi, getAccounts, isFromAdsCreateFlow, hasCompletedOnboarding } from '../selectors';
import { openComposerByQueryParams } from './composer';
import { pollInboxUnreadCount } from './feed';
import { APP_SECTIONS, ACCOUNT_TYPES } from '../../lib/constants';
import { openProfile, openProfileByUsername } from './people'; // update flag to activate FacebookEngagementModal if appropriate

export var setFacebookEngagementModalVisibility = function setFacebookEngagementModalVisibility() {
  var afterConnect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return function (dispatch, getState) {
    // has already been set to true/false, do not show again, unless we just connected a FB account
    if (!afterConnect && typeof getUi(getState()).get('isFacebookEngagementModalVisible') === 'boolean') {
      return;
    }

    var userCanBoostPosts = getUserCanBoostPosts(getState());
    var isFacebookEngagementModalVisible = isFromAdsCreateFlow(getState()) && userCanBoostPosts;
    dispatch(updateUi({
      isFacebookEngagementModalVisible: isFacebookEngagementModalVisible
    }));
  };
};
export var appDidMount = function appDidMount(location, routes, params) {
  return function (dispatch, getState) {
    dispatch(setRoute(routes, params));
    return dispatch(fetchAccountsWithChannels()).then(function (data) {
      dispatch(fetchUnboxing()).then(function () {
        var appSection = getAppSection(getState()); // not totally sure why we do not redirect into onboarding from /settings, but preserving this behavior while moving it out of AppContainer

        if (getAccounts(getState()).isEmpty() && appSection !== APP_SECTIONS.settings && !hasCompletedOnboarding(getState())) {
          dispatch(push('/welcome'));
        }
      });
      var appSection = getAppSection(getState());

      if (appSection !== APP_SECTIONS.settings) {
        dispatch(openComposerByQueryParams());
      }

      dispatch(trackFetchChannels(data, getDataFilter(getState())));
      dispatch(pollInboxUnreadCount());
      dispatch(setFacebookEngagementModalVisibility());
    });
  };
};
export var appInit = function appInit() {
  return function (dispatch, getState) {
    // Non-blocking requests
    dispatch(updateDismissedBanners());
    dispatch(fetchUsers());
    var hasCampaignsReadAccess = getCampaignsEnabled(getState());

    if (hasCampaignsReadAccess) {
      dispatch(fetchCampaigns());
    } // Blocking requests


    return Promise.all([dispatch(fetchUserAttributes()), dispatch(fetchHubSettings())]);
  };
};
export var onClickMessageText = function onClickMessageText(e) {
  return function (dispatch, getState) {
    // strive to handle clicking on any mention of a social user, maybe eventually hashtag
    if (e.target.className.includes('tweet-username')) {
      var twitterUrlParts = e.target.href.split('/');
      var twitterUsername = twitterUrlParts[twitterUrlParts.length - 1]; // attempt to find them in intel, since we can simplify loading process and get contact association

      var feedUser = getState().intel.getNetwork(ACCOUNT_TYPES.twitter).find(function (u) {
        return u.getUsername() === twitterUsername;
      });

      if (feedUser) {
        dispatch(openProfile(feedUser));
      } // fallback to lookup by username


      dispatch(openProfileByUsername(ACCOUNT_TYPES.twitter, twitterUsername));
      dispatch(trackInteraction('open profile by mention'));
      e.preventDefault();
    }
  };
};