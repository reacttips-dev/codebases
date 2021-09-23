'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _specs;

import { has } from '../../../lib/has';
import * as DataTypes from '../../../constants/dataTypes';
import { preprocess as analyticsContentSearch } from './analytics-content-search';
import { preprocess as analyticsVideosViewership } from './analytics-videos-viewership';
import { preprocess as analyticsForms } from './analytics-forms';
import { preprocess as unifiedAdsCampaigns } from './unified-ads-campaigns';
import { preprocess as unifiedFeedbackTrends } from './unified-feedback-trends';
import { preprocess as analyticsSources } from './analytics-sources';
import { preprocess as analyticsDeviceTypes } from './analytics-device-types';
import { preprocess as analyticsAllPages } from './analytics-all-pages';
import { preprocess as sequenceSenderScore } from './sequence-sender-score';
var specs = (_specs = {}, _defineProperty(_specs, DataTypes.ANALYTICS_CONTENT_SEARCH, analyticsContentSearch), _defineProperty(_specs, DataTypes.ANALYTICS_SOURCES, analyticsSources), _defineProperty(_specs, DataTypes.ANALYTICS_VIDEOS_VIEWERSHIP, analyticsVideosViewership), _defineProperty(_specs, DataTypes.ANALYTICS_FORMS, analyticsForms), _defineProperty(_specs, DataTypes.UNIFIED_ADS_CAMPAIGNS, unifiedAdsCampaigns), _defineProperty(_specs, DataTypes.UNIFIED_FEEDBACK_TRENDS, unifiedFeedbackTrends), _defineProperty(_specs, DataTypes.ANALYTICS_DEVICE_TYPES, analyticsDeviceTypes), _defineProperty(_specs, DataTypes.SEQUENCE_SENDER_SCORE, sequenceSenderScore), _defineProperty(_specs, DataTypes.ANALYTICS_ALL_PAGES, analyticsAllPages), _defineProperty(_specs, DataTypes.ANALYTICS_ALL_PAGES_SOURCES, analyticsAllPages), _specs);

var passthrough = function passthrough(response) {
  return response;
};

export var get = function get(spec, config) {
  var dataType = config.dataType;

  if (has(specs, dataType)) {
    return specs[dataType](spec, config);
  }

  return passthrough;
};