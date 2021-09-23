'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as EnrollmentEngagementEventTypes from '../constants/EnrollmentEngagementEventTypes';

var getAdditionalPropertiesByEventType = function getAdditionalPropertiesByEventType(eventType) {
  switch (eventType) {
    case EnrollmentEngagementEventTypes.CLICKED:
      return [{
        propertyName: 'hs_email_click_count',
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.headers.clicks"
        }),
        sortable: true
      }, {
        propertyName: 'hs_latest_email_clicked_date',
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.headers.latestClick"
        }),
        sortable: true,
        defaultSort: true
      }];

    case EnrollmentEngagementEventTypes.ENROLLED:
      return [{
        propertyName: 'hs_enrolled_at',
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummarySearchTableHeader.enrolledAt"
        }),
        sortable: true,
        defaultSort: true
      }];

    case EnrollmentEngagementEventTypes.OPENED:
      return [{
        propertyName: 'hs_email_open_count',
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.headers.opens"
        }),
        sortable: true
      }, {
        propertyName: 'hs_latest_email_opened_date',
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.headers.latestOpen"
        }),
        sortable: true,
        defaultSort: true
      }];

    case EnrollmentEngagementEventTypes.REPLIED:
      return [{
        propertyName: 'hs_latest_email_replied_date',
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.headers.dateReplied"
        }),
        sortable: true,
        defaultSort: true
      }];

    case EnrollmentEngagementEventTypes.SCHEDULED_MEETING:
      return [{
        propertyName: 'hs_latest_meeting_booked_date',
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.headers.scheduledMeeting"
        }),
        sortable: true,
        defaultSort: true
      }];

    case EnrollmentEngagementEventTypes.BOUNCED:
      return [{
        propertyName: 'hs_last_step_executed_at',
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.headers.emailBounced"
        }),
        sortable: true,
        defaultSort: true
      }];

    default:
      return [];
  }
};

export default getAdditionalPropertiesByEventType;