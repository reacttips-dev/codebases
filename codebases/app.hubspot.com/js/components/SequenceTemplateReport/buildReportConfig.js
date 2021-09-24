'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS } from 'immutable';
export default function buildReportConfig(sequenceId, filters) {
  return fromJS({
    config: {
      configType: 'AGGREGATION',
      dataType: 'CRM_OBJECT',
      objectTypeId: '0-79',
      dimensions: ['hs_template_id', 'hs_step_order'],
      metrics: [{
        property: 'hs_email_sent_count',
        metricTypes: ['SUM']
      }, {
        property: 'hs_email_open_count',
        metricTypes: ['COUNT']
      }, {
        property: 'hs_email_click_count',
        metricTypes: ['COUNT']
      }, {
        property: 'hs_email_reply_count',
        metricTypes: ['COUNT']
      }, {
        property: 'hs_meeting_booked_count',
        metricTypes: ['COUNT']
      }],
      filters: {
        custom: [].concat(_toConsumableArray(filters.toJS()), [{
          property: 'hs_template_id',
          operator: 'HAS_PROPERTY'
        }])
      },
      sort: [{
        property: 'hs_sequence_step_order',
        order: 'ASC'
      }, {
        property: 'hs_email_sent_count',
        order: 'DESC'
      }],
      limit: 100
    }
  });
}