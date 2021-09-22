import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { MapDataReturnType, CombinedFilters } from '../../types/data-layer';
import mapDealsData from './deals/mapDealsData';
import mapActivitiesData from './activities/mapActivitiesData';
import mapMailsData from './mails/mapMailsData';

const mapData = (
	dataType: insightsTypes.DataType,
	{
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
	},
): MapDataReturnType => {
	if (dataType === insightsTypes.DataType.DEALS) {
		return mapDealsData({
			responseData,
			reportType,
			chartType,
			filterByFilter,
			filters,
			filterTypes,
			translator,
		});
	}

	if (dataType === insightsTypes.DataType.ACTIVITIES) {
		return mapActivitiesData({
			responseData,
			chartType,
			filters,
			translator,
		});
	}

	if (dataType === insightsTypes.DataType.MAILS) {
		return mapMailsData({
			responseData,
			filters,
			translator,
			chartType,
		});
	}

	throw Error(`Could not map data for data type ${dataType}`);
};

export default mapData;
