'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _fromJS;

import I18n from 'I18n';
import { fromJS, List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { Filter } from '../config/filters';
import { getFilterByProperty } from '../config/filters/functions';
import { TABLE } from '../constants/chartTypes';
import * as ConfigTypes from '../constants/configTypes';
import * as DataTypes from '../constants/dataTypes';
import * as Frequency from '../constants/frequency';
import * as Operators from '../constants/operators';
import { DATE_TIME, NUMBER } from '../constants/property-types';
import * as QuotaTypes from '../constants/quotaTypes';
import makeDateRangeByType from '../lib/makeDateRangeByType';
import * as http from '../request/http';
import { userInfo as getUserInfo } from '../request/user-info';
import { Dataset } from '../v2/dataset/datasetRecords';
import { getDailyGoals, getFrequencyEndDate, isAccumulated, padBuckets, rebucket } from './calculations';
import { getReportOwners, hasGoalsAccess, hasQuotaSeries } from './quota';
import { GOAL_DATE_PROPERTY, GOAL_VALUE_PROPERTY } from './resolveV2CustomSeries';
var COUNT_PROPERTY = 'count';
var quotaRequestUrl = 'quotas/v2/quotas/reports/';

var getQuotas = function getQuotas(requestData, quotaType) {
  return http.post("" + quotaRequestUrl + quotaType, {
    data: requestData
  }).then(fromJS);
};

var getEngagementFilter = function getEngagementFilter(engagementType) {
  return Filter({
    operator: Operators.IN,
    property: 'engagement.type',
    values: [engagementType]
  });
};

var ENGAGEMENT_MEETING_FILTER = getEngagementFilter('MEETING');
var ENGAGEMENT_CALL_FILTER = getEngagementFilter('CALL');
var GOALS_MAPPING = fromJS((_fromJS = {}, _defineProperty(_fromJS, QuotaTypes.DEALS_CREATED, function (dataType, metricProperties) {
  return dataType === DataTypes.DEALS && metricProperties.contains(COUNT_PROPERTY);
}), _defineProperty(_fromJS, QuotaTypes.REVENUE, function (dataType) {
  /* SEE RA-1653
  const properties = Set([
    'amount',
    'projectedAmount',
    'closedAmount',
    'amount_in_home_currency',
    'projectedAmountInHomeCurrency',
    'closedAmountInHomeCurrency',
  ]);
  */
  return dataType === DataTypes.DEALS;
}), _defineProperty(_fromJS, QuotaTypes.TICKETS_CLOSED, function (dataType, metricProperties) {
  return dataType === DataTypes.TICKETS && metricProperties.contains(COUNT_PROPERTY);
}), _defineProperty(_fromJS, QuotaTypes.MEETINGS_BOOKED, function (dataType, metricProperties, config) {
  var engagementFilter = Filter(getFilterByProperty(config, 'engagement.type'));
  var hasMeetingsFilter = engagementFilter.equals(ENGAGEMENT_MEETING_FILTER);
  var hasCountMetric = metricProperties.contains(COUNT_PROPERTY);
  return hasCountMetric && (dataType === DataTypes.MEETINGS || dataType === DataTypes.ENGAGEMENT && hasMeetingsFilter);
}), _defineProperty(_fromJS, QuotaTypes.CALLS_MADE, function (dataType, metricProperties, config) {
  var callFilter = Filter(getFilterByProperty(config, 'engagement.type'));
  var hasCallsFilter = callFilter.equals(ENGAGEMENT_CALL_FILTER);
  var hasCountMetric = metricProperties.contains(COUNT_PROPERTY);
  return hasCountMetric && (dataType === DataTypes.CALLS || dataType === DataTypes.ENGAGEMENT && hasCallsFilter);
}), _fromJS));

var getGoalType = function getGoalType(report) {
  var config = report.get('config');
  var dataType = config.get('dataType');
  var configType = config.get('configType');

  if (configType !== ConfigTypes.TIME_SERIES) {
    return null;
  }

  var metrics = config.get('metrics').map(function (metric) {
    return metric.get('property');
  }).toSet();
  return GOALS_MAPPING.findKey(function (isValid) {
    return isValid(dataType, metrics, config);
  });
};

var getGoalSeries = function getGoalSeries(_ref) {
  var report = _ref.report,
      buckets = _ref.buckets,
      goalResponse = _ref.goalResponse;
  var frequency = report.getIn(['config', 'frequency'], Frequency.MONTH);
  var dates = buckets.update(function (datesWithoutEnd) {
    return datesWithoutEnd.push(getFrequencyEndDate({
      date: datesWithoutEnd.last(),
      frequency: frequency
    }));
  });
  var dateFormat = 'YYYYMMDD';

  var _report$toJS = report.toJS(),
      _report$toJS$config = _report$toJS.config,
      dataType = _report$toJS$config.dataType,
      _report$toJS$config$f = _report$toJS$config.filters;

  _report$toJS$config$f = _report$toJS$config$f === void 0 ? {} : _report$toJS$config$f;
  var _report$toJS$config$f2 = _report$toJS$config$f.dateRange;
  _report$toJS$config$f2 = _report$toJS$config$f2 === void 0 ? {} : _report$toJS$config$f2;
  var reportRange = _report$toJS$config$f2.value;

  var _makeDateRangeByType = makeDateRangeByType(reportRange, dateFormat, dataType),
      reportStart = _makeDateRangeByType.startDate,
      reportEnd = _makeDateRangeByType.endDate;

  var reportStartMoment = I18n.moment(reportStart, dateFormat);
  var reportEndMoment = I18n.moment(reportEnd, dateFormat);
  var startDate = goalResponse.size !== 0 ? goalResponse.first().get('key') : I18n.moment(dates.first()).format('YYYY-MM-01');
  var endDate = goalResponse.size !== 0 ? goalResponse.last().get('key') : I18n.moment(dates.last()).format('YYYY-MM-01');
  var goalsByMonth = goalResponse.map(function (bucket) {
    return ImmutableMap({
      date: bucket.get('key'),
      value: bucket.get('sum')
    });
  });
  var paddedGoalsByMonth = padBuckets({
    goalsByMonth: goalsByMonth,
    startDate: startDate,
    endDate: endDate
  });
  var dailyGoals = getDailyGoals({
    goalsByMonth: paddedGoalsByMonth
  }).filter(function (goal) {
    var goalMoment = I18n.moment(goal.get('date'), dateFormat);
    return !goalMoment.isBefore(reportStartMoment) && !goalMoment.isAfter(reportEndMoment);
  });
  return rebucket({
    dailyGoals: dailyGoals,
    dates: dates
  });
};

var getDateRange = function getDateRange(config, buckets) {
  if (buckets.isEmpty()) {
    return null;
  }

  var firstBucket = buckets.first();
  var lastBucket = buckets.last();

  if (!I18n.moment(firstBucket).isValid() || !I18n.moment(lastBucket).isValid()) {
    return null;
  }

  var frequency = config.get('frequency', Frequency.MONTH);
  var startMonth = I18n.moment(firstBucket).month() + 1;
  var startYear = I18n.moment(firstBucket).year();
  var enddate = getFrequencyEndDate({
    date: lastBucket,
    frequency: frequency
  });
  var endMonth = I18n.moment(enddate).month() + 1;
  var endYear = I18n.moment(enddate).year();
  return {
    startDate: {
      month: startMonth,
      year: startYear
    },
    endDate: {
      month: endMonth,
      year: endYear
    }
  };
};

var USE_PIPELINE_FILTER = ImmutableSet([DataTypes.DEALS, DataTypes.TICKETS]);

var getPipelineFilters = function getPipelineFilters(config) {
  var dataType = config.get('dataType');
  var pipelineFilter = getFilterByProperty(config, 'pipeline') || getFilterByProperty(config, 'hs_pipeline');
  return USE_PIPELINE_FILTER.contains(dataType) && pipelineFilter ? {
    pipelinesOperator: pipelineFilter.get('operator'),
    pipelines: pipelineFilter.get('values')
  } : null;
};

function getGoalLineSeriesData(report, datePoints) {
  var data = fromJS(datePoints);
  var dataByDate = data.toMap().mapKeys(function (k, v) {
    return v.get('date');
  }).map(function (v) {
    return v.get('value');
  });
  var accumulate = isAccumulated(report); // assume the first series has all points

  var series = [];
  datePoints.forEach(function (point, index) {
    var _series$push;

    var currentValue = dataByDate.get(point.get(GOAL_DATE_PROPERTY), 0);
    var goalValue = accumulate ? (index === 0 ? 0 : series[index - 1][GOAL_VALUE_PROPERTY]) + currentValue : currentValue;
    series.push((_series$push = {}, _defineProperty(_series$push, GOAL_DATE_PROPERTY, point.get(GOAL_DATE_PROPERTY)), _defineProperty(_series$push, GOAL_VALUE_PROPERTY, goalValue), _series$push));
  });
  return series;
}

var getRequestPayload = function getRequestPayload(report, buckets, goalType) {
  var config = report.get('config');
  var PipelinesFilter = getPipelineFilters(config);
  var dateRange = getDateRange(config, buckets);
  return dateRange && goalType ? getReportOwners(report).then(function (owners) {
    return owners ? owners.map(function (owner) {
      return owner.get('ownerId');
    }) : [];
  }).then(function (ownerIds) {
    return ownerIds.length !== 0 ? {
      assignees: ownerIds,
      assigneesOperator: Operators.IN
    } : null;
  }).then(function (owners) {
    return Object.assign({}, PipelinesFilter, {}, owners, {
      dateRange: dateRange
    });
  }) : null;
};

var getDatetimeQuotaInternals = function getDatetimeQuotaInternals(report, buckets) {
  if (!hasQuotaSeries(report) || report.get('chartType') === TABLE) {
    return Promise.resolve(report);
  }

  var goalType = getGoalType(report);
  return Promise.all([getRequestPayload(report, buckets, goalType), getUserInfo()]).then(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        requestPayload = _ref3[0],
        userInfo = _ref3[1];

    return requestPayload && hasGoalsAccess(userInfo) ? getQuotas(requestPayload, goalType).then(function (quotas) {
      var _ImmutableMap;

      var data = getGoalLineSeriesData(report, getGoalSeries({
        report: report,
        buckets: buckets,
        goalResponse: quotas
      }));
      var dateLabelReferences = data.reduce(function (map, dataPoint) {
        return map.set(dataPoint[GOAL_DATE_PROPERTY], ImmutableMap({
          label: I18n.moment(dataPoint[GOAL_DATE_PROPERTY]).format('l')
        }));
      }, ImmutableMap());
      return Dataset({
        data: data,
        properties: ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, GOAL_DATE_PROPERTY, {
          type: DATE_TIME,
          references: dateLabelReferences
        }), _defineProperty(_ImmutableMap, GOAL_VALUE_PROPERTY, {
          type: NUMBER,
          label: I18n.text("reporting-data.customSeries.goals." + goalType)
        }), _ImmutableMap))
      });
    }) : Promise.resolve(null);
  });
};

export var getDatetimeQuotaData = function getDatetimeQuotaData(report, oldReportDataset) {
  var buckets = oldReportDataset.getIn(['dimension', 'buckets'], List()).map(function (dataRow) {
    return dataRow.get('key');
  });
  return getDatetimeQuotaInternals(report, buckets);
};
/**
 *
 *  Used for resolving quota data around the RAAS BE resolve process
 *
 * @param {Report} report report config object
 * @param {Dataset} newReportDataset  new reporting dataset format
 * @returns {Promise}
 */

export var getBackendResolveDatetimeQuotaData = function getBackendResolveDatetimeQuotaData(report, newReportDataset) {
  var dimensionProperty = report.getIn(['config', 'dimensions', 0]);
  var buckets = newReportDataset.get('data').map(function (dataRow) {
    return dataRow.get(dimensionProperty);
  }).toOrderedSet().toList();
  return getDatetimeQuotaInternals(report, buckets);
};