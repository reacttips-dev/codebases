import {
	types as insightsTypes,
	constants,
	helpers,
} from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	PROGRESS_DEFAULT_GROUPING,
	NO_SEGMENT,
	PROGRESS_DEFAULT_SEGMENT,
	DEAL_PRODUCTS_PRODUCT_ID,
} from '../../utils/constants';

/**
 * Segmenting by "Product" should be disabled in cases where the report results
 * cannot logically be divided by products:
 *   - when measuring by deal count: a single deal cannot be subdivided,
 *   - when measuring by custom numerical or custom monetary value: this value
 *     is not associated with products.
 *
 * `segmentByFilter` is used to specify the currently selected segment-by option.
 * This parameter is optional. If all other conditions pass, and `segmentByFilter`:
 *   - is specified, then only return true if the selected option is "Product"
 *     (`dealProductsProductId`): can be used to disable segmenting in the report.
 *   - is undefined, then always return true: can be used to filter out the
 *     option "Product" (`dealProductsProductId`) from a list of segment-by options.
 */
export const shouldDisableSegmentByProduct = ({
	reportType,
	measureByFilter,
	segmentByFilter,
}: {
	reportType: insightsTypes.ReportType;
	measureByFilter: insightsTypes.MeasureByType | string;
	segmentByFilter?: string;
}) => {
	const isDealsStats = reportType === insightsTypes.ReportType.DEALS_STATS;
	const isPossiblySegmentedByProduct = segmentByFilter
		? segmentByFilter === DEAL_PRODUCTS_PRODUCT_ID
		: true;
	const isMeasureByNumberOfDeals =
		measureByFilter === insightsTypes.Deals.MeasureByType.COUNT;
	const isMeasureByCustomMonetaryOrNumerical =
		helpers.deals.isCustomField(measureByFilter) &&
		(helpers.deals.isMeasureByMonetary(measureByFilter) ||
			helpers.deals.isMeasureByNumerical(measureByFilter));
	const hasInvalidMeasureBy =
		isMeasureByNumberOfDeals || isMeasureByCustomMonetaryOrNumerical;

	return isDealsStats && isPossiblySegmentedByProduct && hasInvalidMeasureBy;
};

export const getSegmentOptions = ({
	reportType,
	chartType,
	measureByFilter,
	groupByFilter,
	segmentByOptions,
	translator,
}: {
	reportType: insightsTypes.ReportType;
	chartType: insightsTypes.ChartType;
	measureByFilter: insightsTypes.MeasureByType | string;
	groupByFilter: string;
	segmentByOptions: any[];
	translator: Translator;
}) => {
	const isPieChart = chartType === insightsTypes.ChartType.PIE;

	if (isPieChart) {
		return segmentByOptions;
	}

	const optionsWithNone = [
		...segmentByOptions,
		{
			fieldType: NO_SEGMENT,
			label: translator.gettext('None'),
			name: NO_SEGMENT,
		},
	];

	const optionsWithoutGroupByFilter = optionsWithNone.filter(
		(option) => option.name !== groupByFilter,
	);

	if (shouldDisableSegmentByProduct({ reportType, measureByFilter })) {
		return optionsWithoutGroupByFilter.filter(
			(option) => option.name !== DEAL_PRODUCTS_PRODUCT_ID,
		);
	}

	return optionsWithoutGroupByFilter;
};

export const getSegmentByFilter = (
	chartType: insightsTypes.ChartType,
	segmentByFilter: string,
) => {
	const isPieChart = chartType === insightsTypes.ChartType.PIE;
	const hasSelectedSegmentFilter = segmentByFilter !== NO_SEGMENT;

	if (isPieChart && !hasSelectedSegmentFilter) {
		return constants.deals.DEFAULT_PIE_CHART_SEGMENT_BY;
	}

	return segmentByFilter;
};

const getParsedSegmentByFilterForDealsProgress = ({
	groupByFilter,
	segmentByFilter,
}: {
	groupByFilter: string;
	segmentByFilter: string;
}) => {
	// Segmenting is visually disabled for Deal Progress report until we re-write the API for it
	// Here: segment by is visually set to "None" when view by is "Stage entered" (`stageId`)
	if (groupByFilter === PROGRESS_DEFAULT_GROUPING) {
		return NO_SEGMENT;
	}

	if (groupByFilter !== PROGRESS_DEFAULT_GROUPING) {
		return PROGRESS_DEFAULT_GROUPING;
	}

	if (segmentByFilter === groupByFilter) {
		return PROGRESS_DEFAULT_SEGMENT;
	}

	return NO_SEGMENT;
};

export const getParsedSegmentByFilter = ({
	reportType,
	chartType,
	measureByFilter,
	groupByFilter,
	segmentByFilter,
}: {
	reportType: insightsTypes.ReportType;
	chartType: insightsTypes.ChartType;
	measureByFilter: insightsTypes.MeasureByType | string;
	groupByFilter: string;
	segmentByFilter: string;
}) => {
	const parsedSegmentByFilter = getSegmentByFilter(
		chartType,
		segmentByFilter,
	);

	if (
		shouldDisableSegmentByProduct({
			reportType,
			measureByFilter,
			segmentByFilter,
		})
	) {
		return NO_SEGMENT;
	}

	const isProgress = reportType === insightsTypes.ReportType.DEALS_PROGRESS;

	if (isProgress) {
		return getParsedSegmentByFilterForDealsProgress({
			groupByFilter,
			segmentByFilter,
		});
	}

	const isPieChart = chartType === insightsTypes.ChartType.PIE;
	const isSegmentByFilterInvalid =
		!segmentByFilter || segmentByFilter === groupByFilter;

	if (!isPieChart && isSegmentByFilterInvalid) {
		return NO_SEGMENT;
	}

	return parsedSegmentByFilter;
};

export const isSegmentByMissingForChartType = (
	chartType: insightsTypes.ChartType,
	reportType: insightsTypes.ReportType,
) => {
	const reportsWithoutSegmentByFilter = [
		insightsTypes.ReportType.DEALS_REVENUE_FORECAST,
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
		insightsTypes.ReportType.DEALS_CONVERSION_OVERALL,
		insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
		insightsTypes.ReportType.DEALS_DURATION,
	];
	const chartTypesWithoutSegmentByFilter = [
		insightsTypes.ChartType.SCORECARD,
	];

	return (
		reportsWithoutSegmentByFilter.includes(reportType) ||
		chartTypesWithoutSegmentByFilter.includes(chartType)
	);
};
