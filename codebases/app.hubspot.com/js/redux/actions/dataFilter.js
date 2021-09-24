'use es6';

import { createAction } from 'flux-actions';
import { replace } from 'react-router-redux';
import { identity } from 'underscore';
import { APP_SECTIONS, BROADCAST_STATUS_TYPE } from '../../lib/constants';
import { trackInteraction } from './usage';
import actionTypes from './actionTypes';
import { fetchBroadcasts } from './broadcasts';
import { fetchFeed } from './feed';
import { currentLocation, getAppSection } from '../selectors';
import { logDebug } from '../../lib/utils';
var updateDataFilterAction = createAction(actionTypes.DATAFILTER_UPDATE, identity);
var ALWAYS_REFRESH_ATTRS = ['excludedChannelKeys', 'campaignGuid', 'dateRangeKey', 'startDate', 'endDate'];
var BROADCASTS_REFRESH_ATTRS = ALWAYS_REFRESH_ATTRS.concat(['requestedStatusType', 'page', 'sortBy', 'sortOrder']);

function _trackInteraction(attrs, dispatch) {
  if (attrs.dateRangeKey) {
    dispatch(trackInteraction('date filter change', {
      range: attrs.dateRangeKey
    }));
  }

  if (attrs.campaignGuid) {
    dispatch(trackInteraction('campaign filter change'));
  }

  if (attrs.excludedChannelKeys) {
    dispatch(trackInteraction('channel select change'));
  }

  if (attrs.mediaType) {
    dispatch(trackInteraction('media type filter change'));
  }
}

export var updateDataFilter = function updateDataFilter(attrs) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, getState) {
    var state = getState();
    var dataFilter = state.dataFilter;
    var logicalChannels = state.logicalChannels;
    var surpressRefetch = dataFilter.broadcastStatusType === BROADCAST_STATUS_TYPE.uploaded && !attrs.requestedStatusType;
    var currentPath = currentLocation(getState());

    if (!dataFilter.broadcastStatusType && attrs.requestedStatusType) {
      attrs.broadcastStatusType = attrs.requestedStatusType;
    }

    if (opts.silent !== true) {
      _trackInteraction(attrs, dispatch);
    }

    if (!attrs.page && !attrs.sortBy) {
      attrs.page = 1;
    }

    var oldUrl = dataFilter.getUrlForParams(currentPath, opts.isCalendarMode);
    dataFilter = dataFilter.merge(attrs);
    dispatch(updateDataFilterAction(attrs));
    var newUrl = dataFilter.getUrlForParams(currentPath, opts.isCalendarMode);

    if (newUrl !== oldUrl) {
      dispatch(replace(dataFilter.getUrlForParams(currentPath, opts.isCalendarMode)));
    } else {
      logDebug('Same url after updated dataFilter, not navigating');
    }

    if (logicalChannels) {
      if (!surpressRefetch && Object.keys(attrs).some(function (k) {
        return BROADCASTS_REFRESH_ATTRS.includes(k);
      })) {
        // note this happens on Reports for Top Posts and for Publishing table
        dispatch(fetchBroadcasts());
      }

      if ((attrs.excludedChannelKeys || typeof attrs.network !== 'undefined') && getAppSection(getState()) === APP_SECTIONS.monitoring) {
        dispatch(fetchFeed(true));
      }
    }
  };
};
export var updateSelectedNetwork = function updateSelectedNetwork(network) {
  return function (dispatch) {
    dispatch(trackInteraction('change network', {
      network: network
    }));

    if (network === 'all') {
      network = null;
    }

    dispatch(updateDataFilter({
      network: network
    }));
  };
};