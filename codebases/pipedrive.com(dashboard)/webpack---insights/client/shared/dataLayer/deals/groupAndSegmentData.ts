import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { PROGRESS_DEFAULT_GROUPING } from '../../../utils/constants';
import { getDurationInDays } from '../../../utils/duration/durationUtils';
import {
	OverallConversionDataField,
	DurationDataField,
} from '../../../utils/queries/dataMappingConstants';
import {
	FunnelConversionResponseObject,
	getConversionFromStage,
	getSegmentKey,
	getGroupName,
} from '../dataLayerHelpers';

export const getGroupedAndSegmentedData = ({
	items,
	primaryFilter,
	primaryFilterLabel,
	secondaryFilter,
	measureByFilter,
	intervalFilter,
}: {
	items: any;
	primaryFilter: string;
	primaryFilterLabel: string;
	secondaryFilter: string;
	measureByFilter: string;
	intervalFilter: insightsTypes.Interval | boolean;
}) => {
	return items.reduce((accumulator: any[], item: any) => {
		const primaryFilterValue = item[primaryFilter];
		const primaryFilterLabelValue = item[primaryFilterLabel];
		const secondaryFilterValue = item[secondaryFilter];
		const measureByFilterValue = item[measureByFilter];
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

export const getMappedDataForProgress = ({
	items,
	primaryFilter,
	primaryFilterLabel,
	secondaryFilter,
	measureByFilter,
	intervalFilter,
}: {
	items: any;
	primaryFilter: string;
	primaryFilterLabel: string;
	secondaryFilter: string;
	measureByFilter: string;
	intervalFilter: insightsTypes.Interval | boolean;
}) => {
	return items.reduce((accumulator: any[], item: any) => {
		const measureByFilterValue = item[measureByFilter];
		const segmentGroupsBy = secondaryFilter || PROGRESS_DEFAULT_GROUPING;
		const primaryFilterValue = item[primaryFilter];
		const primaryFilterLabelValue = item[primaryFilterLabel];
		const secondaryFilterValue = item[segmentGroupsBy];

		const foundIndex = accumulator.findIndex(
			(accItem) => accItem[primaryFilter] === item[primaryFilter],
		);

		if (foundIndex > -1) {
			if (
				accumulator[foundIndex][segmentGroupsBy][secondaryFilterValue]
			) {
				accumulator[foundIndex][segmentGroupsBy][
					secondaryFilterValue
				] += measureByFilterValue;
			} else {
				accumulator[foundIndex][segmentGroupsBy][secondaryFilterValue] =
					measureByFilterValue;
			}

			accumulator[foundIndex].monetary += item.sum;
			accumulator[foundIndex].count += item.count;
		} else {
			const groupedAndSegmentedDataObject = {
				name: getGroupName({
					filter: primaryFilter,
					item: primaryFilterLabelValue,
					segment: item[secondaryFilter],
					intervalFilter,
				}),
				id: primaryFilterValue,
				[primaryFilter]: item[primaryFilter],
				[segmentGroupsBy]: {
					[secondaryFilterValue]: measureByFilterValue,
				},
				monetary: item.sum,
				count: item.count,
			};

			accumulator.push(groupedAndSegmentedDataObject);
		}

		return accumulator;
	}, []);
};

export const getMappedDataForFunnel = ({
	items,
	measureByFilter,
	primaryFilter,
	translator,
}: {
	items: FunnelConversionResponseObject[];
	measureByFilter: string;
	primaryFilter: string;
	translator: Translator;
}) => {
	return items.map((item: FunnelConversionResponseObject, index: number) => {
		const primaryFilterValue = item[primaryFilter];
		const measureByFilterValue = item[measureByFilter];
		const conversionFrom = getConversionFromStage(item, measureByFilter);
		const isLastItem = items.length === index + 1;

		return {
			name: isLastItem
				? translator.gettext('Won')
				: getGroupName({
						filter: primaryFilter,
						item: primaryFilterValue,
						segment: primaryFilterValue,
						translator,
				  }),
			id: primaryFilterValue,
			[primaryFilter]: primaryFilterValue,
			[measureByFilter]: measureByFilterValue,
			conversionFrom,
		};
	});
};

interface OverallConversionSegment {
	conversion: number;
	total: number;
}

export const getMappedDataForOverallConversion = ({
	items,
	measureByFilter,
	groupingFilter,
	groupingFilterLabel,
	intervalFilter,
}: {
	items: any[];
	measureByFilter: string;
	groupingFilter: string;
	groupingFilterLabel: string;
	intervalFilter: insightsTypes.Interval | boolean;
}) => {
	return items.reduce((accumulator: any[], item: any) => {
		const statusFilter = 'status';

		const groupingFilterValue = item[groupingFilter];
		const groupingFilterLabelValue = item[groupingFilterLabel];
		const statusFilterValue = item[statusFilter];
		const measureByFilterValue = item[measureByFilter];

		const conversion =
			measureByFilter === 'count'
				? item[OverallConversionDataField.CONVERSION]
				: item[OverallConversionDataField.SUM_CONVERSTION];
		const conversionSegment: OverallConversionSegment = {
			conversion:
				statusFilterValue === 'won' ? conversion : conversion * -1,
			total: measureByFilterValue,
		};

		const foundIndex = accumulator.findIndex((accItem) => {
			return accItem[groupingFilter] === groupingFilterValue;
		});
		const itemFromSameGroupAlreadyExists = foundIndex > -1;

		if (itemFromSameGroupAlreadyExists) {
			accumulator[foundIndex][statusFilterValue] = conversionSegment;
		} else {
			const groupedAndSegmentedDataObject = {
				name: getGroupName({
					filter: groupingFilter,
					item: groupingFilterLabelValue,
					segment: groupingFilterValue,
					intervalFilter,
				}),
				[groupingFilter]: groupingFilterValue,
				id: groupingFilterValue,
				[statusFilterValue]: conversionSegment,
			};

			accumulator.push(groupedAndSegmentedDataObject);
		}

		return accumulator;
	}, []);
};

export const getMappedDataForRecurringRevenueMovements = (args: any) => {
	const data = getGroupedAndSegmentedData(args);

	return data.map((item: any) => {
		if (!item.paymentsType) {
			return item;
		}

		const total = Object.values(item.paymentsType).reduce(
			(sum: number, item: any) => sum + item,
			0,
		);

		return { ...item, total };
	});
};

export const getMappedDataForRevenue = (args: any) => {
	const data = getGroupedAndSegmentedData(args);

	return data.map((item: any) => {
		if (!item.paymentsPaymentType) {
			return item;
		}

		const total = Object.values(item.paymentsPaymentType).reduce(
			(sum: number, item: any) => sum + item,
			0,
		);

		return { ...item, total };
	});
};

interface MappedDurationGroup {
	durationInDays: number;
	dealCount: number;
}

export const getMappedDataForDuration = ({
	items,
	groupByFilter,
	groupByFilterLabel,
	intervalFilter,
}: {
	items: any;
	groupByFilter: string;
	groupByFilterLabel: string;
	intervalFilter: insightsTypes.Interval | boolean;
}) => {
	return items.reduce((accumulator: any[], item: any) => {
		const groupByFilterValue = item[groupByFilter];
		const groupByFilterLabelValue = item[groupByFilterLabel];

		const durationGroup: MappedDurationGroup = {
			durationInDays: getDurationInDays(item[DurationDataField.DURATION]),
			dealCount: item.count,
		};

		const groupedAndSegmentedDataObject = {
			name: getGroupName({
				filter: groupByFilter,
				item: groupByFilterLabelValue,
				segment: groupByFilterValue,
				intervalFilter,
			}),
			[groupByFilter]: groupByFilterValue,
			id: groupByFilterValue,
			duration: durationGroup,
		};

		accumulator.push(groupedAndSegmentedDataObject);

		return accumulator;
	}, []);
};
