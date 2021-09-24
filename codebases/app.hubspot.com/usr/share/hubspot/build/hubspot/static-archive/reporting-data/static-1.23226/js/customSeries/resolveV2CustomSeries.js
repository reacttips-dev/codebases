'use es6';

import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { getBackendResolveDatetimeGoalData, getDatetimeGoalData } from './goalDateTimeSeries';
import { getBackendResolveDatetimeQuotaData, getDatetimeQuotaData } from './quotaSeries';
export var CUSTOM_SERIES_DATASET_PREFIX = 'custom-series-';
export var GOAL_DATE_PROPERTY = 'date';
export var GOAL_VALUE_PROPERTY = 'value';
var CUSTOM_SERIES_LIST = {
  'datetime.goal': getDatetimeGoalData,
  'datetime.quota': getDatetimeQuotaData
};
var CUSTOM_SERIES_NEW_DATASET_LIST = {
  'datetime.goal': getBackendResolveDatetimeGoalData,
  'datetime.quota': getBackendResolveDatetimeQuotaData
};
export function resolveV2CustomSeries(report, reportDataset) {
  var isNewDatasetFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var customSeriesList = report && fromJS(report.getIn(['displayParams', 'customSeries'])) || List();
  var customSeriesMapper = isNewDatasetFormat ? CUSTOM_SERIES_NEW_DATASET_LIST : CUSTOM_SERIES_LIST;
  var promises = customSeriesList.filter(function (series) {
    return typeof series === 'string' ? customSeriesMapper[series] : customSeriesMapper[series.get('type')];
  }).map(function (series) {
    var seriesFunc = customSeriesMapper[typeof series === 'string' ? series : series.get('type')];
    return typeof series === 'string' ? seriesFunc(report, reportDataset) : seriesFunc(report, reportDataset, series.toJS());
  }).toJS();
  return promises.count === 0 ? ImmutableMap() : Promise.all(promises).then(function (customSeriesDatasets) {
    return fromJS(customSeriesDatasets).toMap().mapKeys(function (k) {
      return "" + CUSTOM_SERIES_DATASET_PREFIX + k;
    });
  });
}