import moment from 'moment';
import { Row } from 'react-table';
import {
	types as insightsTypes,
	helpers,
	periods,
} from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	DEAL_STAGE_LOG_STAGE_ID,
	dataKeyTypeMap,
	DEAL_PRODUCTS_PRODUCT_ID,
} from './constants';
import { UniqueSegment } from '../types/data-layer';
import { numberFormatter } from './numberFormatter';
import { ListViewSegmentDataType } from '../types/list-view';
import {
	getOperandsFromGroup,
	getOperandsFromSegment,
} from '../shared/listView/listViewAdditionalFilterOperandUtils';
import {
	applyQuickFiltersToReportFilters,
	isUserFilterSetToEveryone,
	isUserType,
} from './quickFilterUtils';
import { QuickFilters } from '../types/apollo-query-types';
import { splitFieldName } from './helpers';

export enum dateTypes {
	DATE = 'date',
	DATETIME = 'dateTime',
}

export const getAdditionalFilterTypeFromGroup = ({
	isPieChart,
	reportType,
	groupByFilter,
	segmentByFilter,
}: {
	isPieChart: boolean;
	reportType: insightsTypes.ReportType;
	groupByFilter: string;
	segmentByFilter: string;
}) => {
	if (isPieChart) {
		return segmentByFilter;
	}

	// TODO: BE needs to change query logic from stageId to dealStageLogStageId
	// Once this is done then we can add stageId to PROGRESS_GROUP_BY_BLACK_LIST
	// and delete this label overwriting
	// also see getGroupByOptions.ts
	if (
		reportType === insightsTypes.ReportType.DEALS_PROGRESS &&
		groupByFilter === 'stageId'
	) {
		return DEAL_STAGE_LOG_STAGE_ID;
	}

	return groupByFilter;
};

export const getAdditionalFilterTypeFromSegment = ({
	isPieChart,
	segmentByFilter,
}: {
	isPieChart: boolean;
	segmentByFilter: string;
}) => (isPieChart ? null : segmentByFilter);

const checkIsTypeString = (input: any): boolean => typeof input === 'string';
const numericIds = ['label'];

const isGroupByFilterValueIdsStringType = (
	isFilterCustom: boolean,
	isGroupedAndSegmentedDataIdTypeString: boolean,
	groupByFilter: string,
	segmentByFilter: string,
) => {
	return (
		!isFilterCustom &&
		isGroupedAndSegmentedDataIdTypeString &&
		!numericIds.includes(groupByFilter) &&
		!numericIds.includes(segmentByFilter)
	);
};

const isSegmentFilterValueIdsStringType = (
	uniqueSegments: any,
	segmentByFilter: string,
	isFilterCustom: boolean,
) => {
	return (
		uniqueSegments.every(
			(segment: any) => typeof segment.id === 'string',
		) &&
		!isFilterCustom &&
		!numericIds.includes(segmentByFilter)
	);
};

const getAdditionalFilter = ({
	isPieChart,
	reportType,
	groupByFilter,
	segmentByFilter,
	filterByFilter,
	intervalFilter,
	uniqueSegments,
	isCumulative,
	groupId,
	segmentId,
	groupedAndSegmentedData,
	isGroup,
}: {
	reportType: insightsTypes.ReportType;
	intervalFilter: any;
	isPieChart: boolean;
	groupByFilter: string;
	segmentByFilter?: string;
	uniqueSegments: UniqueSegment[];
	filterByFilter: insightsTypes.Filter[];
	isCumulative: boolean;
	groupedAndSegmentedData: any;
	isGroup: boolean;
	groupId?: string | number;
	segmentId?: string | number;
}) => {
	const additionalFilterType = isGroup
		? getAdditionalFilterTypeFromGroup({
				isPieChart,
				reportType,
				groupByFilter,
				segmentByFilter,
		  })
		: getAdditionalFilterTypeFromSegment({
				isPieChart,
				segmentByFilter,
		  });
	const additionalFilter = filterByFilter.find(
		(item) => item.filter === additionalFilterType,
	);
	const isFilterCustom =
		additionalFilterType &&
		helpers.deals.isCustomField(additionalFilterType);
	const isSegmentIdTypeString = isSegmentFilterValueIdsStringType(
		uniqueSegments,
		segmentByFilter,
		isFilterCustom,
	);
	const isGroupedAndSegmentedDataIdTypeString = checkIsTypeString(
		groupedAndSegmentedData.find((item: { id: any }) => item.id)?.id,
	);
	const isGroupIdTypeString = isGroupByFilterValueIdsStringType(
		isFilterCustom,
		isGroupedAndSegmentedDataIdTypeString,
		groupByFilter,
		segmentByFilter,
	);

	const operands = isGroup
		? getOperandsFromGroup({
				groupId,
				intervalFilter,
				isPieChart,
				groupByFilter,
				segmentByFilter,
				uniqueSegments,
				isGroupIdTypeString,
				isCumulative,
				filter: additionalFilter,
				groupedAndSegmentedData,
		  })
		: getOperandsFromSegment({
				segmentId,
				groupId,
				groupedAndSegmentedData,
				segmentByFilter,
				isSegmentIdTypeString,
				uniqueSegments,
		  });

	return {
		filter: additionalFilterType,
		operands,
	};
};

export const needsFilterFromSegmentBy = (
	segmentId: string | number,
	segmentByFilter: string,
	isPieChart: boolean,
) => {
	return (
		!isPieChart &&
		(segmentId || segmentByFilter === DEAL_PRODUCTS_PRODUCT_ID)
	);
};

const omitUserTypeFilters = (combinedFilters: insightsTypes.Filter[]) => {
	return combinedFilters.filter(
		(filter: insightsTypes.Filter) => !isUserType(filter.type),
	);
};

export const getCombinedFilters = ({
	quickFilters,
	filterByFilter,
}: {
	quickFilters?: QuickFilters;
	filterByFilter: insightsTypes.Filter[];
}): insightsTypes.Filter[] => {
	if (quickFilters) {
		const { period: dateQuickFilter, user: userQuickFilter } = quickFilters;

		if (dateQuickFilter || userQuickFilter) {
			const appliedQuickFilters = applyQuickFiltersToReportFilters(
				filterByFilter,
				quickFilters,
			);
			const filtersCleanedFromDuplicates = filterByFilter.filter(
				(combinedFilter: insightsTypes.Filter) =>
					!appliedQuickFilters.find(
						(quickFilter) =>
							quickFilter.filter === combinedFilter.filter,
					),
			);
			const combinedFilters = [
				...filtersCleanedFromDuplicates,
				...appliedQuickFilters,
			];

			if (userQuickFilter && isUserFilterSetToEveryone(userQuickFilter)) {
				return omitUserTypeFilters(combinedFilters);
			}

			return combinedFilters;
		}
	}

	return filterByFilter;
};

export const composeListViewFilterByFilter = ({
	reportType,
	listSegmentData,
	intervalFilter,
	isPieChart,
	groupByFilter,
	segmentByFilter,
	uniqueSegments,
	filterByFilter,
	groupedAndSegmentedData,
	isCumulative,
	quickFilters,
}: {
	reportType: insightsTypes.ReportType;
	listSegmentData: ListViewSegmentDataType;
	intervalFilter: insightsTypes.Interval | boolean;
	isPieChart: boolean;
	groupByFilter: string;
	segmentByFilter?: string;
	uniqueSegments: UniqueSegment[];
	filterByFilter: insightsTypes.Filter[];
	groupedAndSegmentedData: any;
	isCumulative: boolean;
	quickFilters?: QuickFilters;
}) => {
	const { groupId, segmentId } = listSegmentData;
	const combinedFilters = getCombinedFilters({
		quickFilters,
		filterByFilter,
	});

	const additionalFilterProps = {
		groupId,
		segmentId,
		isPieChart,
		reportType,
		groupByFilter,
		segmentByFilter,
		filterByFilter: combinedFilters,
		intervalFilter,
		uniqueSegments,
		groupedAndSegmentedData,
		isCumulative,
	};

	const additionalFilterFromGroup =
		(groupId || segmentId) &&
		getAdditionalFilter({ ...additionalFilterProps, isGroup: true });

	const additionalFilterFromSegment =
		needsFilterFromSegmentBy(segmentId, segmentByFilter, isPieChart) &&
		getAdditionalFilter({ ...additionalFilterProps, isGroup: false });

	const filtersCleanedFromDuplicates = combinedFilters.filter(
		(item: any) =>
			item.filter !== additionalFilterFromGroup?.filter &&
			item.filter !== additionalFilterFromSegment?.filter,
	);

	return [
		...filtersCleanedFromDuplicates,
		...(additionalFilterFromGroup ? [additionalFilterFromGroup] : []),
		...(additionalFilterFromSegment ? [additionalFilterFromSegment] : []),
	];
};

export const getListViewTitle = (
	translatedSegmentName: string,
	dataType: insightsTypes.DataType,
	translator: Translator,
) => {
	let dataTypeLabel = '';

	switch (dataType) {
		case insightsTypes.DataType.DEALS:
			dataTypeLabel = translator.gettext('deals');
			break;
		case insightsTypes.DataType.ACTIVITIES:
			dataTypeLabel = translator.gettext('activities');
			break;
		case insightsTypes.DataType.MAILS:
			dataTypeLabel = translator.gettext('emails');
			break;
		default:
			break;
	}

	return `${translatedSegmentName} ${dataTypeLabel}`;
};

const isValueTypeField = (item: any) =>
	item === 'value' || helpers.deals.isMeasureByMonetary(item);

const isDateOrDateTimeTypeField = (item: any, dataType: dateTypes) =>
	dataKeyTypeMap[dataType]?.includes(item) ||
	!!dataKeyTypeMap[dataType]?.find(
		(type) => type === helpers.deals.getFieldType(item).type,
	);

const extractValueFromRow = (row: Row, columnId: string) => {
	const rowValue = row.values[columnId];

	return rowValue?.props?.formattedCellValue || rowValue;
};

export const sortByValueTypeField = (
	rowA: Row,
	rowB: Row,
	columnId: string,
) => {
	const prevItem = numberFormatter.unformat({
		value: extractValueFromRow(rowA, columnId),
		currencyCode: rowA.values.currency,
		isMonetary: true,
	});
	const nextItem = numberFormatter.unformat({
		value: extractValueFromRow(rowB, columnId),
		currencyCode: rowB.values.currency,
		isMonetary: true,
	});

	return prevItem > nextItem ? 1 : -1;
};

const sortByDateTypeField = (rowA: Row, rowB: Row, columnId: string) => {
	const prevItem = moment(rowA.values[columnId], 'L').format(
		periods.dateFormat,
	);
	const nextItem = moment(rowB.values[columnId], 'L').format(
		periods.dateFormat,
	);

	return prevItem > nextItem ? 1 : -1;
};

const sortByDateTimeTypeField = (rowA: Row, rowB: Row, columnId: string) => {
	const dateTimeFormat = `${periods.dateFormat} HH:mm`;

	const prevItem = moment(rowA.values[columnId], 'L HH:mm').format(
		dateTimeFormat,
	);

	const nextItem = moment(rowB.values[columnId], 'L HH:mm').format(
		dateTimeFormat,
	);

	return prevItem > nextItem ? 1 : -1;
};

const convertArrayToString = (array: string[]): string => {
	if (Array.isArray(array)) {
		return array.join('').toLowerCase();
	}

	return '';
};

const sortByMultiOptionTypeField = (rowA: Row, rowB: Row, columnId: string) => {
	const prevItem = convertArrayToString(rowA.values[columnId]);
	const nextItem = convertArrayToString(rowB.values[columnId]);

	return prevItem > nextItem ? 1 : -1;
};

export const sortByNumericTypeField = (
	rowA: Row,
	rowB: Row,
	columnId: string,
) => {
	const prevItem = numberFormatter.unformat({
		value: extractValueFromRow(rowA, columnId),
		isMonetary: false,
	});
	const nextItem = numberFormatter.unformat({
		value: extractValueFromRow(rowB, columnId),
		isMonetary: false,
	});

	return prevItem > nextItem ? 1 : -1;
};

const isMultiOptionTypeField = (key: string): boolean => {
	const multiOptionFieldType = splitFieldName(key)?.field;

	return dataKeyTypeMap.set.includes(multiOptionFieldType);
};

const isNumericTypeField = (key: string): boolean => {
	const fieldType = splitFieldName(key)?.field || key;

	return dataKeyTypeMap.numerical.includes(fieldType);
};

export const hasCustomSorting = (key: string): boolean =>
	isValueTypeField(key) ||
	isDateOrDateTimeTypeField(key, dateTypes.DATE) ||
	isDateOrDateTimeTypeField(key, dateTypes.DATETIME) ||
	isMultiOptionTypeField(key) ||
	isNumericTypeField(key);

export const getCustomSorting = (
	rowA: Row,
	rowB: Row,
	columnId: string,
): number => {
	if (isDateOrDateTimeTypeField(columnId, dateTypes.DATE)) {
		return sortByDateTypeField(rowA, rowB, columnId);
	}

	if (isDateOrDateTimeTypeField(columnId, dateTypes.DATETIME)) {
		return sortByDateTimeTypeField(rowA, rowB, columnId);
	}

	if (isMultiOptionTypeField(columnId)) {
		return sortByMultiOptionTypeField(rowA, rowB, columnId);
	}

	if (isNumericTypeField(columnId)) {
		return sortByNumericTypeField(rowA, rowB, columnId);
	}

	return sortByValueTypeField(rowA, rowB, columnId);
};
