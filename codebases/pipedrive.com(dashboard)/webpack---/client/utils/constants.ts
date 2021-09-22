export enum dragTypes {
	CARD = 'CARD',
	EDIT_HEADER = 'EDIT_HEADER',
}

export enum ActivityStatusTypes {
	OVERDUE = 'OVERDUE',
	TODAY = 'TODAY',
	PLANNED = 'PLANNED',
	NONE = 'NONE',
}

export enum DealTileSizes {
	SMALL = 'SMALL',
	EXTRA_SMALL = 'EXTRA_SMALL',
	REGULAR = 'REGULAR',
}

export enum EditModes {
	OFF = 'OFF',
	EDIT = 'EDIT',
	CREATE = 'CREATE',
}

export enum EditPathStrings {
	OFF = '',
	EDIT = 'edit',
	CREATE = 'add',
}

export enum EntryPoints {
	EDIT = 'edit',
	DROPMENU_EDIT = 'dropmenu_edit',
	DROPMENU_FOOTER_EDIT = 'dropmenu_footer_edit',
}

export enum ViewTypes {
	PIPELINE = 'pipeline',
	FORECAST = 'forecast',
}

export enum PeriodChangeTypes {
	NEXT_MORE = 'jump_forward',
	PREVIOUS_MORE = 'jump_back',
	RESET = 'today',
	NEXT = 'next',
	PREVIOUS = 'previous',
}

export const DEALS_TO_LOAD = 90;
export const DEALS_TO_ADD = 30;

export const EDIT_STAGE_MIN_WIDTH = 256;

export enum CoachmarkTags {
	PIPELINE_NO_DEALS = 'emnt_activityLoop1.1_emptyPipelineAddDeal',
	PIPELINE_NO_ACTIVITIES = 'pipeline_no_activities',
	ACTIVITY_LOOP_DEAL_WON_LOST_OR_DELETED = 'emnt_activityLoop1.1_dealWonLostOrDeleted',
	ACTIVITY_LOOP_SINGLE_DEAL_ACTIVITY = 'emnt_activityLoop1.1_singleDealActivityIcon',
}

export enum FlowCoachmarkTypes {
	EDIT_PIPELINE = 'closedeals_pipeline_customize',
	ADD_NEW_STAGE = 'closedeals_pipeline_addstage',
	SAVE_STAGE = 'closedeals_pipeline_savestage',
	ADD_DEAL = 'closedeals_pipeline_adddeal',
	SAVE_DEAL_MODAL = 'closedeals_pipeline_filldeal',
	DRAG_AND_DROP = 'closedeals_pipeline_advancedeal',
	DEAL_DETAILS = 'closedeals_deal_customfieldsinfo',
}

export const RELEVANT_DEAL_FIELDS = [
	'id',
	'user_id',
	'stage_id',
	'pipeline_id',
	'org_id',
	'org_name',
	'person_name',
	'person_id',
	'status',
	'next_activity_date',
	'next_activity_time',
	'next_activity_subject',
	'activities_count',
	'currency',
	'value',
	'weighted_value',
	'title',
	'rotten_time',
	'label',
];

export const RELEVANT_FORECAST_DEAL_FIELDS = [
	'id',
	'user_id',
	'pipeline_id',
	'org_id',
	'org_name',
	'person_name',
	'person_id',
	'status',
	'next_activity_date',
	'next_activity_time',
	'next_activity_subject',
	'activities_count',
	'currency',
	'value',
	'weighted_value',
	'title',
	'rotten_time',
	'label',
	'won_time',
	'expected_close_date',
	'add_time',
];

export const VIEWER_ROUTE = '/pipeline-viewer';

export const STAGE_CHANGE_TIME_THROTTLE_IN_SECONDS = 3;

export const UNLISTED_DEALS_LIST_PANEL_OFFSET = 24;
