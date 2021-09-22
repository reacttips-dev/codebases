import React from 'react';
import { Icon } from '@pipedrive/convention-ui-react';
import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';

import { Goal, TrackingMetric } from '../../../types/goals';
import {
	getLabelYPosition,
	getUniqueSegmentId,
	isGoalActiveInPeriod,
	isPeriodsInSameWeek,
} from './columnUtils';
import { getCursor } from '../../../utils/styleUtils';
import { UniqueSegment } from '../../../types/data-layer';
import { getValueForChart } from '../chartTypeUtils';

import styles from './Column.pcss';

interface RechartsProps {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	index?: number;
}

interface CustomGoalShapeOwnProps {
	goal: Goal;
	segmentBy: string;
	groupedAndSegmentedData: any;
	uniqueSegments: UniqueSegment[];
}

export interface CustomGoalShapeProps
	extends RechartsProps,
		CustomGoalShapeOwnProps {}

const CustomGoalShape: React.FC<CustomGoalShapeProps> = ({
	x,
	y,
	width,
	height,
	index,
	goal,
	segmentBy,
	groupedAndSegmentedData,
	uniqueSegments,
}) => {
	const data = groupedAndSegmentedData[index];
	const uniqueSegmentId = getUniqueSegmentId(index, uniqueSegments);
	const barValue = data?.[segmentBy]?.[uniqueSegmentId] ?? 0;

	const {
		expected_outcome: {
			target: goalTarget,
			tracking_metric: goalTrackingMetric,
		},
		duration,
	} = goal;
	const isSumGoal = goalTrackingMetric === TrackingMetric.VALUE;

	const minLabelArea = 30;
	const labelHeight = 20;

	const totalHeight = y + height;
	const barY = totalHeight - (height / goalTarget) * barValue;
	const hasRoomForLabel = Math.abs(y - barY) > minLabelArea;

	const isGoalBiggerThanValue = goalTarget > barValue;
	const isLabelHidden = height < minLabelArea && !hasRoomForLabel;
	const goalYPosition = getLabelYPosition(
		y,
		goalTarget <= barValue,
		hasRoomForLabel,
	);
	const valueYPosition = getLabelYPosition(
		barY,
		barValue < goalTarget,
		hasRoomForLabel,
	);

	const formattedValue = getValueForChart({
		value: barValue,
		isMeasureByMonetary: isSumGoal,
	});
	const formattedGoalValue = getValueForChart({
		value: goalTarget,
		isMeasureByMonetary: isSumGoal,
	});

	const black64 = colors['$color-black-hex-64'];

	const barWithoutGoal = (
		<g cursor={getCursor()}>
			{/* Label for bar */}
			<foreignObject
				x={x}
				y={valueYPosition}
				width={width}
				height={labelHeight}
				display={isLabelHidden && isGoalBiggerThanValue ? 'none' : ''}
			>
				<span className={styles.columnBarTextWrapper}>
					<span
						className={styles.columnBarText}
						style={{
							color:
								isGoalBiggerThanValue && !hasRoomForLabel
									? colors['$color-white-hex']
									: colors['$color-black-hex'],
						}}
					>
						{formattedValue}
					</span>
				</span>
			</foreignObject>
		</g>
	);

	const barWithGoal = (
		<g cursor={getCursor()}>
			{/* Area between goal and bar */}
			<rect
				width={width}
				height={height}
				fill={colors['$color-black-rgba-4']}
				x={x}
				y={y}
			/>
			​{/* Goal line */}
			<rect
				width={width + 4}
				height="2"
				fill="grey"
				strokeWidth="1"
				stroke="white"
				x={x - 2}
				y={y}
			/>
			{/* ​Circles in the beginning and end of the goal line */}
			<circle cx={x - 2} cy={y + 1} r="2" fill={black64} />
			<circle cx={x + width + 2} cy={y + 1} r="2" fill={black64} />​
			{/* Label for goal */}
			<foreignObject
				x={x}
				y={goalYPosition}
				width={width}
				height={labelHeight}
				display={isLabelHidden && !isGoalBiggerThanValue ? 'none' : ''}
			>
				<span className={styles.columnBarTextWrapper}>
					<span
						className={styles.columnBarText}
						style={{
							color: isGoalBiggerThanValue
								? black64
								: colors['$color-white-hex'],
						}}
					>
						{formattedGoalValue}
					</span>
					<Icon
						icon={`goal`}
						size="s"
						color={isGoalBiggerThanValue ? 'black-64' : 'white'}
					/>
				</span>
			</foreignObject>
			{barWithoutGoal}
		</g>
	);

	return isGoalActiveInPeriod(duration.start, duration.end, data.id) ||
		isPeriodsInSameWeek(duration.start, data.id)
		? barWithGoal
		: barWithoutGoal;
};

export default CustomGoalShape;
