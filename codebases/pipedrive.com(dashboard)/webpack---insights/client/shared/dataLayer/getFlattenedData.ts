import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	FunnelConversionResponseObject,
	getConversionFromStage,
	getUniqueSegments,
	isItemOtherGroup,
	getSegmentKey,
	getGroupName,
	GetGroupNameParams,
} from './dataLayerHelpers';
import {
	OverallConversionDataField,
	FunnelConversionSummaryTableField,
	DurationSummaryTableField,
} from '../../utils/queries/dataMappingConstants';
import { extractSummaryData } from '../../utils/duration/durationUtils';
import {
	DEAL_STAGE_LOG_STAGE_ID,
	summaryColumnTypes,
	TABLE_DATA_AVERAGE,
	TABLE_DATA_TOTAL,
} from '../../utils/constants';
import { DurationChartSummaryDataObject } from '../../types/data-layer';

const addTotalAndAverageToFlattenedItems = ({
	mappedItems,
	measureByFilter,
	uniqueSegments,
	translator,
}: {
	mappedItems: any[];
	measureByFilter: string;
	uniqueSegments: any[];
	translator: Translator;
}) => {
	const segmentTotal = {
		name: translator.gettext('Total'),
		id: TABLE_DATA_TOTAL,
	} as any;

	const segmentAverage = {
		name: translator.gettext('Average'),
		id: TABLE_DATA_AVERAGE,
	} as any;

	mappedItems.forEach((item) => {
		uniqueSegments.forEach((uniqueSegment) => {
			if (
				Object.keys(item).indexOf(uniqueSegment.id?.toString()) === -1
			) {
				item[uniqueSegment.id] = 0;
			}
		});

		item.average = item.sum / item.count || 0;

		Object.keys(item).forEach((segment) => {
			const requiredMeasuringTypes = [
				summaryColumnTypes.AVG,
				summaryColumnTypes.SUM,
				summaryColumnTypes.COUNT,
				measureByFilter,
			];

			if (
				uniqueSegments
					.map((s) => String(s.id))
					.includes(String(segment)) ||
				requiredMeasuringTypes.includes(String(segment))
			) {
				const total = (segmentTotal[segment] || 0) + item[segment];

				segmentTotal[segment] = total;
				segmentAverage[segment] = total / mappedItems.length;
			}
		});
	});

	return [...mappedItems, segmentAverage, segmentTotal];
};

const getSegmentValue = ({
	item,
	reportType,
	measureByFilter,
}: {
	item: any;
	reportType: insightsTypes.ReportType;
	measureByFilter: string;
}) => {
	if (reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL) {
		return measureByFilter === insightsTypes.Deals.MeasureByType.COUNT
			? item[OverallConversionDataField.CONVERSION]
			: item[OverallConversionDataField.SUM_CONVERSTION];
	}

	return item[measureByFilter];
};

export const getFlattenedDataForFunnel = ({
	chartData,
	primaryFilter,
	measureByFilter,
}: {
	chartData: FunnelConversionResponseObject[];
	primaryFilter: string;
	measureByFilter: string;
}) => {
	const {
		REACHED_STAGE,
		CONVERSION_TO_NEXT_STAGE,
		CONVERSION_TO_WON,
		CONVERSION_TO_LOST,
	} = FunnelConversionSummaryTableField;

	const dataWithoutWon = chartData.length ? chartData.slice(0, -1) : [];

	return dataWithoutWon.map((item: FunnelConversionResponseObject) => {
		const primaryFilterValue = item[primaryFilter];
		const reachedStage = item[measureByFilter];
		const conversionToNextStage = getConversionFromStage(
			item,
			measureByFilter,
		);

		return {
			name: getGroupName({
				filter: primaryFilter,
				item: primaryFilterValue,
				segment: primaryFilterValue,
			}),
			[REACHED_STAGE]: reachedStage,
			[CONVERSION_TO_NEXT_STAGE]: conversionToNextStage,
			[CONVERSION_TO_WON]: item[CONVERSION_TO_WON],
			[CONVERSION_TO_LOST]: item[CONVERSION_TO_LOST],
		};
	});
};

const getFlattenedData = ({
	reportType,
	chartData,
	primaryFilter,
	primaryFilterLabel,
	secondaryFilter,
	secondaryFilterLabel,
	measureByFilter,
	intervalFilter,
	translator,
	customGroupNameGetter,
}: {
	reportType: insightsTypes.ReportType;
	chartData: any[];
	primaryFilter: string;
	primaryFilterLabel: string;
	secondaryFilter?: string;
	secondaryFilterLabel: string;
	measureByFilter: string;
	intervalFilter: insightsTypes.Interval | boolean;
	translator: Translator;
	customGroupNameGetter?: (params: GetGroupNameParams) => string;
}) => {
	const mappedItems = chartData.reduce((accumulator: any[], item: any) => {
		const isOtherGroup = isItemOtherGroup(item, primaryFilter, reportType);
		const primaryFilterValue = item[primaryFilter];
		const primaryFilterLabelValue = item[primaryFilterLabel];
		const secondaryFilterValue = item[secondaryFilter];
		const segmentKey = getSegmentKey(item, secondaryFilter);
		const segmentValue = getSegmentValue({
			item,
			reportType,
			measureByFilter,
		});
		const itemsSum = item.sum || 0;
		const itemsCount = item.count;
		const foundIndex = accumulator.findIndex(
			(accItem) => accItem[primaryFilter] === primaryFilterValue,
		);

		if (foundIndex > -1) {
			accumulator[foundIndex][segmentKey] = segmentValue;
			accumulator[foundIndex].sum += itemsSum;
			accumulator[foundIndex].count += itemsCount;
		} else {
			const groupNameGetterParams = {
				filter: primaryFilter,
				item: primaryFilterLabelValue,
				segment: secondaryFilterValue,
				intervalFilter,
				isOtherGroup,
				translator,
			};
			const flattenedDataObject = {
				name: customGroupNameGetter
					? customGroupNameGetter(groupNameGetterParams)
					: getGroupName(groupNameGetterParams),
				id: primaryFilterValue,
				[segmentKey]: segmentValue,
				// Both measureBy values are needed
				// for calculating average from sum for summary table
				sum: itemsSum,
				count: itemsCount,
				[primaryFilter]: primaryFilterValue,
			};

			accumulator.push(flattenedDataObject);
		}

		return accumulator;
	}, []);

	const uniqueSegments = getUniqueSegments({
		items: chartData,
		filter: {
			withLabel: secondaryFilterLabel || primaryFilterLabel,
			withOutLabel: secondaryFilter || primaryFilter,
		},
		intervalFilter,
		measureByFilter,
		translator,
	});

	if (primaryFilter && mappedItems.length > 0) {
		return addTotalAndAverageToFlattenedItems({
			mappedItems,
			measureByFilter,
			uniqueSegments,
			translator,
		});
	}

	return mappedItems;
};

export default getFlattenedData;

export const getFlattenedDataForDuration = ({
	chartData,
	chartSummaryData,
	primaryFilter,
	primaryFilterLabel,
	intervalFilter,
	translator,
}: {
	chartData: any[];
	primaryFilter: string;
	primaryFilterLabel: string;
	chartSummaryData?: DurationChartSummaryDataObject;
	intervalFilter: insightsTypes.Interval | boolean;
	translator: Translator;
}) => {
	const { AVERAGE_DURATION, NUMBER_OF_DEALS, TOTAL } =
		DurationSummaryTableField;

	const isPrimaryFilterStageEntered =
		primaryFilter === DEAL_STAGE_LOG_STAGE_ID;
	const { count, duration } = extractSummaryData(chartSummaryData);

	const summaryTableData = chartData.map((item: any) => {
		const primaryFilterValue = item[primaryFilter];
		const primaryFilterLabelValue = item[primaryFilterLabel];

		return {
			name: getGroupName({
				filter: primaryFilter,
				intervalFilter,
				item: primaryFilterLabelValue,
				segment: primaryFilterValue,
			}),
			id: primaryFilterValue,
			[AVERAGE_DURATION]: item.duration,
			[NUMBER_OF_DEALS]: item.count,
		};
	});

	if (count && duration) {
		summaryTableData.push({
			name: isPrimaryFilterStageEntered
				? translator.gettext('All stages (average sales cycle)')
				: translator.gettext('Overall'),
			id: TOTAL,
			[AVERAGE_DURATION]: duration,
			[NUMBER_OF_DEALS]: count,
		});
	}

	return summaryTableData;
};
