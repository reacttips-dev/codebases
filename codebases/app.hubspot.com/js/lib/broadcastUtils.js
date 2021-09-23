'use es6';

import { clone } from 'underscore';
import { Map as ImmutableMap, Set as ImmutableSet, List, Record } from 'immutable';
import BroadcastData from '../data/model/BroadcastData';
import { logError, parseBoolean, parseInteger } from './utils';
import { BROADCAST_MEDIA_TYPE } from './constants';
var BROADCAST_DEFAULTS = {
  broadcastGuid: null,
  groupGuid: null,
  portalId: null,
  campaignGuid: null,
  campaignName: null,
  channelKey: null,
  channelGuid: null,
  message: null,
  content: ImmutableMap(),
  channel: null,
  user: null,
  // primarily so that we can assemble a broadcast before we get its details response without components erroring out asking for this
  status: 'UNKNOWN',
  clientTag: null,
  foreignId: null,
  foreignIdForBoost: null,
  remoteContentType: null,
  remoteContentId: null,
  messageUrl: null,
  messageText: null,
  broadcastMediaType: BROADCAST_MEDIA_TYPE.NONE,
  createdAt: null,
  userUpdatedAt: null,
  createdBy: null,
  updatedBy: null,
  triggerAt: null,
  finishedAt: null,
  clicks: null,
  interactionsCount: null,
  likes: null,
  replies: null,
  extraData: new BroadcastData(),
  // attached from extra calls
  serviceId: null,
  interactions: null,
  interactionTotals: null,
  feed: null,
  feedHasLoaded: null,
  isSaving: null,
  assists: null,
  errors: ImmutableSet(),
  // BROADCAST_TABLE_ERRORS, generally for display on list/detail view not composer, which is based on validate()
  file: null,
  videoInsights: null,
  userCanModify: null,
  actions: ImmutableSet(),
  targetLocations: List(),
  targetLanguages: List(),
  targetLocationLabels: List(),
  targetLanguageLabels: List(),
  campaignHexColor: null
};
export var getBroadcastRecord = function getBroadcastRecord() {
  return new Record(BROADCAST_DEFAULTS);
};
export var copyBroadcastAttributes = function copyBroadcastAttributes(attrs) {
  attrs = clone(attrs);
  attrs.content = clone(attrs.content || {
    body: ''
  });

  if (typeof attrs.content.uncompressedLinks === 'string') {
    try {
      attrs.content.uncompressedLinks = JSON.parse(attrs.content.uncompressedLinks);
    } catch (e) {
      logError(e);
    }
  }

  attrs.content.linkPreviewSuppressed = parseBoolean(attrs.content.linkPreviewSuppressed);
  attrs.content.fileId = parseInteger(attrs.content.fileId);

  if (attrs.content.notifyUserId) {
    attrs.content.notifyUserId = parseInteger(attrs.content.notifyUserId);
  }

  if (attrs.content.charCount) {
    attrs.content.charCount = parseInteger(attrs.content.charCount);
  }

  if (attrs.content.hashtagCount) {
    attrs.content.hashtagCount = parseInteger(attrs.content.hashtagCount);
  }

  var extraData;

  if (attrs.extraData) {
    extraData = BroadcastData.createFrom(attrs.extraData);
  } else {
    extraData = new BroadcastData();
  }

  attrs.extraData = extraData;
  return attrs;
};