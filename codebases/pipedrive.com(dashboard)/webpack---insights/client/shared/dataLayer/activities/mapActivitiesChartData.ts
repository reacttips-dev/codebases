import { types as insightsTypes } from '@pipedrive/insights-core';

import { getDurationInHours } from '../../../utils/duration/durationUtils';
import { getSegmentKey, getGroupName } from '../dataLayerHelpers';
import { MappedScorecardChartData } from '../../../types/data-layer';

const mapDataForActivitiesScorecard = (
	chartData: any,
	measureByType: insightsTypes.MeasureByType,
): MappedScorecardChartData => {
	if (chartData.length === 0) {
		return { score: 0 };
	}

	if (chartData.length === 1) {
		const result = chartData[0][measureByType];
		const score =
			measureByType === insightsTypes.Activities.MeasureByType.SUM
				? getDurationInHours(result)
				: result;

		return { score };
	}

	throw Error(
		'Something went wrong with getting scorecard value for activities stats report',
	);
};

export const mapActivitiesChartData = ({
	items,
	primaryFilter,
	primaryFilterLabel,
	secondaryFilter,
	measureByType,
	intervalFilter,
	chartType,
}: {
	items: any;
	primaryFilter: string;
	primaryFilterLabel: string;
	secondaryFilter: string;
	measureByType: insightsTypes.MeasureByType;
	intervalFilter: insightsTypes.Interval | boolean;
	chartType: insightsTypes.ChartType;
}) => {
	if (chartType === insightsTypes.ChartType.SCORECARD) {
		return mapDataForActivitiesScorecard(items, measureByType);
	}

	return items.reduce((accumulator: any[], item: any) => {
		const primaryFilterValue = item[primaryFilter];
		const primaryFilterLabelValue = item[primaryFilterLabel];
		const secondaryFilterValue = item[secondaryFilter];
		const measureByFilterValue =
			measureByType === insightsTypes.Activities.MeasureByType.SUM
				? getDurationInHours(item[measureByType])
				: item[measureByType];
		const segmentKey = getSegmentKey(item, secondaryFilter);
		const foundIndex = accumulator.findIndex(
			(accItem) => accItem[primaryFilter] === primaryFilterValue,
		);

		if (foundIndex > -1) {
			accumulator[foundIndex][secondaryFilter][segmentKey] =
				measureByFilterValue;
		} else {
			const groupedAndSegmentedDataObject = {
				name: getGroupName({
					filter: primaryFilter,
					item: primaryFilterLabelValue,
					segment: secondaryFilterValue,
					intervalFilter,
				}),
				id: primaryFilterValue,
				[primaryFilter]: primaryFilterValue,
				[secondaryFilter]: {
					[segmentKey]: measureByFilterValue,
				},
			};

			accumulator.push(groupedAndSegmentedDataObject);
		}

		return accumulator;
	}, []);
};

export default mapActivitiesChartData;
