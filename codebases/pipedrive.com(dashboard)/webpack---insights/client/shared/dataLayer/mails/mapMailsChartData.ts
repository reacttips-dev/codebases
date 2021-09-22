import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import { getSegmentKey, getGroupName } from '../dataLayerHelpers';
import { MappedScorecardChartData } from '../../../types/data-layer';
import { ENUM_TYPE_FIELDS, getEnumFieldLabel } from './mapMailsDataUtils';

const mapDataForMailsScorecard = (chartData: any): MappedScorecardChartData => {
	if (chartData.length === 0) {
		return { score: 0 };
	}

	if (chartData.length === 1) {
		const score = chartData[0][insightsTypes.Mails.MeasureByType.COUNT];

		return { score };
	}

	throw Error(
		'Something went wrong with getting scorecard value for mails stats report',
	);
};

export const mapMailsChartData = ({
	items,
	primaryFilter,
	primaryFilterLabel,
	secondaryFilter,
	measureByType,
	intervalFilter,
	translator,
	chartType,
}: {
	items: any;
	primaryFilter: string;
	primaryFilterLabel: string;
	secondaryFilter: string;
	measureByType: insightsTypes.MeasureByType;
	intervalFilter: insightsTypes.Interval | boolean;
	chartType: insightsTypes.ChartType;
	translator: Translator;
}) => {
	if (chartType === insightsTypes.ChartType.SCORECARD) {
		return mapDataForMailsScorecard(items);
	}

	return items.reduce((accumulator: any[], item: any) => {
		const primaryFilterValue = item[primaryFilter];
		const primaryFilterLabelValue = item[primaryFilterLabel];
		const secondaryFilterValue = item[secondaryFilter];
		const measureByFilterValue = item[measureByType];
		const segmentKey = getSegmentKey(item, secondaryFilter);
		const foundIndex = accumulator.findIndex(
			(accItem) => accItem[primaryFilter] === primaryFilterValue,
		);

		if (foundIndex > -1) {
			accumulator[foundIndex][secondaryFilter][segmentKey] =
				measureByFilterValue;
		} else {
			const groupedAndSegmentedDataObject = {
				name: ENUM_TYPE_FIELDS.includes(primaryFilter)
					? getEnumFieldLabel(
							primaryFilter,
							primaryFilterLabelValue,
							translator,
					  )
					: getGroupName({
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

export default mapMailsChartData;
