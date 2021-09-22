import React, { ReactElement } from 'react';
import {
	CartesianGrid,
	BarChart,
	XAxis,
	YAxis,
	Label,
	Tooltip,
	LabelProps,
	ResponsiveContainer,
} from 'recharts';
import classNames from 'classnames';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { formatIntervals } from '../../../utils/dateFormatter';
import { isPublicPage } from '../../../utils/helpers';
import { CONTAINER_HEIGHT } from '../chartStyleConstants';
import {
	getAxisDomain,
	getBars,
	getYAxisMaxChars,
	doesChartItemHaveData,
} from '../chartTypeUtils';
import CustomChartAxisTick from './CustomChartAxisTick';
import TooltipCustomCursor from '../../TooltipCustomCursor';
import { ListViewSegmentDataType } from '../../../types/list-view';
import {
	getValueFormatBasedOnMeasureBy,
	ValueFormat,
} from '../../../utils/valueFormatter';

import styles from './Column.pcss';

interface ColumnProps {
	widget: boolean;
	groupedAndSegmentedData: any;
	segmentBy: string;
	uniqueSegments: any;
	intervalFilter: insightsTypes.Interval;
	hasSegment: boolean;
	xAxisDataKey: string;
	valueFormatter: (value: number) => any;
	yAxisTickFormatter?: (value: number) => any;
	customTooltip?: ReactElement;
	yAxisLabel?: string;
	showChartListView?: (data: ListViewSegmentDataType) => void;
	staticDataKey?: string;
	measureByFilter: string;
}

const Column = ({
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
	measureByFilter,
}: ColumnProps) => {
	const chartMarginProps = widget
		? { top: 0, right: 0, left: -22, bottom: -20 }
		: { top: 0, right: 0, left: 0, bottom: -4 };
	const containerHeight = widget ? '100%' : CONTAINER_HEIGHT;

	const yAxisLabelProps: LabelProps = {
		value: yAxisLabel,
		angle: -90,
		position: 'insideLeft',
		style: { textAnchor: 'middle' },
	};

	const yAxisDomain = getAxisDomain(uniqueSegments);
	const allowDecimals =
		getValueFormatBasedOnMeasureBy(measureByFilter) !== ValueFormat.COUNT;

	return (
		<ResponsiveContainer height={containerHeight}>
			<BarChart
				className={classNames(styles.chart, {
					[styles.chartInWidget]: widget,
				})}
				data={groupedAndSegmentedData}
				margin={chartMarginProps}
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
					axisLine={false}
					tickLine={false}
					dataKey={xAxisDataKey}
					tick={
						<CustomChartAxisTick
							yAxisTickFormatter={yAxisTickFormatter}
							formatIntervals={formatIntervals}
							intervalFilter={intervalFilter}
							getYAxisMaxChars={getYAxisMaxChars}
							isWidget={widget}
							groupedAndSegmentedData={groupedAndSegmentedData}
						/>
					}
					height={45}
					interval={0}
				/>
				<YAxis
					padding={{ top: 16, bottom: 0 }}
					axisLine={false}
					tickLine={false}
					domain={yAxisDomain}
					allowDecimals={allowDecimals}
					tick={
						<CustomChartAxisTick
							axis="y"
							yAxisTickFormatter={yAxisTickFormatter}
							formatIntervals={formatIntervals}
							intervalFilter={intervalFilter}
							getYAxisMaxChars={getYAxisMaxChars}
							isWidget={widget}
							groupedAndSegmentedData={groupedAndSegmentedData}
						/>
					}
				>
					<Label {...yAxisLabelProps} />
				</YAxis>
				<Tooltip
					cursor={
						<TooltipCustomCursor
							yModifier={-10}
							heightModifier={10}
						/>
					}
					{...(customTooltip ? { content: customTooltip } : {})}
				/>
				{getBars({
					segmentBy,
					uniqueSegments,
					hasSegment,
					valueFormatter,
					staticDataKey,
					labelPosition: 'top',
					chartType: insightsTypes.ChartType.COLUMN,
				})}
			</BarChart>
		</ResponsiveContainer>
	);
};

export default Column;
