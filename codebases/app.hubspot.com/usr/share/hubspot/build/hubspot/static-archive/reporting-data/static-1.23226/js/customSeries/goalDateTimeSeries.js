'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
import { List, Map as ImmutableMap } from 'immutable';
import { DATE_TIME, NUMBER } from '../constants/property-types';
import { number as formatNumber } from '../hydrate/numberFormatter';
import { Dataset, getReferenceLabel } from '../v2/dataset/datasetRecords';
import { getDailyGoals, getFrequencyEndDate, isAccumulated, rebucket } from './calculations';
import { GOAL_DATE_PROPERTY, GOAL_VALUE_PROPERTY } from './resolveV2CustomSeries';

function getStaticGoalLineSeriesData(_ref, reportConfig, datePoints) {
  var goal = _ref.goal;

  if (!datePoints.length) {
    return ImmutableMap({});
  }

  var frequency = reportConfig.getIn(['config', 'frequency']);
  var firstDate = datePoints[0].id;
  var lastDate = datePoints[datePoints.length - 1].id;
  var start = I18n.moment(firstDate).startOf('month');
  var end = getFrequencyEndDate({
    date: lastDate,
    frequency: frequency
  });
  var goalsByMonth = List();

  while (start.isSameOrBefore(end)) {
    goalsByMonth = goalsByMonth.push(ImmutableMap({
      date: start.format('YYYY-MM-DD'),
      value: goal
    }));
    start.add(1, 'month');
  }

  var dailyGoals = getDailyGoals({
    goalsByMonth: goalsByMonth
  });
  var truncated = rebucket({
    dailyGoals: dailyGoals,
    dates: List([].concat(_toConsumableArray(datePoints.map(function (_ref2) {
      var id = _ref2.id;
      return id;
    })), [end]))
  });
  var goals = isAccumulated(reportConfig) ? truncated.reduce(function (accumulated, point, index) {
    return [].concat(_toConsumableArray(accumulated), [(accumulated[index - 1] || 0) + point.get('value', 0)]);
  }, []) : truncated.map(function (point) {
    return point.get('value', 0);
  }).toJS();
  return datePoints.map(function (point, index) {
    return Object.assign({}, point, {
      yLabel: formatNumber(goals[index]),
      y: goals[index]
    });
  });
}

var getDatetimeGoalDataInternal = function getDatetimeGoalDataInternal(report, datePoints, goalConfig) {
  var _ImmutableMap;

  var contextPath = ['config', 'context', 'context', 'operator'];
  var isAllData = report.getIn(contextPath) === 'HAS_PROPERTY';

  if (isAllData) {
    return Promise.resolve(null);
  }

  var goalLineData = getStaticGoalLineSeriesData(goalConfig, report, datePoints.toJS());
  var data = goalLineData.map(function (dataPoint) {
    return {
      date: dataPoint.id,
      value: dataPoint.y
    };
  });
  var dateLabelReferences = List(goalLineData).reduce(function (map, dataPoint) {
    return map.set(dataPoint.id, ImmutableMap({
      label: dataPoint.xLabel
    }));
  }, ImmutableMap());
  var properties = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, GOAL_DATE_PROPERTY, {
    type: DATE_TIME,
    references: dateLabelReferences
  }), _defineProperty(_ImmutableMap, GOAL_VALUE_PROPERTY, {
    type: NUMBER,
    label: I18n.text('reporting-data.customSeries.goals.monthlyGoalSeries')
  }), _ImmutableMap));
  return Promise.resolve(Dataset({
    data: data,
    properties: properties
  }));
};

export var getDatetimeGoalData = function getDatetimeGoalData(report, oldReportDataset, goalConfig) {
  // Get the all the X axis
  var datePoints = oldReportDataset.getIn(['dimension', 'buckets']).map(function (category) {
    return {
      id: category.get('key'),
      xLabel: category.get('keyLabel')
    };
  });
  return getDatetimeGoalDataInternal(report, datePoints, goalConfig);
};
export var getBackendResolveDatetimeGoalData = function getBackendResolveDatetimeGoalData(report, newReportDataset, goalConfig) {
  // Get the all the X axis
  var dimensionProperty = report.getIn(['config', 'dimensions', 0]);
  var datePoints = newReportDataset.get('data').map(function (dataRow) {
    return dataRow.get(dimensionProperty);
  }).toOrderedSet().toList().map(function (dateId) {
    return {
      id: dateId,
      xLabel: getReferenceLabel(newReportDataset, dimensionProperty, dateId)
    };
  });
  return getDatetimeGoalDataInternal(report, datePoints, goalConfig);
};