'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import invariant from '../../../lib/invariant';
export var QUOTA_DATE_PROPERTY = 'hs_period_start_date';
export var QUOTA_OWNER_PROPERTY = 'hubspot_owner_id';
export var QUOTA_PERIOD_PROPERTY = 'hs_period';
export var QUOTA_PIPELINE_PROPERTY = 'hs_pipeline_id';
export var QUOTA_TYPE_PROPERTY = 'hs_quota_type';
export var QUOTA_VALUE_PROPERTY = 'hs_value';
export var QUOTA_NAMESPACE = 'QUOTAS';
export var getQuotaMetrics = function getQuotaMetrics(config) {
  return config.get('metrics').filter(function (metric) {
    return metric.get('property', '').startsWith(QUOTA_NAMESPACE + ".");
  });
};
export var parseQuotaMetric = function parseQuotaMetric(quotaMetric) {
  // QUOTAS.{PERIOD}.{TYPE}.{?PIPELINE}
  var quotaProperty = quotaMetric.get('property');
  var bits = quotaProperty.split('.');
  invariant(bits.length === 3, 'Invalid quota metric property');

  var _bits = _slicedToArray(bits, 3),
      quotaPeriod = _bits[1],
      quotaType = _bits[2];

  return {
    quotaProperty: quotaProperty,
    quotaPeriod: quotaPeriod,
    quotaType: quotaType
  };
};