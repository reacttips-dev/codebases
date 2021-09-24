'use es6';

import { fromJS } from 'immutable';
import prefix from '../../lib/prefix';
var translate = prefix('reporting-data.properties.quotas');
export default (function () {
  return fromJS({
    'QUOTAS.MONTHLY.AVERAGE_NPS': {
      name: 'QUOTAS.MONTHLY.AVERAGE_NPS',
      label: translate('AVERAGE_NPS.MONTHLY'),
      type: 'number'
    },
    'QUOTAS.MONTHLY.AVERAGE_RESOLUTION_TIME': {
      name: 'QUOTAS.MONTHLY.AVERAGE_RESOLUTION_TIME',
      label: translate('AVERAGE_RESOLUTION_TIME.MONTHLY'),
      type: 'duration'
    },
    'QUOTAS.MONTHLY.AVERAGE_RESPONSE_TIME': {
      name: 'QUOTAS.MONTHLY.AVERAGE_RESPONSE_TIME',
      label: translate('AVERAGE_RESPONSE_TIME.MONTHLY'),
      type: 'duration'
    },
    'QUOTAS.MONTHLY.CALLS_MADE': {
      name: 'QUOTAS.MONTHLY.CALLS_MADE',
      label: translate('CALLS_MADE.MONTHLY'),
      type: 'number'
    },
    'QUOTAS.MONTHLY.DEALS_CREATED': {
      name: 'QUOTAS.MONTHLY.DEALS_CREATED',
      label: translate('DEALS_CREATED.MONTHLY'),
      type: 'number'
    },
    'QUOTAS.MONTHLY.MEETINGS_BOOKED': {
      name: 'QUOTAS.MONTHLY.MEETINGS_BOOKED',
      label: translate('MEETINGS_BOOKED.MONTHLY'),
      type: 'number'
    },
    'QUOTAS.MONTHLY.REVENUE': {
      name: 'QUOTAS.MONTHLY.REVENUE',
      label: translate('REVENUE.MONTHLY'),
      type: 'currency'
    },
    'QUOTAS.MONTHLY.TICKETS_CLOSED': {
      name: 'QUOTAS.MONTHLY.TICKETS_CLOSED',
      label: translate('TICKETS_CLOSED.MONTHLY'),
      type: 'number'
    }
  });
});