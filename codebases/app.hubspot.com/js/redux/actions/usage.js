'use es6';

import I18n from 'I18n';
import Raven from 'Raven';
import startCase from 'hs-lodash/startCase';
import { usageTrackerActions } from 'usage-tracker-redux';
import { getInitialQuery } from '../selectors/initialQuery';
import { AMPLITUDE_EVENTS, PUBLIC_USAGE_EVENTS } from '../../lib/usageEvents';
import { logDebug } from '../../lib/utils';
import { getUserRoleName } from '../selectors/user'; // todo - work to replace module state with redux state, or see if tracker can remember these

var currentScreen;
var screenKeyOverride;
var currentNetwork; // certain key actions are defined as "public usage" which upgrades them to class "usage" sometimes used to discern meaningful usage of a section vs any event
// IMPORTANT: any eventKey that defines actions like this needs a variant of itself defined with "Usage" suffix, can no longer verify this without access to tracker instance

var isUsageEvent = function isUsageEvent(action) {
  var screenKey = screenKeyOverride || currentScreen;
  return PUBLIC_USAGE_EVENTS[screenKey] && PUBLIC_USAGE_EVENTS[screenKey].includes(action);
};

var getCommonData = function getCommonData(state) {
  var data = {};
  var initialQuery = getInitialQuery(state) || {};

  if (initialQuery.source) {
    data.source = initialQuery.source;
  }

  if (currentNetwork) {
    data.network = currentNetwork;
  }

  data.role = getUserRoleName(state);
  return data;
}; // a lite wrapper on track action from usage-tracker-redux


export var track = function track(eventKey) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, getState) {
    // using || undefined ensures against null which won't pass our type: string verification
    data = Object.assign({}, data, {}, getCommonData(getState()));
    Raven.captureBreadcrumb({
      type: 'message',
      message: "[track] " + eventKey + " - " + JSON.stringify(data)
    });
    dispatch(usageTrackerActions.track(eventKey, data));
  };
}; // track a pageView for specific screen and do remember it as an event key.
// generally panels/modals should have their own eventKey but preserve the screen underneath

export var trackScreen = function trackScreen(screenEventKey, subscreen) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch, getState) {
    // since our events.yaml typically translate camelCase event keys to sentence case, do this with sreen to try to match them
    var screen = startCase(screenEventKey);

    if (data.network) {
      currentNetwork = data.network;
    }

    data = Object.assign({}, data, {}, {
      screen: screen,
      subscreen: subscreen
    }, {}, getCommonData(getState()));
    currentScreen = screenEventKey;
    var initialQuery = getInitialQuery(getState());

    if (initialQuery.source) {
      data.source = initialQuery.source;
    }

    Raven.captureBreadcrumb({
      type: 'message',
      message: "[trackScreen] " + screenEventKey + " - " + JSON.stringify(data)
    });
    dispatch(usageTrackerActions.track(AMPLITUDE_EVENTS.pageView, data));
  };
}; // set a network context, call again with null to remove

export var trackNetwork = function trackNetwork(network) {
  return function () {
    currentNetwork = network;
  };
};
export var removeEventKeyOverride = function removeEventKeyOverride() {
  return function () {
    screenKeyOverride = undefined;
  };
};
var trackedActionsByEvent = {};
export var trackInteraction = function trackInteraction(action) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch, getState) {
    if (!currentScreen) {
      // eslint-disable-next-line no-console
      console.warn("Saw trackInteraction action call for " + action + " before screen was set");
      return;
    }

    data = Object.assign({}, data, {}, getCommonData(getState()));
    data.action = action;
    var eventKey = screenKeyOverride || currentScreen;

    if (isUsageEvent(action)) {
      eventKey = eventKey + "Usage";
    }

    if (opts.onlyOnce && trackedActionsByEvent[eventKey]) {
      if (trackedActionsByEvent[eventKey].includes(action)) {
        // eslint-disable-next-line no-console
        logDebug("trackInteraction called with onlyOnce and action " + action + " already logged for eventKey: " + eventKey);
        return;
      }
    }

    dispatch(usageTrackerActions.track(eventKey, data));
    Raven.captureBreadcrumb({
      type: 'message',
      message: "[trackInteraction] " + action + " - " + JSON.stringify(data)
    });

    if (opts.onlyOnce) {
      if (!trackedActionsByEvent[eventKey]) {
        trackedActionsByEvent[eventKey] = [];
      }

      trackedActionsByEvent[eventKey].push(action);
    }
  };
};

var getExtraDataForMessage = function getExtraDataForMessage(message) {
  return {
    network: message.network,
    mediaType: message.broadcast.broadcastMediaType ? message.broadcast.broadcastMediaType.toLowerCase() : 'none',
    remoteContentType: message.broadcast.remoteContentType,
    isMultiPhoto: message.broadcast.isMultiPhoto(),
    clientTag: message.broadcast.clientTag
  };
};

export var trackBroadcastGroupCreate = function trackBroadcastGroupCreate(broadcastGroup) {
  return function (dispatch) {
    dispatch(track(AMPLITUDE_EVENTS.broadcastActivation, Object.assign({}, getExtraDataForMessage(broadcastGroup.messages.get(0)), {
      action: 'create'
    })));
    broadcastGroup.messages.map(function (message) {
      return dispatch(track(AMPLITUDE_EVENTS.broadcast, Object.assign({}, getExtraDataForMessage(message), {
        action: 'create'
      })));
    });
  };
};
export var trackBroadcastGroupUpdate = function trackBroadcastGroupUpdate(broadcastGroup) {
  return function (dispatch) {
    broadcastGroup.messages.map(function (message) {
      return dispatch(track(AMPLITUDE_EVENTS.broadcast, Object.assign({}, getExtraDataForMessage(message), {
        action: 'update'
      })));
    });
  };
};
export var trackFetchChannels = function trackFetchChannels(channelsRep, dataFilter) {
  return function (dispatch) {
    var totalChannels = channelsRep.totalConnectedChannels;
    var unreadableChannels = channelsRep.totalConnectedChannels - channelsRep.readableChannelKeys.size;
    var expiredAccounts = channelsRep.accounts.filter(function (a) {
      return a.expired;
    }).size; // todo- refactor where attachAccountToChannels to allow us to get this tracked
    // const expiredChannels = resp.channels.filter(c => c.accountExpired).size;
    // const longExpiredChannels = resp.channels.filter(c => c.isLongExpired()).size;

    var unsharedChannels = channelsRep.channels.filter(function (c) {
      return !c.shared;
    }).size;
    var bapChannels = channelsRep.channels.filter(function (c) {
      return !c.shared;
    }).size;
    var filteredChannels = !dataFilter.excludedChannelKeys.isEmpty();
    var channelsCachedHoursAgo;

    if (dataFilter.channelsCachedAt) {
      var hoursAgo = I18n.moment().diff(I18n.moment(dataFilter.channelsCachedAt), 'hours'); // we want to record how many hours ago channel data was cached, but constrain to 24 to not create crazy amount of outliers
      // data that old is not

      if (hoursAgo <= 24) {
        channelsCachedHoursAgo = hoursAgo;
      }
    }

    dispatch(track(AMPLITUDE_EVENTS.fetchChannels, {
      totalChannels: totalChannels,
      unreadableChannels: unreadableChannels,
      expiredAccounts: expiredAccounts,
      unsharedChannels: unsharedChannels,
      bapChannels: bapChannels,
      filteredChannels: filteredChannels,
      channelsCachedHoursAgo: channelsCachedHoursAgo,
      publishingQuickFetched: Boolean(window._publishingQuickFetchAttempted)
    }));
  };
};