import { types as insightsTypes } from '@pipedrive/insights-core';
import { cloneDeep } from 'lodash';

import { isItemOtherGroup } from '../dataLayerHelpers';
import { FORECAST_MAX_ITEMS_PER_PAGE } from '../../../utils/constants';

const removeOtherGroupFromChartData = (
	chartData: any[],
	primaryFilter: string,
	reportType: insightsTypes.ReportType,
) =>
	chartData.filter(
		(item: any) => !isItemOtherGroup(item, primaryFilter, reportType),
	);

// a hack to limit the amount of information displayed on the chart,
// until BE starts to paginate revenue forecast data
const getRevenueForecastChartData = (chartData: any) => {
	let lastGroupName = '';
	let groupsNumber = 0;
	let requiredAmountOfBuckets = 0;

	const canUseAllData = chartData.every((bucket: any, index: number) => {
		if (lastGroupName !== bucket.expectedCloseDateOrWonTime) {
			lastGroupName = bucket.expectedCloseDateOrWonTime;
			groupsNumber += 1;
		}

		if (groupsNumber > FORECAST_MAX_ITEMS_PER_PAGE) {
			requiredAmountOfBuckets = index;

			return false;
		}

		return true;
	});

	if (canUseAllData) {
		return chartData;
	}

	return cloneDeep(chartData).splice(0, requiredAmountOfBuckets);
};

const getDataForChartPage = ({
	chartType,
	chartData,
	reportType,
	primaryFilter,
}: {
	chartType: insightsTypes.ChartType;
	chartData: any;
	reportType: insightsTypes.ReportType;
	primaryFilter: string;
}) => {
	if (reportType === insightsTypes.ReportType.DEALS_REVENUE_FORECAST) {
		return getRevenueForecastChartData(chartData);
	}

	if (chartType === insightsTypes.ChartType.PIE) {
		return chartData;
	}

	return removeOtherGroupFromChartData(chartData, primaryFilter, reportType);
};

export default getDataForChartPage;
