'use es6';

import { SEQUENCE_ENROLLMENT } from 'SequencesUI/constants/CRMSearchConstants';
export default (function (filterGroups) {
  return {
    objectTypeId: SEQUENCE_ENROLLMENT,
    filterGroups: filterGroups,
    metrics: [{
      property: 'hs_email_open_count',
      metricTypes: ['COUNT']
    }, {
      property: 'hs_meeting_booked_count',
      metricTypes: ['COUNT']
    }, {
      property: 'hs_email_click_count',
      metricTypes: ['COUNT']
    }, {
      property: 'hs_email_reply_count',
      metricTypes: ['COUNT']
    }, {
      property: 'hs_email_bounce_count',
      metricTypes: ['COUNT']
    }, {
      property: 'hs_contact_id',
      metricTypes: ['DISTINCT_APPROX']
    }, {
      property: 'hs_unsubscribe_count',
      metricTypes: ['COUNT']
    }]
  };
});