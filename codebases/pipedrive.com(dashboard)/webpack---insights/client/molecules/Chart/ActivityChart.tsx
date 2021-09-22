import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import ActivityTooltip from '../../atoms/ChartTooltip/ActivityTooltip';
import Column from '../../atoms/ChartTypes/Column';
import Scorecard from '../../atoms/ChartTypes/Scorecard';
import Bar from '../../atoms/ChartTypes/Bar';
import Pie from '../../atoms/ChartTypes/Pie';
import GoalColumn from '../../atoms/ChartTypes/Column/GoalColumn';
import {
	getFormattedDuration,
	DurationFormat,
	DurationUnit,
} from '../../utils/duration/durationUtils';
import { MappedScorecardChartData } from '../../types/data-layer';
import { getActivitiesMeasureByLabel } from '../../utils/filterUtils';
import { Goal } from '../../types/goals';
import { ListViewSegmentDataType } from '../../types/list-view';
import GoalTooltip from '../../atoms/ChartTooltip/GoalTooltip/GoalTooltip';
import { getValueForChart } from '../../atoms/ChartTypes/chartTypeUtils';
import { getFormattedValue, ValueFormat } from '../../utils/valueFormatter';

interface ActivityChartProps {
	chartType: insightsTypes.ChartType;
	isShownAsWidget: boolean;
	hasSegment: boolean;
	data: any | MappedScorecardChartData;
	segmentByFilter: string;
	groupByFilter: string;
	measureByFilter: string;
	uniqueSegments: any[];
	intervalFilter: insightsTypes.Interval;
	axisDataKey: string;
	showChartListView: (data: ListViewSegmentDataType) => void;
	isGoalsReport: boolean;
	goal?: Goal;
}

const ActivityChart = ({
	chartType,
	isShownAsWidget,
	hasSegment,
	data,
	segmentByFilter,
	groupByFilter,
	uniqueSegments,
	intervalFilter,
	axisDataKey,
	measureByFilter,
	showChartListView,
	isGoalsReport,
	goal,
}: ActivityChartProps) => {
	const translator = useTranslator();
	const isMeasuredByDuration =
		measureByFilter === insightsTypes.Activities.MesaureByField.DURATION;
	const countValueFormatter = (value: number) =>
		getValueForChart({ value, isMeasureByMonetary: false });
	const shortFormatDurationValueFormatter = (durationInDays: number) =>
		getFormattedDuration({
			duration: durationInDays,
			translator,
			format: DurationFormat.SHORT,
			unit: DurationUnit.HOURS,
		});
	const valueFormatter = isMeasuredByDuration
		? shortFormatDurationValueFormatter
		: countValueFormatter;

	if (chartType === insightsTypes.ChartType.COLUMN) {
		const columnProps = {
			widget: isShownAsWidget,
			hasSegment,
			groupedAndSegmentedData: data,
			segmentBy: segmentByFilter,
			uniqueSegments,
			intervalFilter,
			measureByFilter,
			xAxisDataKey: axisDataKey,
			showChartListView,
			valueFormatter,
			customTooltip: (
				<ActivityTooltip
					segmentByFilter={segmentByFilter}
					groupByFilter={groupByFilter}
					hasSegment={hasSegment}
					measureByFilter={measureByFilter}
				/>
			),
			goal,
		};

		return isGoalsReport && goal ? (
			<GoalColumn
				{...{
					...columnProps,
					yAxisLabel: getActivitiesMeasureByLabel(
						measureByFilter,
						translator,
					),
					goal,
					yAxisTickFormatter: (value: number) =>
						getValueForChart({ value, isMeasureByMonetary: false }),
					customTooltip: <GoalTooltip goal={goal} />,
				}}
			/>
		) : (
			<Column {...columnProps} />
		);
	}

	if (chartType === insightsTypes.ChartType.SCORECARD) {
		const { score } = data;
		const formattedScore = isMeasuredByDuration
			? getFormattedDuration({
					duration: score,
					translator,
					format: DurationFormat.LONG,
					unit: DurationUnit.HOURS,
			  })
			: getFormattedValue(score, ValueFormat.COUNT);

		return (
			<Scorecard
				score={formattedScore}
				description={getActivitiesMeasureByLabel(
					measureByFilter,
					translator,
				)}
				isShownAsWidget={isShownAsWidget}
				showChartListView={showChartListView}
			/>
		);
	}

	if (chartType === insightsTypes.ChartType.PIE) {
		const longFormatDurationValueFormatter = (durationInDays: number) => {
			return getFormattedDuration({
				duration: durationInDays,
				translator,
				format: DurationFormat.LONG,
				unit: DurationUnit.HOURS,
			});
		};
		const tooltipValueFormatter = isMeasuredByDuration
			? longFormatDurationValueFormatter
			: (value: number) => getFormattedValue(value, ValueFormat.COUNT);

		return (
			<Pie
				uniqueSegments={uniqueSegments}
				isShownAsWidget={isShownAsWidget}
				hasSegment={hasSegment}
				showChartListView={showChartListView}
				labelValueFormatter={valueFormatter}
				tooltipValueFormatter={tooltipValueFormatter}
			/>
		);
	}

	if (chartType === insightsTypes.ChartType.BAR) {
		return (
			<Bar
				widget={isShownAsWidget}
				hasSegment={hasSegment}
				groupedAndSegmentedData={data}
				segmentBy={segmentByFilter}
				isMeasureByMonetary={false}
				uniqueSegments={uniqueSegments}
				intervalFilter={intervalFilter}
				axisDataKey={axisDataKey}
				showChartListView={showChartListView}
				valueFormatter={valueFormatter}
				measureByFilter={measureByFilter}
				customTooltip={
					<ActivityTooltip
						segmentByFilter={segmentByFilter}
						groupByFilter={groupByFilter}
						hasSegment={hasSegment}
						measureByFilter={measureByFilter}
					/>
				}
			/>
		);
	}

	return null;
};

export default ActivityChart;
