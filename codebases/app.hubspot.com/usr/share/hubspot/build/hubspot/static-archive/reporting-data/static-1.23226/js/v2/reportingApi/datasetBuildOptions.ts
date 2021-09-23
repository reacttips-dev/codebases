import { List, Map as ImmutableMap } from 'immutable';
import { FUNNEL, PIPELINE, SEARCH } from '../../constants/configTypes';
import * as MetricTypes from '../../constants/metricTypes';
import { fromMetricKey, isMetricWithType } from '../dataset/datasetMetrics';
export var defaultDatasetBuildOptions = {
  isSearch: false,
  removeLastRowPercentiles: false,
  hasCurrencyDimension: function hasCurrencyDimension() {
    return false;
  },
  isMeasure: function isMeasure() {
    return false;
  },
  getMeasureType: function getMeasureType() {
    return MetricTypes.SUM;
  }
};
export var getDatasetBuildOptionsFromConfig = function getDatasetBuildOptionsFromConfig(config) {
  var configType = config.get('configType');
  return {
    isSearch: configType === SEARCH,
    removeLastRowPercentiles: configType === FUNNEL || configType === PIPELINE,
    hasCurrencyDimension: function hasCurrencyDimension(currencyCodeColumn) {
      return config.get('dimensions', List()).includes(currencyCodeColumn);
    },
    isMeasure: isMetricWithType,
    getMeasureType: function getMeasureType(columnName) {
      return fromMetricKey(columnName).type;
    }
  };
};
export var getDatasetBuildOptionsFromReportDef = function getDatasetBuildOptionsFromReportDef(reportDef) {
  return {
    isSearch: reportDef.get('columns', ImmutableMap()).every(function (column) {
      return column.get('role') === 'DIMENSION';
    }),
    removeLastRowPercentiles: false,
    hasCurrencyDimension: function hasCurrencyDimension(currencyCodeColumn) {
      return reportDef.get('columns', ImmutableMap()).some(function (column, columnName) {
        return columnName === currencyCodeColumn && column.get('role') === 'DIMENSION';
      });
    },
    isMeasure: function isMeasure(columnName) {
      return reportDef.getIn(['columns', columnName, 'role'], 'DIMENSION') === 'MEASURE';
    },
    getMeasureType: function getMeasureType(columnName) {
      return reportDef.getIn(['columns', columnName, 'role'], 'DIMENSION') === 'MEASURE' ? reportDef.getIn(['columns', columnName, 'aggregation']) : MetricTypes.SUM;
    }
  };
};