import React from 'react';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import Column from '../../atoms/ChartTypes/Column';
import Bar from '../../atoms/ChartTypes/Bar';
import { getValueForChart } from '../../atoms/ChartTypes/chartTypeUtils';
import ProgressTooltip from '../../atoms/ChartTooltip/ProgressTooltip';
import {
	DATE_STAGE_ENTERED,
	PROGRESS_DEFAULT_GROUPING,
} from '../../utils/constants';
import { Goal } from '../../types/goals';
import { getMeasureByLabel } from '../../utils/filterUtils';
import GoalColumn from '../../atoms/ChartTypes/Column/GoalColumn';
import useReportOptions from '../../hooks/useReportOptions';
import GoalTooltip from '../../atoms/ChartTooltip/GoalTooltip/GoalTooltip';
import { ListViewSegmentDataType } from '../../types/list-view';
import { AXIS_DECIMAL_PLACES } from '../../atoms/ChartTypes/chartStyleConstants';

interface ProgressChartProps {
	chartType: insightsTypes.ChartType;
	isShownAsWidget: boolean;
	hasSegment: boolean;
	groupedAndSegmentedData: any;
	segmentByFilter: string;
	isMeasureByMonetary: boolean;
	uniqueSegments: any;
	intervalFilter: any;
	axisDataKey: any;
	showChartListView: (data: ListViewSegmentDataType) => void;
	groupByFilter: string;
	measureByFilter: string;
	isGoalsReport: boolean;
	goal?: Goal;
}

const ProgressChart = ({
	chartType,
	isShownAsWidget = false,
	hasSegment = false,
	groupedAndSegmentedData,
	segmentByFilter,
	isMeasureByMonetary = false,
	uniqueSegments,
	intervalFilter,
	axisDataKey,
	showChartListView,
	groupByFilter,
	measureByFilter,
	isGoalsReport,
	goal,
}: ProgressChartProps) => {
	const translator = useTranslator();
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);

	const measureByLabel = getMeasureByLabel(
		measureByFilter,
		fields,
		translator,
	);
	const primaryAxisDataKey =
		groupByFilter === DATE_STAGE_ENTERED ? 'name' : axisDataKey;

	const progressSegmentBy =
		groupByFilter === PROGRESS_DEFAULT_GROUPING
			? segmentByFilter || groupByFilter
			: PROGRESS_DEFAULT_GROUPING;
	const columnChartProps = {
		widget: isShownAsWidget,
		hasSegment,
		measureByFilter,
		groupedAndSegmentedData,
		segmentBy: progressSegmentBy,
		uniqueSegments,
		intervalFilter,
		xAxisDataKey: primaryAxisDataKey,
		showChartListView,
		valueFormatter: (value: number) =>
			getValueForChart({ value, isMeasureByMonetary }),
		customTooltip: (
			<ProgressTooltip
				isMeasureByMonetary={isMeasureByMonetary}
				measureByFilter={measureByFilter}
				intervalFilter={intervalFilter}
				groupByFilter={groupByFilter}
				hasSegment={hasSegment}
				groupedAndSegmentedData={groupedAndSegmentedData}
			/>
		),
		yAxisTickFormatter: (value: number) =>
			getValueForChart({
				value,
				precision: AXIS_DECIMAL_PLACES,
				isMeasureByMonetary,
			}),
	};

	if (isGoalsReport && goal) {
		return (
			<GoalColumn
				{...{
					...columnChartProps,
					yAxisLabel: measureByLabel,
					goal,
					customTooltip: <GoalTooltip goal={goal} />,
				}}
			/>
		);
	}

	if (chartType === insightsTypes.ChartType.BAR) {
		return (
			<Bar
				{...columnChartProps}
				isMeasureByMonetary={helpers.deals.isMeasureByMonetary(
					measureByFilter,
				)}
				measureByFilter={measureByFilter}
				axisDataKey={primaryAxisDataKey}
			/>
		);
	}

	return <Column {...columnChartProps} />;
};

export default ProgressChart;
