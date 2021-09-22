import { types } from '@pipedrive/insights-core';

import { SidemenuReport } from '../types/apollo-query-types';

export enum AssigneeType {
	PERSON = 'person',
	TEAM = 'team',
	COMPANY = 'company',
}

export interface Assignee {
	type: AssigneeType;
	id: number;
}

export interface Duration {
	start: string;
	end: string | undefined;
}

export enum Interval {
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	QUARTERLY = 'quarterly',
	YEARLY = 'yearly',
}

export enum TrackingMetric {
	VALUE = 'sum',
	COUNT = 'quantity',
}

export enum GoalReportType {
	ACTIVITIES_ADDED = 'activity',
	ACTIVITIES_COMPLETED = 'activity',
	DEALS_PROGRESSED = 'progress',
	DEALS_STARTED = 'stats',
	DEALS_WON = 'stats',
	REVENUE_FORECAST = 'revenue_forecast',
}

export type GoalType =
	| 'activities_added'
	| 'activities_completed'
	| 'deals_progressed'
	| 'deals_started'
	| 'deals_won'
	| 'revenue_forecast';

export interface GoalBase {
	id?: string;
	assignee?: Assignee;
	duration?: Duration;
	expected_outcome?: {
		target: number;
		tracking_metric?: TrackingMetric;
		currency_id?: number;
	};
	interval?: Interval;
	owner_id?: number;
	type?: {
		name?: GoalType;
		params?: {
			pipeline_id?: number;
			stage_id?: number;
			activity_type_id?: number;
		};
	};
	is_active?: boolean;
	report_ids?: string[];
}
export interface Goal extends GoalBase {
	name?: string;
}

export interface SidemenuGoal extends Goal {
	is_past?: boolean;
	report?: SidemenuReport;
}

export interface GoalApi extends Goal {
	title: string;
}

export type GoalDataType = types.DataType.DEALS | types.DataType.ACTIVITIES;

export enum GoalDataKey {
	ASSIGNEE = 'assignee',
	TYPE = 'type',
	PIPELINE = 'pipeline',
	INTERVAL = 'interval',
	DURATION = 'duration',
	EXPECTED_OUTCOME = 'expectedOutcome',
}

export interface GoalValidationError {
	duration?: string;
	target?: string;
}

export interface GoalCardItem {
	icon: string;
	label: string | number;
	tooltipText: string;
}

export interface GoalCardData {
	[key: string]: GoalCardItem;
}

export enum GoalError {
	RESTRICTED = 'restricted',
	USER_QUICK_FILTER_MISMATCH = 'userQuickFilterMismatch',
	PERIOD_QUICK_FILTER_MISMATCH = 'periodQuickFilterMismatch',
}
