'use es6';

import { fromJS } from 'immutable';
import { Promise } from '../../lib/promise';
import { FUNNEL, PIPELINE } from '../../constants/configTypes';
import { CONTACTS, DEALS } from '../../constants/dataTypes';
import { SUM, PERCENTILES } from '../../constants/metricTypes';
/**
 * Funnel conversion property
 *
 * @constant {string}
 * @private
 */

var STEPWISE_CONVERSION = 'funnel.stepwiseConversion';
var CUMULATIVE_CONVERSION = 'funnel.cumulativeConversion';
/**
 * Whether to run configure step
 *
 * @param {ReportConfiguration} config Report configuration
 * @returns {boolean} Whether to run configure step
 * @private
 */

var shouldConfigure = function shouldConfigure(config) {
  return [FUNNEL, PIPELINE].includes(config.get('configType')) && [CONTACTS, DEALS].includes(config.get('dataType'));
};
/**
 * Add conversion metrics
 *
 * @param {ReportConfiguration} config Report configuration
 * @returns {ReportConfiguration} Updated report configuration
 */


export var configure = function configure(config) {
  if (!shouldConfigure(config)) {
    return Promise.resolve(config);
  }

  var countMetric = {
    property: 'count',
    metricTypes: [SUM]
  };
  return config.set('metrics', fromJS(config.get('configType') === FUNNEL ? [countMetric, {
    property: STEPWISE_CONVERSION,
    metricTypes: [PERCENTILES]
  }, {
    property: CUMULATIVE_CONVERSION,
    metricTypes: [PERCENTILES]
  }] : [countMetric]));
};