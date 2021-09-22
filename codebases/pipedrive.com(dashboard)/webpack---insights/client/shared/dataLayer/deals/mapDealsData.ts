import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	getGroupedAndSegmentedData,
	getMappedDataForProgress,
	getMappedDataForFunnel,
	getMappedDataForOverallConversion,
	getMappedDataForRecurringRevenueMovements,
	getMappedDataForRevenue,
	getMappedDataForDuration,
} from './groupAndSegmentData';
import getFlattenedData, {
	getFlattenedDataForFunnel,
	getFlattenedDataForDuration,
} from '../getFlattenedData';
import {
	getUniqueSegmentsFilter,
	getUniqueSegments,
	getSecondaryFilter,
	getSecondaryFilterLabel,
} from '../dataLayerHelpers';
import getLegendData from './getLegendData';
import {
	getQueryObject,
	getQueryPath,
	getSourceData,
	getQueryListPath,
} from '../../../utils/responseUtils';
import getDataForChartPage from './getDataForChartPage';
import {
	DATE_STAGE_ENTERED,
	PROGRESS_DEFAULT_GROUPING,
} from '../../../utils/constants';
import {
	DurationChartSummaryDataObject,
	MapDataReturnType,
	CombinedFilters,
} from '../../../types/data-layer';

const areFiltersRemovedDuringQueryComposition = (
	reportType: insightsTypes.ReportType,
	chartType: insightsTypes.ChartType,
): boolean => {
	if (chartType === insightsTypes.ChartType.SCORECARD) {
		return reportType !== insightsTypes.ReportType.DEALS_DURATION;
	}

	return false;
};

export const getAddedFilters = (
	reportType: insightsTypes.ReportType,
	chartType: insightsTypes.ChartType,
	primaryFilter?: string,
	secondaryFilter?: string,
) => {
	const filtersAdded: string[] = [];

	if (areFiltersRemovedDuringQueryComposition(reportType, chartType)) {
		return [];
	}

	switch (reportType) {
		case insightsTypes.ReportType.DEALS_CONVERSION_OVERALL:
			if (primaryFilter) {
				filtersAdded.push(primaryFilter);
			}

			break;
		case insightsTypes.ReportType.DEALS_PROGRESS:
			const isPrimaryFilterNeeded = ![
				PROGRESS_DEFAULT_GROUPING,
				DATE_STAGE_ENTERED,
			].includes(primaryFilter);

			if (primaryFilter && isPrimaryFilterNeeded) {
				filtersAdded.push(primaryFilter);
			} else if (
				secondaryFilter &&
				secondaryFilter !== PROGRESS_DEFAULT_GROUPING
			) {
				filtersAdded.push(secondaryFilter);
			}

			break;
		case insightsTypes.ReportType.DEALS_REVENUE_FORECAST:
		case insightsTypes.ReportType.DEALS_STATS:
		case insightsTypes.ReportType.DEALS_DURATION:
			if (primaryFilter) {
				filtersAdded.push(primaryFilter);
			}

			if (secondaryFilter && secondaryFilter !== primaryFilter) {
				filtersAdded.push(secondaryFilter);
			}

			break;
		default:
			break;
	}

	return filtersAdded;
};

export const getChartData = ({
	responseData,
	reportType,
	dataType,
	chartType,
	filterTypes,
	primaryFilter,
	secondaryFilter,
}: {
	responseData: any;
	reportType: insightsTypes.ReportType;
	dataType: insightsTypes.DataType;
	chartType: insightsTypes.ChartType;
	filterTypes: string[];
	primaryFilter?: string;
	secondaryFilter?: string;
}) => {
	const filtersAdded = getAddedFilters(
		reportType,
		chartType,
		primaryFilter,
		secondaryFilter,
	);

	return getQueryObject(
		getQueryPath({
			filterByFilters: filterTypes,
			groupByFilters:
				chartType === insightsTypes.ChartType.TABLE
					? null
					: filtersAdded,
			reportType,
			dataType,
		}),
		responseData,
	);
};

const getMappedDataForChart = ({
	reportType,
	chartData,
	chartType,
	measureByFilter,
	intervalFilter,
	primaryFilter,
	primaryFilterLabel,
	secondaryFilter,
	secondaryFilterLabel,
	translator,
}: {
	reportType: insightsTypes.ReportType;
	chartData: any;
	chartType: insightsTypes.ChartType;
	measureByFilter: string;
	intervalFilter: insightsTypes.Interval | boolean;
	primaryFilter: string;
	primaryFilterLabel: string;
	secondaryFilter: string;
	secondaryFilterLabel: string;
	translator: Translator;
}) => {
	switch (reportType) {
		case insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION:
			return getMappedDataForFunnel({
				items: chartData,
				measureByFilter,
				primaryFilter,
				translator,
			});
		case insightsTypes.ReportType.DEALS_CONVERSION_OVERALL:
			return getMappedDataForOverallConversion({
				items: chartData,
				measureByFilter,
				groupingFilter: primaryFilter,
				groupingFilterLabel: primaryFilterLabel,
				intervalFilter,
			});
		case insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT:
			return getMappedDataForRecurringRevenueMovements({
				items: chartData,
				primaryFilter,
				primaryFilterLabel,
				secondaryFilter: getSecondaryFilter(
					primaryFilter,
					secondaryFilter,
				),
				secondaryFilterLabel: getSecondaryFilterLabel(
					primaryFilterLabel,
					secondaryFilterLabel,
				),
				measureByFilter,
				intervalFilter,
			});
		case insightsTypes.ReportType.DEALS_RECURRING_REVENUE:
			return getMappedDataForRevenue({
				items: chartData,
				primaryFilter,
				primaryFilterLabel,
				secondaryFilter: getSecondaryFilter(
					primaryFilter,
					secondaryFilter,
				),
				secondaryFilterLabel: getSecondaryFilterLabel(
					primaryFilterLabel,
					secondaryFilterLabel,
				),
				measureByFilter,
				intervalFilter,
			});
		case insightsTypes.ReportType.DEALS_DURATION:
			return getMappedDataForDuration({
				items: chartData,
				groupByFilter: primaryFilter,
				groupByFilterLabel: primaryFilterLabel,
				intervalFilter,
			});
		case insightsTypes.ReportType.DEALS_PROGRESS:
			return getMappedDataForProgress({
				items: chartData,
				primaryFilter,
				primaryFilterLabel,
				secondaryFilter,
				measureByFilter,
				intervalFilter,
			});
		case insightsTypes.ReportType.DEALS_REVENUE_FORECAST:
		case insightsTypes.ReportType.DEALS_STATS:
			if (chartType === insightsTypes.ChartType.SCORECARD) {
				return chartData;
			}

			return getGroupedAndSegmentedData({
				items: chartData,
				primaryFilter,
				primaryFilterLabel,
				secondaryFilter: getSecondaryFilter(
					primaryFilter,
					secondaryFilter,
				),
				measureByFilter,
				intervalFilter,
			});
		default:
			return [];
	}
};

const mapDealsData = ({
	responseData,
	reportType,
	chartType,
	filterByFilter,
	filters,
	filterTypes,
	translator,
}: {
	responseData: any;
	reportType: insightsTypes.ReportType;
	chartType: insightsTypes.ChartType;
	filterTypes: string[];
	filterByFilter: insightsTypes.Filter[];
	filters: CombinedFilters;
	translator: Translator;
}): MapDataReturnType => {
	const {
		measureByFilterType: measureByFilter,
		intervalFilter,
		primaryFilter,
		primaryFilterLabel,
		secondaryFilter,
		secondaryFilterLabel,
	} = filters;
	const dataType = insightsTypes.DataType.DEALS;
	const {
		data: chartData,
		meta: chartMetaData,
		summary: chartSummaryDataArray,
	} = getChartData({
		responseData,
		reportType,
		dataType,
		chartType,
		filterTypes,
		primaryFilter,
		secondaryFilter,
	});

	const queryListPath = getQueryListPath({
		filterByFilter,
		dataType,
		reportType,
	});

	const sourceData = getSourceData(queryListPath, responseData);

	const defaultDataObject = {
		groupedAndSegmentedData: [] as any[],
		uniqueSegments: [] as any[],
		groupedAndSegmentedFlatData: [] as any[],
		legendData: [] as any[],
		sourceData,
		chartSummaryData: [] as undefined,
		chartMetaData: {} as any,
	};

	if (!chartData) {
		return defaultDataObject;
	}

	const isConversionFunnelReport =
		reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION;
	const isDurationReport =
		reportType === insightsTypes.ReportType.DEALS_DURATION;
	const dataForChartPage = getDataForChartPage({
		chartType,
		chartData,
		reportType,
		primaryFilter,
	});
	const chartSummaryData = chartSummaryDataArray && chartSummaryDataArray[0];

	const groupedAndSegmentedData = getMappedDataForChart({
		reportType,
		chartData: dataForChartPage,
		chartType,
		measureByFilter,
		intervalFilter,
		primaryFilter,
		primaryFilterLabel,
		secondaryFilter,
		secondaryFilterLabel,
		translator,
	});

	if (isConversionFunnelReport) {
		return {
			...defaultDataObject,
			groupedAndSegmentedData,
			groupedAndSegmentedFlatData: getFlattenedDataForFunnel({
				chartData,
				primaryFilter,
				measureByFilter,
			}),
			chartSummaryData,
			chartMetaData,
		};
	}

	if (isDurationReport) {
		return {
			...defaultDataObject,
			groupedAndSegmentedData,
			groupedAndSegmentedFlatData: getFlattenedDataForDuration({
				chartData,
				chartSummaryData:
					chartSummaryData as DurationChartSummaryDataObject,
				primaryFilter,
				primaryFilterLabel,
				intervalFilter,
				translator,
			}),
			chartSummaryData,
			chartMetaData,
		};
	}

	const uniqueSegmentsFilter = getUniqueSegmentsFilter({
		reportType,
		secondaryFilterLabel,
		secondaryFilter,
		primaryFilter,
		primaryFilterLabel,
	});

	const uniqueSegments = getUniqueSegments({
		items: dataForChartPage,
		filter: uniqueSegmentsFilter,
		intervalFilter,
		measureByFilter,
		translator,
	});

	const groupedAndSegmentedFlatData = getFlattenedData({
		reportType,
		chartData:
			reportType === insightsTypes.ReportType.DEALS_REVENUE_FORECAST
				? dataForChartPage
				: chartData,
		primaryFilter,
		primaryFilterLabel,
		secondaryFilter: getSecondaryFilter(primaryFilter, secondaryFilter),
		secondaryFilterLabel: getSecondaryFilterLabel(
			primaryFilterLabel,
			secondaryFilterLabel,
		),
		measureByFilter,
		intervalFilter,
		translator,
	});

	const legendData = getLegendData({
		reportType,
		uniqueSegments,
		filters,
		translator,
	});

	return {
		groupedAndSegmentedData,
		uniqueSegments,
		sourceData,
		groupedAndSegmentedFlatData,
		legendData,
		chartSummaryData,
		chartMetaData,
	};
};

export default mapDealsData;
