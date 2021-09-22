import {
	ReportType,
	Deals,
	Filter,
	DataType,
} from '@pipedrive/insights-core/lib/types';
import { helpers } from '@pipedrive/insights-core';
import { get } from 'lodash';

import { FLAT_RESPONSE_DATA_TYPES } from './constants';
import { omitDeep } from './reportObjectHelpers';

const QueryReportTypeField = Deals.QueryReportTypeField;

export type QueryPathReportTypeComponent = {
	[key in ReportType]?: Deals.QueryReportTypeField;
};

export const QueryPathReportTypeComponents: QueryPathReportTypeComponent = {
	[ReportType.DEALS_LIST]: QueryReportTypeField.LIST,
	[ReportType.DEALS_CONVERSION_OVERALL]:
		QueryReportTypeField.CONVERSION_OVERALL,
	[ReportType.DEALS_FUNNEL_CONVERSION]:
		QueryReportTypeField.FUNNEL_CONVERSION,
	[ReportType.DEALS_RECURRING_REVENUE]: QueryReportTypeField.REVENUE_MOVEMENT,
	[ReportType.DEALS_RECURRING_REVENUE_MOVEMENT]:
		QueryReportTypeField.REVENUE_MOVEMENT,
	[ReportType.DEALS_DURATION]: QueryReportTypeField.DURATION,
	[ReportType.DEALS_STATS]: QueryReportTypeField.STATS,
	[ReportType.DEALS_REVENUE_FORECAST]: QueryReportTypeField.REVENUE_FORECAST,
	[ReportType.DEALS_PROGRESS]: QueryReportTypeField.PROGRESS,
	[ReportType.ACTIVITIES_STATS]: QueryReportTypeField.ACTIVITY,
};

const getQueryPathReportTypeComponent = (reportType: ReportType) => {
	const queryComponent = QueryPathReportTypeComponents[reportType];

	if (!queryComponent) {
		throw new Error(
			`Could not find query path component based on report type: ${reportType}`,
		);
	}

	return queryComponent;
};

const isReportWithFlatResponse = (dataType: DataType) => {
	return FLAT_RESPONSE_DATA_TYPES.includes(dataType);
};

const getQueryPathComponents = ({
	filterByFilters,
	groupByFilters,
	dataType,
	reportType,
}: {
	filterByFilters: string[] | null;
	groupByFilters: string[] | null;
	dataType: DataType;
	reportType: ReportType;
}) => {
	const pathComponents: string[] = [];

	if (isReportWithFlatResponse(dataType)) {
		const reportTypeComponent = QueryPathReportTypeComponents[reportType];

		if (reportTypeComponent) {
			pathComponents.push(reportTypeComponent);
		}

		pathComponents.push('stats');

		return pathComponents;
	}

	if (filterByFilters && filterByFilters.length > 0) {
		filterByFilters.forEach((filter) => {
			pathComponents.push(Deals.QueryFilterField.FILTER);
			pathComponents.push(filter);
		});
	}

	if (groupByFilters && groupByFilters.length > 0) {
		groupByFilters.forEach((group) => {
			pathComponents.push(Deals.QueryFilterField.GROUP_BY);
			pathComponents.push(group);
		});
	}

	pathComponents.push(getQueryPathReportTypeComponent(reportType));

	return pathComponents;
};

const getQueryPathString = (pathComponents: string[]) =>
	pathComponents.join('.');

export const getQueryPath = ({
	filterByFilters,
	groupByFilters,
	dataType,
	reportType,
	isListView = false,
}: {
	filterByFilters: string[] | null;
	groupByFilters: string[] | null;
	dataType: DataType;
	reportType: ReportType;
	isListView?: boolean;
}) => {
	const queryFilters = [...filterByFilters];

	const backgroundFilterType =
		helpers.getBackgroundFilterType(reportType)?.filter;

	if (backgroundFilterType && !queryFilters.includes(backgroundFilterType)) {
		queryFilters.push(backgroundFilterType);
	}

	const pathComponents = getQueryPathComponents({
		filterByFilters: queryFilters,
		groupByFilters,
		dataType,
		reportType: isListView ? ReportType.DEALS_LIST : reportType,
	});

	return getQueryPathString(pathComponents);
};

export const getQueryListPath = ({
	filterByFilter,
	dataType,
	groupByFilters = [],
	reportType,
}: {
	filterByFilter: Filter[];
	dataType: DataType;
	reportType: ReportType;
	groupByFilters?: string[];
}) => {
	if (isReportWithFlatResponse(dataType)) {
		return 'list';
	}

	return getQueryPath({
		filterByFilters: filterByFilter.map((filter: any) => filter.filter),
		groupByFilters,
		reportType,
		dataType,
		isListView: true,
	});
};

export const getColumns = ({
	isWidget,
	reportColumns,
	reportId,
	getCachedSourceDataTable,
}: {
	isWidget?: boolean;
	reportColumns: string[];
	reportId: string;
	getCachedSourceDataTable: any;
}) => {
	return isWidget
		? reportColumns
		: getCachedSourceDataTable(reportId).columns || reportColumns;
};

export const removeTypenames = (item: any) => {
	return omitDeep(item, '__typename');
};

export const getQueryObject = (path: string, response: any) => {
	const queryObject = get(response, path);

	return queryObject || [];
};

export const getSourceData = (queryListPath: string, response: any) => {
	return removeTypenames(getQueryObject(queryListPath, response));
};
