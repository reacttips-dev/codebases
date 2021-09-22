import { LabelProps } from 'recharts';
import moment from 'moment';
import { periods } from '@pipedrive/insights-core';

import { UniqueSegment } from '../../../types/data-layer';
import { Goal } from '../../../types/goals';
import { CONTAINER_HEIGHT } from '../chartStyleConstants';

export const GOAL_TARGET_DATAKEY = 'goalTarget';

export const getChartMarginProps = (isWidget: boolean, yAxisLabel?: string) => {
	const chartWidgetLeftMargin = yAxisLabel ? 0 : -22;
	const chartLeftMargin = yAxisLabel ? 16 : 0;

	return isWidget
		? { top: 10, right: 0, left: chartWidgetLeftMargin, bottom: -20 }
		: { top: 10, right: 0, left: chartLeftMargin, bottom: -4 };
};

export const getContainerHeight = (isWidget: boolean) =>
	isWidget ? '100%' : CONTAINER_HEIGHT;

export const getYAxisLabelProps = (yAxisLabel: number | string): LabelProps => {
	return {
		value: yAxisLabel,
		angle: -90,
		position: 'insideLeft',
		style: { textAnchor: 'middle' },
	};
};

export const getUniqueSegmentId = (
	index: number,
	uniqueSegments: UniqueSegment[],
) => {
	// Progress goal needs exception, since its uniqueSegments array contains always one object with stage information
	return uniqueSegments?.length === 1
		? uniqueSegments[0]?.id
		: uniqueSegments?.[index]?.id;
};

export const getChartMaxValue = ({
	isSingleGoalLine,
	groupedAndSegmentedData,
	uniqueSegments,
	segmentBy,
	goalTarget,
}: {
	isSingleGoalLine: boolean;
	groupedAndSegmentedData: any[];
	uniqueSegments: UniqueSegment[];
	segmentBy: string;
	goalTarget: number;
}) => {
	const segmentValues = groupedAndSegmentedData.reduce(
		(acc, value, index) => {
			const uniqueSegmentId = getUniqueSegmentId(index, uniqueSegments);

			const segmentValue = value[segmentBy][uniqueSegmentId];

			if (segmentValue) {
				acc.push(segmentValue);
			}

			return acc;
		},
		[],
	);

	if (isSingleGoalLine) {
		return 'auto';
	}

	const maxColumnValue = Math.max.apply(Math, segmentValues);

	return Math.max(goalTarget, maxColumnValue);
};

export const getGroupedAndSegmentedDataWithGoal = ({
	groupedAndSegmentedData,
	goal,
}: {
	groupedAndSegmentedData: any[];
	goal: Goal;
}) => {
	const isRevenueGoal = goal?.type?.name === 'revenue_forecast';

	return groupedAndSegmentedData.map((data: any, index: number) => {
		return {
			...data,
			...(isRevenueGoal
				? {
						goalTarget:
							(index + 1) * goal?.expected_outcome?.target,
				  }
				: { goal }),
		};
	});
};

export const getLabelYPosition = (
	y: number,
	isValueSmaller: boolean,
	hasRoomForLabel: boolean,
) => {
	return isValueSmaller && !hasRoomForLabel ? y + 4 : y - 22;
};

export const goalEndDate = (startDate: string) =>
	moment(Date.parse(startDate))
		.add(1, 'y')
		.add(1, 'm')
		.format(periods.dateFormat);

export const isGoalActiveInPeriod = (
	startDate: string,
	endDate: string,
	periodId: string,
) =>
	moment(periodId).isBetween(
		startDate,
		endDate ?? goalEndDate(startDate),
		undefined,
		'[]',
	);

export const isPeriodsInSameWeek = (startDate: string, periodId: string) =>
	moment(periodId).isSame(startDate, 'week');
