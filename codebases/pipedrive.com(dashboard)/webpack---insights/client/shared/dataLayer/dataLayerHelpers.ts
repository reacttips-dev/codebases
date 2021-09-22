import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { formatIntervals } from '../../utils/dateFormatter';
import { getDataFieldValue } from '../../utils/labels';
import { isGroupByTime } from '../../atoms/ChartGroupByFilter/chartGroupByUtils';
import {
	CHART_MAX_ITEMS_PER_PAGE,
	FUNNEL_MAX_ITEMS_PER_PAGE,
	MAX_SEGMENTATION_SIZE,
	MAX_SEGMENTATION_SIZE_DEAL_PROGRESS,
	OTHER_SEGMENT,
} from '../../utils/constants';
import { UniqueSegment, UniqueSegmentFilter } from '../../types/data-layer';
import { getData } from '../../utils/reportObjectHelpers';

export interface FunnelConversionResponseObject {
	[key: string]: number;
}

interface GetSegmentNameParams {
	item: any;
	intervalFilter?: insightsTypes.Interval | boolean;
	basicSegmentKey: string | number;
	filter: UniqueSegmentFilter;
	translator: Translator;
}

export interface GetGroupNameParams {
	filter: string;
	item: string | number;
	segment: string | number;
	intervalFilter?: insightsTypes.Interval | boolean;
	isOtherGroup?: boolean;
	translator?: Translator;
}

export const getSegmentName = ({
	item,
	intervalFilter,
	basicSegmentKey,
	filter,
	translator,
}: GetSegmentNameParams) => {
	if (item.isOtherSegment) {
		return translator.gettext('other');
	}

	const isFieldWithLabel = filter.withOutLabel !== filter.withLabel;

	if (isFieldWithLabel) {
		return item[filter.withLabel];
	}

	const segmentDataItem = getData(filter.withOutLabel)?.find(
		(d: any) => String(d.id) === String(basicSegmentKey),
	);

	const nameFromSegmentDataItem =
		segmentDataItem && (segmentDataItem.name || segmentDataItem.label);

	const customSegmentName = intervalFilter
		? formatIntervals(intervalFilter, basicSegmentKey as string)
		: getDataFieldValue({ key: filter.withLabel, value: basicSegmentKey });

	return segmentDataItem ? nameFromSegmentDataItem : customSegmentName;
};

export const getSecondaryFilterLabel = (
	primaryFilterLabel: string,
	secondaryFilterLabel?: string,
) => {
	return secondaryFilterLabel || primaryFilterLabel;
};

export const getSecondaryFilter = (
	primaryFilter: string,
	secondaryFilter?: string,
) => secondaryFilter || primaryFilter;

export const getUniqueSegmentsFilter = ({
	reportType,
	secondaryFilterLabel,
	secondaryFilter,
	primaryFilter,
	primaryFilterLabel,
}: {
	reportType: string;
	secondaryFilterLabel: string;
	secondaryFilter: string;
	primaryFilter: string;
	primaryFilterLabel: string;
}) => {
	return {
		withLabel: getSecondaryFilterLabel(
			primaryFilterLabel,
			secondaryFilterLabel,
		),
		withOutLabel: getSecondaryFilter(primaryFilter, secondaryFilter),
	};
};

const getUnsanitizedSegmentKey = (item: any, secondaryFilter: string) => {
	if (item.isOtherSegment) {
		return OTHER_SEGMENT;
	}

	return item[secondaryFilter];
};

const getSanitizedSegmentKey = (segmentKey: any) => {
	if (typeof segmentKey === 'string') {
		return segmentKey
			.replace(/\./g, 'dot')
			.replace(/[^a-zA-Z0-9_\s-]/g, 'symbol');
	}

	return segmentKey;
};

export const getSegmentKey = (item: any, secondaryFilter: string) => {
	const unsanitizedSegmentKey = getUnsanitizedSegmentKey(
		item,
		secondaryFilter,
	);

	return getSanitizedSegmentKey(unsanitizedSegmentKey);
};

export const getUniqueSegments = ({
	items,
	filter,
	intervalFilter,
	measureByFilter,
	translator,
	itemValueFormatter,
	customSegmentNameGetter,
}: {
	items: any[];
	filter: UniqueSegmentFilter;
	intervalFilter?: insightsTypes.Interval | boolean;
	measureByFilter: string;
	translator: Translator;
	itemValueFormatter?: (value: number) => number;
	customSegmentNameGetter?: (params: GetSegmentNameParams) => string;
}): UniqueSegment[] => {
	return items.reduce((acc: any[], item: any) => {
		const segmentKey = getUnsanitizedSegmentKey(item, filter.withOutLabel);
		const sanitizedSegmentKey = getSanitizedSegmentKey(segmentKey);
		const foundIndex = acc.findIndex(
			(accItem) => accItem.id === sanitizedSegmentKey,
		);

		if (foundIndex > -1) {
			acc[foundIndex].value += item[measureByFilter];
		} else {
			const nameGettingFnParams: GetSegmentNameParams = {
				item,
				intervalFilter,
				basicSegmentKey: item.isOtherSegment
					? OTHER_SEGMENT
					: item[filter.withOutLabel],
				filter,
				translator,
			};
			const segmentName = customSegmentNameGetter
				? customSegmentNameGetter(nameGettingFnParams)
				: getSegmentName(nameGettingFnParams);

			(segmentKey || segmentKey === false) &&
				acc.push({
					id: sanitizedSegmentKey,
					unsanitizedId: segmentKey,
					name: segmentName,
					value: itemValueFormatter
						? itemValueFormatter(item[measureByFilter])
						: item[measureByFilter],
				});
		}

		return acc;
	}, []);
};

export const getConversionFromStage = (
	item: FunnelConversionResponseObject,
	measureByFilter: string,
) => {
	const isMeasureByNumberOfDeals =
		measureByFilter === insightsTypes.Deals.MeasureByType.COUNT;

	return isMeasureByNumberOfDeals
		? item.conversionFrom
		: item.sumConversionFrom;
};

export const getMaxItemsPerPage = (chartType: insightsTypes.ChartType) => {
	switch (chartType) {
		case insightsTypes.ChartType.FUNNEL:
			return FUNNEL_MAX_ITEMS_PER_PAGE;
		case insightsTypes.ChartType.PIE:
			return CHART_MAX_ITEMS_PER_PAGE - 1;
		default:
			return CHART_MAX_ITEMS_PER_PAGE;
	}
};

export const isItemOtherGroup = (
	item: any,
	primaryFilter: string,
	reportType: insightsTypes.ReportType,
) => {
	// waiting for BE to start properly handling pagination for RR
	if (
		[
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
		].includes(reportType)
	) {
		return !item[primaryFilter];
	}

	return item.isOtherSegment && !item[primaryFilter];
};

export const getGroupName = ({
	filter,
	item,
	segment,
	intervalFilter,
	isOtherGroup,
	translator,
}: GetGroupNameParams) => {
	if (isOtherGroup) {
		return translator.gettext('other');
	}

	const isDate = isGroupByTime(filter);
	const groupDataItem = getData(filter).find(
		(d: any) => String(d.id) === String(item),
	);

	const nameFromGroupDataItem =
		groupDataItem && (groupDataItem.name || groupDataItem.label);

	const dateSegment = isDate
		? formatIntervals(intervalFilter, item as string)
		: segment;

	const customGroupName =
		(!isDate && getDataFieldValue({ key: filter, value: item })) ||
		dateSegment;

	return groupDataItem ? nameFromGroupDataItem : customGroupName;
};

export const getSegmentSizeForReportType = (
	reportType: insightsTypes.ReportType,
) => {
	if (reportType === insightsTypes.ReportType.DEALS_PROGRESS) {
		return MAX_SEGMENTATION_SIZE_DEAL_PROGRESS;
	}

	return MAX_SEGMENTATION_SIZE;
};
