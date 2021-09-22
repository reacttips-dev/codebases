import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import Column from '../../atoms/ChartTypes/Column';
import Scorecard from '../../atoms/ChartTypes/Scorecard';
import { getValueForChart } from '../../atoms/ChartTypes/chartTypeUtils';
import useReportOptions from '../../hooks/useReportOptions';
import getScorecardProps from './getScorecardProps';
import { Goal } from '../../types/goals';
import GoalRevenueForecastTooltip from '../../atoms/ChartTooltip/GoalRevenueForecastTooltip';
import RevenueForecastTooltip from '../../atoms/ChartTooltip/RevenueForecastTooltip';
import { getMeasureByLabel } from '../../utils/filterUtils';
import GoalColumn from '../../atoms/ChartTypes/Column/GoalColumn';
import { ListViewSegmentDataType } from '../../types/list-view';
import { AXIS_DECIMAL_PLACES } from '../../atoms/ChartTypes/chartStyleConstants';

interface RevenueForecastChartProps {
	chartType: insightsTypes.ChartType;
	isShownAsWidget: boolean;
	groupedAndSegmentedData: any;
	segmentBy: string;
	measureByFilter: string;
	uniqueSegments: any;
	intervalFilter: any;
	axisDataKey: any;
	showChartListView: (data: ListViewSegmentDataType) => void;
	isGoalsReport: boolean;
	goal?: Goal;
}

const RevenueForecastChart = ({
	chartType,
	isShownAsWidget = false,
	groupedAndSegmentedData,
	segmentBy,
	measureByFilter,
	uniqueSegments,
	intervalFilter,
	axisDataKey,
	showChartListView,
	isGoalsReport,
	goal,
}: RevenueForecastChartProps) => {
	const translator = useTranslator();
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);
	const measureByLabel = getMeasureByLabel(
		measureByFilter,
		fields,
		translator,
	);

	const getChart = () => {
		switch (chartType) {
			case insightsTypes.ChartType.COLUMN:
				const columnProps = {
					widget: isShownAsWidget,
					hasSegment: false,
					groupedAndSegmentedData,
					segmentBy,
					uniqueSegments,
					measureByFilter,
					intervalFilter,
					xAxisDataKey: axisDataKey,
					showChartListView,
					valueFormatter: (value: number) =>
						getValueForChart({ value, isMeasureByMonetary: true }),
					customTooltip: (
						<RevenueForecastTooltip
							measureByFilter={measureByFilter}
							intervalFilter={intervalFilter}
						/>
					),
					yAxisTickFormatter: (value: number) =>
						getValueForChart({
							value,
							precision: AXIS_DECIMAL_PLACES,
							isMeasureByMonetary: true,
						}),
				};

				return isGoalsReport && goal ? (
					<GoalColumn
						{...{
							...columnProps,
							goal,
							yAxisLabel: measureByLabel,
							visualization: 'singleGoalLine',
							customTooltip: (
								<GoalRevenueForecastTooltip
									measureByFilter={measureByFilter}
									goal={goal}
								/>
							),
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

export default RevenueForecastChart;
