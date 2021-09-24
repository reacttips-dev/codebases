'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import { fetchReports } from 'SequencesUI/api/CRMSearchApi';
import getReportsQuery from 'SequencesUI/util/overview/getReportsQuery';
import { ALLEnrollmentEngagementEventTypes } from 'SequencesUI/constants/EnrollmentEngagementEventTypes';
var CONTACTS = 'CONTACTS';
export function useReportingData(filterGroups) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      reportingData = _useState2[0],
      setReportingData = _useState2[1];

  useEffect(function () {
    fetchReports(getReportsQuery(filterGroups)).then(function (res) {
      var _setReportingData;

      var getCount = function getCount(property) {
        return res.metrics[property].count;
      };

      setReportingData((_setReportingData = {}, _defineProperty(_setReportingData, ALLEnrollmentEngagementEventTypes.ENROLLED, res.count), _defineProperty(_setReportingData, ALLEnrollmentEngagementEventTypes.BOUNCED, getCount('hs_email_bounce_count')), _defineProperty(_setReportingData, ALLEnrollmentEngagementEventTypes.REPLIED, getCount('hs_email_reply_count')), _defineProperty(_setReportingData, ALLEnrollmentEngagementEventTypes.OPENED, getCount('hs_email_open_count')), _defineProperty(_setReportingData, ALLEnrollmentEngagementEventTypes.SCHEDULED_MEETING, getCount('hs_meeting_booked_count')), _defineProperty(_setReportingData, ALLEnrollmentEngagementEventTypes.CLICKED, getCount('hs_email_click_count')), _defineProperty(_setReportingData, ALLEnrollmentEngagementEventTypes.UNSUBSCRIBED, getCount('hs_unsubscribe_count')), _defineProperty(_setReportingData, CONTACTS, res.metrics.hs_contact_id.distinctApprox), _setReportingData));
    });
  }, [filterGroups]);
  return reportingData;
}