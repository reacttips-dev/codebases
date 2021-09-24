'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import { identity } from 'underscore';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import actionTypes from './actionTypes';
import RelationshipManager from '../../data/RelationshipManager';
import Relationships from '../../data/model/Relationships';
import { getUserId } from '../selectors/user';
import { CHANNEL_TYPES, getChannelSlugFromKey, ACCOUNT_TYPES, LINKEDIN_URN_PREFIX, getNetworkFromChannelKey, FACEBOOK_GRAPH_API_BASE_URL } from '../../lib/constants';
import { trackInteraction } from './usage';
import { getTwitterChannels, getPublishableChannels } from '../selectors/channels';
import { getNetworkUrl } from '../../lib/utils';
var relationshipManager = RelationshipManager.getInstance();
var TWITTER_ERROR_CODE_TO_MESSAGE_CODE = {
  '108': 'follow.target_not_found',
  '161': 'follow.following_limit',
  '158': 'follow.cannot_follow_self'
};
var MENTION_HELP_DOC_URL = 'https://knowledge.hubspot.com/articles/kcs_article/social/create-and-publish-social-posts?utm_medium=';
export var getMessageForSocialItemActionError = function getMessageForSocialItemActionError(err) {
  if (!(err.responseJSON && err.responseJSON.errorTokens && err.responseJSON.errorTokens.twitterCode)) {
    return err;
  }

  var twitterCode = err.responseJSON.errorTokens.twitterCode[0];

  if (TWITTER_ERROR_CODE_TO_MESSAGE_CODE[twitterCode]) {
    err.messageCode = TWITTER_ERROR_CODE_TO_MESSAGE_CODE[twitterCode];
  }

  return err;
};
export var fetchRelationships = function fetchRelationships(fromIds, toIds) {
  return function (dispatch, getState) {
    var relationships = getState().relationships;
    dispatch({
      type: actionTypes.RELATIONSHIPS_FETCH,
      apiRequest: function apiRequest() {
        return relationshipManager.fetchRelationships(fromIds, toIds).then(function (data) {
          if (!relationships) {
            relationships = Relationships.createFrom(data);
          }

          Object.keys(data).forEach(function (fromId) {
            if (!data[fromId]) {
              // make sure we can tell we fetched followers/following for a channelId, but just found none
              relationships = relationships.setIn(['follower', fromId], ImmutableSet()).setIn(['following', fromId], ImmutableSet());
              return;
            }

            var follower = relationships.follower.get(fromId) || ImmutableSet();
            var following = relationships.following.get(fromId) || ImmutableSet();
            Object.keys(data[fromId]).forEach(function (toId) {
              var toStatus = data[fromId][toId];

              if (toStatus.following) {
                following = following.concat(toId);
              }

              if (toStatus.follower) {
                follower = follower.concat(toId);
              }
            });
            relationships = relationships.set('follower', relationships.follower.merge(_defineProperty({}, fromId, follower)));
            relationships = relationships.set('following', relationships.following.merge(_defineProperty({}, fromId, following)));
          });
          return relationships;
        });
      }
    });
  };
};
export var fetchRelationshipsForChannels = function fetchRelationshipsForChannels(toUserIds) {
  return function (dispatch, getState) {
    var channelIds = getTwitterChannels(getState()).map(function (c) {
      return c.channelKey.split(':')[1];
    }).toSet();
    dispatch(fetchRelationships(channelIds, toUserIds));
  };
};
export var requestFollow = function requestFollow(channelKey, remoteUserId, otherRemoteUserID) {
  return function (dispatch, getState) {
    var userId = getUserId(getState());
    dispatch(trackInteraction('follow', {
      network: getNetworkFromChannelKey(channelKey)
    }));
    return dispatch({
      type: actionTypes.FOLLOW,
      payload: {
        feedKey: "FOLLOW-" + otherRemoteUserID + "-" + remoteUserId
      },
      apiRequest: function apiRequest() {
        return relationshipManager.follow(channelKey, remoteUserId, otherRemoteUserID, userId).catch(function (err) {
          throw getMessageForSocialItemActionError(err);
        });
      }
    });
  };
};
export var requestUnfollow = function requestUnfollow(channelKey, remoteUserId, otherRemoteUserID) {
  return function (dispatch, getState) {
    var userId = getUserId(getState());
    dispatch(trackInteraction('unfollow', {
      network: getNetworkFromChannelKey(channelKey)
    }));
    return dispatch({
      type: actionTypes.UNFOLLOW,
      payload: {
        feedKey: "FOLLOW-" + otherRemoteUserID + "-" + remoteUserId
      },
      apiRequest: function apiRequest() {
        return relationshipManager.unfollow(channelKey, remoteUserId, otherRemoteUserID, userId).catch(function (err) {
          throw getMessageForSocialItemActionError(err);
        });
      }
    });
  };
};
var abortFetchAtMentions;
export var fetchAtMentions = function fetchAtMentions(channelKey, query) {
  return function (dispatch, getState) {
    var channels = getPublishableChannels(getState());
    var channelSlug = getChannelSlugFromKey(channelKey);
    var network = getNetworkFromChannelKey(channelKey);

    if (abortFetchAtMentions) {
      abortFetchAtMentions();
    }

    function getDropdownHelpText() {
      var url = "" + MENTION_HELP_DOC_URL + network + "#mention";
      return /*#__PURE__*/_jsxs("span", {
        className: "mention-results-help",
        onClick: function onClick() {
          return dispatch(trackInteraction('click mention help', {
            network: network
          }));
        },
        children: [/*#__PURE__*/_jsx(FormattedJSXMessage, {
          elements: {
            UILink: UILink
          },
          message: "sui.mentions.helpText." + network + "_jsx"
        }), "\xA0", /*#__PURE__*/_jsx(FormattedJSXMessage, {
          elements: {
            UILink: UILink
          },
          options: {
            url: url
          },
          message: "sui.mentions.helpText.learnMore_jsx"
        })]
      });
    }

    function getMentionsRequestFailureText() {
      var dropdownText = I18n.text("sui.mentions.requestFailure." + network);
      return {
        data: [{
          value: 'failed-request',
          text: '',
          dropdownText: dropdownText,
          disabled: true
        }]
      };
    }

    function getTwitterOptions(resp) {
      resp.data = resp.data.map(function (d) {
        return {
          text: "@" + d.screenName,
          value: d.screenName,
          imageUrl: d.profileImageUrl,
          network: ACCOUNT_TYPES.twitter,
          networkLink: getNetworkUrl(ACCOUNT_TYPES.twitter, d.screenName)
        };
      });
      resp.data.push({
        text: '',
        dropdownText: getDropdownHelpText(ACCOUNT_TYPES.twitter),
        disabled: true,
        value: null
      });
      return resp;
    }

    function getFacebookChannelOptions() {
      var matchingChannels = channels.filter(function (c) {
        return c.channelSlug === CHANNEL_TYPES.facebookpage && c.name.toLowerCase().includes(query.toLowerCase());
      });
      return matchingChannels.map(function (c) {
        return {
          text: c.name,
          value: c.channelId,
          imageUrl: c.avatarUrl,
          network: ACCOUNT_TYPES.facebook,
          tokenText: "{{facebook_mention(" + c.channelId + "|" + c.name + ")}}",
          networkLink: getNetworkUrl(ACCOUNT_TYPES.facebook, c.channelId)
        };
      }).toArray();
    }

    function fetchFacebookOptions(resp) {
      if (!resp.data) {
        return resp;
      }

      var networkChannelOptions = resp.data.map(function (d) {
        var dropdownText = d.name;

        if (d.location) {
          var locationParts = [d.location.city, d.location.state, d.location.country].filter(identity);

          if (locationParts.length) {
            dropdownText = d.name + " (" + locationParts.join(', ') + ")";
          }
        }

        return {
          text: d.name,
          dropdownText: "" + dropdownText,
          tokenText: "{{facebook_mention(" + d.facebookId + "|" + d.name + ")}}",
          value: d.facebookId,
          imageUrl: FACEBOOK_GRAPH_API_BASE_URL + "/" + d.facebookId + "/picture",
          network: ACCOUNT_TYPES.facebook,
          networkLink: getNetworkUrl(ACCOUNT_TYPES.facebook, d.facebookId)
        };
      });
      resp.data = getFacebookChannelOptions();
      var channelIds = ImmutableSet(resp.data.map(function (o) {
        return o.value;
      })); // do not put the same page in twice when query matches a connected channel and a result from FB search

      resp.data = resp.data.concat(networkChannelOptions.filter(function (o) {
        return !channelIds.contains(o.value);
      }));
      resp.data.push({
        text: '',
        dropdownText: getDropdownHelpText(ACCOUNT_TYPES.facebook),
        disabled: true,
        value: null
      });
      return resp;
    }

    function getLinkedinChannelOptions() {
      // todo needs to use full URNs not just IDs
      var matchingChannels = channels.filter(function (c) {
        return c.channelSlug === CHANNEL_TYPES.linkedincompanypage && c.name.toLowerCase().includes(query.toLowerCase());
      });
      return matchingChannels.map(function (c) {
        var urn = "" + LINKEDIN_URN_PREFIX + c.channelId;
        return {
          text: c.name,
          value: urn,
          imageUrl: c.avatarUrl,
          network: ACCOUNT_TYPES.linkedin,
          tokenText: "{{linkedin_mention(" + urn + "|" + c.name + ")}}",
          networkLink: getNetworkUrl(ACCOUNT_TYPES.linkedin, c.channelId)
        };
      }).toArray();
    }

    function cleanMentions(mention) {
      // cleans linkedin organizationBrand type of URN: urn:li:organizationBrand:XXXXX
      return mention.includes('organizationBrand') ? mention.replace('organizationBrand', 'organization') : mention;
    }

    function fetchLinkedInChannelOptions(resp) {
      var networkChannelOptions = resp.data.map(function (d) {
        var organizationId = cleanMentions(d.urn).replace(LINKEDIN_URN_PREFIX, '');
        return {
          text: d.localizedName,
          value: organizationId,
          imageUrl: d.preferredLogoUrl,
          tokenText: "{{linkedin_mention(" + LINKEDIN_URN_PREFIX + organizationId + "|" + d.localizedName + ")}}",
          network: ACCOUNT_TYPES.linkedin,
          networkLink: getNetworkUrl(ACCOUNT_TYPES.linkedin, organizationId)
        };
      });
      resp.data = getLinkedinChannelOptions();
      var channelIds = ImmutableSet(resp.data.map(function (o) {
        return o.value;
      })); // do not put the same page in twice when query matches a connected channel and a result from search

      resp.data = resp.data.concat(networkChannelOptions.filter(function (o) {
        return !channelIds.contains(o.value);
      }));
      resp.data.push({
        text: '',
        dropdownText: getDropdownHelpText(ACCOUNT_TYPES.linkedin),
        disabled: true,
        value: null
      });
      return resp;
    }

    if (channelSlug === CHANNEL_TYPES.twitter) {
      var fetchResult = relationshipManager.fetchAtMentions(query);
      abortFetchAtMentions = fetchResult.abort;
      return fetchResult.promise.then(getTwitterOptions).catch(getMentionsRequestFailureText);
    } else if (channelSlug === CHANNEL_TYPES.facebookpage) {
      if (query.length >= 2) {
        var _fetchResult = relationshipManager.fetchFacebookPages(channelKey, query);

        abortFetchAtMentions = _fetchResult.abort;
        return _fetchResult.promise.then(fetchFacebookOptions).catch(getMentionsRequestFailureText);
      }

      return Promise.resolve({
        data: getFacebookChannelOptions()
      });
    } else if (channelSlug === CHANNEL_TYPES.linkedincompanypage || channelSlug === CHANNEL_TYPES.linkedinstatus) {
      if (query.length >= 2) {
        var _fetchResult2 = relationshipManager.fetchLinkedinCompanies(channelKey, query);

        abortFetchAtMentions = _fetchResult2.abort;
        return _fetchResult2.promise.then(fetchLinkedInChannelOptions).catch(getMentionsRequestFailureText);
      }

      var resp = {
        data: getLinkedinChannelOptions()
      };
      return Promise.resolve(resp);
    }

    return null;
  };
};