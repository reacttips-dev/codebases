'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _frequencyToPeriodMap;

import I18n from 'I18n';
import { fromJS, List, Map as ImmutableMap, OrderedMap, Range, Seq } from 'immutable';
import { getFilterByProperty } from '../../../config/filters/functions';
import { QUOTAS } from '../../../constants/dataTypes';
import * as Frequency from '../../../constants/frequency';
import { summarize } from '../../../dataset/summarize';
import makeDateRangeByType from '../../../lib/makeDateRangeByType';
import zeroFill from '../../../lib/zeroFill';
import * as http from '../../../request/http';
import { QUOTA_DATE_PROPERTY, QUOTA_OWNER_PROPERTY, QUOTA_PIPELINE_PROPERTY, QUOTA_TYPE_PROPERTY, QUOTA_VALUE_PROPERTY } from './shared';
import { DEFAULT_NULL_VALUES } from '../../../constants/defaultNullValues';

var getMonthlyUrl = function getMonthlyUrl(quotaType) {
  return "quotas/v2/quotas/reports/" + quotaType + "/monthly";
};
/* These are the _ONLY_ supported dimensions */


var DIMENSIONS = {
  SUMMARY: List([]),
  DATE: List([QUOTA_DATE_PROPERTY]),
  DATE_OWNERS: List([QUOTA_DATE_PROPERTY, QUOTA_OWNER_PROPERTY]),
  OWNERS: List([QUOTA_OWNER_PROPERTY])
};
var DATE_FORMAT = 'YYYY-MM-DD';
var frequencyToPeriodMap = (_frequencyToPeriodMap = {}, _defineProperty(_frequencyToPeriodMap, Frequency.DAY, 'day'), _defineProperty(_frequencyToPeriodMap, Frequency.WEEK, 'isoWeek'), _defineProperty(_frequencyToPeriodMap, Frequency.MONTH, 'month'), _defineProperty(_frequencyToPeriodMap, Frequency.QUARTER, 'quarter'), _defineProperty(_frequencyToPeriodMap, Frequency.YEAR, 'year'), _frequencyToPeriodMap);

var getMonthAndYear = function getMonthAndYear(date) {
  var m = I18n.moment(date);
  return {
    month: m.month() + 1,
    year: m.year()
  };
};

var pad = function pad(number) {
  return ("00" + number).slice(-2);
};

var getData = function getData(_ref) {
  var quotaType = _ref.quotaType,
      startDate = _ref.startDate,
      endDate = _ref.endDate,
      filters = _ref.filters;
  var monthlyStartDate = I18n.moment(startDate).startOf('month').format(DATE_FORMAT);
  return http.post(getMonthlyUrl(quotaType), {
    data: Object.assign({
      dateRange: {
        startDate: getMonthAndYear(monthlyStartDate),
        endDate: getMonthAndYear(endDate)
      }
    }, filters)
  }).then(function (data) {
    return data.map(function (value, date) {
      return ImmutableMap({
        key: date,
        value: value
      });
    }).toList().flatMap(function (v) {
      var date = I18n.moment(v.get('key'), DATE_FORMAT);
      var daysInMonth = date.daysInMonth();
      return Range(1, daysInMonth + 1).map(function (day) {
        return I18n.moment(date.format("YYYY-MM-" + pad(day))).format(DATE_FORMAT);
      }).map(function (day) {
        return ImmutableMap({
          key: day,
          value: v.get('value').map(function (b) {
            return b.update('sum', function (sum) {
              return sum / daysInMonth;
            });
          })
        });
      });
    });
  });
};

var rebucket = function rebucket(_ref2) {
  var dailyQuotas = _ref2.dailyQuotas,
      frequency = _ref2.frequency;
  var period = frequencyToPeriodMap[frequency];
  return dailyQuotas.map(function (q) {
    return q.set('bucket', I18n.moment(q.get('key')).startOf(period).format(DATE_FORMAT));
  }).groupBy(function (q) {
    return q.get('bucket');
  }).map(function (b) {
    return b.flatMap(function (q) {
      return q.get('value');
    }).groupBy(function (q) {
      return q.get('breakdown');
    }).map(function (g) {
      return g.reduce(function (memo, q) {
        return memo + q.get('sum');
      }, 0);
    });
  });
};

var toDateOwnerDataset = function toDateOwnerDataset(data) {
  return fromJS({
    dimension: {
      property: QUOTA_DATE_PROPERTY,
      buckets: data.map(function (bucket, key) {
        return {
          key: key,
          dimension: {
            property: QUOTA_OWNER_PROPERTY,
            buckets: bucket.map(function (b, k) {
              return {
                key: k,
                metrics: _defineProperty({}, QUOTA_VALUE_PROPERTY, {
                  SUM: b
                })
              };
            }).toList().toJS()
          }
        };
      }).toList().toJS()
    }
  });
};

var toOwnerDataset = function toOwnerDataset(data) {
  return fromJS({
    dimension: {
      property: QUOTA_OWNER_PROPERTY,
      buckets: data.map(function (bucket, key) {
        return {
          key: key,
          metrics: _defineProperty({}, QUOTA_VALUE_PROPERTY, {
            SUM: bucket
          })
        };
      }).toList().toJS()
    }
  });
};

export var retrieve = function retrieve(config, __debug, __runtimeOptions) {
  var dimensions = config.get('dimensions');
  var type = Seq(DIMENSIONS).find(function (dimensionList) {
    return dimensionList.equals(dimensions);
  });

  if (!type) {
    throw new Error("Unsupported dimensions for quota report " + dimensions);
  }

  var quotaTypeFilter = getFilterByProperty(config, QUOTA_TYPE_PROPERTY) || undefined;
  var quotaType = quotaTypeFilter.get('value');

  if (!quotaType) {
    throw new Error("Unsupported quota type " + quotaType + " for quota report");
  }

  var dateRangeFilter = config.getIn(['filters', 'dateRange']);

  if (!dateRangeFilter) {
    throw new Error('Quota reports require a date range filter');
  }

  var frequency = config.get('frequency') || Frequency.MONTH;

  var _makeDateRangeByType = makeDateRangeByType(dateRangeFilter.get('value').toJS()),
      startDate = _makeDateRangeByType.startDate,
      endDate = _makeDateRangeByType.endDate;

  var ownersFilter = getFilterByProperty(config, QUOTA_OWNER_PROPERTY) || undefined;
  var assignees = ownersFilter && ownersFilter.get('values').filter(function (owner) {
    return owner !== DEFAULT_NULL_VALUES.ENUMERATION;
  });
  var assigneesOperator = ownersFilter && ownersFilter.get('operator');
  var pipelineFilter = getFilterByProperty(config, QUOTA_PIPELINE_PROPERTY) || undefined;
  var pipelines = pipelineFilter && pipelineFilter.get('values');
  var pipelinesOperator = 'IN';
  var filters = {
    assignees: assignees,
    assigneesOperator: assigneesOperator,
    pipelines: pipelines,
    pipelinesOperator: pipelinesOperator
  };
  return getData({
    quotaType: quotaType,
    startDate: startDate,
    endDate: endDate,
    filters: filters
  }).then(function (unfilteredDailyQuotas) {
    var dailyQuotas = unfilteredDailyQuotas.skipUntil(function (q) {
      return I18n.moment(q.get('key')).isSameOrAfter(I18n.moment(startDate));
    }).update(function (dq) {
      return dq.takeUntil(function (_, i) {
        if (i === 0) {
          return false;
        }

        return I18n.moment(dq.getIn([i - 1, 'key'])).isSameOrAfter(I18n.moment(endDate));
      });
    });
    var data = rebucket({
      dailyQuotas: dailyQuotas,
      frequency: frequency
    });

    if (type === DIMENSIONS.DATE_OWNERS) {
      var dataset = toDateOwnerDataset(data);
      return summarize(dataset);
    }

    if (type === DIMENSIONS.DATE) {
      var _dataset = toDateOwnerDataset(data);

      return summarize(_dataset).updateIn(['dimension', 'buckets'], function (buckets) {
        return buckets.map(function (b) {
          return b.delete('dimension');
        });
      });
    }

    if (type === DIMENSIONS.SUMMARY) {
      var _dataset2 = toDateOwnerDataset(data);

      return summarize(_dataset2).delete('dimension');
    }

    if (type === DIMENSIONS.OWNERS) {
      var owners = {};
      data.forEach(function (date) {
        return date.forEach(function (sum, owner) {
          owners[owner] = owners[owner] ? owners[owner] + sum : sum;
        });
      });
      var ownersData = OrderedMap(owners).sort();

      var _dataset3 = toOwnerDataset(ownersData);

      return summarize(_dataset3);
    }

    throw new Error('Unsupported quota report');
  }).then(function (dataset) {
    return {
      dataConfig: config,
      dataset: zeroFill(config, dataset)
    };
  });
};
export var match = function match(dataConfig) {
  return dataConfig.get('dataType') === QUOTAS;
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = module.exports;
}