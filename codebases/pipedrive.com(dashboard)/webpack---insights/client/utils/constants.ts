import { types as insightsTypes } from '@pipedrive/insights-core';

export const INSIGHTS_BASE_URL = 'progress/insights';

export const FLAT_RESPONSE_DATA_TYPES = [
	insightsTypes.DataType.ACTIVITIES,
	insightsTypes.DataType.MAILS,
];

export enum ReportParentType {
	STATS = 'stats',
	REVENUE_FORECAST = 'revenue_forecast',
	RECURRING_REVENUE = 'recurring_revenue',
	RECURRING_REVENUE_MOVEMENT = 'revenue_movement',
	CONVERSION = 'conversion',
	DURATION = 'duration',
	PROGRESS = 'progress',
	ACTIVITY = 'activity',
	EMAIL = 'email',
}

export enum ReportEntityType {
	ACTIVITY = 'activity',
	DEAL = 'deal',
	REVENUE = 'revenue',
}

export enum UrlEntityType {
	REPORT = 'report',
	DASHBOARD = 'dashboard',
	GOAL = 'goal',
}

export const REVENUE_ENTITY_REPORTS = [
	insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
	insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
	insightsTypes.ReportType.DEALS_REVENUE_FORECAST,
];
export const ACTIVITY_ENTITY_REPORTS = [
	insightsTypes.ReportType.ACTIVITIES_STATS,
	insightsTypes.ReportType.ACTIVITIES_LIST,
	insightsTypes.ReportType.MAILS_STATS,
	insightsTypes.ReportType.MAILS_LIST,
];

export interface ReportEntity {
	type: ReportEntityType;
	name: string;
	icon: string;
	reportTypes: ReportParentType[];
}

export enum FilterTypenameType {
	SELECTED_FILTER = 'SelectedDataFilter',
	SELECTED_OPERAND = 'SelectedDataFilterOperand',
}

export const REPORTS_WITH_TITLE = [
	insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
	insightsTypes.ReportType.DEALS_DURATION,
];

export const INITIAL_DATE_PERIOD = 'year';
export const PROGRESS_DEFAULT_GROUPING = 'stageId';
export const DATE_STAGE_ENTERED = 'dealStageLogAddTime';
export const DEAL_STAGE_LOG_STAGE_ID = 'dealStageLogStageId';
export const DEAL_PRODUCTS_PRODUCT_ID = 'dealProductsProductId';
export const PROGRESS_DEFAULT_SEGMENT = 'userId';
export const NO_SEGMENT = 'none';
export const OTHER_SEGMENT = 'otherSegment';
export const STATS_DEFAULT_MEASURE_BY_FILTER =
	insightsTypes.Deals.MeasureByType.COUNT;

export const TABLE_DATA_AVERAGE = 'average';
export const TABLE_DATA_TOTAL = 'total';
export const dataTableHighlight = {
	ROWS: [TABLE_DATA_TOTAL, TABLE_DATA_AVERAGE],
	COLUMNS: [
		'sum',
		'count',
		TABLE_DATA_AVERAGE,
		'differenceBetweenGoalAndResult',
	],
};

export const RIGHT_ALIGNED_TABLE_CELLS = [
	'id',
	'undoneActivitiesCount',
	'weightedValue',
	'value',
	'monetary',
];

export const ACTIONABLE_SOURCE_TABLE_CELLS = [
	'id',
	'title',
	'subject',
	'orgId',
	'personId',
	'dealId',
];

export enum FilterType {
	DATE = 'date',
	TIME = 'time',
	DATETIME = 'datetime',
	USER = 'user',
	CURRENCY = 'currency',
	INT = 'int',
	DOUBLE = 'double',
	ENUM = 'enum',
	SET = 'set',
	VARCHAR_OPTIONS = 'varchar_options',
	PIPELINE = 'pipeline',
	STAGE = 'stage',
	STATUS = 'status',
	MONETARY = 'monetary',
	TEAM = 'team',
	ORGANIZATION = 'organization',
	PERSON = 'person',
	VALUE = 'value',
	PAYMENTS = 'payments',
	DEAL = 'deal',
	PARTICIPANTS = 'participants',
	PRODUCT = 'product',
}

export const dataKeyTypeMap = {
	date: [
		'date',
		'addTime',
		'closeTime',
		'wonTime',
		'lostTime',
		'expectedCloseDate',
		'stageChangeTime',
		'lastIncomingEmailTime',
		'lastOutgoingEmailTime',
		'lastActivityDate',
		'nextActivityDate',
		'dealStageLogAddTime',
		'paymentsDueAt',
		'dueDate',
		'dueTime',
		'linkClickedTime',
		'messageTime',
		'openTime',
		'expectedCloseDateOrWonTime',
	],
	dateTime: ['markedAsDoneTime', 'updateTime'],
	pipeline: ['pipelineId', 'pipeline'],
	team: ['team'],
	stage: ['stageId', 'stage', 'dealStageLogStageId'],
	user: ['userId', 'creatorUserId', 'user', 'writerId'],
	value: ['value', 'weightedValue'],
	set: ['multiOption'],
	enum: ['singleOption'],
	done: ['done'],
	busyFlag: ['busyFlag'],
	status: ['status'],
	label: ['label'],
	numerical: [
		'numerical',
		'activitiesCount',
		'doneActivitiesCount',
		'undoneActivitiesCount',
		'emailMessagesCount',
		'id',
		'duration',
	],
	monetary: ['monetary'],
	payments: ['paymentsPaymentType'],
	duration: ['duration'],
	product: [DEAL_PRODUCTS_PRODUCT_ID, FilterType.PRODUCT],
	person: [FilterType.PERSON, FilterType.PARTICIPANTS],
	org: [FilterType.ORGANIZATION],
	deal: [FilterType.DEAL],
};

// All payments related fields. It's used to hide all payments fields for non revenue movements report.
export const PAYMENTS_BLACK_LIST = [
	'paymentsDueAt',
	'paymentsType',
	'paymentsPaymentType',
	'paymentsAmount',
	'paymentsChangeAmount',
];

export const OPTION_TYPE_BLACK_LIST = {
	GROUP_BY: ['monetary'],
	SEGMENT_BY: ['date', 'monetary', 'datetime', 'multipleOptions'],
	MEASURE_BY: [
		'activitiesCount',
		'doneActivitiesCount',
		'emailMessagesCount',
		'probability',
		'undoneActivitiesCount',
	],
};

export const multiSelectWhitelist = {
	types: [
		FilterType.PIPELINE,
		FilterType.STAGE,
		FilterType.TEAM,
		FilterType.STATUS,
		FilterType.VARCHAR_OPTIONS,
		FilterType.CURRENCY,
		FilterType.USER,
		FilterType.SET,
		FilterType.ENUM,
		FilterType.PAYMENTS,
	],
};

export const singleSelectWhitelist = {
	types: [
		FilterType.PIPELINE,
		FilterType.STAGE,
		FilterType.TEAM,
		FilterType.STATUS,
		FilterType.VARCHAR_OPTIONS,
		FilterType.CURRENCY,
		FilterType.USER,
		FilterType.SET,
		FilterType.ENUM,
		FilterType.PAYMENTS,
	],
};

interface InputWhitelistObject {
	types: any[];
}

export const inputWhitelist: InputWhitelistObject = {
	types: [],
};

export const numericInputWhitelist = {
	types: [FilterType.VALUE, FilterType.INT, FilterType.DOUBLE],
};

export const disabledOperandsByType = [
	{ type: FilterType.DATE, fallbackValue: insightsTypes.OperandType.EQ },
];

export const dataTabTypes = {
	SOURCE_DATA: 'source-data',
	SUMMARY: 'summary',
};

export const summaryColumnTypes = {
	SUM: 'sum',
	COUNT: 'count',
	AVG: 'average',
};

// will have to change back from hard-coded if updated colors are in'@pipedrive/convention-ui-css/dist/json/colors.json'
const colors = {
	'$color-sky-hex': '#62bffc',
	'$color-lime-hex': '#77e38d',
	'$color-apricot-hex': '#ffb32b',
	'$color-salmon-hex': '#ff827b',
	'$color-orchid-hex': '#c877ce',
	'$color-steel-hex': '#8ba5af',
	'$color-turquoise-hex': '#00d3e4',
	'$color-kiwi-hex': '#a3d776',
	'$color-lemon-hex': '#ffed27',
	'$color-flamingo-hex': '#ff6ea2',
	'$color-sky2-hex': '#a3dbff',
	'$color-lime2-hex': '#8bf0a0',
	'$color-apricot2-hex': '#ffd180',
	'$color-salmon2-hex': '#ffa8a3',
	'$color-orchid2-hex': '#f6a2fc',
	'$color-steel2-hex': '#b4d6e3',
	'$color-turquoise2-hex': '#74f2fc',
	'$color-kiwi2-hex': '#c3f09c',
	'$color-lemon2-hex': '#fff79e',
	'$color-flamingo2-hex': '#ff99be',
};

export const GROUPING_COLOR = colors['$color-sky-hex'];

export const CHART_COLORS = [
	GROUPING_COLOR,
	colors['$color-apricot-hex'],
	colors['$color-orchid-hex'],
	colors['$color-steel-hex'],
	colors['$color-kiwi-hex'],
	colors['$color-lemon-hex'],
	colors['$color-flamingo-hex'],
	colors['$color-sky2-hex'],
	colors['$color-lime2-hex'],
	colors['$color-apricot2-hex'],
	colors['$color-salmon2-hex'],
	colors['$color-orchid2-hex'],
	colors['$color-steel2-hex'],
	colors['$color-turquoise2-hex'],
	colors['$color-kiwi2-hex'],
	colors['$color-lemon2-hex'],
	colors['$color-flamingo2-hex'],
];

export const CHART_FIRST_PAGE_INDEX = 0;
export const CHART_MAX_ITEMS_PER_PAGE = 12;
export const FORECAST_MAX_ITEMS_PER_PAGE = 14;
export const FUNNEL_MAX_ITEMS_PER_PAGE = 7;
export const MAX_SEGMENTATION_SIZE = 15;
export const MAX_SEGMENTATION_SIZE_DEAL_PROGRESS = 60;

export const NAME_MAX_LENGTH = 255;

export const MAX_REPORTS_IN_DASHBOARD = 25;

export const CONVERSION_SHAPE = {
	HEIGHT_FROM_X_AXIS: 32,
	HEIGTH: 24,
	BASE_WIDTH: 32,
	ARROW_WIDTH: 12,
	PADDING: {
		HORIZONTAL: 20,
		VERTICAL: 14,
	},
};

export interface DefaultUnsavedReportObject {
	name: string;
	chart_type: null;
	report_type: null;
	is_editing: boolean;
	segment_set: boolean;
	parameters: {
		filter_by: null;
		group_by: null;
		measure_by: null;
		segment_by: null;
		stats: null;
		stages: null;
		is_cumulative: null;
		__typename: string;
	};
	data: null;
	__typename: string;
}

export const DEFAULT_UNSAVED_REPORT: DefaultUnsavedReportObject = {
	name: '',
	chart_type: null,
	report_type: null,
	is_editing: false,
	segment_set: false,
	parameters: {
		filter_by: null,
		group_by: null,
		measure_by: null,
		segment_by: null,
		stats: null,
		stages: null,
		is_cumulative: null,
		__typename: 'reportreportParametersInput',
	},
	data: null,
	__typename: 'reportreportInput',
};

export const PAGINATION_SIZE = 100;

export enum CoachmarkTags {
	INSIGHTS_ONBOARDING_INTRO_DIALOG = 'insights_onboarding_intro_dialog',
	INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_COACHMARK = 'insights_onboarding_customize_report_coachmark',
	INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_VIEW_BY_COACHMARK = 'insights_onboarding_customize_report_view_by_coachmark',
	INSIGHTS_ONBOARDING_SHARING_DASHBOARD_COACHMARK = 'insights_onboarding_sharing_dashboard_coachmark',
	INSIGHTS_UPDATE_INTERNAL_SHARING_COACHMARK = 'insights_update_internal_sharing_coachmark',
	INSIGHTS_CAPPING_COACHMARK = 'insights_capping_coachmark',
}

export const insightsPaths = ['/progress/insights/', '/insights/'];

export enum ChartFilterType {
	GROUP_BY = 'groupBy',
	MEASURE_BY = 'measureBy',
	SEGMENT_BY = 'segmentBy',
	INTERVAL = 'interval',
	IS_CUMULATIVE = 'is-cumulative',
}

export enum FilterPlacementStyles {
	HORIZONTAL = 'horizontal',
	VERTICAL = 'vertical',
	HIDDEN = 'hidden',
}

export enum FilterPopoverPlacements {
	BOTTOM_END = 'bottom-end',
	BOTTOM_START = 'bottom-start',
	RIGHT_START = 'right-start',
}

export const LOGGER_FACILITY = 'insights';

export const PERMISSION_TYPES = {
	static: {
		useRevenueReport: 'use:revenue-report',
		haveMultipleDashboards: 'have:multiple-dashboards',
	},
	dynamic: {
		seeThisDashboard: 'see:this-dashboard',
		seeThisReport: 'see:this-report',
	},
};

export enum ModalType {
	DASHBOARD_CREATE = 'DASHBOARD_CREATE',
	REPORT_CREATE = 'REPORT_CREATE',
	REPORT_SAVE = 'REPORT_SAVE',
	REPORT_SAVE_AS_NEW = 'REPORT_SAVE_AS_NEW',
	DASHBOARD_CREATE_AND_ADD_REPORT = 'DASHBOARD_CREATE_AND_ADD_REPORT',
	GOAL_CREATE = 'GOAL_CREATE',
	GOAL_CREATE_DETAILS = 'GOAL_CREATE_DETAILS',
	GOAL_EDIT = 'GOAL_EDIT',
}

export const UNBLOCKED_MODAL_TYPES = [ModalType.REPORT_SAVE_AS_NEW];

export enum DialogType {
	DASHBOARD_DELETE = 'DASHBOARD_DELETE',
	REPORT_DELETE = 'REPORT_DELETE',
	REPORT_DISCARD_CHANGES = 'REPORT_DISCARD_CHANGES',
	REPORT_DISCARD = 'REPORT_DISCARD',
	REPORT_CHANGE_TYPE = 'REPORT_CHANGE_TYPE',
	GOAL_DELETE = 'GOAL_DELETE',
	GOAL_DISCARD_CHANGES = 'GOAL_DISCARD_CHANGES',
	REPORT_BULK_DELETE = 'REPORT_BULK_DELETE',
}

// Error codes sent by insights-api in errors[n].extensions.code
export const ERROR_CODES = {
	REPORT_HAS_DELETED_CUSTOM_FIELD: 'PRIVATE_INDEX_QUERY_FAILED',
	CUSTOM_FIELDS_FLAG_NOT_ENABLED: 'SHARED_INDICES_QUERY_FAILED',
	PRIVATE_INDEX_MISSING: 'PRIVATE_INDEX_MISSING',
};

export enum ActivityFieldKey {
	ID = 'id',
	SUBJECT = 'subject',
	TYPE = 'type',
	DONE = 'done',
	MARKED_AS_DONE_TIME = 'markedAsDoneTime',
	ORGANISATION = 'orgId',
	PERSON = 'personId',
	DEAL = 'dealId',
	DUE_DATE = 'dueDate',
	DUE_TIME = 'dueTime',
	DURATION = 'duration',
	NOTE = 'note',
	ADD_TIME = 'addTime',
	USER = 'userId',
	CREATOR = 'writerId',
	CREATOR_FIELD_KEY_IN_WEBAPP = 'createdByUserId',
	UPDATE_TIME = 'updateTime',
	LAST_NOTIFICATION_TIME = 'lastNotificationTime',
	LOCATION = 'location',
	BUSY_FLAG = 'busyFlag',
	PUBLIC_DESCRIPTION = 'publicDescription',
	LEAD = 'leadTitle',
	CONFERENCE_MEETING_CLIENT = 'conferenceMeetingClient',
	CONFERENCE_MEETING_URL = 'conferenceMeetingUrl',
	PIPELINE = 'pipelineId',
}

export enum EmailFieldKey {
	THREAD_ID = 'threadId',
	SUBJECT = 'subject',
}

export enum MailType {
	SENT = 'sent',
	RECEIVED = 'received',
	DRAFT = 'draft',
}

export enum MailOpenedTrackingStatus {
	OPENED = 'opened',
	NOT_OPENED = 'not_opened',
	NOT_TRACKED = 'not_tracked',
}

export enum MailLinkClickedTrackingStatus {
	CLICKED = 'clicked',
	NOT_CLICKED = 'not_clicked',
	NOT_TRACKED = 'not_tracked',
}

export enum SideMenuItemGroup {
	REPORTS = 'reports',
	GOALS = 'goals',
}

export const ACCEPTED_DROP_TARGET_ITEMS = [
	SideMenuItemGroup.REPORTS,
	SideMenuItemGroup.GOALS,
];

export const COUNT_TYPE_MEASURE_BY = ['count', 'dealProductsAmount'];

export const NEW_GOAL_ID = 'new';
