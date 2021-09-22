import { types } from '@pipedrive/insights-core';

export enum ModalView {
	REPORTS = 'reports',
	DASHBOARDS = 'dashboards',
	GOALS = 'goals',
}

export enum SharedAddModalView {
	REPORTS = 'reports',
	GOALS = 'goals',
}

export enum SubEntity {
	STATS = 'stats',
	REVENUE_FORECAST = 'revenue_forecast',
	RECURRING_REVENUE = 'recurring_revenue',
	RECURRING_REVENUE_MOVEMENT = 'revenue_movement',
	CONVERSION = 'conversion',
	DURATION = 'duration',
	PROGRESS = 'progress',
	ACTIVITY = 'activity',
	EMAIL = 'email',
	STARTED = 'started',
	PROGRESSED = 'progressed',
	WON = 'won',
	ADDED = 'added',
	COMPLETED = 'completed',
}

export enum Entity {
	ACTIVITY = 'activity',
	DEAL = 'deal',
	REVENUE = 'revenue',
}

export interface SubEntityType {
	title: string;
	subtitle: string;
	dataType: types.DataType;
	isDisabled?: boolean;
	plan?: string;
}

export interface ReportActivitySubTypes {
	[SubEntity.ACTIVITY]: SubEntityType;
	[SubEntity.EMAIL]: SubEntityType;
}

export interface ReportDealSubTypes {
	[SubEntity.STATS]: SubEntityType;
	[SubEntity.CONVERSION]: SubEntityType;
	[SubEntity.DURATION]: SubEntityType;
	[SubEntity.PROGRESS]: SubEntityType;
}

export interface ReportRevenueSubTypes {
	[SubEntity.REVENUE_FORECAST]: SubEntityType;
	[SubEntity.RECURRING_REVENUE]: SubEntityType;
}

export interface GoalActivitySubTypes {
	[SubEntity.ADDED]: SubEntityType;
	[SubEntity.COMPLETED]: SubEntityType;
}

export interface GoalRevenueSubTypes {
	[SubEntity.REVENUE_FORECAST]: SubEntityType;
}

export interface GoalDealSubTypes {
	[SubEntity.STARTED]: SubEntityType;
	[SubEntity.PROGRESSED]: SubEntityType;
	[SubEntity.WON]: SubEntityType;
}

export interface ModalReportActivityEntityType {
	entityType: Entity;
	title: string;
	icon: string;
	subTypes: ReportActivitySubTypes;
}

export interface ModalReportDealEntityType {
	entityType: Entity;
	title: string;
	icon: string;
	subTypes: ReportDealSubTypes;
}

export interface ModalReportRevenueEntityType {
	entityType: Entity;
	title: string;
	icon: string;
	subTypes: ReportRevenueSubTypes;
}

export interface ModalGoalActivityEntityType {
	entityType: Entity;
	title: string;
	icon: string;
	subTypes: GoalActivitySubTypes;
}

export interface ModalGoalDealEntityType {
	entityType: Entity;
	title: string;
	icon: string;
	subTypes: GoalDealSubTypes;
}

export interface ModalReportEntitiesType {
	[Entity.ACTIVITY]: ModalReportActivityEntityType;
	[Entity.DEAL]: ModalReportDealEntityType;
	[Entity.REVENUE]: ModalReportRevenueEntityType;
}

export interface ModalGoalEntitiesType {
	[Entity.ACTIVITY]: ModalGoalActivityEntityType;
	[Entity.DEAL]: ModalGoalDealEntityType;
}
