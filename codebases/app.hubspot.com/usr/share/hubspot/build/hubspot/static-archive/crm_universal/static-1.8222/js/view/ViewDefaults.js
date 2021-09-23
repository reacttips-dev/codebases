'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ViewDefaults;

import { CONTACT, COMPANY, DEAL, TASK, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import { DEFAULT, HIDDEN } from 'customer-data-objects/view/ViewTypes';
var DEFAULT_TASK_STATUS_VALUES = ['NOT_STARTED', 'IN_PROGRESS', 'WAITING', 'DEFERRED'];
var TASK_COLUMNS = [{
  name: 'metadata.subject'
}, {
  name: 'metadata.taskType'
}, {
  name: 'metadata.priority'
}, {
  name: 'relatesTo'
}, {
  name: 'engagement.timestamp'
}];
var ViewDefaults = (_ViewDefaults = {}, _defineProperty(_ViewDefaults, CONTACT, [{
  id: 'my',
  type: DEFAULT,
  translationKey: 'ViewDefaults.myContactsFilter',
  columns: [{
    name: 'name',
    label: 'Name'
  }, {
    name: 'email'
  }, {
    name: 'phone'
  }, {
    name: 'hs_lead_status'
  }, {
    name: 'createdate'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'IN',
    property: 'hubspot_owner_id',
    values: ['__hs__ME']
  }]
}, {
  id: 'unassigned',
  type: DEFAULT,
  translationKey: 'ViewDefaults.unassignedContactsFilter',
  columns: [{
    name: 'name',
    label: 'Name'
  }, {
    name: 'email'
  }, {
    name: 'phone'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'hs_lead_status'
  }, {
    name: 'createdate'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'NOT_HAS_PROPERTY',
    property: 'hubspot_owner_id'
  }]
}, {
  id: 'all',
  type: DEFAULT,
  translationKey: 'ViewDefaults.allContactsFilter',
  columns: [{
    name: 'name',
    label: 'Name'
  }, {
    name: 'email'
  }, {
    name: 'phone'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'associatedcompanyid'
  }, {
    name: 'notes_last_updated'
  }, {
    name: 'hs_lead_status'
  }, {
    name: 'createdate'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  }
}, {
  id: 'uncontacted',
  type: DEFAULT,
  translationKey: 'ViewDefaults.myUncontactedFilter',
  columns: [{
    name: 'name',
    label: 'Name'
  }, {
    name: 'email'
  }, {
    name: 'phone'
  }, {
    name: 'hs_lead_status'
  }, {
    name: 'createdate'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'NOT_HAS_PROPERTY',
    property: 'notes_last_contacted'
  }, {
    operator: 'IN',
    property: 'hubspot_owner_id',
    values: ['__hs__ME']
  }]
}, {
  id: 'recently_assigned',
  type: DEFAULT,
  translationKey: 'ViewDefaults.recentlyAssignedContacts',
  columns: [{
    name: 'name',
    label: 'Name'
  }, {
    name: 'email'
  }, {
    name: 'phone'
  }, {
    name: 'hs_lead_status'
  }, {
    name: 'createdate'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'IN',
    property: 'hubspot_owner_id',
    values: ['__hs__ME']
  }, {
    operator: 'ROLLING_DATE_RANGE',
    property: 'hubspot_owner_assigneddate',
    inclusive: true,
    timeUnitCount: 1,
    timeUnit: 'MONTH',
    value: 'MONTH;1;true;false'
  }]
}, {
  id: 'needs_follow_up',
  type: DEFAULT,
  translationKey: 'ViewDefaults.needsFollowUp',
  columns: [{
    name: 'name',
    label: 'Name'
  }, {
    name: 'email'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'phone'
  }, {
    name: 'hs_lead_status'
  }, {
    name: 'createdate'
  }, {
    name: 'hs_sales_email_last_opened',
    type: 'datetime'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'ROLLING_DATE_RANGE',
    property: 'hs_sales_email_last_opened',
    inclusive: false,
    timeUnit: 'WEEK',
    timeUnitCount: 1,
    value: 'WEEK;1;false'
  }, {
    operator: 'NOT_HAS_PROPERTY',
    property: 'hs_sales_email_last_replied',
    dateTimeFormat: 'DATE'
  }]
}, {
  id: 'needs_action',
  type: DEFAULT,
  translationKey: 'ViewDefaults.needsAction',
  columns: [{
    name: 'name',
    label: 'Name'
  }, {
    name: 'email'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'phone'
  }, {
    name: 'hs_lead_status'
  }, {
    name: 'createdate'
  }, {
    name: 'notes_next_activity_date',
    type: 'datetime'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'HAS_PROPERTY',
    property: 'notes_last_updated',
    dateTimeFormat: 'DATE'
  }, {
    operator: 'NOT_HAS_PROPERTY',
    property: 'notes_next_activity_date',
    dateTimeFormat: 'DATE'
  }]
}]), _defineProperty(_ViewDefaults, COMPANY, [{
  id: 'my',
  type: DEFAULT,
  translationKey: 'ViewDefaults.myCompaniesFilter',
  columns: [{
    name: 'name'
  }, {
    name: 'createdate'
  }, {
    name: 'phone'
  }, {
    name: 'notes_last_updated'
  }, {
    name: 'city'
  }, {
    name: 'country'
  }, {
    name: 'industry'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'IN',
    property: 'hubspot_owner_id',
    values: ['__hs__ME']
  }]
}, {
  id: 'all',
  type: DEFAULT,
  translationKey: 'ViewDefaults.allCompaniesFilter',
  columns: [{
    name: 'name'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'createdate'
  }, {
    name: 'notes_last_updated'
  }, {
    name: 'phone'
  }, {
    name: 'city'
  }, {
    name: 'country'
  }, {
    name: 'industry'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  }
}]), _defineProperty(_ViewDefaults, DEAL, [{
  id: 'my',
  type: DEFAULT,
  translationKey: 'ViewDefaults.myDealsFilter',
  columns: [{
    name: 'dealname'
  }, {
    name: 'dealstage'
  }, {
    name: 'closedate'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'amount'
  }, {
    name: 'relatesTo',
    label: 'Relates to'
  }],
  state: {
    sortKey: 'closedate',
    order: 1
  },
  filters: [{
    operator: 'IN',
    property: 'hubspot_owner_id',
    values: ['__hs__ME']
  }]
}, {
  id: 'my_month',
  type: DEFAULT,
  translationKey: 'ViewDefaults.newDealsInMonth',
  columns: [{
    name: 'dealname'
  }, {
    name: 'dealstage'
  }, {
    name: 'closedate'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'amount'
  }, {
    name: 'relatesTo',
    label: 'Relates to'
  }],
  state: {
    sortKey: 'closedate',
    order: 1
  },
  filters: [{
    operator: 'IN',
    property: 'hubspot_owner_id',
    values: ['__hs__ME']
  }, {
    operator: 'ROLLING_DATE_RANGE',
    property: 'createdate',
    inclusive: true,
    timeUnitCount: 1,
    timeUnit: 'MONTH',
    value: 'MONTH;1;true;false'
  }]
}, {
  id: 'closed_month',
  type: DEFAULT,
  translationKey: 'ViewDefaults.wonDealsInMonth',
  columns: [{
    name: 'dealname'
  }, {
    name: 'dealstage'
  }, {
    name: 'closedate'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'amount'
  }, {
    name: 'relatesTo',
    label: 'Relates to'
  }],
  state: {
    sortKey: 'closedate',
    order: 1
  },
  filters: [{
    operator: 'IN',
    property: 'hubspot_owner_id',
    values: ['__hs__ME']
  }, {
    operator: 'ROLLING_DATE_RANGE',
    property: 'closedate',
    inclusive: true,
    timeUnitCount: 1,
    timeUnit: 'MONTH',
    value: 'MONTH;1;true;false'
  }, {
    operator: 'IN',
    property: 'dealstage',
    values: ['__hs__CLOSEDWON']
  }]
}, {
  id: 'all',
  type: DEFAULT,
  translationKey: 'ViewDefaults.allDealsFilter',
  columns: [{
    name: 'dealname'
  }, {
    name: 'dealstage'
  }, {
    name: 'closedate'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'amount'
  }, {
    name: 'relatesTo',
    label: 'Relates to'
  }],
  state: {
    sortKey: 'closedate',
    order: 1
  }
}]), _defineProperty(_ViewDefaults, TASK, [{
  id: 'my',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.myTasksView',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'engagement.ownerId',
    values: ['__hs__ME']
  }, {
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'all',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.allTasksView',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'due_today',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.dueTodayView',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }, {
    inclusive: true,
    operator: 'ROLLING_DATE_RANGE',
    property: 'engagement.timestamp',
    timeUnit: 'DAY',
    timeUnitCount: 1,
    value: 'DAY;1;true'
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'due_this_week',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.dueThisWeekView',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }, {
    inclusive: true,
    operator: 'ROLLING_DATE_RANGE',
    property: 'engagement.timestamp',
    timeUnit: 'WEEK',
    timeUnitCount: 1,
    value: 'WEEK;1;true'
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'overdue',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.overdueView',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }, {
    operator: 'LT',
    property: 'engagement.timestamp',
    value: '__hs__NOW',
    default: true
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'calls',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.calls',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }, {
    operator: 'EQ',
    value: 'CALL',
    property: 'task.taskType'
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'emails',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.emails',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }, {
    operator: 'EQ',
    value: 'EMAIL',
    property: 'task.taskType'
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'todos',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.todos',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }, {
    operator: 'EQ',
    value: 'TODO',
    property: 'task.taskType'
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'completed',
  type: DEFAULT,
  translationKey: 'ViewDefaults.tasks.completedView',
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: ['COMPLETED']
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}, {
  id: 'queue',
  type: HIDDEN,
  columns: TASK_COLUMNS,
  filters: [{
    operator: 'IN',
    property: 'task.status',
    values: DEFAULT_TASK_STATUS_VALUES
  }],
  state: {
    sortKey: 'engagement.timestamp',
    order: -1
  }
}]), _defineProperty(_ViewDefaults, TICKET, [{
  id: 'all',
  type: DEFAULT,
  translationKey: 'ViewDefaults.allTicketsFilter',
  columns: [{
    name: 'subject'
  }, {
    name: 'hs_pipeline'
  }, {
    name: 'hs_pipeline_stage'
  }, {
    name: 'createdate'
  }, {
    name: 'hs_ticket_priority'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'source_type'
  }, {
    name: 'hs_lastactivitydate'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  }
}, {
  id: 'my',
  type: DEFAULT,
  translationKey: 'ViewDefaults.myTicketsFilter',
  columns: [{
    name: 'subject'
  }, {
    name: 'hs_pipeline'
  }, {
    name: 'hs_pipeline_stage'
  }, {
    name: 'createdate'
  }, {
    name: 'hs_ticket_priority'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'source_type'
  }, {
    name: 'hs_lastactivitydate'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'IN',
    property: 'hubspot_owner_id',
    values: ['__hs__ME']
  }, {
    operator: 'NOT_IN',
    property: 'hs_pipeline_stage',
    values: ['__hs__TICKET_CLOSED']
  }]
}, {
  id: 'unassigned',
  type: DEFAULT,
  translationKey: 'ViewDefaults.unassignedTicketsFilter',
  columns: [{
    name: 'subject'
  }, {
    name: 'status'
  }, {
    name: 'createdate'
  }, {
    name: 'hs_ticket_priority'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'last_engagement_date'
  }, {
    name: 'hs_lastmodifieddate'
  }, {
    name: 'source_type'
  }, {
    name: 'time_to_close'
  }],
  state: {
    sortKey: 'createdate',
    order: 1
  },
  filters: [{
    operator: 'NOT_HAS_PROPERTY',
    property: 'hubspot_owner_id'
  }]
}]), _defineProperty(_ViewDefaults, VISIT, [{
  id: 'all',
  type: DEFAULT,
  translationKey: 'ViewDefaults.allVisitsFilter',
  columns: [{
    name: 'name'
  }, {
    name: 'domain'
  }, {
    name: 'numPageViews'
  }, {
    name: 'numVids'
  }, {
    name: 'lastTimestamp'
  }],
  state: {
    sortKey: 'lastTimestamp',
    order: 1
  },
  filters: [{
    operator: 'EQ',
    property: 'isp',
    value: 'false'
  }]
}, {
  id: 'favorites',
  type: DEFAULT,
  translationKey: 'ViewDefaults.favoriteVisitsFilter',
  columns: [{
    name: 'name'
  }, {
    name: 'domain'
  }, {
    name: 'numPageViews'
  }, {
    name: 'numVids'
  }, {
    name: 'lastTimestamp'
  }],
  filters: [{
    operator: 'EQ',
    property: 'favoriteUserList',
    value: '__hs__ID'
  }, {
    operator: 'EQ',
    property: 'isp',
    value: 'false'
  }]
}]), _ViewDefaults);
export default ViewDefaults;