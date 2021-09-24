'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, OrderedMap, Record, fromJS } from 'immutable';
import I18n from 'I18n';
import { isNumber, isNaN } from 'underscore';
import prefix from 'reporting-data/lib/prefix';
import accumulate from 'reporting-data/process/accumulate';
import { CHANNEL_METRICS } from '../socialChannels';
import { formatDuration } from '../../lib/utils';
var DEFAULTS = {
  fetchStatus: null,
  currentSeries: null,
  previousSeries: null
};
export var translate = prefix('reporting-data.properties.socialPosts');
var CHANNEL_METRIC_KEYS = Object.keys(CHANNEL_METRICS);

var mapSeries = function mapSeries(seriesObj) {
  return Object.keys(seriesObj).map(function (dateKey) {
    return [dateKey, ImmutableMap(seriesObj[dateKey])];
  });
};

var ChannelAnalytics = /*#__PURE__*/function (_Record) {
  _inherits(ChannelAnalytics, _Record);

  function ChannelAnalytics() {
    _classCallCheck(this, ChannelAnalytics);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChannelAnalytics).apply(this, arguments));
  }

  _createClass(ChannelAnalytics, [{
    key: "getBuckets",
    value: function getBuckets(series, metricNames) {
      return series.map(function (dp, key) {
        var metrics = OrderedMap(metricNames.map(function (m) {
          var agg = {
            SUM: dp.get(m)
          };
          return [m, fromJS(agg)];
        }));
        return fromJS({
          key: key,
          keyLabel: I18n.moment(key).format('ll'),
          metrics: metrics
        });
      }).filter(function (dp) {
        var hasMetrics = metricNames.every(function (m) {
          return isNumber(dp.getIn(['metrics', m, 'SUM'])) && !isNaN(dp.getIn(['metrics', m, 'SUM']));
        });
        return hasMetrics;
      }).toList();
    }
  }, {
    key: "getDataWellReportData",
    value: function getDataWellReportData(metricNames, report) {
      var total = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var currentBuckets = this.getBuckets(this.currentSeries, metricNames);
      var previousBuckets = this.getBuckets(this.previousSeries, metricNames);
      return List.of(currentBuckets, previousBuckets).map(function (buckets) {
        if (buckets.isEmpty()) {
          return fromJS({
            metrics: []
          });
        }

        var dataset = fromJS({
          dimension: {
            buckets: buckets,
            property: 'date',
            propertyLabel: 'Date'
          }
        });
        var accumulated = accumulate({
          dataset: dataset,
          dataConfig: report.get('config').set('configType', 'TIME_SERIES').set('dimensions', fromJS(['date']))
        });

        if (metricNames[0] === 'audienceTotal') {
          accumulated = dataset;
        }

        var lastDataPointMetrics = accumulated.getIn(['dimension', 'buckets']).last().get('metrics');
        var metrics;

        if (metricNames.length > 1 && total) {
          var lastDataPointTotal = lastDataPointMetrics.reduce(function (acc, dp, metricName) {
            var value = dp.get('SUM') || 0;

            if (metricName === 'audienceLost') {
              value = 0 - value;
            }

            return acc + value;
          }, 0);
          var translationKey = 'total';
          var delta = lastDataPointMetrics && lastDataPointTotal;
          metrics = OrderedMap({
            total: fromJS({
              SUM: {
                formatted: I18n.formatNumber(delta),
                label: translate("stats." + translationKey),
                raw: delta
              }
            })
          });
        } else {
          metrics = OrderedMap(metricNames.map(function (metricName) {
            var metricConfig = report.getIn(['config', 'metrics']).find(function (m) {
              return m.get('property') === metricName;
            });

            if (!metricConfig) {
              metricConfig = report.get('metrics').find(function (m) {
                return m.get('property') === metricName;
              });
            }

            metricConfig = metricConfig.set('options', List());
            var lastDataPointTotal = lastDataPointMetrics.get(metricName).get('SUM');

            if (metricName === 'videoAverageViewDurationSeconds') {
              lastDataPointTotal = lastDataPointTotal / buckets.size;
            }

            var value = lastDataPointMetrics && lastDataPointTotal;
            var formatted = I18n.formatNumber(value);

            if (metricConfig.get('type') === 'duration') {
              formatted = formatDuration(value, metricConfig.get('durationUnit'));
            }

            var agg = {
              SUM: {
                formatted: formatted,
                label: translate("stats." + metricName),
                raw: value
              }
            };
            return [metricName, fromJS(agg)];
          }));
        }

        return accumulated.merge({
          metrics: metrics
        });
      });
    }
  }, {
    key: "getHistogramReportData",
    value: function getHistogramReportData(metricNames) {
      var currentBuckets = this.getBuckets(this.currentSeries, metricNames);
      var previousBuckets = this.getBuckets(this.previousSeries, metricNames);
      return List.of(currentBuckets, previousBuckets).map(function (buckets) {
        var metrics = OrderedMap(metricNames.map(function (m) {
          var agg = {
            SUM: {
              label: translate("stats." + m)
            }
          };
          return [m, fromJS(agg)];
        }));
        buckets = buckets.map(function (b) {
          return b.updateIn(['metrics'], function (_metrics) {
            return _metrics.map(function (m, metricName) {
              var value = m.get('SUM');

              if (metricName === 'audienceLost') {
                value = 0 - value;
              }

              return fromJS({
                SUM: {
                  label: translate("stats." + metricName),
                  formatted: I18n.formatNumber(value),
                  raw: value
                }
              });
            });
          });
        });
        return fromJS({
          dimension: {
            buckets: buckets,
            property: 'sessionDate',
            propertyLabel: 'Date'
          },
          metrics: metrics,
          total: {
            formatted: I18n.formatNumber(buckets.size),
            label: 'Total',
            raw: buckets.size
          }
        });
      });
    }
  }, {
    key: "isLoaded",
    value: function isLoaded() {
      return this.fetchStatus === 'success' || this.fetchStatus === 'error';
    }
  }], [{
    key: "createFromResponse",
    value: function createFromResponse(response) {
      var currentSeries = OrderedMap(mapSeries(response.currentPeriodStats || []));
      var previousSeries = OrderedMap(mapSeries(response.previousPeriodStats || []));
      return new ChannelAnalytics({
        currentSeries: currentSeries,
        previousSeries: previousSeries,
        fetchStatus: 'success'
      });
    }
  }]);

  return ChannelAnalytics;
}(Record(DEFAULTS));

export { ChannelAnalytics as default };
export var combine = function combine(channelAnalyticsList) {
  channelAnalyticsList = channelAnalyticsList.filter(function (c) {
    return c.fetchStatus === 'success';
  });

  if (channelAnalyticsList.isEmpty()) {
    return null;
  }

  var mapDataPoint = function mapDataPoint(dateKey, seriesName) {
    return ImmutableMap(CHANNEL_METRIC_KEYS.map(function (metricName) {
      var metricConfig = CHANNEL_METRICS[metricName];
      var total = channelAnalyticsList.reduce(function (acc, ca) {
        var dataPoint = ca.get(seriesName).get(dateKey);
        return dataPoint ? acc + dataPoint.get(metricName) : acc;
      }, 0);

      if (metricConfig.metricType === 'AVG') {
        total = total / channelAnalyticsList.size;
      }

      return [metricName, total];
    }));
  };

  var combinedChannels = new ChannelAnalytics({
    previousSeries: OrderedMap(),
    currentSeries: OrderedMap(),
    fetchStatus: 'success'
  });
  var longestCurrentSeries = channelAnalyticsList.sortBy(function (ca) {
    return 0 - ca.currentSeries.size;
  }).first().currentSeries;
  var longestPreviousSeries = channelAnalyticsList.sortBy(function (ca) {
    return 0 - ca.previousSeries.size;
  }).first().previousSeries;
  combinedChannels = combinedChannels.set('currentSeries', OrderedMap(longestCurrentSeries.map(function (dp, dateKey) {
    return mapDataPoint(dateKey, 'currentSeries');
  })));
  combinedChannels = combinedChannels.set('previousSeries', OrderedMap(longestPreviousSeries.map(function (dp, dateKey) {
    return mapDataPoint(dateKey, 'previousSeries');
  })));
  return combinedChannels;
};
export var getDurationDataWellReportData = function getDurationDataWellReportData(viewsData, minutesWatchedData) {
  return viewsData.map(function (series, i) {
    // weight each day's average view duration by the number of views in order to match YT, this really didn't wanna work within ChannelAnalytics.getDataWellReportData
    var viewsSum = viewsData.getIn([i, 'metrics', 'videoViews', 'SUM', 'raw']);
    var minutesWatchedSum = minutesWatchedData.getIn([i, 'metrics', 'videoMinutesWatched', 'SUM', 'raw']);

    if (!minutesWatchedSum) {
      return fromJS({
        metrics: {
          videoAverageViewDurationSeconds: {
            SUM: {
              formatted: '-',
              raw: 0,
              label: translate('stats.videoAverageViewDurationSeconds')
            }
          }
        }
      });
    }

    var averageDuration = minutesWatchedSum * 60 / viewsSum;
    return fromJS({
      metrics: {
        videoAverageViewDurationSeconds: {
          SUM: {
            formatted: formatDuration(averageDuration),
            raw: averageDuration,
            label: translate('stats.videoAverageViewDurationSeconds')
          }
        }
      }
    });
  });
};
export var getSubscribersDeltaDataWellReportData = function getSubscribersDeltaDataWellReportData(audienceTotalData, subscribersDeltaData) {
  // hack in a previous subscriber delta that is actually based on the total gain/loss over the period,
  // so the delta of the delta matches that of the total
  var audienceTotalCount = audienceTotalData.getIn([0, 'metrics', 'audienceTotal', 'SUM', 'raw']);
  var audienceTotalCountPrevious = audienceTotalData.getIn([1, 'metrics', 'audienceTotal', 'SUM', 'raw']);
  var subscriberDeltaCurrent = subscribersDeltaData.getIn([0, 'metrics', 'total', 'SUM', 'raw']);
  var deltaRatio = audienceTotalCountPrevious / audienceTotalCount;
  return subscribersDeltaData.mergeIn([0, 'metrics', 'total', 'SUM'], {
    raw: audienceTotalCount,
    formatted: I18n.formatNumber(audienceTotalCount)
  }).mergeIn([1, 'metrics', 'total', 'SUM'], {
    raw: subscriberDeltaCurrent * deltaRatio,
    formatted: I18n.formatNumber(subscriberDeltaCurrent * deltaRatio)
  });
};