import React from 'react';
import { useQuery } from '@apollo/client';
import { Spinner } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';

import { getPrimaryAndSecondaryChartFilter } from '../../utils/filterUtils';
import useFilterState from '../../molecules/VisualBuilder/useFilterState';
import { getUserSettings, getPipelineStages } from '../../api/webapp';
import ReportError from '../error/reportError/ReportError';
import { InsightsApiClient } from '../../api/apollo/insightsApiClient';
import { PAGINATION_SIZE } from '../../utils/constants';
import { CombinedFilters } from '../../types/data-layer';
import {
	doesReportHaveData,
	doesReportTableHaveData,
	isPublicPage,
} from '../../utils/helpers';
import {
	getMaxItemsPerPage,
	getSegmentSizeForReportType,
} from './dataLayerHelpers';
import mapData from './mapData';
import getReportQuery from '../../utils/queries/getReportQuery';
import localState from '../../utils/localState';
import { goalsState } from '../../api/vars/goalsState';
import { getInsightsApiFetchPolicy } from '../../api/apollo/utils';

const getSegmentByFilter = (
	reportType: insightsTypes.ReportType,
	segmentByFilter: string,
) => {
	// RR-211 hack to add paymentsPaymentType segmentBy for old "Recurring revenue" report(now "Subscription overview").
	const isOldRecurringRevenue =
		reportType === insightsTypes.ReportType.DEALS_RECURRING_REVENUE &&
		segmentByFilter === undefined;

	return isOldRecurringRevenue ? 'paymentsPaymentType' : segmentByFilter;
};

const shouldQueryList = (isTableChart: boolean): boolean =>
	!isPublicPage() || isTableChart;

const shouldQueryChartData = (isTableChart: boolean): boolean =>
	!isPublicPage() || !isTableChart;

interface DataLayerProps {
	children: any;
	dataType: insightsTypes.DataType;
	groupByFilter: string;
	multiSelectFilter: number[];
	measureByFilter: string;
	segmentByFilter: string;
	intervalFilter: insightsTypes.Interval | boolean;
	interval: insightsTypes.Interval | boolean;
	filterByFilter: insightsTypes.Filter[];
	isWidget?: boolean;
	reportId: string;
	reportName: string;
	reportType: insightsTypes.ReportType;
	chartType: insightsTypes.ChartType;
	reportColumns?: string[];
	pageNumber: number;
	isNewReport?: boolean;
	isCumulative: boolean;
	isGoalsReport?: boolean;
	containsInactiveCustomFields?: boolean;
	dashboardId?: string;
}

let previousRequest = {
	query: {},
	data: false,
	reportData: {},
	id: null as null | string,
};

const DataLayer: React.FC<DataLayerProps> = ({
	children,
	dataType,
	groupByFilter,
	multiSelectFilter,
	measureByFilter,
	segmentByFilter,
	intervalFilter,
	interval,
	filterByFilter,
	isWidget = false,
	reportId,
	reportName,
	reportType,
	chartType,
	reportColumns,
	pageNumber,
	isNewReport = false,
	isCumulative,
	isGoalsReport = false,
	containsInactiveCustomFields,
	dashboardId,
}) => {
	if (containsInactiveCustomFields) {
		return (
			<ReportError
				containsInactiveCustomFields={containsInactiveCustomFields}
				dashboardId={dashboardId}
				isGoalsReport={isGoalsReport}
				isWidget={isWidget}
				reportDataType={dataType}
				reportId={reportId}
				reportName={reportName}
				reportType={reportType}
			/>
		);
	}

	const translator = useTranslator();
	const { setGroupByFilter } = useFilterState();
	const { setCachedSourceDataTable } = localState();
	const { error: goalsError } = goalsState();
	const defaultCurrency = getUserSettings('default_currency');
	const timeZone = getUserSettings('timezone_name')?.replace(/\s/g, '_');
	const timeInterval = [{ defaultValue: intervalFilter, name: 'interval' }];

	const measureByFilterType = helpers.getMeasureByStatsFieldKey(
		dataType,
		measureByFilter,
	);

	const isWeightedValue =
		measureByFilter === insightsTypes.Deals.MeasureByType.WEIGHTED_VALUE;
	const isMeasureByCustomField = helpers.deals.isCustomField(measureByFilter);
	const filterTypes = filterByFilter.map((data) => data.filter);
	const isTableChart = chartType === insightsTypes.ChartType.TABLE;

	const query = getReportQuery(dataType, {
		shouldQueryList: shouldQueryList(isTableChart),
		shouldQueryChartData: shouldQueryChartData(isTableChart),
		reportType,
		chartType,
		interval,
		groupByFilter,
		timeInterval,
		segmentByFilter: getSegmentByFilter(reportType, segmentByFilter),
		measureByFilter,
		isMeasureByCustomField,
		defaultCurrency,
		isWeightedValue,
		reportColumns,
		filterByFilter,
		setGroupByFilter,
		multiSelectFilter,
		timeZone,
		isCumulative,
		getPipelineStages,
	});

	const maxItemsPerPage = getMaxItemsPerPage(chartType);
	const { loading, error, data } = useQuery(query, {
		client: InsightsApiClient,
		variables: {
			from: 0,
			size: PAGINATION_SIZE,
			...(dataType === insightsTypes.DataType.DEALS
				? {
						lastPage: pageNumber,
				  }
				: {
						chartDataFrom: pageNumber * maxItemsPerPage,
				  }),
			chartDataSize: maxItemsPerPage,
			segmentSize: getSegmentSizeForReportType(reportType),
			sortOrder: 'desc',
			sortBy: measureByFilterType,
		},
		context: { headers: { 'insights-report-id': reportId } },
		fetchPolicy: getInsightsApiFetchPolicy(isNewReport),
	});

	if (loading) {
		if (isWidget) {
			return <Spinner size="s" light />;
		}

		return children({ ...previousRequest, loading });
	}

	if (error || (isGoalsReport && goalsError) || !data) {
		return (
			<ReportError
				dashboardId={dashboardId}
				error={error || goalsError}
				isGoalsReport={isGoalsReport}
				isWidget={isWidget}
				reportDataType={dataType}
				reportId={reportId}
				reportName={reportName}
				reportType={reportType}
			/>
		);
	}

	const responseData = data[dataType];

	const {
		primaryFilter,
		primaryFilterLabel,
		secondaryFilter,
		secondaryFilterLabel,
	} = getPrimaryAndSecondaryChartFilter({
		groupByFilter,
		segmentByFilter: getSegmentByFilter(reportType, segmentByFilter),
		chartType,
		reportType,
		dataType,
	});

	const reportData = mapData(dataType, {
		responseData,
		reportType,
		chartType,
		filters: {
			measureByFilterType,
			intervalFilter,
			primaryFilter,
			primaryFilterLabel,
			secondaryFilter,
			secondaryFilterLabel,
		} as CombinedFilters,
		filterByFilter,
		filterTypes,
		translator,
	});

	previousRequest = {
		query,
		data,
		reportData,
		id: reportId,
	};

	const tableHasNoData =
		!data ||
		!doesReportTableHaveData({
			filterByFilter,
			data: responseData,
			dataType,
			reportType,
		});

	const chartHasNoData = !data || !doesReportHaveData(reportData);

	const shouldCacheDataTable = !isPublicPage() && !isWidget;

	if (shouldCacheDataTable) {
		setCachedSourceDataTable(reportId, {
			columns: reportColumns,
			data: reportData?.sourceData,
		});
	}

	return children({
		data: previousRequest.data,
		reportData,
		tableHasNoData,
		chartHasNoData,
	});
};

export default React.memo(DataLayer);
