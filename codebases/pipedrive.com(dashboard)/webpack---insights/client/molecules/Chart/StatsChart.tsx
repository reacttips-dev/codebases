import React from 'react';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import Bar from '../../atoms/ChartTypes/Bar';
import Pie from '../../atoms/ChartTypes/Pie';
import Column from '../../atoms/ChartTypes/Column';
import Scorecard from '../../atoms/ChartTypes/Scorecard';
import { getValueForChart } from '../../atoms/ChartTypes/chartTypeUtils';
import StatsTooltip from '../../atoms/ChartTooltip/StatsTooltip';
import {
	getFormattedValue,
	getValueFormatBasedOnMeasureBy,
} from '../../utils/valueFormatter';
import useReportOptions from '../../hooks/useReportOptions';
import getScorecardProps from './getScorecardProps';
import GoalColumn from '../../atoms/ChartTypes/Column/GoalColumn';
import { Goal } from '../../types/goals';
import { getMeasureByLabel } from '../../utils/filterUtils';
import GoalTooltip from '../../atoms/ChartTooltip/GoalTooltip/GoalTooltip';
import { ListViewSegmentDataType } from '../../types/list-view';
import { AXIS_DECIMAL_PLACES } from '../../atoms/ChartTypes/chartStyleConstants';

interface StatsChartProps {
	chartType: insightsTypes.ChartType;
	isShownAsWidget: boolean;
	hasSegment: boolean;
	groupedAndSegmentedData: any;
	segmentBy: string;
	measureByFilter: string;
	segmentByFilter: string;
	uniqueSegments: any;
	intervalFilter: any;
	axisDataKey: any;
	showChartListView: (data: ListViewSegmentDataType) => void;
	isGoalsReport: boolean;
	goal?: Goal;
}

const StatsChart = ({
	chartType,
	isShownAsWidget = false,
	hasSegment = false,
	groupedAndSegmentedData,
	segmentBy,
	measureByFilter,
	segmentByFilter,
	uniqueSegments,
	intervalFilter,
	axisDataKey,
	showChartListView,
	isGoalsReport,
	goal,
}: StatsChartProps) => {
	const translator = useTranslator();
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);
	const isMeasureByMonetary =
		helpers.deals.isMeasureByMonetary(measureByFilter);
	const measureByLabel = getMeasureByLabel(
		measureByFilter,
		fields,
		translator,
	);

	const getChart = () => {
		switch (chartType) {
			case insightsTypes.ChartType.BAR:
				return (
					<Bar
						widget={isShownAsWidget}
						measureByFilter={measureByFilter}
						hasSegment={hasSegment}
						groupedAndSegmentedData={groupedAndSegmentedData}
						segmentBy={segmentBy}
						isMeasureByMonetary={isMeasureByMonetary}
						uniqueSegments={uniqueSegments}
						intervalFilter={intervalFilter}
						axisDataKey={axisDataKey}
						showChartListView={showChartListView}
						customTooltip={
							<StatsTooltip
								isMeasureByMonetary={isMeasureByMonetary}
								intervalFilter={intervalFilter}
								measureByFilter={measureByFilter}
								segmentByFilter={segmentByFilter}
							/>
						}
						valueFormatter={(value: number) =>
							getValueForChart({
								value,
								isMeasureByMonetary,
							})
						}
					/>
				);
			case insightsTypes.ChartType.PIE:
				return (
					<Pie
						uniqueSegments={uniqueSegments}
						isShownAsWidget={isShownAsWidget}
						hasSegment={hasSegment}
						showChartListView={showChartListView}
						labelValueFormatter={(value: number) =>
							getValueForChart({
								value,
								isMeasureByMonetary,
								precision: 2,
							})
						}
						tooltipValueFormatter={(value: number) =>
							getFormattedValue(
								value,
								getValueFormatBasedOnMeasureBy(measureByFilter),
							)
						}
					/>
				);
			case insightsTypes.ChartType.COLUMN:
				const columnProps = {
					widget: isShownAsWidget,
					hasSegment,
					groupedAndSegmentedData,
					segmentBy,
					uniqueSegments,
					intervalFilter,
					xAxisDataKey: axisDataKey,
					measureByFilter,
					showChartListView,
					valueFormatter: (value: number) =>
						getValueForChart({
							value,
							isMeasureByMonetary,
						}),

					customTooltip: (
						<StatsTooltip
							isMeasureByMonetary={isMeasureByMonetary}
							intervalFilter={intervalFilter}
							measureByFilter={measureByFilter}
							segmentByFilter={segmentByFilter}
						/>
					),
					yAxisTickFormatter: (value: number) =>
						getValueForChart({
							value,
							precision: AXIS_DECIMAL_PLACES,
							isMeasureByMonetary,
						}),
				};

				return isGoalsReport && goal ? (
					<GoalColumn
						{...{
							...columnProps,
							yAxisLabel: measureByLabel,
							goal,
							customTooltip: <GoalTooltip goal={goal} />,
						}}
					/>
				) : (
					<Column {...columnProps} />
				);
			case insightsTypes.ChartType.SCORECARD:
				return (
					<Scorecard
						{...getScorecardProps({
							groupedAndSegmentedData,
							measureByFilter,
							isShownAsWidget,
							fields,
							translator,
						})}
						showChartListView={showChartListView}
					/>
				);
			default:
				return null;
		}
	};

	return getChart();
};

export default StatsChart;
