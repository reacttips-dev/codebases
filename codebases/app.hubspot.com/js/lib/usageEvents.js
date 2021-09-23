'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _PUBLIC_USAGE_EVENTS;

import keyMirror from 'react-utils/keyMirror';
import { APP_SECTIONS } from './constants';
export var AMPLITUDE_EVENTS = keyMirror({
  pageView: null,
  postPanel: null,
  detailsPanel: null,
  reportsNext: null,
  composePost: null,
  // composer
  composerEmbed: null,
  composerExtension: null,
  broadcast: null,
  // message publish/scheduling
  broadcastActivation: null,
  connectAccount: null,
  // oauth connection (which can be launched from many screens)
  connectAccountFailure: null,
  // oauth connection failing
  connectAccountActivation: null,
  editSettings: null,
  // any of the 4 settings sections
  editSettingsUsage: null,
  // any of the 4 settings sections
  profile: null,
  // this should have been inbox
  view: null,
  // special case, we want pageview events across the app to share an event
  // below are new, missing from spec
  publishing: null,
  beta: null,
  // means experiments, opt-in, welcome and onboarding flows
  calendar: null,
  competitors: null,
  followMe: null,
  monitoring: null,
  compare: null,
  inbox: null,
  emailSettings: null,
  schedule: null,
  streamEdit: null,
  reports: null,
  boostPanel: null,
  createAdCampaign: null,
  createAdCampaignSuccess: null,
  adNetworkConnectSuccess: null,
  adNetworkConnectFailure: null,
  adAccountConnectSuccess: null,
  adAccountConnectFailure: null,
  fetchChannels: null
}); // ********** PUBLIC EVENT **********
// Public Events help teams across HubSpot automate work and customize experiences based on user actions.
// Speak with #product-insight and your PM before any shipping any changes to this event incl. event name, properties, values, and when it occurs.
// Read more about Public Events on the wiki: https://wiki.hubspotcentral.net/display/PM/Public+Events+-+Amplitude+events+ready+for+HubSpot+team+use+and+automation

export var COMMON_EVENTS = ['create post', 'campaign filter change', 'channel filter change', 'channel select change', 'change network', 'change page'];
export var COMMON_MONITORING_EVENTS = COMMON_EVENTS.concat(['follow', 'unfollow', 'favorite', 'unfavorite', 'retweet', 'submit reply', 'open profile', 'start monitoring tour', 'start competitors tour', 'start publishing tour', 'start calendar tour', 'view stream', 'submit edit stream', 'submit new stream']);
export var PUBLIC_USAGE_EVENTS = (_PUBLIC_USAGE_EVENTS = {}, _defineProperty(_PUBLIC_USAGE_EVENTS, APP_SECTIONS.inbox, COMMON_MONITORING_EVENTS), _defineProperty(_PUBLIC_USAGE_EVENTS, APP_SECTIONS.monitoring, COMMON_MONITORING_EVENTS), _defineProperty(_PUBLIC_USAGE_EVENTS, APP_SECTIONS.reports, COMMON_EVENTS.concat(['change graph mode', 'date filter change'])), _defineProperty(_PUBLIC_USAGE_EVENTS, APP_SECTIONS.publishing, COMMON_EVENTS.concat(['switch to calendar', 'header tab reports', 'header tab monitoring', 'header tab settings', 'click broadcast', 'open export modal', 'open bulk schedule', 'bulk delete', 'bulk make draft', 'bulk set campaign'])), _defineProperty(_PUBLIC_USAGE_EVENTS, "details", COMMON_EVENTS.concat(['clone broadcast', 'delete broadcast', 'click interaction user', 'click comment user', 'open assist profile', 'view on network'])), _defineProperty(_PUBLIC_USAGE_EVENTS, APP_SECTIONS.settings, COMMON_EVENTS.concat(['connect account', 'favorite channel', 'unfavorite channel', 'share enable', 'share disable', 'bap enable', 'bap disable', 'bap update', 'disconnect account'])), _PUBLIC_USAGE_EVENTS); // ********** END PUBLIC EVENT **********

export default AMPLITUDE_EVENTS;