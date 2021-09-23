'use es6';

import { List } from 'immutable';
import { SequenceSearchSort, SequenceSearchQuery, SequenceSearchFilter } from 'SequencesUI/records/SequenceSearchQuery';
var PAGE_SIZE = 25;

var cilckEventQuery = function cilckEventQuery(filterGroups) {
  return new SequenceSearchQuery({
    count: PAGE_SIZE,
    filterGroups: filterGroups.map(function (group) {
      return group.update('filters', function (filters) {
        return filters.push(new SequenceSearchFilter({
          property: 'hs_email_click_count',
          operator: 'HAS_PROPERTY'
        }));
      });
    }),
    sorts: List([new SequenceSearchSort({
      property: 'hs_latest_email_clicked_date',
      order: 'DESC'
    }), new SequenceSearchSort({
      property: 'hs_enrollment_id',
      order: 'DESC'
    })])
  });
};

var enrolledEventQuery = function enrolledEventQuery(filterGroups) {
  return new SequenceSearchQuery({
    count: PAGE_SIZE,
    filterGroups: filterGroups,
    sorts: List([new SequenceSearchSort({
      property: 'hs_enrolled_at',
      order: 'DESC'
    }), new SequenceSearchSort({
      property: 'hs_enrollment_id',
      order: 'DESC'
    })])
  });
};

var openedEventQuery = function openedEventQuery(filterGroups) {
  return new SequenceSearchQuery({
    count: PAGE_SIZE,
    filterGroups: filterGroups.map(function (group) {
      return group.update('filters', function (filters) {
        return filters.push(new SequenceSearchFilter({
          property: 'hs_email_open_count',
          operator: 'HAS_PROPERTY'
        }));
      });
    }),
    sorts: List([new SequenceSearchSort({
      property: 'hs_latest_email_opened_date',
      order: 'DESC'
    }), new SequenceSearchSort({
      property: 'hs_enrollment_id',
      order: 'DESC'
    })])
  });
};

var repliedEventQuery = function repliedEventQuery(filterGroups) {
  return new SequenceSearchQuery({
    count: PAGE_SIZE,
    filterGroups: filterGroups.map(function (group) {
      return group.update('filters', function (filters) {
        return filters.push(new SequenceSearchFilter({
          property: 'hs_email_reply_count',
          operator: 'HAS_PROPERTY'
        }));
      });
    }),
    sorts: List([new SequenceSearchSort({
      property: 'hs_latest_email_replied_date',
      order: 'DESC'
    }), new SequenceSearchSort({
      property: 'hs_enrollment_id',
      order: 'DESC'
    })])
  });
};

var scheduledMeetingEventQuery = function scheduledMeetingEventQuery(filterGroups) {
  return new SequenceSearchQuery({
    count: PAGE_SIZE,
    filterGroups: filterGroups.map(function (group) {
      return group.update('filters', function (filters) {
        return filters.push(new SequenceSearchFilter({
          property: 'hs_meeting_booked_count',
          operator: 'HAS_PROPERTY'
        }));
      });
    }),
    sorts: List([new SequenceSearchSort({
      property: 'hs_latest_meeting_booked_date',
      order: 'DESC'
    }), new SequenceSearchSort({
      property: 'hs_enrollment_id',
      order: 'DESC'
    })])
  });
};

var bouncedEventQuery = function bouncedEventQuery(filterGroups) {
  return new SequenceSearchQuery({
    count: PAGE_SIZE,
    filterGroups: filterGroups.map(function (group) {
      return group.update('filters', function (filters) {
        return filters.push(new SequenceSearchFilter({
          property: 'hs_email_bounce_count',
          operator: 'HAS_PROPERTY'
        }));
      });
    }),
    sorts: List([new SequenceSearchSort({
      property: 'hs_latest_email_bounce_date',
      order: 'DESC'
    }), new SequenceSearchSort({
      property: 'hs_enrollment_id',
      order: 'DESC'
    })])
  });
};

export var eventTypeToQuery = {
  CLICKED: cilckEventQuery,
  ENROLLED: enrolledEventQuery,
  OPENED: openedEventQuery,
  REPLIED: repliedEventQuery,
  SCHEDULED_MEETING: scheduledMeetingEventQuery,
  BOUNCED: bouncedEventQuery
};