'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import { clone, sortBy } from 'underscore';
import { List, Set as ImmutableSet } from 'immutable';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import { BROADCAST_PUBLISH_TYPE, BROADCAST_VALIDATION_ERRORS, COMPOSER_MODES } from '../../lib/constants';
import actionTypes from '../actions/actionTypes';
import BroadcastGroup from '../../data/model/BroadcastGroup';
var COPY_TO_BROADCASTS_ATTRS = ['createdBy', 'campaignGuid', 'clientTag'];
var COPY_TO_GROUP_ATTRS = ['campaignGuid'];
var GROUP_CREATE_RESPONSE_CATEGORIES = ['published', 'scheduled', 'drafts', 'enqueued', 'createdBap'];
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_INIT, function (state, action) {
  return BroadcastGroup.createFrom(action.payload);
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_POPULATE, function (state, action) {
  return action.payload;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_CLONE, function (state, action) {
  return BroadcastGroup.cloneFromBroadcasts(action.payload.broadcasts, action.payload.attrs);
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_EDIT), function (state, action) {
  if (action.data) {
    return BroadcastGroup.createFromBroadcast(action.data.broadcast, action.data.network, action.data.options);
  }

  return state;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_APPROVE_INIT, function (state, action) {
  return BroadcastGroup.createFromBroadcasts(action.payload.broadcasts, {
    composerMode: COMPOSER_MODES.approve,
    networks: action.payload.networks,
    broadcastGroupOptions: action.payload.broadcastGroupOptions
  });
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_UPDATE, function (state, action) {
  state = state.merge(action.payload);
  COPY_TO_BROADCASTS_ATTRS.forEach(function (attr) {
    if (Object.keys(action.payload).includes(attr)) {
      state = state.set('messages', state.messages.map(function (m) {
        return m.setIn(['broadcast', attr], action.payload[attr]);
      }));
    }
  });
  return state;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_REPLACE, function (state, action) {
  return action.payload;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_REPLACE_MESSAGE, function (state, action) {
  if (state.messages.get(action.payload.index)) {
    return state.setIn(['messages', action.payload.index], action.payload.message);
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.began(actionTypes.BROADCAST_GROUP_CREATE), function (state) {
  if (!state) {
    return null;
  }

  return state.set('messages', state.getNonEmptyMessages());
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.BROADCAST_GROUP_CREATE), function (state, action) {
  if (!state) {
    return null;
  }

  var data = clone(action.data || {});
  var broadcastData = [];
  GROUP_CREATE_RESPONSE_CATEGORIES.forEach(function (statusType) {
    if (data[statusType]) {
      broadcastData = broadcastData.concat(data[statusType]);
    }
  });
  broadcastData = sortBy(broadcastData, function (b) {
    return b.broadcastGuid;
  });
  return state.set('messages', state.messages.map(function (m) {
    // todo investigate 202 resp here that doesn't give us enough broadcasts back https://sentry.io/hubspot-dev/socialui/issues/212061243/
    var broadcastGuids = [];
    m.channelKeys.forEach(function () {
      var createdBroadcast = broadcastData.shift();

      if (createdBroadcast) {
        broadcastGuids.push(createdBroadcast.broadcastGuid);
      }
    });
    return m.set('broadcastGuids', List(broadcastGuids));
  }));
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.BROADCAST_GROUP_CREATE), function (state, action) {
  var errorData = action.error.responseJSON;

  if (!(errorData && errorData.validationErrors)) {
    return state;
  }

  return state.set('messages', state.messages.map(function (m) {
    var index = state.messages.indexOf(m);
    return m.set('apiErrors', ImmutableSet(errorData.validationErrors[index]));
  }));
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.BROADCAST_GROUP_SAVE), function (state, action) {
  var errorData = action.error.responseJSON;

  if (!(errorData && errorData.errors)) {
    return state;
  }

  return state.setIn(['messages', 0, 'apiErrors'], ImmutableSet(errorData.errors));
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.BROADCAST_GROUP_BULK_SAVE), function (state, action) {
  if (action.error.errorsByGuid) {
    action.error.errorsByGuid.forEach(function (apiErrors, broadcastGuid) {
      var messageIndex = state.messages.findIndex(function (m) {
        return m.broadcast.broadcastGuid === broadcastGuid;
      });

      if (state.messages.get(messageIndex)) {
        state = state.setIn(['messages', messageIndex, 'apiErrors'], apiErrors);
      }
    });
  }

  if (action.error.successfulByGuid) {
    action.error.successfulByGuid.forEach(function (apiErrors, broadcastGuid) {
      var messageIndex = state.messages.findIndex(function (m) {
        return m.broadcast.broadcastGuid === broadcastGuid;
      });

      if (state.messages.get(messageIndex)) {
        state = state.deleteIn(['messages', messageIndex], apiErrors);
      }
    });
  }

  return state;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_UPDATE_BROADCAST, function (state, action) {
  if (!state) {
    return state;
  }

  state = state.mergeBroadcastUpdate(action.payload.attrs, action.payload.index);

  if (action.payload.attrs.content && action.payload.attrs.content.quotedStatusUrl === null) {
    state = state.setIn(['messages', action.payload.index], state.messages.get(action.payload.index).removeQuotedStatus());
  }

  COPY_TO_GROUP_ATTRS.forEach(function (attr) {
    if (Object.keys(action.payload.attrs).includes(attr)) {
      state = state.set(attr, action.payload.attrs[attr]);
    }
  });
  return state;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_UPDATE_MESSAGE, function (state, action) {
  if (!state) {
    return state;
  }

  var index = action.payload.index;

  if (action.payload.uid) {
    index = state.messages.findIndex(function (m) {
      return m.uid === action.payload.uid;
    });
  }

  if (typeof index === 'number' && state.messages.get(index)) {
    return state.mergeIn(['messages', index], action.payload.attrs);
  }

  return state;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_ATTACH_MEDIA, function (state, action) {
  return state.updateMessageWithFile(action.payload.file, action.payload.index, action.payload.opts);
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_MAKE_DRAFT, function (state) {
  if (!state) {
    return state;
  }

  return state.set('messages', state.messages.map(function (m) {
    return m.set('publishType', BROADCAST_PUBLISH_TYPE.draft);
  }));
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.PAGE_PREVIEW_FETCH), function (state, action) {
  if (!state) {
    return state;
  }

  if (action.payload.updateBroadcast && !action.payload.channelType) {
    return state.updateWithPagePreview(action.data, action.payload.index, action.payload.twitterChannels);
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.CONTENT_FETCH), function (state, action) {
  if (typeof action.payload.index === 'number' && state.messages.get(action.payload.index)) {
    return state.setIn(['messages', action.payload.index, 'cosContent'], action.data);
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.CONTENT_FETCH), function (state, action) {
  // should be uncommon after starting to verify hubspotPortalId on PagePreview matches current portal ID before fetching that COS content
  if (action.error.status === 404) {
    return state.set('messages', state.messages.map(function (m) {
      if (m.broadcast.remoteContentId === action.payload.id) {
        return m.clearRemoteContent();
      }

      return m;
    }));
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.TWITTER_STATUS_FETCH), function (state, action) {
  var message = state.messages.get(action.payload.index);

  if (!message) {
    return state;
  }

  return state.setIn(['messages', action.payload.index], message.updateWithQuotedStatus(action.data));
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.FILE_UPLOAD), function (state, action) {
  if (!state || !action.data) {
    return state;
  }

  return state.updateMessageWithFile(action.data, action.payload.index, {
    addToMultiImage: action.payload.addToMultiImage
  });
}), _defineProperty(_handleActions, ActionMapper.success(actionTypes.FILE_MANAGER_DOWNLOAD_FROM_URL), function (state, action) {
  if (!state) {
    return state;
  }

  var index = action.payload.index;

  if (action.payload.uid) {
    index = state.messages.findIndex(function (m) {
      return m.uid === action.payload.uid;
    });
  }

  if (action.payload.replaceWithPhoto) {
    state = state.updateMessageWithFile(action.data, index);
  }

  return state;
}), _defineProperty(_handleActions, ActionMapper.error(actionTypes.FILE_MANAGER_DOWNLOAD_FROM_URL), function (state, action) {
  if (!state) {
    return state;
  }

  var index = action.payload.index;

  if (action.payload.uid) {
    index = state.messages.findIndex(function (m) {
      return m.uid === action.payload.uid;
    });
  }

  var message = state.messages.get(index);

  if (message) {
    state = state.setIn(['messages', index, 'apiErrors'], message.apiErrors.add(BROADCAST_VALIDATION_ERRORS.imageDownloadFailed));
  }

  return state;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_BLUR, function () {
  return undefined;
}), _defineProperty(_handleActions, actionTypes.BROADCAST_GROUP_REMOVE_MESSAGE, function (state, action) {
  var index = action.payload;
  return state.set('messages', state.messages.delete(index));
}), _handleActions));