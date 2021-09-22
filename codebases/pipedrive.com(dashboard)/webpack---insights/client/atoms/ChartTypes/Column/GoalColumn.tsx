import React, { ReactElement } from 'react';
import {
	CartesianGrid,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Label,
	ResponsiveContainer,
	Tooltip,
	ComposedChart,
	LabelList,
	Line,
} from 'recharts';
import classNames from 'classnames';
import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { Goal } from '../../../types/goals';
import { formatIntervals } from '../../../utils/dateFormatter';
import {
	getYAxisMaxChars,
	doesChartItemHaveData,
	isStackedBarOrderReversed,
} from '../chartTypeUtils';
import { ChartElementColor } from '../chartStyleConstants';
import CustomChartAxisTick from './CustomChartAxisTick';
import CustomGoalBar from './CustomGoalBar';
import CustomGoalShape from './CustomGoalShape';
import TooltipCustomCursor from '../../TooltipCustomCursor';
import {
	getChartMarginProps,
	getChartMaxValue,
	getContainerHeight,
	getGroupedAndSegmentedDataWithGoal,
	getYAxisLabelProps,
	GOAL_TARGET_DATAKEY,
} from './columnUtils';
import { getColor, getCursor } from '../../../utils/styleUtils';
import { isPublicPage } from '../../../utils/helpers';
import SingleGoalLineCustomCursor from './SingleGoalLineCustomCursor';
import { UniqueSegment } from '../../../types/data-layer';
import { ListViewSegmentDataType } from '../../../types/list-view';

import styles from './Column.pcss';

interface GoalColumnProps {
	widget: boolean;
	groupedAndSegmentedData: any;
	segmentBy: string;
	uniqueSegments: UniqueSegment[];
	intervalFilter: insightsTypes.Interval;
	hasSegment: boolean;
	xAxisDataKey: string;
	valueFormatter: (value: number) => any;
	yAxisTickFormatter?: (value: number) => any;
	customTooltip?: ReactElement;
	yAxisLabel?: string;
	showChartListView?: (data: ListViewSegmentDataType) => void;
	staticDataKey?: string;
	goal?: Goal;
	visualization?: 'singleGoalLine' | 'separateLinesPerColumn';
}

const GoalColumn: React.FC<GoalColumnProps> = ({
	widget,
	groupedAndSegmentedData,
	segmentBy,
	uniqueSegments,
	intervalFilter,
	hasSegment,
	xAxisDataKey,
	yAxisLabel,
	valueFormatter,
	customTooltip,
	yAxisTickFormatter,
	showChartListView,
	staticDataKey,
	goal,
	visualization = 'separateLinesPerColumn',
}) => {
	const isSingleGoalLine = visualization === 'singleGoalLine';
	const isSeparateLinesPerColumn = visualization === 'separateLinesPerColumn';
	const isSingleSegment = uniqueSegments.length === 1;

	const Chart = isSingleGoalLine ? ComposedChart : BarChart;
	const goalTarget = goal?.expected_outcome?.target;

	const isReversedBar = isStackedBarOrderReversed(segmentBy);

	const getBar = (dataKey: string, segmentName: string, barIndex = 0) => {
		const lastRenderedSegment = barIndex === 0;
		const shouldAddLabel =
			isSingleGoalLine && (!!staticDataKey || lastRenderedSegment);

		const conditionalBarProps =
			isSeparateLinesPerColumn && uniqueSegments.length > 1
				? { shape: <CustomGoalBar barIndex={barIndex} /> }
				: null;

		const barFillColor = isSingleSegment
			? colors['$color-green-hex-64']
			: getColor(segmentName, barIndex, hasSegment);

		return (
			<Bar
				key={dataKey}
				dataKey={dataKey}
				name={segmentName}
				fill={barFillColor}
				stroke={colors['$color-white-hex']}
				isAnimationActive={false}
				cursor={getCursor()}
				stackId="a"
				{...conditionalBarProps}
			>
				{shouldAddLabel && (
					<LabelList
						dataKey={undefined} // hack to make sure label is always applied to the most top segment & all label values are added together
						position="top"
						formatter={valueFormatter}
					/>
				)}
			</Bar>
		);
	};

	const getBarByUniqueSegments = (uniqueSegments: UniqueSegment[]) => {
		const bar = uniqueSegments.map((segment: any, index: number) => {
			const dataKey = `${segmentBy}.${segment.id}`;

			return getBar(dataKey, segment.name, index);
		});

		return isReversedBar ? bar.reverse() : bar;
	};

	const getBars = () => {
		if (isSingleGoalLine) {
			if (staticDataKey) {
				return getBar(staticDataKey, segmentBy);
			}

			return getBarByUniqueSegments(uniqueSegments);
		}

		if (isSingleSegment) {
			return getBarByUniqueSegments(uniqueSegments);
		} else {
			const bars = groupedAndSegmentedData.map(
				(segment: any, barIndex: number) => {
					const segmentId = Object.keys(segment[segmentBy])[0];
					const dataKey = `${segmentBy}.${segmentId}`;

					return getBar(dataKey, segment.name, barIndex);
				},
			);

			return isReversedBar ? bars.reverse() : bars;
		}
	};

	const groupedAndSegmentedDataWithGoal = getGroupedAndSegmentedDataWithGoal({
		groupedAndSegmentedData,
		goal,
	});

	const getCustomCursor = () =>
		isSingleGoalLine ? (
			<SingleGoalLineCustomCursor
				itemsCount={groupedAndSegmentedDataWithGoal.length}
			/>
		) : (
			<TooltipCustomCursor yModifier={-10} heightModifier={10} />
		);

	return (
		<ResponsiveContainer height={getContainerHeight(widget)}>
			<Chart
				className={classNames(styles.chart, {
					[styles.chartInWidget]: widget,
				})}
				margin={getChartMarginProps(widget, yAxisLabel)}
				data={groupedAndSegmentedDataWithGoal}
				onClick={(data) =>
					!isPublicPage() &&
					doesChartItemHaveData(data) &&
					showChartListView({
						groupId: data.activePayload[0].payload?.id,
						listName: data.activePayload[0].payload?.name,
					})
				}
			>
				<CartesianGrid vertical={false} strokeWidth={1} />

				<XAxis
					dataKey={xAxisDataKey}
					axisLine={false}
					tickLine={false}
					tick={
						<CustomChartAxisTick
							yAxisTickFormatter={yAxisTickFormatter}
							formatIntervals={formatIntervals}
							intervalFilter={intervalFilter}
							getYAxisMaxChars={getYAxisMaxChars}
							isWidget={widget}
							groupedAndSegmentedData={
								groupedAndSegmentedDataWithGoal
							}
						/>
					}
					interval={0}
					height={45}
					xAxisId={0}
				/>

				{isSeparateLinesPerColumn && (
					<XAxis dataKey={xAxisDataKey} xAxisId={1} hide />
				)}

				<YAxis
					axisLine={false}
					tickLine={false}
					padding={{ top: 16, bottom: 0 }}
					domain={[
						0,
						getChartMaxValue({
							isSingleGoalLine,
							groupedAndSegmentedData,
							uniqueSegments,
							segmentBy,
							goalTarget,
						}),
					]}
					tick={
						<CustomChartAxisTick
							axis="y"
							yAxisTickFormatter={yAxisTickFormatter}
							formatIntervals={formatIntervals}
							intervalFilter={intervalFilter}
							getYAxisMaxChars={getYAxisMaxChars}
							isWidget={widget}
							groupedAndSegmentedData={
								groupedAndSegmentedDataWithGoal
							}
						/>
					}
				>
					<Label {...getYAxisLabelProps(yAxisLabel)} />
				</YAxis>

				<Tooltip
					cursor={getCustomCursor()}
					{...(customTooltip ? { content: customTooltip } : {})}
				/>

				{getBars()}

				{isSeparateLinesPerColumn && (
					<Bar
						dataKey="goal.expected_outcome.target"
						xAxisId={1}
						isAnimationActive={false}
						shape={
							<CustomGoalShape
								segmentBy={segmentBy}
								groupedAndSegmentedData={
									groupedAndSegmentedData
								}
								uniqueSegments={uniqueSegments}
								goal={goal}
							/>
						}
					/>
				)}

				{isSingleGoalLine && (
					<Line
						isAnimationActive={false}
						dataKey={GOAL_TARGET_DATAKEY}
						stroke={ChartElementColor.AXIS_TICK}
						strokeWidth={2}
						dot={{ r: 2, strokeWidth: 4 }}
						activeDot={false}
					/>
				)}
			</Chart>
		</ResponsiveContainer>
	);
};

export default GoalColumn;
