import { types as insightsTypes } from '@pipedrive/insights-core';
import { Filter } from '@pipedrive/insights-core/lib/types';

import { ReportParentType } from '../utils/constants';
import { UnsavedReport } from './apollo-local-types';
import { SidemenuGoal } from './goals';

export interface DealField {
	dbName: string;
	uiName: string;
	fieldType: string;
	isCustomField: boolean;
	isNestedObjectField: boolean;
	filterType: string | null;
	groupByType: string | null;
	originalName: string;
	isMeasurable: boolean;
	__typename: string;
}

export interface GroupByField {
	name: string;
	__typename?: string;
}

export interface Field {
	name: string;
}

export interface MeasureByField {
	name: string;
	__typename?: string;
}

export interface DealsFilterByField {
	name: string;
	description: string;
	args: {
		name: string;
		type: {
			name: string;
			inputFields: {
				name: string;
				defaultValue: any;
				type: {
					inputFields: string | null;
				};
			}[];
		};
	}[];
}

export interface FilterByField {
	name: string;
	type: {
		name: string;
		inputFields: {
			name: string;
		}[];
	};
}

export interface GetReportSelectOptionsResponse {
	groupBy: { fields: GroupByField[] };
	measureBy: { enumValues: MeasureByField[] };
	filters: {
		fields: DealsFilterByField[];
	};
	fields: {
		fields: Field[];
	};
}

export interface DashboardReport {
	id: string;
	position: number[];
	__typename?: string;
}

export enum SharingOptionType {
	USER = 'user',
	TEAM = 'team',
	EVERYONE = 'everyone',
}

export interface SharingOption {
	id: number;
	type: SharingOptionType;
	can_edit: boolean;
}

export interface QuickFilter {
	user_id?: number;
	period: string | null;
	user: string | null;
}

export interface Dashboard {
	id: string;
	user_id: number;
	name: string;
	type: string;
	sidemenu_position: number;
	reports: DashboardReport[];
	quick_filters: QuickFilter[];
	shared_with: SharingOption[];
}

export interface Report<P = ReportParameters> {
	id: string;
	user_id: number;
	name: string;
	type: string;
	data_type: insightsTypes.DataType;
	columns: string[];
	sidemenu_position: number | null;
	is_goals_report?: boolean | null;
	is_new: boolean;
	contains_custom_fields: boolean;
	contains_inactive_custom_fields: boolean;
	parameters: P;
	shared_with: SharingOption[];
	chart_type?: insightsTypes.ChartType | null;
	report_type?: insightsTypes.ReportType;
	unsavedReport?: Partial<UnsavedReport>;
}

export interface ReportParameters {
	filter_by: any;
	group_by: any;
	measure_by: string;
	segment_by: string;
	stats?: string;
	stages?: string | null;
	is_cumulative?: boolean | null;
	__typename?: string;
}

export interface GetPublicDashboardSettingsResponse {
	currentUserSettings: {
		dashboards: Dashboard[];
		reports: Report[];
	};
}

export interface SidemenuDashboard {
	id: string;
	user_id: number;
	name: string;
	type: string;
	sidemenu_position: number;
	reports: { id: string; position: number[] }[];
	shared_with: { id: number }[];
}

export interface SidemenuReport {
	id: string;
	user_id: number;
	name: string;
	data_type: string;
	report_type: string;
	sidemenu_position: number | null;
	is_new: boolean;
	contains_custom_fields: boolean;
	contains_inactive_custom_fields: boolean;
	is_goals_report: boolean;
	shared_with: { id: number }[];
}

export interface SidemenuSettings {
	dashboards: SidemenuDashboard[];
	reports: SidemenuReport[];
	goals?: SidemenuGoal[];
}

export interface GetSidemenuSettingsResponse {
	sidebarSettings: {
		dashboards: SidemenuDashboard[];
		reports: SidemenuReport[];
		__typename: string;
	};
}

export enum SelectedItemType {
	REPORTS = 'reports',
	DASHBOARDS = 'dashboards',
	GOALS = 'goals',
}

export interface SelectedItem {
	id: string;
	type: SelectedItemType | string;
}

export interface GetSelectedItemResponse {
	selectedItem: SelectedItem;
}

export interface DefaultReport {
	chart_type: string;
	columns: string[];
	parameters: {
		filter_by: string;
		group_by: string;
		measure_by: string;
		segment_by: string;
		stats: string;
		stages: string | null;
		is_cumulative: boolean | null;
	};
}

export interface ReportSettingsSubtype {
	isAvailable: boolean;
	subtype: insightsTypes.ReportType | any;
	defaultReport: DefaultReport;
}

export interface ReportSettingsType {
	dataType: insightsTypes.DataType;
	isAvailable: boolean;
	name?: string;
	type: ReportParentType;
	defaultType: insightsTypes.ReportType;
	subtypes?: ReportSettingsSubtype[];
}

export interface GetReportTypesResponse {
	commonSettings: {
		reportTypes: ReportSettingsType[];
		reportsLimit: number;
	};
}

export interface QuickFilters {
	period: Filter;
	user: Filter;
}

export interface TrackingParams {
	source: string;
	entryPoint: string;
}

export interface RelatedObject {
	id: number;
	name?: string;
	title?: string;
}

export interface RelatedObjects {
	organizations: RelatedObject[];
	deals: RelatedObject[];
	persons: RelatedObject[];
	products: RelatedObject[];
}
