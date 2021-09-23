'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { createAction } from 'flux-actions';
import { MSG_TYPE_MODAL_DIALOG_CLOSE } from 'ui-addon-iframeable/messaging/IFrameMessageTypes';
import { onComposerOpened, onComposerClosed, fetchPagePreview, downloadFromUrl, fetchTwitterStatus, downloadPhotos } from './composer';
import { identity } from 'underscore';
import I18n from 'I18n';
import { List, Map as ImmutableMap, Set as ImmutableSet, OrderedMap, fromJS } from 'immutable';
import { goToManageUrl } from '../../manage/actions';
import { extractPreviewLinkFromBroadcast, logDebug, getValidUrlsInText, logError, logBreadcrumb } from '../../lib/utils';
import actionTypes from './actionTypes';
import { fetchAccountsAndChannels } from './accounts';
import { fetchContent, fetchFileManagerFile } from './content';
import { createQuoteTweet } from './streams';
import { showNotification, updateUi } from './ui';
import { ACCOUNT_TYPES, BROADCAST_MEDIA_TYPE, BROADCAST_PUBLISH_TYPE, COMPOSER_MESSAGE_TYPES, COMPOSER_MODES, FILE_FROM_URL_ID, TWITTER_STATUS_PATTERN, BROADCAST_GROUP_OPTIONS_KEYS, MULTI_IMAGE_ACCOUNT_TYPES, getNetworkFromChannelKey } from '../../lib/constants';
import { BROADCAST_UPDATE_ERROR_KEYS } from '../../lib/broadcastError';
import { getRoute } from '../selectors';
import { getPublishableChannels, getTwitterChannels, getChannelsForComposerPicker } from '../selectors/channels';
import BroadcastManager from '../../data/BroadcastManager';
import Broadcast from '../../data/model/Broadcast';
import { API_ERROR_MAP } from '../../data/model/BroadcastGroupMessage';
import { trackInteraction, trackBroadcastGroupCreate, trackBroadcastGroupUpdate, removeEventKeyOverride } from './usage';
import SuccessNotification from '../../components/composer/SuccessNotification';
import { fetchBroadcasts, fetchStatusCounts } from './broadcasts';
import { getUserRoleName, getUserId } from '../selectors/user';
import allSettled from 'hs-promise-utils/allSettled';
import { isComposerEmbed, getEmbeddedContext } from '../selectors/embed';
import { sendMessageToHost } from './embed';
import { makeGetFavoriteChannelsForComposer, getDefaultPublishNow } from '../selectors/users';
import { getParamsForBroadcastTarget } from '../selectors/postTargeting';
import { getPagePreviews } from '../selectors/pagePreviews';
var broadcastManager = BroadcastManager.getInstance();
var cloneBroadcastGroupAction = createAction(actionTypes.BROADCAST_GROUP_CLONE, function (broadcasts, attrs) {
  return {
    broadcasts: broadcasts,
    attrs: attrs
  };
});
var initBroadcastGroupAction = createAction(actionTypes.BROADCAST_GROUP_INIT, identity);
var broadcastGroupPopulateAction = createAction(actionTypes.BROADCAST_GROUP_POPULATE, identity);
export var updateBroadcastGroup = createAction(actionTypes.BROADCAST_GROUP_UPDATE, identity);
export var updateMessageInGroup = createAction(actionTypes.BROADCAST_GROUP_UPDATE_MESSAGE, function (attrs, index) {
  return {
    attrs: attrs,
    index: index
  };
});
export var updateBroadcastInGroup = createAction(actionTypes.BROADCAST_GROUP_UPDATE_BROADCAST, function (attrs, index) {
  return {
    attrs: attrs,
    index: index
  };
});
var blurBroadcastGroupAction = createAction(actionTypes.BROADCAST_GROUP_BLUR, identity);
export var replaceBroadcastGroup = createAction(actionTypes.BROADCAST_GROUP_REPLACE, identity);
export var removeBroadcastFromGroup = createAction(actionTypes.BROADCAST_GROUP_REMOVE_MESSAGE, identity);
export var attachMedia = createAction(actionTypes.BROADCAST_GROUP_ATTACH_MEDIA, function (file, index, opts) {
  return {
    file: file,
    index: index,
    opts: opts
  };
});
export var makeDraft = createAction(actionTypes.BROADCAST_GROUP_MAKE_DRAFT, identity);
export var clearCalendarBroadcasts = createAction(actionTypes.CALENDAR_BROADCAST_CLEAR);
var initBroadcastGroupApproval = createAction(actionTypes.BROADCAST_GROUP_APPROVE_INIT, function (data) {
  return {
    broadcasts: List(data.map(function (d) {
      return d.broadcast;
    })),
    networks: ImmutableMap(data.map(function (d) {
      return [d.broadcast.broadcastGuid, d.network];
    })),
    broadcastGroupOptions: data.broadcastGroupOptions
  };
});

var removeCloneFailedProperty = function removeCloneFailedProperty(messages) {
  return messages.map(function (message) {
    return message.setIn(['broadcast', 'content', 'cloneFailed'], null);
  });
};

export var initBroadcastGroup = function initBroadcastGroup() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (dispatch, getState) {
    dispatch(fetchAccountsAndChannels());
    attrs.options = ImmutableMap();

    if (getRoute(getState()).id !== 'calendar') {
      dispatch(clearCalendarBroadcasts());
    }

    dispatch(onComposerOpened(COMPOSER_MODES.create));
    return dispatch(initBroadcastGroupAction(attrs));
  };
};
export var broadcastGroupPopulate = function broadcastGroupPopulate() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (dispatch) {
    return dispatch(broadcastGroupPopulateAction(attrs));
  };
};
export var blurBroadcastGroup = function blurBroadcastGroup() {
  return function (dispatch, getState) {
    // blurring means we are closing the panel, or dismissing the post-save dialog the only applies to the embed
    dispatch(blurBroadcastGroupAction());
    dispatch(updateUi({
      composerOpen: false
    }));
    var publishResultData = getState().composerResponse.toJS();

    if (isComposerEmbed(getState())) {
      var embeddedContext = getEmbeddedContext(getState());

      if (embeddedContext) {
        embeddedContext.sendMessage(MSG_TYPE_MODAL_DIALOG_CLOSE, publishResultData);
      } else {
        dispatch(sendMessageToHost(COMPOSER_MESSAGE_TYPES.exit, publishResultData));
      }
    }

    dispatch(onComposerClosed());
    dispatch(removeEventKeyOverride());
  };
};

var loadBroadcastResources = function loadBroadcastResources(broadcast, index) {
  return function (dispatch, getState) {
    // editing or cloning a broadcast
    var pagePreviews = getPagePreviews(getState());
    var previewLink = extractPreviewLinkFromBroadcast(broadcast);

    if (broadcast.content.get('quotedStatusUrl')) {
      var statusUrlParts = broadcast.content.get('quotedStatusUrl').split('/');
      dispatch(fetchTwitterStatus(broadcast.channelKey, statusUrlParts[statusUrlParts.length - 1], index));
    } else if (Boolean(previewLink) && !pagePreviews.get(previewLink)) {
      // - important not to pass {updateBroadcast: true} here since it would overwrite any customizations made to title/description/imageUrl
      dispatch(fetchPagePreview(previewLink, {
        index: index
      })).then(function (page) {
        var imageIndex = page.images.keySeq().indexOf();

        if (imageIndex >= 0) {
          dispatch(updateMessageInGroup({
            imageIndex: imageIndex
          }, index));
        }
      });
    }

    if (broadcast.content.get('fileId') && broadcast.content.get('fileId') !== FILE_FROM_URL_ID) {
      dispatch(fetchFileManagerFile(broadcast.content.get('fileId'))).then(function (file) {
        if (file) {
          var network = broadcast.getNetwork();
          dispatch(attachMedia(file, index, {
            addToMultiImage: MULTI_IMAGE_ACCOUNT_TYPES.includes(network),
            // Setting convertToMediaPost will determine what alterations in broadcast.content we do in BroadcastGroupMessage.updateWithFile()
            convertToMediaPost: Boolean(broadcast.content.get('photoUrl'))
          }));
        }
      }).catch(function (err) {
        logError(err);
      });
    } else if (broadcast.content.get('photoUrl') && broadcast.broadcastMediaType === BROADCAST_MEDIA_TYPE.PHOTO) {
      dispatch(downloadFromUrl(broadcast, index, true));
    }

    if (broadcast.remoteContentId && broadcast.isCosContent()) {
      dispatch(fetchContent(broadcast.remoteContentId, index));
    }
  };
};

var loadMessageResources = function loadMessageResources(message, index) {
  return function (dispatch, getState) {
    // adding a new message to a group
    var pagePreviews = getPagePreviews(getState());

    if (message.broadcast.content.get('fileId') && !message.file) {
      dispatch(fetchFileManagerFile(message.broadcast.content.get('fileId'))).then(function (file) {
        if (file) {
          dispatch(updateMessageInGroup({
            file: file
          }, index));
        }
      });
    }

    if (message.broadcast.isCosContent() && message.broadcast.remoteContentId && !message.content) {
      dispatch(fetchContent(message.broadcast.remoteContentId, index));
    } // could happen if a message that doesn't support link previews is copied onto one that does


    var previewLink = extractPreviewLinkFromBroadcast(message.broadcast);

    if (Boolean(previewLink) && !pagePreviews.get(previewLink)) {
      dispatch(fetchPagePreview(previewLink, {
        index: index,
        updateBroadcast: true
      }));
    }
  };
};

export var addBroadcastToGroup = function addBroadcastToGroup(network) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, getState) {
    var _opts$loadResources = opts.loadResources,
        loadResources = _opts$loadResources === void 0 ? true : _opts$loadResources;
    var state = getState();
    var broadcastGroup = state.broadcastGroup;
    var pagePreviews = state.pagePreviews,
        hubSettings = state.hubSettings;
    var channels = getChannelsForComposerPicker(getState());

    if (channels.isEmpty()) {
      return;
    }

    var channelsToAdd = channels.filter(function (c) {
      return c.accountSlug === network;
    }).slice(0, 1);
    var getFavoriteChannelsForComposer = makeGetFavoriteChannelsForComposer(getState());
    var defaultPublishNow = getDefaultPublishNow(getState());
    channelsToAdd = getFavoriteChannelsForComposer(network, channels);

    if (network === ACCOUNT_TYPES.twitter && channelsToAdd.size > 1) {
      channelsToAdd = channelsToAdd.take(1);
    }

    var publishType = defaultPublishNow ? BROADCAST_PUBLISH_TYPE.now : undefined;

    if (broadcastGroup.messages.size && broadcastGroup.messages.last().network === network && !broadcastGroup.messages.last().channelKeys.isEmpty()) {
      var channelKeys = broadcastGroup.messages.last().channelKeys;
      channelsToAdd = channels.filter(function (c) {
        return channelKeys.has(c.channelKey);
      });
    }

    var lastMessagePage = broadcastGroup.messages.size && pagePreviews.get(broadcastGroup.messages.last().broadcast.content.get('originalLink'));
    broadcastGroup = broadcastGroup.addMessageForChannels(channelsToAdd, publishType, lastMessagePage, hubSettings);
    dispatch(replaceBroadcastGroup(broadcastGroup));

    if (loadResources) {
      dispatch(loadMessageResources(broadcastGroup.messages.last(), broadcastGroup.messages.size - 1, true));
    }
  };
};

var showPostSaveNotification = function showPostSaveNotification() {
  return function (dispatch, getState) {
    var _getState = getState(),
        broadcastGroup = _getState.broadcastGroup;

    if (broadcastGroup) {
      var props = {
        broadcastGroup: broadcastGroup
      };
      var notification = {
        id: actionTypes.SHOW_NOTIFICATION,
        timeout: 6000,
        type: 'success',
        titleText: I18n.text("sui.composer.success.header." + broadcastGroup.getPublishType()),
        message: /*#__PURE__*/_jsx(SuccessNotification, Object.assign({}, props))
      };
      dispatch(showNotification(notification));
    }

    dispatch(updateUi({
      composerOpen: false
    }));
  };
};

var afterSave = function afterSave(resp) {
  return function (dispatch, getState) {
    dispatch(removeEventKeyOverride());
    dispatch(updateUi({
      composerHasSaved: true
    }));
    dispatch(onComposerClosed());

    if (isComposerEmbed(getState())) {
      dispatch(updateUi({
        composerSuccessOpen: true
      }));
    } else {
      setTimeout(function () {
        dispatch(showPostSaveNotification());
      }, 500);
      dispatch(fetchBroadcasts());
      dispatch(fetchStatusCounts());
    }

    return resp;
  };
};

var ensureSelectedChannelsAreStillVisible = function ensureSelectedChannelsAreStillVisible() {
  return function (dispatch, getState) {
    var state = getState(); // after refreshing channels, filter down the BGM's channelKeys to ones that are still visible/publishable

    var channels = getChannelsForComposerPicker(state);
    var broadcastGroup = state.broadcastGroup;
    broadcastGroup.messages.forEach(function (m, index) {
      var selectedChannelKeysStillVisible = m.channelKeys.filter(function (c) {
        return channels.get(c);
      });

      if (selectedChannelKeysStillVisible.size < m.channelKeys) {
        logDebug("updating channelKeys of message: " + m.uid + " due to changed visible keys: " + selectedChannelKeysStillVisible);
        dispatch(updateMessageInGroup({
          channelKeys: selectedChannelKeysStillVisible
        }, index));
      }
    });
  };
};

var handleBroadcastGroupCreateFailure = function handleBroadcastGroupCreateFailure(dispatch, err, broadcastGroup) {
  // todo: is it weird that we have a floating error, but only 1 broadcast of the group may be problematic?
  err.messageContext = {
    count: broadcastGroup.messages.size
  };

  if (err.responseJSON && err.responseJSON.validationErrors) {
    if (err.responseJSON.validationErrors.some(function (e) {
      return e.includes(API_ERROR_MAP.MISSING_CHANNEL);
    })) {
      err.messageCode = 'broadcast_group_create.missing_channel'; // channels have changed such that a selected one is no longer visible, reload to guard against stale data

      dispatch(fetchAccountsAndChannels()).then(dispatch(ensureSelectedChannelsAreStillVisible()));
    }
  }

  throw err;
};

var handleBroadcastGroupSaveFailures = function handleBroadcastGroupSaveFailures(dispatch, errorByGuid) {
  var anyHaveMissingChannel = errorByGuid.some(function (e) {
    return e.has(API_ERROR_MAP.MISSING_CHANNEL);
  });

  if (anyHaveMissingChannel) {
    // channels have changed such that a selected one is no longer visible, reload to guard against stale data
    dispatch(fetchAccountsAndChannels()).then(dispatch(ensureSelectedChannelsAreStillVisible()));
  }
};

var createSocialItemAction = function createSocialItemAction() {
  return function (dispatch, getState) {
    var _getState2 = getState(),
        logicalChannels = _getState2.logicalChannels,
        broadcastGroup = _getState2.broadcastGroup;

    if (broadcastGroup.streamItem && broadcastGroup.messages.first().twitterStatus) {
      var firstMessage = broadcastGroup.messages.first();
      var channel = logicalChannels.get(firstMessage.channelKeys.first());
      dispatch(createQuoteTweet(channel, broadcastGroup.streamItem, firstMessage.twitterStatus.userId, firstMessage.broadcastGuids.first(), firstMessage.broadcast.content.get('body'), firstMessage.broadcast.triggerAt));
    }
  };
};

export var createBroadcastGroup = function createBroadcastGroup() {
  return function (dispatch, getState) {
    var state = getState();
    var logicalChannels = state.logicalChannels,
        broadcastGroup = state.broadcastGroup;
    return dispatch({
      type: actionTypes.BROADCAST_GROUP_CREATE,
      apiRequest: function apiRequest() {
        return downloadPhotos(dispatch, broadcastGroup).then(function () {
          var newGroup = broadcastGroup.set('messages', removeCloneFailedProperty(broadcastGroup.get('messages')));
          var bgData = newGroup.serialize(logicalChannels);
          return broadcastManager.createBroadcastGroup(bgData, getParamsForBroadcastTarget(getState())).then(function (resp) {
            newGroup = getState().broadcastGroup;
            dispatch(trackBroadcastGroupCreate(newGroup));
            return resp;
          }).catch(function (err) {
            newGroup = getState().broadcastGroup;
            handleBroadcastGroupCreateFailure(dispatch, err, newGroup);
          });
        });
      }
    }).then(function (resp) {
      dispatch(createSocialItemAction());
      dispatch(afterSave(resp));
      return resp;
    });
  };
};
export var createBroadcastGroupSimple = function createBroadcastGroupSimple(broadcastGroup) {
  return function (dispatch, getState) {
    var bgData = broadcastGroup.serialize(getState().logicalChannels);
    return dispatch({
      type: actionTypes.BROADCAST_GROUP_CREATE_SIMPLE,
      apiRequest: function apiRequest() {
        return broadcastManager.createBroadcastGroup(bgData).then(function (resp) {
          var broadcast = Broadcast.createFrom(resp.scheduled[0]);
          dispatch(trackBroadcastGroupCreate(broadcastGroup));
          return broadcast;
        }).catch(function (err) {
          handleBroadcastGroupCreateFailure(dispatch, err);
        });
      }
    });
  };
};
export var saveBroadcastGroupBulk = function saveBroadcastGroupBulk() {
  return function (dispatch, getState) {
    var _getState3 = getState(),
        broadcastGroup = _getState3.broadcastGroup,
        logicalChannels = _getState3.logicalChannels;

    var channels = logicalChannels.filter(function (c) {
      return c.settings.get('autoPublish');
    });
    var broadcastData = broadcastGroup.serialize(channels);
    return dispatch({
      type: actionTypes.BROADCAST_GROUP_BULK_SAVE,
      apiRequest: function apiRequest() {
        return allSettled(broadcastData.map(function (bd) {
          return broadcastManager.update(bd.broadcastGuid, bd, getParamsForBroadcastTarget(getState()));
        })).then(function (resps) {
          resps.forEach(function (r, i) {
            r.broadcastGuid = broadcastData[i].broadcastGuid;
          });
          var errorsByGuid = OrderedMap(resps.filter(function (r) {
            return r.status === 'rejected';
          }).map(function (r) {
            return [r.broadcastGuid, r];
          }));
          errorsByGuid = errorsByGuid.map(function (r) {
            var err = r.reason;

            if (err.responseJSON && err.responseJSON.errors && err.responseJSON.errors.length > 0) {
              return ImmutableSet(err.responseJSON.errors);
            }

            return ImmutableSet.of(API_ERROR_MAP.UNKNOWN_API_ERROR);
          });
          var successfulByGuid = OrderedMap(resps.filter(function (r) {
            return r.status === 'fulfilled';
          }).map(function (r) {
            return [r.broadcastGuid, fromJS(r)];
          }));

          if (errorsByGuid.isEmpty()) {
            dispatch(afterSave());
            return {
              successfulByGuid: successfulByGuid
            };
          } else {
            // todo, remove successfully updated ones from group, so only invalid ones remain
            handleBroadcastGroupSaveFailures(dispatch, errorsByGuid, successfulByGuid);
          }

          return null;
        });
      }
    });
  };
};
export var saveBroadcastGroup = function saveBroadcastGroup() {
  return function (dispatch, getState) {
    // can only edit a single broadcast from a group 1 at a time
    var _getState4 = getState(),
        broadcastGroup = _getState4.broadcastGroup,
        logicalChannels = _getState4.logicalChannels;

    var broadcastData = broadcastGroup.serialize(logicalChannels)[0];
    return dispatch({
      type: actionTypes.BROADCAST_GROUP_SAVE,
      apiRequest: function apiRequest() {
        return broadcastManager.update(broadcastData.broadcastGuid, broadcastData, getParamsForBroadcastTarget(getState())).then(function (resp) {
          dispatch(trackBroadcastGroupUpdate(broadcastGroup, getUserRoleName(getState())));
          return resp;
        }).catch(function (err) {
          if (err.status === 400 && err.responseJSON && err.responseJSON.errors) {
            var errorCode = err.responseJSON.errors[0];

            if (BROADCAST_UPDATE_ERROR_KEYS.contains(errorCode)) {
              err.messageCode = "broadcast_group_save." + errorCode.toLowerCase();
            }
          }

          throw err;
        });
      }
    }).then(function (resp) {
      return dispatch(afterSave(resp));
    });
  };
};

var setBroadcastChannel = function setBroadcastChannel(data, channels, dispatch) {
  var channel = channels.get(data.channelKey);

  if (channel) {
    if (channel.accountExpired) {
      // unset channelKey if we find its visible but expired, forcing user to pick a new one before publish
      logBreadcrumb("Found expired channel: " + data.channelKey + " when editing broadcast: " + data.broadcastGuid);
      dispatch(trackInteraction('unset expired channel'));
      return BROADCAST_GROUP_OPTIONS_KEYS.accountExpired;
    } else {
      data.channel = channel;
    }
  } else {
    logError("Could not find channelKey " + data.channelKey + " when editing broadcast: " + data.broadcastGuid);
    dispatch(trackInteraction('unset missing channel'));
    return BROADCAST_GROUP_OPTIONS_KEYS.missingChannel;
  }

  return null;
};

export var openBroadcast = function openBroadcast(broadcastGuid) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BROADCAST_EDIT,
      apiRequest: function apiRequest() {
        return broadcastManager.fetchBroadcast(broadcastGuid).then(function (data) {
          var network = getNetworkFromChannelKey(data.channelKey);
          var options = ImmutableMap();
          var broadcast = Broadcast.createFrom(data);

          if (broadcast.isEndState()) {
            dispatch(goToManageUrl(broadcast.getStatusType(), broadcast.broadcastGuid));
            return null;
          } else if (!broadcast.canBeEdited()) {
            dispatch(goToManageUrl(null, broadcast.broadcastGuid));
            return null;
          } else {
            dispatch(loadBroadcastResources(broadcast, 0));
            dispatch(onComposerOpened(COMPOSER_MODES.edit, List.of(broadcastGuid)));
            return {
              broadcast: broadcast,
              network: network,
              options: options
            };
          }
        });
      }
    });
  };
};
export var cloneBroadcasts = function cloneBroadcasts(broadcasts, network) {
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch, getState) {
    var channels = getChannelsForComposerPicker(getState());
    broadcasts = broadcasts.map(function (b) {
      if (b.getNetwork() === ACCOUNT_TYPES.instagram) {
        b = b.deleteIn(['content', 'notifyUserId']);
      }

      if (!channels.get(b.channelKey)) {
        var channelsFromNetwork = channels.filter(function (c) {
          return c.accountSlug === b.getNetwork();
        });

        if (!channelsFromNetwork.isEmpty()) {
          // if the channel was deleted or deactivated, try to find a new one so stale key attached to the clone
          b = b.set('channelKey', channelsFromNetwork.first().channelKey);
        } else {
          return null;
        }
      }

      return b;
    }).filter(identity);

    if (broadcasts.isEmpty()) {
      return;
    }

    broadcasts.forEach(function (broadcast, index) {
      dispatch(cloneBroadcastGroupAction(broadcasts, Object.assign({
        createdBy: getUserId(getState()),
        options: ImmutableMap()
      }, attrs)));
      dispatch(loadBroadcastResources(broadcast, index));
    });
    dispatch(updateUi({
      composerOpen: true
    }));
  };
};
export var cloneBroadcast = function cloneBroadcast(broadcast, network, attrs) {
  return function (dispatch) {
    return dispatch(cloneBroadcasts(List.of(broadcast), network, attrs));
  };
};
export var initApproveBroadcasts = function initApproveBroadcasts(guids) {
  return function (dispatch, getState) {
    var channels = getPublishableChannels(getState());
    dispatch(onComposerOpened(COMPOSER_MODES.approve, guids));
    broadcastManager.fetchList(guids.toArray()).then(function (fetchedBroadcastData) {
      return List(fetchedBroadcastData).map(function (data) {
        var network = getNetworkFromChannelKey(data.channelKey);
        var errorCode = setBroadcastChannel(data, channels, dispatch);

        if ([BROADCAST_GROUP_OPTIONS_KEYS.accountExpired, BROADCAST_GROUP_OPTIONS_KEYS.missingChannel].includes(errorCode)) {
          return null;
        }

        var broadcast = Broadcast.createFrom(data);

        if (!broadcast.canBeEdited()) {
          return null;
        }

        return {
          broadcast: broadcast,
          network: network
        };
      }).filter(function (data) {
        return data;
      }).sortBy(function (data) {
        return guids.indexOf(data.broadcast.broadcastGuid);
      }).map(function (data, index) {
        dispatch(loadBroadcastResources(data.broadcast, index));
        return data;
      });
    }).then(function (data) {
      data.broadcastGroupOptions = ImmutableMap();
      dispatch(initBroadcastGroupApproval(data));
    });
  };
};
export var updateMessageBody = function updateMessageBody(textValue) {
  var contentAttrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var index = arguments.length > 2 ? arguments[2] : undefined;
  return function (dispatch, getState) {
    var urls = getValidUrlsInText(textValue);
    var state = getState();
    var broadcastGroup = state.broadcastGroup;
    var pagePreviews = state.pagePreviews;

    if (!broadcastGroup) {
      // must have closed the panel since the async action leading up to this was fired
      return;
    }

    var message = broadcastGroup.messages.get(index);
    var isBapCustomizationMode = message.isBlogPostAutoPublish;
    var attrs = {};
    contentAttrs.body = textValue;
    var extraDataAttrs = {
      body: textValue
    };

    if (urls.length) {
      // if links in the post body have changed, fetch a page preview and attach as a primary link, potentially associate metadata campaignGuid/remoteContentId/remoteContentType
      // do not associate urls as primary links or fetch page preview/COS content if in BAP mode, see https://issues.hubspotcentral.com/browse/CG-13656?focusedCommentId=1079882&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-1079882
      if (!ImmutableSet(urls).equals(ImmutableSet(message.broadcast.content.get('uncompressedLinks'))) && !isBapCustomizationMode) {
        contentAttrs.originalLink = urls[0];
        contentAttrs.uncompressedLinks = urls; // if primary link has changed

        if (message.broadcast.content.get('originalLink') !== urls[0] && !message.isVideo()) {
          logBreadcrumb("primary url change - " + urls[0]);
          contentAttrs.linkPreviewSuppressed = false;

          if (message.network === ACCOUNT_TYPES.twitter) {
            // make this field the first twitter status url of all the urls, or unset if not found
            contentAttrs.quotedStatusUrl = urls.find(function (url) {
              return TWITTER_STATUS_PATTERN.test(url);
            });

            if (contentAttrs.quotedStatusUrl) {
              var statusUrlParts = contentAttrs.quotedStatusUrl.split('/');
              var quotedStatusId = statusUrlParts[statusUrlParts.length - 1];
              contentAttrs.quotedStatusId = quotedStatusId;
              dispatch(fetchTwitterStatus(message.channelKeys.first(), quotedStatusId, index));
            } else {
              dispatch(updateMessageInGroup({
                twitterStatus: null
              }, index));
            }
          }

          if (!message.broadcast.isPhoto()) {
            extraDataAttrs.files = new OrderedMap();
          }

          message = message.mergeBroadcastUpdate(Object.assign({}, attrs, {
            content: contentAttrs,
            extraData: extraDataAttrs
          }));
          broadcastGroup = broadcastGroup.setIn(['messages', index], message);
          dispatch(updateBroadcastInGroup(Object.assign({}, attrs, {
            content: contentAttrs,
            extraData: extraDataAttrs
          }), index));

          if (contentAttrs.quotedStatusUrl) {
            return;
          }

          var pagePreview = pagePreviews.get(urls[0]); // get the twitter accounts to pass them to BroadcastGroupMessage so it can handle showing or not 'by @username'

          var twitterChannels = getTwitterChannels(getState());

          if (!pagePreview) {
            dispatch(fetchPagePreview(urls[0], {
              index: index,
              updateBroadcast: true,
              twitterChannels: twitterChannels,
              fetchContent: true
            }));
          } else if (pagePreview.success) {
            dispatch(replaceBroadcastGroup(broadcastGroup.updateWithPagePreview(pagePreview, index, twitterChannels), index));
          }

          return;
        }
      }
    } else if (!isBapCustomizationMode) {
      // there are no URLs in the body, so clean up fields related to url and link preview
      // take care not to discard the existing originalLink, so we can keep the link preview after removing the url from the body
      if (!message.supportsLinkPreviewWithoutUrlInBody() || message.broadcast.broadcastMediaType !== BROADCAST_MEDIA_TYPE.NONE || message.broadcast.content.get('linkPreviewSuppressed') === true) {
        contentAttrs.originalLink = null;
        contentAttrs.uncompressedLinks = List();
      }

      if (message.broadcast.content.get('quotedStatusUrl')) {
        contentAttrs.quotedStatusUrl = null;
      }

      attrs.remoteContentId = null;
      attrs.remoteContentType = null;

      if (message.content || message.twitterStatus) {
        dispatch(updateMessageInGroup({
          cosContent: null,
          twitterStatus: null
        }, index));
      }
    }

    dispatch(updateBroadcastInGroup(Object.assign({}, attrs, {
      content: contentAttrs,
      extraData: extraDataAttrs
    }), index));
  };
};