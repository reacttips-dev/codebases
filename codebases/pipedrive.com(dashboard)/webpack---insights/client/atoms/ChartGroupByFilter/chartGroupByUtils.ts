import { types as insightsTypes, helpers } from '@pipedrive/insights-core';

import { ChartMetaDataObject } from '../../types/data-layer';
import {
	CHART_MAX_ITEMS_PER_PAGE,
	dataKeyTypeMap,
	FUNNEL_MAX_ITEMS_PER_PAGE,
} from '../../utils/constants';

export const isPaginationDirectionLeftToRight = (
	chartType: insightsTypes.ChartType,
): boolean => {
	return (
		chartType === insightsTypes.ChartType.COLUMN ||
		chartType === insightsTypes.ChartType.STACKED_BAR_CHART ||
		chartType === insightsTypes.ChartType.FUNNEL
	);
};

export const isGroupByTime = (groupByFilter: string) => {
	const dateFields = [...dataKeyTypeMap.date, ...dataKeyTypeMap.dateTime];

	return dateFields.includes(helpers.deals.getFieldType(groupByFilter).type);
};

export const getChartTotalPages = (
	chartMetaData: ChartMetaDataObject,
	isConversionFunnelReport: boolean,
): number => {
	if (isConversionFunnelReport) {
		return Math.ceil(
			((chartMetaData?.totalItems || FUNNEL_MAX_ITEMS_PER_PAGE) - 1) /
				(FUNNEL_MAX_ITEMS_PER_PAGE - 1),
		);
	}

	return (
		chartMetaData?.totalPages ||
		Math.ceil(
			(chartMetaData?.totalItems || CHART_MAX_ITEMS_PER_PAGE) /
				CHART_MAX_ITEMS_PER_PAGE,
		)
	);
};
