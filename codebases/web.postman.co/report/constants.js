import React from 'react';
import { IllustrationNoReport, IllustrationInternalServerError } from '@postman/aether';
export const OPEN_REPORTS_IDENTIFIER = 'reports';
export const OPEN_REPORTS_TEAM_IDENTIFIER = 'reports.team';
export const OPEN_REPORTS_API_OVERVIEW_IDENTIFIER = 'reports.apiOverviewReport';
export const OPEN_REPORTS_PRIVATE_API_IDENTIFIER = 'reports.privateApi';
export const OPEN_REPORTS_SECURITY_AUDIT_IDENTIFIER = 'reports.securityAudit';
export const OPEN_REPORTS_API_REPORT_IDENTIFIER = 'reports.apiReport';
export const OPEN_REPORTS_SUMMARY_IDENTIFIER = 'reports.summary';
export const OPEN_REPORTS_ACTIVITY_IDENTIFIER = 'reports.activity';
export const OPEN_REPORTS_RESOURCE_IDENTIFIER = 'reports.resource';
export const OPEN_REPORTS_WORKSPACES_IDENTIFIER = 'reports.workspaces';
export const OPEN_REPORTS_TEAM_WORKSPACES_IDENTIFIER = 'reports.teamWorkspaces';
export const OPEN_REPORTS_PUBLIC_WORKSPACES_IDENTIFIER = 'reports.publicWorkspaces';
export const OPEN_REPORTS_TEAM_APIS_IDENTIFIER = 'reports.teamApis';
export const OPEN_REPORTS_PUBLIC_APIS_IDENTIFIER = 'reports.publicApis';

export const EMPTY_STATE_OPTIONS = [
  'Track all your team\'s APIs in one place',
  'View average response times and sizes',
  'Measure API performance and responsiveness',
  'See failed test runs over time'
];

export const LOADING_FOOTER_TEXT = {
  short: 'Hold tight while we get your reports',
  long: 'This is taking longer than expected. Apologies.'
};

export const LOOKER_DOMAINS = {
  'beta': 'https://looker.postman-beta.co',
  'stage': 'https://looker.postman-stage.co',
  'production': 'https://looker.postman.co'
};

export const ERROR_CONFIG = {
  GENERIC: {
    errorTitle: 'Something went wrong',
    errorBody: 'There was an error while fetching report. Please try again.',
    imageName: <IllustrationInternalServerError />
  },
  NO_ACCESS: {
    errorTitle: 'We can’t seem to find this report',
    errorBody: 'Double check your link or try finding it in the left-handed navigation menu.',
    imageName: <IllustrationNoReport />
  }
};

export const REPORTING_LABELS = {
  'summaryLoad': 'summary',
  'teamOverviewLoad': 'team_overview',
  'activityLoad': 'activity',
  'resourceUsageLoad': 'resource_usage',
  'workspacesLoad': 'all_workspaces',
  'teamWorkspacesLoad': 'team_workspaces',
  'publicWorkspacesLoad': 'public_workspaces',
  'apiOverviewLoad': 'api_overview',
  'teamApisLoad': 'team_apis',
  'privateApiOverviewLoad': 'private_api_overview',
  'publicApisLoad': 'public_apis',
  'apiInfoLoad': 'api_info',
  'securityAuditLoad': 'security_audit'
};

// view ids
export const REQUEST_COUNT_API = 'REQUEST_COUNT_API';
export const REQUEST_COUNT_API_COLLECTION = 'REQUEST_COUNT_API_COLLECTION';
export const REQUEST_COUNT_API_REQUEST = 'REQUEST_COUNT_API_REQUEST';
export const AVG_RESPONSE_TIME_API = 'AVG_RESPONSE_TIME_API';
export const AVG_RESPONSE_TIME_API_COLLECTION = 'AVG_RESPONSE_TIME_API_COLLECTION';
export const AVG_RESPONSE_TIME_API_REQUEST = 'AVG_RESPONSE_TIME_API_REQUEST';
export const AVG_RESPONSE_SIZE_API = 'AVG_RESPONSE_SIZE_API';
export const AVG_RESPONSE_SIZE_API_COLLECTION = 'AVG_RESPONSE_SIZE_API_COLLECTION';
export const AVG_RESPONSE_SIZE_API_REQUEST = 'AVG_RESPONSE_SIZE_API_REQUEST';
export const TEST_FAILURES_API = 'TEST_FAILURES_API';
export const TEST_FAILURES_API_COLLECTION = 'TEST_FAILURES_API_COLLECTION';
export const TEST_FAILURES_API_REQUEST = 'TEST_FAILURES_API_REQUEST';
export const RESPONSE_CODE_API = 'RESPONSE_CODE_API';
export const RESPONSE_CODE_API_COLLECTION = 'RESPONSE_CODE_API_COLLECTION';
export const RESPONSE_CODE_API_REQUEST = 'RESPONSE_CODE_API_REQUEST';
export const TOTAL_APIS_TEAM = 'TOTAL_APIS_TEAM';
export const NEW_APIS_TEAM = 'NEW_APIS_TEAM';
export const NEW_APIS_TEAM_DETAILS = 'NEW_APIS_TEAM_DETAILS';
export const ACTIVE_APIS_TEAM = 'ACTIVE_APIS_TEAM';
export const ACTIVE_APIS_TEAM_DETAILS = 'ACTIVE_APIS_TEAM_DETAILS';
export const SIZE_TEAM = 'SIZE_TEAM';
export const SIZE_TEAM_DETAILS = 'SIZE_TEAM_DETAILS';
export const ACTIVE_WORKSPACES_TEAM = 'ACTIVE_WORKSPACES_TEAM';
export const ACTIVE_WORKSPACES_TEAM_DETAILS = 'ACTIVE_WORKSPACES_TEAM_DETAILS';
export const EMPTY_WORKSPACES_TEAM = 'EMPTY_WORKSPACES_TEAM';
export const EMPTY_WORKSPACES_TEAM_DETAILS = 'EMPTY_WORKSPACES_TEAM_DETAILS';

// view details
export const viewDetails = {
  [REQUEST_COUNT_API]: {
    title: 'Team API requests',
    fragment: 'team-usage'
  },
  [AVG_RESPONSE_SIZE_API]: {
    title: 'Average response size',
    fragment: 'avg-response-size'
  },
  [AVG_RESPONSE_TIME_API]: {
    title: 'Average response time',
    fragment: 'avg-response-time'
  },
  [TEST_FAILURES_API]: {
    title: 'Failed test runs',
    fragment: 'test-failures'
  },
  [RESPONSE_CODE_API]: {
    title: 'Response codes',
    fragment: 'response-codes'
  },
  [TOTAL_APIS_TEAM]: {
    title: 'Total no. of APIs',
    fragment: 'total-apis'
  },
  [NEW_APIS_TEAM]: {
    title: 'New APIs',
    fragment: 'new-apis'
  },
  [NEW_APIS_TEAM_DETAILS]: {
    title: 'New APIs',
    fragment: 'new-apis'
  },
  [ACTIVE_APIS_TEAM]: {
    title: 'Active APIs',
    fragment: 'active-apis'
  },
  [ACTIVE_APIS_TEAM_DETAILS]: {
    title: 'Active APIs',
    fragment: 'active-apis'
  },
  [SIZE_TEAM_DETAILS]: {
    title: 'Team size',
    fragment: 'team-size'
  },
  [SIZE_TEAM]: {
    title: 'Team size',
    fragment: 'team-size'
  },
  [ACTIVE_WORKSPACES_TEAM]: {
    title: 'Active workspaces',
    fragment: 'active-workspaces'
  },
  [ACTIVE_WORKSPACES_TEAM_DETAILS]: {
    title: 'Active workspaces',
    fragment: 'active-workspaces'
  },
  [EMPTY_WORKSPACES_TEAM]: {
    title: 'Empty workspaces',
    fragment: 'empty-workspaces'
  },
  [EMPTY_WORKSPACES_TEAM_DETAILS]: {
    title: 'Empty workspaces',
    fragment: 'empty-workspaces'
  }
};

// metrics
export const WORKSPACE_COUNT = 'workspaceCount';
export const REQUEST_COUNT = 'requestCount';
export const API_COUNT = 'apiCount';
export const RESPONSE_SIZE_AVG = 'responseSizeAvg';
export const RESPONSE_SIZE_TOTAL = 'responseSizeTotal';
export const RESPONSE_SIZE_COUNT = 'responseSizeCount';
export const RESPONSE_TIME_AVG = 'responseTimeAvg';
export const RESPONSE_TIME_TOTAL = 'responseTimeTotal';
export const RESPONSE_TIME_COUNT = 'responseTimeCount';
export const FAILED_RUN_COUNT = 'failedRunCount';
export const RESPONSE_COUNT = 'responseCount';
export const RESPONSE_CODE = 'responseCode';

// dimensions
export const TEAM = 'team';
export const API = 'api';
export const API_VERSION = 'apiVersion';
export const DATE = 'date';
export const WORKSPACE = 'workspace';
export const COLLECTION = 'collection';
export const REQUEST = 'request';

// operators
export const EQUALS = 'EQUALS';

// misc
export const NEGATIVE = 'negative';
export const INTERVAL = 'interval';
export const LAST_7_DAYS = 'last7Days';
export const LAST_30_DAYS = 'last30Days';
export const ONE_DAY = 1000 * 60 * 60 * 24;
export const ALL_COLLECTIONS = 'allCollections';
export const ALLOWED_INTERVALS = {
  [LAST_7_DAYS]: true,
  [LAST_30_DAYS]: true
};
export const INTERVALS = [{
  label: 'Last 7 days',
  value: LAST_7_DAYS
}, {
  label: 'Last 30 days',
  value: LAST_30_DAYS
}];

export const API_FILTER_VALUES = {
  ALL: 'ALL',
  PUBLIC: 'PUBLIC',
  TEAM: 'TEAM',
  CREATED: 'CREATED',
  SHARED: 'SHARED',
  WATCHED: 'WATCHED'
};

export const API_FILTER_LABELS = {
  ALL: 'All APIs',
  PUBLIC: 'Public APIs',
  TEAM: 'Team APIs',
  CREATED: 'Created by you',
  SHARED: 'Shared with you',
  WATCHED: 'Watched by you'
};

export const API_FILTERS = [{
  label: API_FILTER_LABELS.ALL,
  value: API_FILTER_VALUES.ALL
}, {
  label: API_FILTER_LABELS.PUBLIC,
  value: API_FILTER_VALUES.PUBLIC
}, {
  label: API_FILTER_LABELS.TEAM,
  value: API_FILTER_VALUES.TEAM
}, {
  label: API_FILTER_LABELS.CREATED,
  value: API_FILTER_VALUES.CREATED
}, {
  label: API_FILTER_LABELS.SHARED,
  value: API_FILTER_VALUES.SHARED
}, {
  label: API_FILTER_LABELS.WATCHED,
  value: API_FILTER_VALUES.WATCHED
}];

// Enterprise/looker report groups
export const REPORT_GROUPS = {
  summary: 'summary',
  team: 'teamDetails',
  teamActivity: 'teamActivity',
  teamResourceUsage: 'teamResourceUsage',
  workspaces: 'workspacesOverview',
  teamWorkspaces: 'teamWorkspaces',
  publicWorkspaces: 'publicWorkspaces',
  apis: 'apisOverview',
  teamApis: 'teamApis',
  privateNetworkApis: 'privateNetworkApis',
  publicApis: 'publicApis',
  individualApis: 'individualApis',
  securityAudit: 'securityAudit'
};

export const REPORT_GROUPS_MAP = {
  [REPORT_GROUPS.summary]: {
    name: REPORT_GROUPS.summary,
    displayName: 'Summary',
    path: 'reports/summary'
  },
  [REPORT_GROUPS.team]: {
    name: REPORT_GROUPS.team,
    displayName: 'Team details',
    path: 'reports/team'
  },
  [REPORT_GROUPS.teamActivity]: {
    name: REPORT_GROUPS.teamActivity,
    displayName: 'Team activity',
    path: 'reports/activity'
  },
  [REPORT_GROUPS.teamResourceUsage]: {
    name: REPORT_GROUPS.teamResourceUsage,
    displayName: 'Resource usage',
    path: 'reports/resource-usage'
  },
  [REPORT_GROUPS.workspaces]: {
    name: REPORT_GROUPS.workspaces,
    displayName: 'All workspaces',
    path: 'reports/all-workspaces'
  },
  [REPORT_GROUPS.teamWorkspaces]: {
    name: REPORT_GROUPS.teamWorkspaces,
    displayName: 'Team workspaces',
    path: 'reports/team-workspaces'
  },
  [REPORT_GROUPS.publicWorkspaces]: {
    name: REPORT_GROUPS.publicWorkspaces,
    displayName: 'Public workspaces',
    path: 'reports/public-workspaces'
  },
  [REPORT_GROUPS.apis]: {
    name: REPORT_GROUPS.apis,
    displayName: 'All APIs',
    path: 'reports/all-apis'
  },
  [REPORT_GROUPS.teamApis]: {
    name: REPORT_GROUPS.teamApis,
    displayName: 'Team APIs',
    path: 'reports/team-apis'
  },
  [REPORT_GROUPS.privateNetworkApis]: {
    name: REPORT_GROUPS.privateNetworkApis,
    displayName: 'Private Network APIs',
    path: 'reports/private-network-apis'
  },
  [REPORT_GROUPS.publicApis]: {
    name: REPORT_GROUPS.publicApis,
    displayName: 'Public APIs',
    path: 'reports/public-apis'
  },
  [REPORT_GROUPS.securityAudit]: {
    name: REPORT_GROUPS.securityAudit,
    displayName: 'Security Audit',
    path: 'reports/security-audit'
  },
  [REPORT_GROUPS.individualApis]: {
    name: REPORT_GROUPS.individualApis,
    displayName: 'API Report'
  }
};

export const SECTION_LOAD_ERROR = 'Couldn\'t load the full report';
export const PAGE_LOAD_ERROR = 'Couldn\'t load your report';
export const LOAD_ERROR_SUBTITLE = 'Just a faulty wire. Try reloading it.';

// Feature flags to trigger newer version of reports
export const REDESIGN_V3_FLAG = {
  flag: 'reporting-redesigned-reports-client-enabled-temp'
};

export const V3_OPTIONS = [
  {
    label: 'Reports',
    value: 'reports',
    options: [
      {
        label: 'Summary',
        value: 'reports/summary'
      },
      {
        label: 'Team details',
        value: 'reports/team',
        options: [
          {
            label: 'Team activity',
            value: 'reports/activity'
          },
          {
            label: 'Resource usage',
            value: 'reports/resource-usage'
          }
        ],
        sublist: true
      },
      {
        label: 'All Workspaces',
        value: 'reports/all-workspaces',
        options: [
          {
            label: 'Team Workspaces',
            value: 'reports/team-workspaces'
          },
          {
            label: 'Public Workspaces',
            value: 'reports/public-workspaces'
          }
        ],
        sublist: true
      },
      {
        label: 'All APIs',
        value: 'reports/all-apis',
        options: [
          {
            label: 'Team APIs',
            value: 'reports/team-apis'
          },
          {
            label: 'Private Network APIs',
            value: 'reports/private-network-apis'
          },
          {
            label: 'Public APIs',
            value: 'reports/public-apis'
          },
          {
            label: 'View Report by API',
            expandedLabel: 'Select API to see report',
            value: 'apis',
            collapsed: true
          }
        ],
        sublist: true
      },
      {
        label: 'Security Audit',
        value: 'reports/security-audit'
      }
    ]
  }
];

export const LEGACY_OPTIONS = [
  {
    label: 'Reports',
    value: 'overview',
    options: [
      {
        label: 'Team Activity',
        value: 'reports/team'
      },
      {
        label: 'All APIs',
        value: 'reports/all-apis'
      },
      {
        label: 'Private Network APIs',
        value: 'reports/private-network-apis'
      },
      {
        label: 'Security Audit',
        value: 'reports/security-audit'
      }
    ]
  },
  {
    label: 'View reports by API',
    expandedLabel: 'All APIs',
    value: 'apis',
    options: null,
    collapsed: true
  }
];

// all the defined and accepted chart types
export const CHART_TYPE = {
  doughnut: 'doughnut',
  area: 'area',
  bar: 'bar',
  line: 'line',
  horizontalBar: 'horizontal-bar',
  progressBar: 'progress-bar', // stacked bars
  verticalProgressBar: 'vertical-progress-bar' // vertically stacked bars
};

// data set colors for all kind of data to be plotted on charts
export const DATASETS_COLOURS = [
  '#FF6C37',
  '#926CC2',
  '#0CA4B6',
  '#F15EB0',
  '#3E92F2',
  '#FFCF3F',
  '#886000'
];

// This maps importance of a chart to the weightage to decide the space on the page-layout
export const IMP_WEIGHTAGE_MAP = {
  1: 2,
  2: 3,
  3: 4,
  4: 6
};

export const scaledAxisTicks = (val) => {
  if (val === 100000000000) return '100B';
  if (val === 10000000000) return '10B';
  if (val === 1000000000) return '1B';
  if (val === 100000000) return '100M';
  if (val === 10000000) return '10M';
  if (val === 1000000) return '1M';
  if (val === 100000) return '100K';
  if (val === 10000) return '10K';
  if (val === 1000) return '1K';
  if (val === 500) return '500';
  if (val === 100) return '100';
  if (val === 50) return '50';
  if (val === 10) return '10';
  if (val === 0) return '0';
  return null;
};
