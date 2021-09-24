'use es6';

import { createSelector } from 'reselect';
import { createTruthySelector } from 'truthy-selector';
import { Set as ImmutableSet } from 'immutable';
import { NETWORKS_AVAILABLE_FOR_POST_TARGETING, ACCOUNT_TYPES, BROADCAST_MEDIA_TYPE_NOT_ALLOWED_FB_POST_TARGET, POST_TARGET_ERROR } from '../../lib/constants';
import { makeGetPostTargetingEnabledForNetwork } from './gates';
import { getUser } from './user';

var getPostTargeting = function getPostTargeting(state) {
  return state.postTargeting;
};

export var getTargetLocationsForFacebook = createSelector([getPostTargeting], function (postTargeting) {
  return postTargeting.getIn(['locations', 'facebook']) || [];
});
export var getTargetLanguagesForFacebook = createSelector([getPostTargeting], function (postTargeting) {
  return postTargeting.getIn(['languages', 'facebook']) || [];
});
export var getTargetLocationsForLinkedin = createSelector([getPostTargeting], function (postTargeting) {
  return postTargeting.getIn(['locations', 'linkedin']) || [];
});
export var getTargetLanguagesForLinkedin = createSelector([getPostTargeting], function (postTargeting) {
  return postTargeting.getIn(['languages', 'linkedin']) || [];
});
export var getParamsForBroadcastTarget = createSelector([makeGetPostTargetingEnabledForNetwork, getUser], function (getPostTargetingEnabledForNetwork, user) {
  var includeTargetLabels = NETWORKS_AVAILABLE_FOR_POST_TARGETING.map(function (network) {
    return getPostTargetingEnabledForNetwork(network);
  }).some(function (network) {
    return Boolean(network);
  });

  if (includeTargetLabels) {
    return {
      locale: user.locale,
      includeTargetLabels: includeTargetLabels
    };
  }

  return {};
});

var getMessageFromProps = function getMessageFromProps(state, props) {
  return props.message;
};

var getIsFacebookVideoPost = createSelector([getMessageFromProps], function (message) {
  return message.network === ACCOUNT_TYPES.facebook && BROADCAST_MEDIA_TYPE_NOT_ALLOWED_FB_POST_TARGET.includes(message.broadcast.get('broadcastMediaType'));
});
export var getDisabledReasons = createTruthySelector([getIsFacebookVideoPost], function (isFacebookVideoPost) {
  var disabledReasons = ImmutableSet();

  if (isFacebookVideoPost) {
    disabledReasons = disabledReasons.add(POST_TARGET_ERROR.FB_VIDEO_POST);
  }

  return disabledReasons;
});
export var getLocationsForMessageNetwork = createSelector([getMessageFromProps, getTargetLocationsForFacebook, getTargetLocationsForLinkedin], function (message, targetLocationsForFacebook, targetLocationsForLinkedin) {
  if (message.network === ACCOUNT_TYPES.facebook) {
    return targetLocationsForFacebook;
  }

  return targetLocationsForLinkedin;
});
export var getLanguagesForMessageNetwork = createSelector([getMessageFromProps, getTargetLanguagesForFacebook, getTargetLanguagesForLinkedin], function (message, targetLanguagesForFacebook, targetLanguagesForLinkedin) {
  if (message.network === ACCOUNT_TYPES.facebook) {
    return targetLanguagesForFacebook;
  }

  return targetLanguagesForLinkedin;
});