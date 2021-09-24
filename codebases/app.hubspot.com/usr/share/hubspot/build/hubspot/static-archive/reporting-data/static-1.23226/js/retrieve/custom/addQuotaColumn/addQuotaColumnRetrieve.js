'use es6';

import { QUOTAS } from '../../../constants/dataTypes';
import { mergeDatasets } from '../../../dataset/mergeDatasets';
import { orderMetrics } from '../../../dataset/orderMetrics';
import { retrieve as baseRetrieve } from '../../baseRetrieve';
import { getQuotaData } from './getQuotaData';
import { getQuotaMetrics } from '../quotas/shared';
var QUOTA_NAMESPACE = 'QUOTAS';
export default {
  match: function match(dataConfig) {
    return dataConfig.get('dataType') !== QUOTAS && getQuotaMetrics(dataConfig).count() > 0;
  },
  retrieve: function retrieve(dataConfig, debug, runtimeOptions) {
    var primaryConfig = dataConfig.update('metrics', function (metrics) {
      return metrics.filterNot(function (metric) {
        return metric.get('property', '').startsWith(QUOTA_NAMESPACE + ".");
      });
    });
    return baseRetrieve(primaryConfig, debug, runtimeOptions).then(function (_ref) {
      var dataset = _ref.dataset,
          response = _ref.response;
      var quotaMetrics = getQuotaMetrics(dataConfig);
      return Promise.all(quotaMetrics.map(function (quotaMetric) {
        return getQuotaData({
          dataConfig: dataConfig,
          primaryConfig: primaryConfig,
          dataset: dataset,
          quotaMetric: quotaMetric
        });
      })).then(function (results) {
        return {
          dataConfig: dataConfig,
          dataset: orderMetrics(dataConfig, mergeDatasets(results.reduce(function (combinedDataset, quotaDataset) {
            return mergeDatasets(combinedDataset, quotaDataset);
          }), dataset)),
          response: response
        };
      });
    });
  }
};