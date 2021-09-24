'use es6';

import I18n from 'I18n';
import { is, List } from 'immutable';
import { Attribution } from '../../config/attribution';
import { CrossObject } from '../../config/cross-object';
import { DATA_WELL, TABLE } from '../../constants/chartTypes';
import { FUNNEL, PIPELINE, SEARCH } from '../../constants/configTypes';
import { CRM_OBJECT } from '../../constants/dataTypes';
import { ENGAGEMENT, ENGAGEMENTS } from '../../constants/dataTypes/inboundDb';
import { RANGE_TYPES } from '../../constants/dateRangeTypes';
import { DEFAULT_LIMIT } from '../../retrieve/inboundDb/aggregate/preconditions/responseTooLarge';
import { SUM } from '../../constants/metricTypes';
import { DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES } from '../../constants/objectCoordinates';
import { BETWEEN } from '../../constants/operators';
import { QUOTA_NAMESPACE } from '../../retrieve/custom/quotas/shared';
export var fixCrmObject = function fixCrmObject(_ref) {
  var report = _ref.report;
  var dataType = report.getIn(['config', 'dataType']);

  if (dataType !== CRM_OBJECT) {
    return {
      report: report.setIn(['config', 'objectTypeId'], DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES.get(dataType !== ENGAGEMENT ? dataType : ENGAGEMENTS)).setIn(['config', 'dataType'], CRM_OBJECT)
    };
  }

  return {
    report: report
  };
};
var dateValueRanges = [RANGE_TYPES.CUSTOM, RANGE_TYPES.IS_EQUAL_TO, RANGE_TYPES.IS_BEFORE_DATE, RANGE_TYPES.IS_AFTER_DATE];

var reformatDate = function reformatDate(date) {
  return I18n.moment.portalTz(date, 'YYYYMMDD', true).isValid() ? I18n.moment.portalTz(date, 'YYYYMMDD').format('YYYY-MM-DD') : date;
};

export var fixDateFilters = function fixDateFilters(_ref2) {
  var report = _ref2.report;

  if (dateValueRanges.includes(report.getIn(['config', 'filters', 'dateRange', 'value', 'rangeType']))) {
    report = report.getIn(['config', 'filters', 'dateRange', 'value', 'rangeType']) === RANGE_TYPES.CUSTOM ? report.updateIn(['config', 'filters', 'dateRange', 'value', 'startDate'], reformatDate).updateIn(['config', 'filters', 'dateRange', 'value', 'endDate'], reformatDate) : report.updateIn(['config', 'filters', 'dateRange', 'value', 'date'], reformatDate);
  }

  report = report.updateIn(['config', 'filters', 'custom'], List(), function (filters) {
    return filters.map(function (filter) {
      if (filter.get('dateTimeFormat') !== 'DATE') {
        return filter;
      }

      filter = filter.update('value', reformatDate);
      return filter.get('operator') === BETWEEN ? filter.update('highValue', reformatDate) : filter;
    });
  });
  return {
    report: report
  };
};
var NULL_ATTRIBUTION = Attribution(null);
var NULL_CROSS_OBJECT = CrossObject(null);
export var fixInvalidFields = function fixInvalidFields(_ref3) {
  var report = _ref3.report;

  if (is(report.getIn(['config', 'attributionModel'], NULL_ATTRIBUTION), NULL_ATTRIBUTION)) {
    report = report.deleteIn(['config', 'attributionModel']);
  }

  if (is(report.getIn(['config', 'crossObject'], NULL_CROSS_OBJECT), NULL_CROSS_OBJECT)) {
    report = report.deleteIn(['config', 'crossObject']);
  }

  return {
    report: report
  };
};
export var fixMissingMetricTypes = function fixMissingMetricTypes(_ref4) {
  var report = _ref4.report;
  return {
    report: report.updateIn(['config', 'metrics'], function (metrics) {
      return metrics.map(function (metric) {
        return metric.update('metricTypes', function (types) {
          return types && types.count() > 0 ? types : List([SUM]);
        });
      });
    })
  };
};
export var fixCountMetricType = function fixCountMetricType(_ref5) {
  var report = _ref5.report;
  return {
    report: report.updateIn(['config', 'metrics'], function (metrics) {
      return metrics.map(function (metric) {
        return metric.get('property') === 'count' ? metric.set('metricTypes', List([SUM])) : metric;
      });
    })
  };
};
export var fixZeroLimit = function fixZeroLimit(_ref6) {
  var report = _ref6.report;
  return {
    report: report.getIn(['config', 'limit']) === 0 ? report.deleteIn(['config', 'limit']) : report
  };
};
export var fixFunnelLimit = function fixFunnelLimit(_ref7) {
  var report = _ref7.report;
  return {
    report: report.get('chartType') !== TABLE && [FUNNEL, PIPELINE].includes(report.getIn(['config', 'configType'])) ? report.deleteIn(['config', 'limit']) : report
  };
};
export var fixComparisonDatawellLimit = function fixComparisonDatawellLimit(_ref8) {
  var report = _ref8.report;
  return {
    report: report.get('chartType') === DATA_WELL ? report.setIn(['config', 'limit'], DEFAULT_LIMIT) : report
  };
};
export var fixQuotaProperties = function fixQuotaProperties(_ref9) {
  var report = _ref9.report;
  return {
    report: report.updateIn(['config', 'metrics'], function (metrics) {
      return metrics.filter(function (metric) {
        return !metric.get('property', '').startsWith(QUOTA_NAMESPACE + ".");
      });
    })
  };
};
export var fixSearchOffset = function fixSearchOffset(_ref10) {
  var report = _ref10.report;

  if (report.getIn(['config', 'configType']) === SEARCH) {
    return {
      report: report.setIn(['config', 'offset'], 0),
      externalizedData: {
        offset: report.getIn(['config', 'offset'])
      }
    };
  }

  return {
    report: report
  };
};

var makeFixes = function makeFixes(fns) {
  return fns.map(function (fn) {
    return function (_ref11) {
      var report = _ref11.report,
          externalizedData = _ref11.externalizedData;
      var result = fn({
        report: report,
        externalizedData: externalizedData
      });
      return {
        report: result.report,
        externalizedData: Object.assign({}, result.externalizedData, {}, externalizedData)
      };
    };
  });
};

var reportFixes = makeFixes([fixCrmObject, fixDateFilters, fixInvalidFields, fixMissingMetricTypes, fixCountMetricType, fixZeroLimit, fixFunnelLimit, fixQuotaProperties]);
var endpointFixes = makeFixes([fixSearchOffset]);
var compareFixes = makeFixes([fixComparisonDatawellLimit]);
export var applyReportFixes = function applyReportFixes(report) {
  return reportFixes.reduce(function (data, fix) {
    return fix(data);
  }, {
    report: report,
    externalizedData: {}
  });
};
export var applyEndpointFixes = function applyEndpointFixes(report) {
  return endpointFixes.reduce(function (data, fix) {
    return fix(data);
  }, {
    report: report,
    externalizedData: {}
  });
};
export var applyCompareFixes = function applyCompareFixes(report) {
  return compareFixes.reduce(function (data, fix) {
    return fix(data);
  }, {
    report: report,
    externalizedData: {}
  });
};