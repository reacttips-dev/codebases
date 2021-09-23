'use es6';

import env from 'enviro';
import PortalStorage from './storage';
import PortalIdParser from 'PortalIdParser';
import http from 'hub-http/clients/apiClient';
import { updateHubSetting as _updateHubSetting } from '../redux/actions/users';
import { USER_ATTR_FAVORITE_CHANNEL_KEYS, USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN, USER_ATTR_DEFAULT_PUBLISH_NOW, USER_ATTR_MANAGE_COLUMNS, USER_ATTR_FAILED_POST_BANNER_DISMISSAL_TIME, SHEPHERD_TOURS_USER_ATTRIBUTES, SHEPHERD_TOURS } from './constants';
var storage = PortalStorage.getInstance();
window._sui = {
  setStorage: function setStorage(attrs) {
    storage.set(attrs);
  },
  local: function local() {
    if (env.isProd()) {
      localStorage.URL_REWRITE = JSON.stringify([['api.hubspot.com/broadcast', 'local.hubspot.com/broadcast']]);
    } else {
      localStorage.URL_REWRITE = JSON.stringify([['api.hubspotqa.com/broadcast', 'local.hubspotqa.com/broadcast']]);
    }
  },
  setMonitoringLocal: function setMonitoringLocal() {
    if (env.isProd()) {
      localStorage.URL_REWRITE = JSON.stringify([['api.hubspot.com/socialmonitoring', 'local.hubspot.com/socialmonitoring']]);
    } else {
      localStorage.URL_REWRITE = JSON.stringify([['api.hubspotqa.com/socialmonitoring', 'local.hubspotqa.com/socialmonitoring']]);
    }
  },
  setReportingLocal: function setReportingLocal() {
    if (env.isProd()) {
      localStorage.URL_REWRITE = JSON.stringify([['api.hubspot.com/social-reporting', 'local.hubspot.com/social-reporting']]);
    } else {
      localStorage.URL_REWRITE = JSON.stringify([['api.hubspotqa.com/social-reporting', 'local.hubspotqa.com/social-reporting']]);
    }
  },
  setRivalIQLocal: function setRivalIQLocal() {
    if (env.isProd()) {
      localStorage.URL_REWRITE = JSON.stringify([['api.hubspot.com/rivaliq', 'local.hubspot.com/rivaliq']]);
    } else {
      localStorage.URL_REWRITE = JSON.stringify([['api.hubspotqa.com/rivaliq', 'local.hubspotqa.com/rivaliq']]);
    }
  },
  breakMentionsSearch: function breakMentionsSearch() {
    localStorage.URL_REWRITE = JSON.stringify([['broadcast/v2/facebook', 'broadcast/v2/facebook-broken'], ['broadcast/v2/linkedin', 'broadcast/v2/linkedin-broken']]);
  },
  getStorage: function getStorage() {
    return storage;
  },
  clear: function clear() {
    storage.clear();
  },
  updateHubSetting: function updateHubSetting(key, value) {
    window.app.store.dispatch(_updateHubSetting(key, value));
  },
  resetGettingStarted: function resetGettingStarted() {
    return http.delete('broadcast/v1/unboxsettings/resetTestPortal');
  },
  resetReportsNextShepherdTour: function resetReportsNextShepherdTour() {
    var portalId = PortalIdParser.get();
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/social:reportsNextOverviewShepherdStepsSeenAt?portalId=" + portalId);
  },
  resetPublishingShepherdTour: function resetPublishingShepherdTour() {
    var portalId = PortalIdParser.get();
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/social:publishingTableStepsSeenAt?portalId=" + portalId);
  },
  resetDetailsPanelShepherdTour: function resetDetailsPanelShepherdTour() {
    var portalId = PortalIdParser.get();
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/social:detailsPanelTourStepsSeenAt?portalId=" + portalId);
  },
  resetDefaultChannelsShepherdTour: function resetDefaultChannelsShepherdTour() {
    var portalId = PortalIdParser.get();
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/" + USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN + "?portalId=" + portalId);
  },
  resetManageDashboardTour: function resetManageDashboardTour() {
    var portalId = PortalIdParser.get();
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/" + SHEPHERD_TOURS_USER_ATTRIBUTES[SHEPHERD_TOURS.manageDashboard] + "?portalId=" + portalId);
  },
  resetManageDashboardStartTourModal: function resetManageDashboardStartTourModal() {
    var portalId = PortalIdParser.get();
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/" + SHEPHERD_TOURS_USER_ATTRIBUTES[SHEPHERD_TOURS.manageDashboardStartTourModal] + "?portalId=" + portalId);
  },
  resetSavedColumns: function resetSavedColumns() {
    var portalId = PortalIdParser.get();
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/" + USER_ATTR_MANAGE_COLUMNS + "?portalId=" + portalId);
  },
  resetFavoriteChannels: function resetFavoriteChannels() {
    var portalId = PortalIdParser.get();
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/" + USER_ATTR_FAVORITE_CHANNEL_KEYS + "?portalId=" + portalId);
  },
  resetComposerShepherdTour: function resetComposerShepherdTour() {
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/social:composerShepherdSeen");
  },
  resetDefaultPublishNow: function resetDefaultPublishNow() {
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/" + USER_ATTR_DEFAULT_PUBLISH_NOW);
  },
  resetFailedPostBannerDismissalTime: function resetFailedPostBannerDismissalTime() {
    var userId = window.app.store.getState().user.user_id;
    return http.delete("users/v1/app/attributes/" + userId + "/" + USER_ATTR_FAILED_POST_BANNER_DISMISSAL_TIME);
  },
  clearUserAttributes: function clearUserAttributes() {
    this.resetReportsNextShepherdTour();
    this.resetPublishingShepherdTour();
    this.resetDetailsPanelShepherdTour();
    this.resetFavoriteChannels();
    this.resetComposerShepherdTour();
    this.resetDefaultPublishNow();
    this.resetDefaultChannelsShepherdTour();
    this.resetSavedColumns();
    this.resetManageDashboardTour();
    this.resetManageDashboardStartTourModal();
    this.resetFailedPostBannerDismissalTime();
  },
  getBroadcast: function getBroadcast() {
    return window.app.store.getState().broadcast.serialize();
  },
  getBroadcastGroup: function getBroadcastGroup() {
    return window.app.store.getState().broadcastGroup.serialize();
  },
  getBroadcastGroupObject: function getBroadcastGroupObject() {
    return window.app.store.getState().broadcastGroup.toJS();
  }
};