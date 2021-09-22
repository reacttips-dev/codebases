import React from 'react';
import memoize from 'memoizee';
import { Column, Row } from 'react-table';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';
import { Tag } from '@pipedrive/convention-ui-react';

import { InsightsApiClient } from '../../api/apollo/insightsApiClient';
import localState from '../../utils/localState/index';
import { getDataFieldValue } from '../../utils/labels';
import {
	PAGINATION_SIZE,
	CHART_FIRST_PAGE_INDEX,
	ACTIONABLE_SOURCE_TABLE_CELLS,
} from '../../utils/constants';
import { getMultiSelectFilterValue } from '../../utils/filterUtils';
import {
	ENUM_TYPE_FIELDS as MAILS_ENUM_TYPE_FIELDS,
	getEnumFieldLabel as getMailsEnumFieldLabel,
} from '../../shared/dataLayer/mails/mapMailsDataUtils';
import getReportQuery from '../../utils/queries/getReportQuery';
import { Report } from '../../types/apollo-query-types';
import { getColumnHeaderLabel } from '../summaryTable/summaryTableHeaderUtils';
import { getTableCellAction } from './sourceTableActions';
import { hasCustomSorting, getCustomSorting } from '../../utils/listViewUtils';
import { getInsightsApiFetchPolicy } from '../../api/apollo/utils';
import { getPipelineStages } from '../../api/webapp';

const { getPublicDashboardSettings, getCurrentUserSettings } = localState();

const isMailDataTypeEnumField = (
	reportDataType: insightsTypes.DataType,
	key: string,
) =>
	reportDataType === insightsTypes.DataType.MAILS &&
	MAILS_ENUM_TYPE_FIELDS.includes(key);

const replaceSourceValuesWithPresentational = (
	obj: any,
	translator: Translator,
	reportDataType: insightsTypes.DataType,
) => {
	return Object.keys(obj).reduce((acc, key) => {
		const { currency } = obj;
		const value = isMailDataTypeEnumField(reportDataType, key)
			? getMailsEnumFieldLabel(key, obj[key], translator)
			: getDataFieldValue({
					key,
					value: obj[`${key}Label`] || obj[key],
					currency,
					translator,
			  });

		return {
			...acc,
			...{ [key]: value || '' },
		};
	}, {});
};

const getReportColumns = (reportId: string, reports: any) => {
	const { columns } = reports.find(
		(report: Report) => report.id === reportId,
	);

	return columns;
};

export const isReportCached = (cachedTable: any) =>
	!!cachedTable?.data && !!cachedTable?.columns;

export const hasReachedEnd = (tableDataSet: any) =>
	tableDataSet &&
	(tableDataSet.length % PAGINATION_SIZE !== 0 ||
		tableDataSet.length < PAGINATION_SIZE);

export const getTimeInterval = (intervalFilter: insightsTypes.Interval) => [
	{ defaultValue: intervalFilter, name: 'interval' },
];

export const getRequestDataSize = (cachedTable: any) =>
	cachedTable?.data?.length || PAGINATION_SIZE;

export const getPaginationParameters = (
	reportDataType: insightsTypes.DataType,
) =>
	reportDataType === insightsTypes.DataType.DEALS
		? {
				lastPage: CHART_FIRST_PAGE_INDEX,
		  }
		: {
				chartDataFrom: CHART_FIRST_PAGE_INDEX,
		  };

export const getWebappApiParameters = (WebappApi: Pipedrive.API) => {
	const {
		settings: { default_currency: defaultCurrency },
		id: currentUserId,
		timezone_name: timezoneName,
	} = WebappApi.userSelf;

	return {
		defaultCurrency,
		currentUserId,
		timeZone: timezoneName?.replace(/\s/g, '_'),
	};
};

export const getPublicTableColumnsArray = (reportId: string) => {
	const { reports: publicReports } = getPublicDashboardSettings();

	return getReportColumns(reportId, publicReports);
};

export const getTableColumnsArray = (reportId: string) => {
	const { reports: currentReports } = getCurrentUserSettings();

	return getReportColumns(reportId, currentReports);
};

export const getCachedColumns = (cachedTable: any) =>
	cachedTable.columns.filter((key: string) => key !== 'name');

export const getPreparedSourceTableData = (
	tableData: any,
	translator: Translator,
	reportDataType: insightsTypes.DataType,
) => {
	return tableData?.map((obj: any) =>
		replaceSourceValuesWithPresentational(obj, translator, reportDataType),
	);
};

export const getPreparedTableHeaderColumns = ({
	tableColumnsArray,
	isPublicPage,
	reportType,
	currentUserId,
	tableSourceData,
	fields,
}: {
	tableColumnsArray: string[];
	isPublicPage: boolean;
	reportType: insightsTypes.ReportType;
	currentUserId: number;
	tableSourceData: any;
	fields: any[];
}) => {
	return tableColumnsArray?.map((key: string) => {
		const renderHeaderCell = (params: {
			column: Column;
			row: Row<{ id: string; [key: string]: any }>;
		}) => {
			const { column, row } = params;

			const rowId = row.original.id;
			const rowValue = row.original[key];
			const columnId = column.id;

			const showLinksInTable = !isPublicPage && rowId;
			const isActionableField = ACTIONABLE_SOURCE_TABLE_CELLS.includes(
				column.id,
			);

			if (showLinksInTable && isActionableField) {
				return getTableCellAction({
					reportType,
					currentUserId,
					tableDataSet: tableSourceData,
					rowId,
					rowValue,
					columnId,
				});
			}

			if (Array.isArray(rowValue)) {
				return rowValue.map((v) => <Tag key={v}>{v}</Tag>);
			}

			return <span>{rowValue}</span>;
		};

		const customSorting = memoize(
			(rowA: Row, rowB: Row, columnId: string) =>
				getCustomSorting(rowA, rowB, columnId),
		);

		return {
			Header: getColumnHeaderLabel(fields, key),
			accessor: key,
			sortType: hasCustomSorting(key) ? customSorting : 'alphanumeric',
			Cell: (params: any) => renderHeaderCell(params),
		};
	});
};

const getSourceDataQuery = ({
	columns,
	reportDataType,
	reportType,
	webappAPI,
	groupByFilter,
	intervalFilter,
	filterByFilter,
	selectedStages,
}: {
	columns: string[];
	reportDataType: insightsTypes.DataType;
	reportType: insightsTypes.ReportType;
	webappAPI: Pipedrive.API;
	groupByFilter?: string;
	intervalFilter?: insightsTypes.Interval;
	filterByFilter: insightsTypes.Filter[];
	selectedStages?: number[];
}) => {
	const isOverallReportType =
		reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL;

	const { defaultCurrency, timeZone } = getWebappApiParameters(webappAPI);

	return getReportQuery(reportDataType, {
		reportType,
		chartType: insightsTypes.ChartType.TABLE,
		shouldQueryList: true,
		shouldQueryChartData: true,
		filterByFilter,
		reportColumns: columns,
		defaultCurrency,
		statsFields: { sum: true, count: true },
		timeZone,
		timeInterval: getTimeInterval(intervalFilter),
		...(isOverallReportType && {
			groupByFilter,
		}),
		multiSelectFilter: getMultiSelectFilterValue(
			filterByFilter,
			insightsTypes.ChartType.FUNNEL,
			selectedStages,
		),
		getPipelineStages,
	});
};

export const getRequestedData = async ({
	pagination,
	columns,
	reportDataType,
	reportType,
	webappAPI,
	reportId,
	groupByFilter,
	intervalFilter,
	filterByFilter,
	selectedStages,
}: {
	pagination: { from: number; size: number };
	columns: string[];
	reportDataType: insightsTypes.DataType;
	reportType: insightsTypes.ReportType;
	webappAPI: Pipedrive.API;
	reportId: string;
	groupByFilter?: string;
	intervalFilter?: insightsTypes.Interval;
	filterByFilter: insightsTypes.Filter[];
	selectedStages?: number[];
}) => {
	// For certain kind reports, e.g progress, duration, we currently need to
	// query chart data as well to retrieve list information. - SAT-1194
	const query = getSourceDataQuery({
		columns,
		reportDataType,
		reportType,
		webappAPI,
		groupByFilter,
		intervalFilter,
		filterByFilter,
		selectedStages,
	});
	const { from, size } = pagination;

	return InsightsApiClient.query({
		query,
		variables: {
			from,
			size,
			...getPaginationParameters(reportDataType),
			chartDataSize: 1,
			segmentSize: 1,
			sortOrder: 'desc',
			sortBy: 'count',
		},
		context: {
			headers: { 'insights-report-id': reportId },
		},
		fetchPolicy: getInsightsApiFetchPolicy(),
	});
};
