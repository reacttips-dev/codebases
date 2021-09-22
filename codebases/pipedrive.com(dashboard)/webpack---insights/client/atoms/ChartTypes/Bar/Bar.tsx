import React, { ReactElement } from 'react';
import classNames from 'classnames';
import {
	BarChart as RechartBarChart,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	LabelProps,
	Label,
} from 'recharts';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { formatIntervals } from '../../../utils/dateFormatter';
import { isPublicPage } from '../../../utils/helpers';
import ChartAxisTick from '../../../atoms/ChartAxisTick';
import TooltipCustomCursor from '../../TooltipCustomCursor';
import {
	getAxisDomain,
	getBars,
	getValueForChart,
	doesChartItemHaveData,
} from '../chartTypeUtils';
import {
	AXIS_DECIMAL_PLACES,
	ChartElementColor,
	CONTAINER_HEIGHT,
} from '../chartStyleConstants';
import { UniqueSegment } from '../../../types/data-layer';
import { ListViewSegmentDataType } from '../../../types/list-view';
import {
	getValueFormatBasedOnMeasureBy,
	ValueFormat,
} from '../../../utils/valueFormatter';

import styles from './Bar.pcss';

interface BarProps {
	widget: boolean;
	groupedAndSegmentedData: any[];
	segmentBy: string;
	isMeasureByMonetary: boolean;
	uniqueSegments: UniqueSegment[];
	intervalFilter: insightsTypes.Interval;
	hasSegment: boolean;
	axisDataKey: string;
	showChartListView: (data: ListViewSegmentDataType) => void;
	valueFormatter: (value: number) => any;
	customTooltip?: ReactElement;
	xAxisLabel?: string;
	staticDataKey?: string;
	measureByFilter: string;
}

const Bar: React.FC<BarProps> = ({
	widget,
	groupedAndSegmentedData,
	segmentBy,
	isMeasureByMonetary,
	uniqueSegments,
	intervalFilter,
	hasSegment,
	axisDataKey,
	showChartListView,
	customTooltip,
	valueFormatter,
	xAxisLabel,
	staticDataKey,
	measureByFilter,
}) => {
	const CustomChartAxisTick = (props: any) => {
		const { x, y, payload, width, textAnchor } = props;
		const formattedValue =
			formatIntervals(intervalFilter, payload.value) || payload.value;
		const value = payload && formattedValue;

		return (
			<ChartAxisTick
				x={x}
				y={y}
				width={width}
				textAnchor={textAnchor}
				fill={ChartElementColor.AXIS_TICK}
				lineHeight={6}
				fontSize={12}
				maxChars={15}
				value={value}
			/>
		);
	};

	const chartMarginProps = widget
		? { top: 0, right: 48, left: 0, bottom: 5 }
		: { top: -6, right: 48, left: 20, bottom: 5 };
	const containerHeight = widget ? '100%' : CONTAINER_HEIGHT;
	const xAxisDomain = getAxisDomain(uniqueSegments);
	const xAxisLabelProps: LabelProps = {
		value: xAxisLabel,
		position: 'insideBottom',
	};

	const allowDecimals =
		getValueFormatBasedOnMeasureBy(measureByFilter) !== ValueFormat.COUNT;

	return (
		<ResponsiveContainer height={containerHeight}>
			<RechartBarChart
				className={classNames(styles.chart, {
					[styles.chartInWidget]: widget,
				})}
				data={groupedAndSegmentedData}
				layout="vertical"
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
				<CartesianGrid horizontal={false} strokeWidth={1} />
				<XAxis
					type="number"
					tickLine={false}
					axisLine={false}
					domain={xAxisDomain}
					tickFormatter={(value) =>
						getValueForChart({
							value,
							isMeasureByMonetary,
							precision: AXIS_DECIMAL_PLACES,
						})
					}
					padding={{ right: 16, left: 0 }}
					allowDecimals={allowDecimals}
				>
					<Label {...xAxisLabelProps} />
				</XAxis>
				<YAxis
					type="category"
					dataKey={axisDataKey}
					interval={0}
					tickLine={false}
					axisLine={false}
					tick={<CustomChartAxisTick />}
					width={100}
				/>
				<Tooltip
					cursor={<TooltipCustomCursor widthModifier={12} />}
					{...(customTooltip ? { content: customTooltip } : {})}
				/>
				{getBars({
					segmentBy,
					uniqueSegments,
					hasSegment,
					valueFormatter,
					staticDataKey,
					labelPosition: 'right',
					chartType: insightsTypes.ChartType.BAR,
				})}
			</RechartBarChart>
		</ResponsiveContainer>
	);
};

export default Bar;
