'use es6';

import { createTruthySelector } from 'truthy-selector';
import { Map as ImmutableMap } from 'immutable';
import { getCampaigns } from './campaigns';
import { getUsers } from './users';

var getGuid = function getGuid(state, _ref) {
  var broadcastGuid = _ref.broadcastGuid;
  return broadcastGuid;
};

export var getBroadcastCores = function getBroadcastCores(state) {
  return state.broadcastCores;
};
export var getBroadcastExtras = function getBroadcastExtras(state) {
  return state.broadcast;
};
export var getBroadcastExport = function getBroadcastExport(state) {
  return state.export;
};
export var getBroadcastCore = createTruthySelector([getBroadcastCores, getGuid], function (broadcastCores, broadcastGuid) {
  return broadcastCores.get(broadcastGuid);
});
export var getBroadcastExtra = createTruthySelector([getBroadcastExtras, getGuid], function (broadcastExtra, broadcastGuid) {
  return broadcastExtra.get(broadcastGuid) || ImmutableMap();
});
export var getBroadcastCoreCreatedByUser = createTruthySelector([getBroadcastCore, getUsers], function (broadcastCore, users) {
  return users.get(broadcastCore.createdBy);
});
export var getBroadcastCoreCampaignName = createTruthySelector([getBroadcastCore, getCampaigns], function (broadcastCore, campaigns) {
  if (!broadcastCore.campaignGuid) {
    return null;
  }

  var campaign = campaigns.get(broadcastCore.campaignGuid);
  return campaign && campaign.display_name;
});
export var getBroadcastCoreAssists = createTruthySelector([getBroadcastExtra], function (extra) {
  return extra.get('assists');
});
export var getBroadcastCoreInteractions = createTruthySelector([getBroadcastExtra], function (extra) {
  return extra.get('interactions');
});
export var getBroadcastCoreInteractionTotals = createTruthySelector([getBroadcastExtra], function (extra) {
  return extra.get('interactionTotals');
});
export var getBroadcastCoreFile = createTruthySelector([getBroadcastExtra], function (extra) {
  return extra.get('file');
});
export var getBroadcastCoreVideoInsights = createTruthySelector([getBroadcastExtra], function (extra) {
  return extra.get('videoInsights');
});
export var getBroadcastCoreReports = createTruthySelector([getBroadcastExtra], function (extra) {
  return extra.get('reports');
});
export var getBroadcastCoreReportingPost = createTruthySelector([getBroadcastExtra], function (extra) {
  return extra.get('reportingPost');
});
export var getBroadcastCoreAdCreated = createTruthySelector([getBroadcastExtra], function (extra) {
  var boostedPosts = extra.get('boostedPosts');
  return boostedPosts && !boostedPosts.isEmpty();
});
export var getBroadcastAdCampaigns = createTruthySelector([getBroadcastExtra], function (extra) {
  return extra.get('adCampaigns');
});