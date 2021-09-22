import moment from 'moment';
import { types as insightsTypes, periods } from '@pipedrive/insights-core';

import { ActivityFieldKey, OTHER_SEGMENT } from '../../utils/constants';
import { UniqueSegment } from '../../types/data-layer';
import { isGroupByTime } from '../../atoms/ChartGroupByFilter/chartGroupByUtils';

const getOtherSegmentIdsFromAllSegments = (
	uniqueSegments: UniqueSegment[],
	isGroupIdTypeString: boolean,
) =>
	uniqueSegments
		.filter((segment) => segment.id !== OTHER_SEGMENT)
		.map((segment) =>
			isGroupIdTypeString ? segment.unsanitizedId : Number(segment.id),
		);

const getUnsanitizedIdBasedOnId = (
	id: string,
	uniqueSegments: UniqueSegment[],
) => {
	return uniqueSegments.find((segment) => segment.id === id)?.unsanitizedId;
};

const getOtherSegmentIdsFromGroupSegments = ({
	groupId,
	groupedAndSegmentedData,
	segmentByFilter,
	isSegmentIdTypeString,
	uniqueSegments,
}: {
	groupId: string | number;
	groupedAndSegmentedData: any[];
	segmentByFilter: string;
	isSegmentIdTypeString: boolean;
	uniqueSegments: UniqueSegment[];
}) => {
	const groupData = groupedAndSegmentedData.find(
		(group) => group.id === groupId,
	);

	if (groupData) {
		const groupSegments = Object.keys(groupData[segmentByFilter] || {});

		if (isSegmentIdTypeString) {
			const redundantIdValues = [OTHER_SEGMENT, undefined, null];

			return groupSegments
				.map((id) => getUnsanitizedIdBasedOnId(id, uniqueSegments))
				.filter((id: string) => !redundantIdValues.includes(id));
		}

		return groupSegments
			.filter((id) => id !== OTHER_SEGMENT)
			.map((id) => Number(id));
	}

	return [];
};

const getAllGroupIds = (
	groupedAndSegmentedData: any[],
	isGroupIdTypeString: boolean,
) =>
	groupedAndSegmentedData.map((group) =>
		isGroupIdTypeString ? group.id : Number(group.id),
	);

const getPeriodEndDate = (
	startDate: string,
	interval: insightsTypes.Interval,
	filter: insightsTypes.Filter,
): string => {
	if (!startDate || !interval) {
		return '';
	}

	const endDateBasedOnInterval = moment(startDate)
		.endOf(interval)
		.format(periods.dateFormat);

	const filterOperands = filter?.operands;
	const filterToOperand = filterOperands?.find(
		(operand) => operand.name === insightsTypes.OperandType.TO,
	);
	const endDateBasedOnFilter = filterToOperand?.defaultValue;
	const shouldUseDateBasedOnFilter =
		endDateBasedOnFilter && endDateBasedOnInterval > endDateBasedOnFilter;

	return shouldUseDateBasedOnFilter
		? endDateBasedOnFilter
		: endDateBasedOnInterval;
};

const getPeriodStartDate = ({
	id,
	isCumulative,
	filter,
}: {
	id: number | string;
	isCumulative?: boolean;
	filter: insightsTypes.Filter;
}) => {
	const filterOperands = filter?.operands;
	const filterFromOperand = filterOperands?.find(
		(operand) => operand.name === insightsTypes.OperandType.FROM,
	);

	const startDateBasedOnFilter = filterFromOperand?.defaultValue;
	const shouldUseDateBasedOnFilter =
		startDateBasedOnFilter && (isCumulative || id < startDateBasedOnFilter);

	return shouldUseDateBasedOnFilter ? startDateBasedOnFilter : id;
};

export const getOperandsFromSegment = ({
	groupId,
	segmentId,
	groupedAndSegmentedData,
	segmentByFilter,
	isSegmentIdTypeString,
	uniqueSegments,
}: {
	groupId: number | string;
	segmentId: number | string;
	groupedAndSegmentedData: any[];
	segmentByFilter: string;
	isSegmentIdTypeString: boolean;
	uniqueSegments: UniqueSegment[];
}) => {
	const isOtherSegment = segmentId === OTHER_SEGMENT;
	const requestAllSegments = !segmentId;

	if (requestAllSegments) {
		return [
			{
				defaultValue: null,
				name: insightsTypes.OperandType.EQ,
			},
		];
	}

	if (isOtherSegment) {
		return [
			{
				defaultValue: getOtherSegmentIdsFromGroupSegments({
					groupId,
					groupedAndSegmentedData,
					segmentByFilter,
					isSegmentIdTypeString,
					uniqueSegments,
				}),
				name: insightsTypes.OperandType.NOT,
			},
		];
	}

	return [
		{
			defaultValue: isSegmentIdTypeString ? segmentId : Number(segmentId),
			name: insightsTypes.OperandType.EQ,
		},
	];
};

const activityReportHasDoneFilter = ({
	filter,
	groupByFilter,
	segmentByFilter,
	isPieChart,
}: {
	filter: insightsTypes.Filter;
	groupByFilter: string;
	segmentByFilter: string;
	isPieChart: boolean;
}) =>
	filter?.filter === ActivityFieldKey.DONE ||
	(!isPieChart && groupByFilter === ActivityFieldKey.DONE) ||
	(isPieChart && segmentByFilter === ActivityFieldKey.DONE);

export const getOperandsFromGroup = ({
	groupId,
	intervalFilter,
	isPieChart,
	groupByFilter,
	segmentByFilter,
	uniqueSegments,
	isGroupIdTypeString,
	isCumulative,
	filter,
	groupedAndSegmentedData,
}: {
	groupId: number | string;
	intervalFilter: insightsTypes.Interval | boolean;
	isPieChart: boolean;
	groupByFilter: string;
	segmentByFilter: string;
	uniqueSegments: UniqueSegment[];
	isGroupIdTypeString: boolean;
	filter: insightsTypes.Filter;
	groupedAndSegmentedData: any[];
	isCumulative?: boolean;
}) => {
	const isDate = isGroupByTime(groupByFilter);
	const isOtherGroup = groupId === OTHER_SEGMENT;
	const isDoneFilter = activityReportHasDoneFilter({
		filter,
		segmentByFilter,
		groupByFilter,
		isPieChart,
	});

	if (isOtherGroup) {
		if (isPieChart) {
			const getDefaultValue = () => {
				const segmentIds = getOtherSegmentIdsFromAllSegments(
					uniqueSegments,
					isGroupIdTypeString,
				);

				const filterOperands = filter?.operands[0];
				const isMatchingOperandName =
					filterOperands?.name === insightsTypes.OperandType.NOT;

				if (isMatchingOperandName) {
					return [...segmentIds, ...filterOperands.defaultValue];
				}

				return segmentIds;
			};

			return [
				{
					defaultValue: getDefaultValue(),
					name: insightsTypes.OperandType.NOT,
				},
			];
		}

		return [
			{
				defaultValue: getAllGroupIds(
					groupedAndSegmentedData,
					isGroupIdTypeString,
				),
				name: insightsTypes.OperandType.NOT,
			},
		];
	}

	const isSummaryTableTotalRow = !groupId;

	if (isSummaryTableTotalRow) {
		if (isDate) {
			return [
				{
					name: insightsTypes.OperandType.FROM,
					defaultValue: groupedAndSegmentedData[0]?.id,
				},
				{
					name: insightsTypes.OperandType.TO,
					defaultValue: getPeriodEndDate(
						groupedAndSegmentedData[
							groupedAndSegmentedData.length - 1
						]?.id,
						intervalFilter as insightsTypes.Interval,
						filter,
					),
				},
				{
					name: insightsTypes.OperandType.FORMAT,
					defaultValue: periods.gqlDateFormat,
				},
			];
		}

		return [
			{
				defaultValue: getAllGroupIds(
					groupedAndSegmentedData,
					isGroupIdTypeString,
				),
				name: insightsTypes.OperandType.IN,
			},
		];
	}

	if (isDate && !isPieChart) {
		return [
			{
				name: insightsTypes.OperandType.FROM,
				defaultValue: getPeriodStartDate({
					id: groupId,
					isCumulative,
					filter,
				}),
			},
			{
				name: insightsTypes.OperandType.TO,
				defaultValue: getPeriodEndDate(
					groupId as string,
					intervalFilter as insightsTypes.Interval,
					filter,
				),
			},
			{
				name: insightsTypes.OperandType.FORMAT,
				defaultValue: periods.gqlDateFormat,
			},
		];
	}

	if (isDoneFilter) {
		return [
			{
				defaultValue: true,
				name: insightsTypes.OperandType.EQ,
			},
		];
	}

	return [
		{
			defaultValue: isGroupIdTypeString ? groupId : Number(groupId),
			name: insightsTypes.OperandType.EQ,
		},
	];
};
