'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import FMFile from '../../data/model/FMFile';
import { Map as ImmutableMap, Set as ImmutableSet, fromJS } from 'immutable';
import ViewTypes from 'ui-addon-calendars/constants/CalendarViewTypes';
import { getBroadcastExtra, getBroadcasts, getCalendarBroadcasts, getCampaigns, getChannels, getDataFilter, getUploadedErrors, getUsers } from '../selectors';
import { getChannelsForComposerPicker, getChannelsForDisplay, activeChannels } from './channels';
import { ACCOUNT_SUGGESTED_MIN_IMAGE_DIMENSIONS, ACCOUNT_TYPES, BROADCAST_ACTION_TYPES, BROADCAST_MEDIA_TYPE, BROADCAST_STATUS_TYPE, BROADCAST_STATUS_TYPE_TO_DATE_ATTRIBUTE, BROADCAST_STATUS_TYPE_TO_SORT_ORDER, BROADCAST_SUGGESTIONS, BROADCAST_TABLE_ERRORS, CHANNEL_VALIDATION, INSTAGRAM_MIN_SUGGESTED_DIMENSIONS, MEDIA_FILTER_OPTIONS, UPLOADED_BROADCAST_ISSUE_FILTER } from '../../lib/constants';
import { createSelector } from 'reselect';
import { createTruthySelector } from 'truthy-selector';
import { logErrorMessageOnce } from '../../lib/utils';
import { getBroadcastCores } from './broadcastCore';
import { getPagePreviews } from '../selectors/pagePreviews';
import { getLinkShorteningDomains } from './ui';
import Broadcast from '../../data/model/Broadcast';
export var getBroadcastGuid = function getBroadcastGuid(state, broadcastGuid) {
  return broadcastGuid;
};
export var getBroadcastForDetails = createSelector([getBroadcasts, getBroadcastGuid, getBroadcastExtra, getChannels, getCampaigns], function (broadcasts, broadcastGuid, broadcastExtra, channels, campaigns) {
  var broadcast;

  if (broadcasts && broadcasts.get(broadcastGuid)) {
    broadcast = broadcasts.get(broadcastGuid);
  } else if (broadcastExtra.get(broadcastGuid)) {
    broadcast = broadcastExtra.get(broadcastGuid).get('broadcast');
  }

  if (!broadcast) {
    return broadcast;
  }

  var extra = broadcastExtra.get(broadcastGuid) || ImmutableMap();
  var campaign = campaigns && broadcast.campaignGuid && campaigns.get(broadcast.campaignGuid);
  return broadcast.merge({
    file: extra.get('file'),
    videoInsights: extra.get('videoInsights'),
    feed: extra && extra.get('feed') && extra.get('feed').set('interactions', extra.get('interactions')),
    feedHasLoaded: extra.get('feedHasLoaded'),
    interactions: extra.get('interactions'),
    interactionTotals: extra.get('interactionTotals'),
    assists: extra.get('assists'),
    channel: channels.get(broadcast.channelKey),
    campaignName: campaign && campaign.display_name
  });
});
var getFilteredSortedBroadcasts = createSelector([getDataFilter, getBroadcasts, getUploadedErrors], function (dataFilter, broadcasts, uploadedErrors) {
  if (broadcasts && dataFilter.broadcastStatusType === BROADCAST_STATUS_TYPE.uploaded) {
    // uploaded section loads the whole batch at once, manually support channel and campaign filtering
    broadcasts = broadcasts.filter(function (b) {
      return dataFilter.getSelectedChannelKeys().contains(b.channelKey);
    }); // lacks date filter (i.e. startDate and endDate) so they're not included here.

    if (dataFilter.campaignGuid) {
      broadcasts = broadcasts.filter(function (b) {
        return b.campaignGuid === dataFilter.campaignGuid;
      });
    }

    broadcasts = broadcasts.map(function (b) {
      var broadcastErrors = uploadedErrors.get(b.broadcastGuid);

      if (broadcastErrors && !broadcastErrors.isEmpty()) {
        b = b.update('errors', function (errs) {
          return errs.concat(broadcastErrors);
        });
      }

      if (b.hasScraperError()) {
        b = b.update('errors', function (errs) {
          return errs.add(BROADCAST_TABLE_ERRORS.LINK_PREVIEW_ERROR);
        });
      }

      return b;
    });

    if (dataFilter.uploadedIssueFilterState === UPLOADED_BROADCAST_ISSUE_FILTER.ISSUES) {
      broadcasts = broadcasts.filter(function (b) {
        return !b.errors.isEmpty();
      });
    }

    var sortBy = dataFilter.sortBy ? dataFilter.sortBy : BROADCAST_STATUS_TYPE_TO_DATE_ATTRIBUTE[dataFilter.broadcastStatusType];

    if (sortBy === 'uploadedRow') {
      broadcasts = broadcasts.sortBy(function (b) {
        return parseInt(b.content.get('uploadedRow'), 10);
      });
    } else {
      broadcasts = broadcasts.sortBy(function (b) {
        return b.get(sortBy);
      });
    }

    var sortOrder = dataFilter.sortOrder ? dataFilter.sortOrder : BROADCAST_STATUS_TYPE_TO_SORT_ORDER[dataFilter.broadcastStatusType];

    if (sortOrder === 'desc') {
      broadcasts = broadcasts.reverse();
    }
  }

  return broadcasts;
});

var getBroadcastsWithEntitiesSelectorFactory = function getBroadcastsWithEntitiesSelectorFactory(broadcastsSelector) {
  return createSelector([broadcastsSelector, getChannelsForDisplay, getCampaigns, getUsers], function (broadcasts, channels, campaigns, users) {
    if (!broadcasts) {
      return broadcasts;
    }

    return broadcasts.map(function (b) {
      if (users) {
        b = b.set('user', users.get(b.createdBy));
      }

      if (channels && !b.channel) {
        b = b.set('channel', channels.get(b.channelKey));

        if (!b.channel) {
          // should not be possible, just in case
          var channelKeys = channels.map(function (c) {
            return c.channelKey;
          }).toArray();
          var broadcastGuids = broadcasts.map(function (br) {
            return br.broadcastGuid;
          }).toArray();
          logErrorMessageOnce("Could not find channel to attach for channelKey: " + b.channelKey, {
            channelKeys: channelKeys,
            broadcastGuids: broadcastGuids
          });
        }
      }

      var isDraft = b.getStatusType() === BROADCAST_STATUS_TYPE.draft;
      var channel = channels.get(b.channelKey);

      if (!channel) {
        b = b.merge({
          userCanModify: false
        });
      } else {
        b = b.merge({
          userCanModify: isDraft ? channel.userCanDraft : channel.userCanPublish
        });
      }

      if (campaigns && b.campaignGuid && campaigns.get(b.campaignGuid)) {
        b = b.set('campaignName', campaigns.get(b.campaignGuid).display_name);
      }

      return b;
    });
  });
};

var getBroadcastsWithEntities = getBroadcastsWithEntitiesSelectorFactory(getFilteredSortedBroadcasts);
var getBroadcastsWithChannelErrors = createSelector([getBroadcastsWithEntities], function (broadcasts) {
  if (!broadcasts) {
    return broadcasts;
  }

  return broadcasts.map(function (b) {
    if (b.channel) {
      return b.update('errors', function (errs) {
        return errs.concat(b.channel.publishingErrors);
      });
    }

    return b;
  });
});
export var isActionEnabled = function isActionEnabled(action, channels, broadcast) {
  var channel = channels.get(broadcast.channelKey);
  var isDraft = broadcast.getStatusType() === BROADCAST_STATUS_TYPE.draft;

  switch (action) {
    case BROADCAST_ACTION_TYPES.CLONE:
      if (channel) {
        return !channels.filter(function (c) {
          return c.accountSlug === channel.accountSlug;
        }).isEmpty();
      }

      return false;

    case BROADCAST_ACTION_TYPES.CANCEL:
    case BROADCAST_ACTION_TYPES.DELETE:
      if (channel) {
        var userCanModify = isDraft ? channel.userCanDraft : channel.userCanPublish;
        return !channel.publishingErrors.includes(CHANNEL_VALIDATION.EXPIRED) && userCanModify && broadcast.canDelete();
      }

      return false;

    case BROADCAST_ACTION_TYPES.MAKE_DRAFT:
      if (channel && broadcast.isScheduled()) {
        var _userCanModify = isDraft ? channel.userCanDraft : channel.userCanPublish;

        return _userCanModify && broadcast.getStatusType() === BROADCAST_STATUS_TYPE.scheduled;
      }

      return false;

    case BROADCAST_ACTION_TYPES.EDIT:
      if (!channel || broadcast.isPublished() || broadcast.isFailed()) {
        return false;
      }

      if (broadcast.isDraft()) {
        return channel.userCanDraft;
      }

      return channel.userCanPublish;

    case BROADCAST_ACTION_TYPES.VIEW_DETAILS:
      // - when on published and isFailed > always show the view details
      // - when on scheduled > show view details for draft only users
      // - when on drafts > show view details if !channel.userCanDraft
      if (broadcast.isPublished() || broadcast.isFailed() || !channel) {
        return true;
      }

      if (broadcast.getStatusType() === BROADCAST_STATUS_TYPE.draft) {
        return !channel.userCanDraft;
      }

      return !channel.userCanPublish;

    case BROADCAST_ACTION_TYPES.BOOST:
      if (broadcast.isPublished() && channel) {
        var _userCanModify2 = isDraft ? channel.userCanDraft : channel.userCanPublish;

        return !channel.publishingErrors.includes(CHANNEL_VALIDATION.EXPIRED) && _userCanModify2;
      }

      return false;

    case BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK:
      return broadcast.isPublished();

    case BROADCAST_ACTION_TYPES.EDIT_CAMPAIGN:
      return true;

    default:
      return false;
  }
};
var ACTIONS = [BROADCAST_ACTION_TYPES.CLONE, BROADCAST_ACTION_TYPES.EDIT, BROADCAST_ACTION_TYPES.CANCEL, BROADCAST_ACTION_TYPES.DELETE, BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK, BROADCAST_ACTION_TYPES.BOOST, BROADCAST_ACTION_TYPES.MAKE_DRAFT, BROADCAST_ACTION_TYPES.VIEW_DETAILS // BROADCAST_ACTION_TYPES.EDIT_CAMPAIGN,
];

var attachActionsToBroadcast = function attachActionsToBroadcast(broadcast, channels) {
  return broadcast.merge({
    actions: fromJS(ACTIONS.filter(function (a) {
      return isActionEnabled(a, channels, broadcast);
    })).toSet()
  });
};

var getBroadcastsWithActionsPermissions = createTruthySelector([getBroadcastsWithChannelErrors, getChannelsForComposerPicker], function (broadcasts, channels) {
  return broadcasts.map(function (b) {
    return attachActionsToBroadcast(b, channels);
  });
});

var getGuid = function getGuid(state, broadcastGuid) {
  return broadcastGuid;
};

export var getSingleBroadcastCoreWithActions = createSelector([getBroadcasts, getBroadcastCores, getChannelsForComposerPicker, getGuid], function (broadcasts, broadcastCores, channels, guid) {
  var broadcast;

  if (broadcastCores && broadcastCores.get(guid)) {
    broadcast = broadcastCores.get(guid);
  }

  if (broadcasts && broadcasts.get(guid)) {
    broadcast = new Broadcast(broadcasts.get(guid));
  }

  if (!broadcast) {
    return null;
  }

  return attachActionsToBroadcast(broadcast, channels);
});
export var getBroadcastPage = createSelector([getDataFilter, getBroadcastsWithActionsPermissions, getUploadedErrors, getCampaigns], function (dataFilter, filteredSortedBroadcasts, uploadedErrors, campaigns) {
  if (!filteredSortedBroadcasts) {
    return filteredSortedBroadcasts;
  }

  if (dataFilter.broadcastStatusType === BROADCAST_STATUS_TYPE.uploaded) {
    var firstBroadcastIndex = (dataFilter.page - 1) * dataFilter.pageSize;
    var sliced = filteredSortedBroadcasts.slice(firstBroadcastIndex, firstBroadcastIndex + dataFilter.pageSize);
    return sliced.map(function (b) {
      if (!b.campaignGuid) {
        return b;
      }

      var campaign = campaigns.get(b.campaignGuid);
      return campaign ? b.set('campaignName', campaign.display_name) : b;
    });
  }

  return filteredSortedBroadcasts;
});
export var getCalendarBroadcastsForDisplay = createTruthySelector([getCalendarBroadcasts, getDataFilter], function (calendarBroadcasts, dataFilter) {
  var date = dataFilter.calendarDate;
  var broadcasts = calendarBroadcasts.getBroadcastsForDate(date);

  if (!broadcasts) {
    return broadcasts;
  }

  if (dataFilter.calendarViewType !== ViewTypes.DAY) {
    // include two surrounding months because calendar can show last week of prior and first week of next month
    var nextMonth = date.clone().add(1, 'month');

    if (calendarBroadcasts._getMonth(nextMonth)) {
      broadcasts = broadcasts.concat(calendarBroadcasts.getBroadcastsForDate(nextMonth));
    }

    var previousMonth = date.clone().subtract(1, 'month');

    if (calendarBroadcasts._getMonth(previousMonth)) {
      broadcasts = broadcasts.concat(calendarBroadcasts.getBroadcastsForDate(previousMonth));
    }
  }

  if (dataFilter.campaignGuid) {
    broadcasts = broadcasts.filter(function (b) {
      return b.campaignGuid === dataFilter.campaignGuid;
    });
  }

  if (dataFilter.hasPartialChannelSelection()) {
    broadcasts = broadcasts.filter(function (b) {
      return dataFilter.getSelectedChannelKeys().has(b.channelKey);
    });
  }

  if (dataFilter.mediaType !== MEDIA_FILTER_OPTIONS.all) {
    if (dataFilter.mediaType === MEDIA_FILTER_OPTIONS.link) {
      broadcasts = broadcasts.filter(function (b) {
        return b.broadcastMediaType === BROADCAST_MEDIA_TYPE.NONE && b.content.get('originalLink');
      });
    } else if (dataFilter.mediaType === MEDIA_FILTER_OPTIONS.photo) {
      broadcasts = broadcasts.filter(function (b) {
        return b.isPhoto();
      });
    } else if (dataFilter.mediaType === MEDIA_FILTER_OPTIONS.video) {
      broadcasts = broadcasts.filter(function (b) {
        return b.isVideo();
      });
    }
  }

  if (!dataFilter.showDrafts) {
    broadcasts = broadcasts.filter(function (b) {
      return b.status.toLowerCase() !== BROADCAST_STATUS_TYPE.draft;
    });
  }

  if (dataFilter.createdBy) {
    broadcasts = broadcasts.filter(function (b) {
      return b.createdBy === dataFilter.createdBy;
    });
  }

  return broadcasts;
});
export var getBroadcastsWithEntitiesForCalendar = getBroadcastsWithEntitiesSelectorFactory(getCalendarBroadcastsForDisplay);
export var getBroadcastsTotal = createSelector([getBroadcastsWithEntities, getDataFilter], function (broadcasts, dataFilter) {
  if (!broadcasts) {
    return undefined;
  }

  return dataFilter.broadcastStatusType === BROADCAST_STATUS_TYPE.uploaded ? broadcasts.size : dataFilter.total;
});
export var getCanEditBroadcast = createSelector([getBroadcasts, activeChannels, getGuid], function (broadcastCores, channels, broadcastGuid) {
  var broadcast = broadcastCores.get(broadcastGuid);

  if (!broadcast) {
    return false;
  }

  if (broadcast.getStatusType() === BROADCAST_STATUS_TYPE.draft) {
    return channels.get(broadcast.channelKey).userCanDraft;
  }

  return channels.get(broadcast.channelKey).userCanPublish;
});
export var getMessageSuggestions = createSelector([function (_state, props) {
  return props.message;
}, getPagePreviews, getLinkShorteningDomains], function (message, pagePreviews, linkShorteningDomains) {
  var pagePreview = pagePreviews.get(message.broadcast.content.get('originalLink'));
  var suggestions = ImmutableSet();

  if (pagePreview && ACCOUNT_SUGGESTED_MIN_IMAGE_DIMENSIONS[message.network]) {
    var imgInfo = pagePreview.images.get(message.broadcast.content.get('imageUrl'));

    var _ACCOUNT_SUGGESTED_MI = _slicedToArray(ACCOUNT_SUGGESTED_MIN_IMAGE_DIMENSIONS[message.network], 2),
        minWidth = _ACCOUNT_SUGGESTED_MI[0],
        minHeight = _ACCOUNT_SUGGESTED_MI[1];

    if (imgInfo && imgInfo.width && imgInfo.height && (imgInfo.width < minWidth || imgInfo.height < minHeight)) {
      suggestions = suggestions.add(BROADCAST_SUGGESTIONS.imageDimensionsTooSmall);
    }
  }

  if (message.network === ACCOUNT_TYPES.instagram && message.file && message.file.type === FMFile.TYPES.IMG) {
    if (message.file.width < INSTAGRAM_MIN_SUGGESTED_DIMENSIONS || message.file.height < INSTAGRAM_MIN_SUGGESTED_DIMENSIONS) {
      suggestions = suggestions.add(BROADCAST_SUGGESTIONS.instagramDimensionsTooSmall);
    } else if (message.file.width !== message.file.height) {
      suggestions = suggestions.add(BROADCAST_SUGGESTIONS.instagramSquareImage);
    }
  }

  if (message.broadcast.content.get('uncompressedLinks') && !linkShorteningDomains.isEmpty()) {
    var linkShorteningDomainsRegex = new RegExp("https?://(" + linkShorteningDomains.join('|') + ")", 'i');

    if (message.broadcast.content.get('uncompressedLinks').some(function (url) {
      return linkShorteningDomainsRegex.test(url);
    })) {
      suggestions = suggestions.add(BROADCAST_SUGGESTIONS.hubspotShortlink);
    }
  }

  return suggestions;
});