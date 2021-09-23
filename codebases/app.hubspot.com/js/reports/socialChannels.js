'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import * as ConfigTypes from 'reporting-data/constants/configTypes';
import * as MetricTypes from 'reporting-data/constants/metricTypes';
import * as ChartTypes from 'reporting-data/constants/chartTypes';
import { BAR_CHART_DISPLAY_PARAMS, BASE_DISPLAY_PARAMS, CHANNEL_TYPE_SORT, SIMPLE_DATE_FORMAT } from '../lib/constants';
import { RANGE_TYPES } from '../lib/dateUtils';
export var ANALYTICS_INTERACTIONS_METRICS = ['likes', 'dislikes', 'comments', 'shares'];
export var ANALYTICS_SUBSCRIBER_METRICS = ['audienceGained', 'audienceLost'];
var DATA_TYPE = 'SOCIAL_CHANNELS';
export var CHANNEL_METRICS = {
  comments: {
    metricType: 'SUM'
  },
  dislikes: {
    metricType: 'SUM'
  },
  likes: {
    metricType: 'SUM'
  },
  shares: {
    metricType: 'SUM'
  },
  audienceGained: {
    metricType: 'SUM',
    type: 'number'
  },
  audienceLost: {
    metricType: 'SUM',
    type: 'number'
  },
  audienceTotal: {
    metricType: 'SUM',
    type: 'number'
  },
  videoAverageViewDurationSeconds: {
    metricType: 'AVG',
    type: 'duration',
    durationUnit: 'seconds'
  },
  videoAverageViewPercentage: {
    metricType: 'AVG'
  },
  videoMinutesWatched: {
    metricType: 'SUM',
    type: 'duration',
    durationUnit: 'minutes'
  },
  videoViews: {
    metricType: 'SUM',
    type: 'number'
  }
};
Object.keys(CHANNEL_METRICS).forEach(function (m) {
  CHANNEL_METRICS[m].name = m;
});
export default (function (dataFilter) {
  if (dataFilter.getSelectedChannelKeys().isEmpty()) {
    return ImmutableMap();
  }

  var dateRange = dataFilter.getDateRangeForChannelStats(); // youtube's 2 day delay on analytics data requires some hacks and custom handling here, still working to make it function like overview as much as possible

  if (dateRange.rangeType === RANGE_TYPES.LAST_THIRTY_DAYS) {
    dateRange.rangeType = RANGE_TYPES.CUSTOM;
  }

  if (dateRange.startDate && dateRange.endDate) {
    dateRange.startDate = dateRange.startDate.format(SIMPLE_DATE_FORMAT);
    dateRange.endDate = dateRange.endDate.format(SIMPLE_DATE_FORMAT);
  }

  var SELECTED_CHANNELS_FILTER = fromJS({
    property: 'channelKeys',
    values: dataFilter.getSelectedChannelKeys().toArray()
  });
  var channelAnalyticsViewsTimeSeries = fromJS({
    name: 'Channel analytics over time',
    chartType: ChartTypes.AREA,
    displayParams: Object.assign({}, BASE_DISPLAY_PARAMS, {
      showDelta: false,
      hideComparisonSeries: true,
      stacked: true
    }),
    config: {
      configType: 'TIME_SERIES',
      dataType: DATA_TYPE,
      dimensions: ['sessionDate'],
      frequency: 'DAY',
      // seems like this is fighting more than helping
      compare: 'PRIOR_PERIOD',
      metrics: [{
        property: CHANNEL_METRICS.videoViews.name,
        metricTypes: [MetricTypes.SUM]
      }],
      filters: {
        dateRange: {
          property: 'sessionDate',
          value: dateRange
        },
        custom: [SELECTED_CHANNELS_FILTER]
      }
    }
  });
  var channelAnalyticsAverageTimeWatchedTimeSeries = channelAnalyticsViewsTimeSeries.setIn(['config', 'metrics', 0, 'property'], CHANNEL_METRICS.videoAverageViewDurationSeconds.name);
  var channelAnalyticsInteractionsTimeSeries = channelAnalyticsViewsTimeSeries.setIn(['config', 'metrics'], fromJS(ANALYTICS_INTERACTIONS_METRICS.map(function (property) {
    return {
      property: property,
      metricTypes: ['SUM']
    };
  })));
  var channelAnalyticsSubscribersTimeSeries = channelAnalyticsViewsTimeSeries.setIn(['config', 'metrics'], fromJS(ANALYTICS_SUBSCRIBER_METRICS.map(function (property) {
    return {
      property: property,
      metricTypes: ['SUM']
    };
  })));
  var channelAnalyticsViewsDataWell = fromJS({
    name: 'Channel analytics views data well',
    chartType: ChartTypes.DATA_WELL,
    config: {
      configType: ConfigTypes.AGGREGATION,
      dataType: DATA_TYPE,
      compare: 'PRIOR_PERIOD',
      metrics: fromJS([{
        property: CHANNEL_METRICS.videoViews.name,
        metricTypes: [MetricTypes.SUM]
      }]),
      filters: {
        dateRange: {
          property: 'sessionDate',
          value: dateRange
        },
        custom: [SELECTED_CHANNELS_FILTER]
      }
    }
  });
  var channelAnalyticsLikesDataWell = fromJS({
    name: 'Channel analytics likes data well',
    chartType: ChartTypes.DATA_WELL,
    config: {
      configType: ConfigTypes.AGGREGATION,
      dataType: DATA_TYPE,
      compare: 'PRIOR_PERIOD',
      metrics: fromJS([{
        property: CHANNEL_METRICS.likes.name,
        metricTypes: [MetricTypes.SUM]
      }]),
      filters: {
        dateRange: {
          property: 'sessionDate',
          value: dateRange
        },
        custom: [SELECTED_CHANNELS_FILTER]
      }
    }
  });
  var channelAnalyticsDislikesDataWell = fromJS({
    name: 'Channel analytics dislikes data well',
    chartType: ChartTypes.DATA_WELL,
    config: {
      configType: ConfigTypes.AGGREGATION,
      dataType: DATA_TYPE,
      compare: 'PRIOR_PERIOD',
      metrics: fromJS([{
        property: CHANNEL_METRICS.dislikes.name,
        metricTypes: [MetricTypes.SUM]
      }]),
      filters: {
        dateRange: {
          property: 'sessionDate',
          value: dateRange
        },
        custom: [SELECTED_CHANNELS_FILTER]
      }
    }
  });
  var channelAnalyticsCommentsDataWell = fromJS({
    name: 'Channel analytics comments data well',
    chartType: ChartTypes.DATA_WELL,
    config: {
      configType: ConfigTypes.AGGREGATION,
      dataType: DATA_TYPE,
      compare: 'PRIOR_PERIOD',
      metrics: fromJS([{
        property: CHANNEL_METRICS.comments.name,
        metricTypes: [MetricTypes.SUM]
      }]),
      filters: {
        dateRange: {
          property: 'sessionDate',
          value: dateRange
        },
        custom: [SELECTED_CHANNELS_FILTER]
      }
    }
  });
  var channelAnalyticsSharesDataWell = fromJS({
    name: 'Channel analytics shares data well',
    chartType: ChartTypes.DATA_WELL,
    config: {
      configType: ConfigTypes.AGGREGATION,
      dataType: DATA_TYPE,
      compare: 'PRIOR_PERIOD',
      metrics: fromJS([{
        property: CHANNEL_METRICS.shares.name,
        metricTypes: [MetricTypes.SUM]
      }]),
      filters: {
        dateRange: {
          property: 'sessionDate',
          value: dateRange
        },
        custom: [SELECTED_CHANNELS_FILTER]
      }
    }
  });
  var channelAnalyticsAverageTimeWatchedDataWell = channelAnalyticsViewsDataWell.mergeIn(['config'], {
    metrics: fromJS([// todo: should this be AVG?
    {
      property: 'videoAverageViewDurationSeconds',
      metricTypes: [MetricTypes.SUM],
      durationUnit: 'seconds',
      type: 'duration'
    }])
  });
  var channelAnalyticsMinutesWatchedTimeSeries = channelAnalyticsViewsTimeSeries.setIn(['config', 'metrics', 0], fromJS({
    property: CHANNEL_METRICS.videoMinutesWatched.name,
    metricTypes: [MetricTypes.SUM],
    durationUnit: 'minutes'
  }));
  var channelAnalyticsMinutesWatchedDataWell = channelAnalyticsViewsDataWell.mergeIn(['config'], {
    metrics: fromJS([{
      property: CHANNEL_METRICS.videoMinutesWatched.name,
      metricTypes: [MetricTypes.SUM],
      type: 'duration',
      durationUnit: 'minutes'
    }])
  });
  var channelAnalyticsInteractionsDataWell = channelAnalyticsViewsDataWell.mergeIn(['config'], {
    metrics: channelAnalyticsInteractionsTimeSeries.getIn(['config', 'metrics'])
  });
  var channelAnalyticsInteractionsTotalDataWell = channelAnalyticsViewsDataWell.mergeIn(['config'], {
    metrics: fromJS([{
      property: 'total',
      metricTypes: [MetricTypes.SUM]
    }])
  });
  var channelAnalyticsAudienceTotalDataWell = channelAnalyticsViewsDataWell.mergeIn(['config'], {
    metrics: fromJS([{
      property: CHANNEL_METRICS.audienceTotal.name,
      metricTypes: [MetricTypes.SUM]
    }])
  }).set('displayParams', fromJS({
    render: {
      header: function header() {
        return I18n.text('srui.chart.subscribers.title');
      }
    }
  }));
  var channelAnalyticsSubscribersDeltaDataWell = channelAnalyticsViewsDataWell.mergeIn(['config'], {
    metrics: fromJS([{
      property: 'total',
      metricTypes: [MetricTypes.SUM]
    }])
  });
  var channelAudienceByNetwork = fromJS({
    name: I18n.text('srui.chart.channelAudienceByNetwork.dashboardTitle'),
    chartType: 'COLUMN',
    config: {
      dataType: DATA_TYPE,
      configType: 'AGGREGATION',
      dimensions: ['breakdown'],
      filters: {
        dateRange: {
          property: 'sessionDate',
          value: dateRange
        },
        custom: [{
          property: 'channelKeys',
          values: dataFilter.getSelectedChannelKeys().toArray()
        }]
      },
      metrics: [{
        property: 'audienceTotal',
        metricTypes: ['SUM']
      }],
      sort: CHANNEL_TYPE_SORT
    },
    displayParams: Object.assign({}, BAR_CHART_DISPLAY_PARAMS, {
      showDelta: true
    })
  });

  if (dataFilter.compareToPriorPeriod) {
    channelAudienceByNetwork = channelAudienceByNetwork.setIn(['config', 'compare'], 'PRIOR_PERIOD');
  }

  return ImmutableMap({
    channelAnalyticsViewsTimeSeries: channelAnalyticsViewsTimeSeries,
    channelAnalyticsViewsDataWell: channelAnalyticsViewsDataWell,
    channelAnalyticsLikesDataWell: channelAnalyticsLikesDataWell,
    channelAnalyticsDislikesDataWell: channelAnalyticsDislikesDataWell,
    channelAnalyticsCommentsDataWell: channelAnalyticsCommentsDataWell,
    channelAnalyticsSharesDataWell: channelAnalyticsSharesDataWell,
    channelAnalyticsAverageTimeWatchedTimeSeries: channelAnalyticsAverageTimeWatchedTimeSeries,
    channelAnalyticsAverageTimeWatchedDataWell: channelAnalyticsAverageTimeWatchedDataWell,
    channelAnalyticsMinutesWatchedTimeSeries: channelAnalyticsMinutesWatchedTimeSeries,
    channelAnalyticsMinutesWatchedDataWell: channelAnalyticsMinutesWatchedDataWell,
    channelAnalyticsInteractionsTimeSeries: channelAnalyticsInteractionsTimeSeries,
    channelAnalyticsInteractionsDataWell: channelAnalyticsInteractionsDataWell,
    channelAnalyticsInteractionsTotalDataWell: channelAnalyticsInteractionsTotalDataWell,
    channelAnalyticsSubscribersTimeSeries: channelAnalyticsSubscribersTimeSeries,
    channelAnalyticsAudienceTotalDataWell: channelAnalyticsAudienceTotalDataWell,
    channelAnalyticsSubscribersDeltaDataWell: channelAnalyticsSubscribersDeltaDataWell,
    channelAudienceByNetwork: channelAudienceByNetwork
  });
});