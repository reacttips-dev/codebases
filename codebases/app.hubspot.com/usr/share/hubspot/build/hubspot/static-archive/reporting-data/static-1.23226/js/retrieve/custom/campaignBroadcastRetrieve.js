'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { List, Map as ImmutableMap } from 'immutable';
import { assetTypeToFilterProp } from '../../retrieve/unified/options/assetTypes';
import { value as valueExtractor } from '../../config/filters/extractors';
import { ANALYTICS_CAMPAIGNS } from '../../constants/dataTypes';
import { Promise } from '../../lib/promise';
import * as http from '../../request/http';
import { retrieve as legacyRetrieve } from '../legacyRetrieve';

var getBroadcasts = function getBroadcasts(dataConfig) {
  var campaignIdExtractor = valueExtractor('campaignId', null);
  var campaignId = campaignIdExtractor(dataConfig);
  return http.get({
    url: 'broadcast/v1/broadcasts',
    query: {
      campaignGuid: campaignId,
      property: ['broadcastGuid', 'content']
    }
  });
};

function buildEmptyMetrics(dataConfig) {
  return ImmutableMap(dataConfig.get('metrics').map(function (metric) {
    return [metric.get('property'), ImmutableMap(metric.get('metricTypes').map(function (metricType) {
      return [metricType, 0];
    }).toJS())];
  }).toJS());
}

var addBroadcasts = function addBroadcasts(dataset, broadcasts, dataConfig) {
  return broadcasts.reduce(function (memo, broadcast) {
    var broadcastGuid = broadcast.get('broadcastGuid');

    if (!memo.getIn(['dimension', 'buckets'], List()).find(function (value) {
      return value.get('key') === broadcastGuid;
    })) {
      return memo.updateIn(['dimension', 'buckets'], List(), function (buckets) {
        return buckets.push(ImmutableMap({
          key: broadcastGuid,
          metrics: buildEmptyMetrics(dataConfig)
        }));
      });
    } else {
      return memo;
    }
  }, dataset);
};

export default {
  match: function match(dataConfig) {
    return dataConfig.get('dataType') === ANALYTICS_CAMPAIGNS && dataConfig.get('dimensions').size === 1 && dataConfig.get('dimensions').first() === assetTypeToFilterProp('broadcast');
  },
  retrieve: function retrieve(dataConfig, debug, runtimeOptions) {
    var promises = [legacyRetrieve(dataConfig, debug, runtimeOptions), getBroadcasts(dataConfig)];
    return Promise.all(promises).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          _ref2$ = _ref2[0],
          dataset = _ref2$.dataset,
          response = _ref2$.response,
          broadcasts = _ref2[1];

      return {
        dataConfig: dataConfig,
        dataset: addBroadcasts(dataset, broadcasts, dataConfig),
        response: response
      };
    });
  }
};