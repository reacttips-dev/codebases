import React, { ReactElement } from 'react';
import {
	ComposedChart,
	BarChart,
	Bar as RechartBar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ReferenceLine,
	ResponsiveContainer,
	LabelList,
	PositionType,
	AxisDomain,
	Percentage,
	Line as RechartsLine,
} from 'recharts';
import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';

import ChartAxisTick from '../../../atoms/ChartAxisTick';
import TooltipCustomCursor from '../../TooltipCustomCursor';
import { ChartElementColor, CONTAINER_HEIGHT } from '../chartStyleConstants';
import { getYAxisMaxChars, doesChartItemHaveData } from '../chartTypeUtils';
import { getCursor } from '../../../utils/styleUtils';
import { ListViewSegmentDataType } from '../../../types/list-view';
import { isPublicPage } from '../../../utils/helpers';

import styles from './BarChartStackedBySign.pcss';

export enum StackedBarChartLabelControl {
	TOTAL = 'total',
	ALL = 'all',
	NONE = 'none',
}

interface BarChartStackedBySignProps {
	data: any;
	isShownAsWidget: boolean;
	bars: BarChartStackedBySignBar[];
	valueFormatter: (value: number) => string | number;
	yAxisValueRange?: [AxisDomain, AxisDomain];
	customTooltip?: ReactElement;
	lines?: any;
	showBarLabels?: StackedBarChartLabelControl;
	showChartListView?: (data: ListViewSegmentDataType) => void;
	segmentBy?: any;
	uniqueSegments?: any;
}

interface BarChartStackedBySignBar {
	dataKey: string;
	fillColor: string;
}

interface CustomChartStyles {
	xAxis: XAxisStyles;
	chart: BarChartStyles;
	bar: BarStyles;
	referenceLine: ReferenceLineStyles;
	responsiveContainer: ResponsiveContainerStyles;
}

interface BarChartStyles {
	margin: Object;
	width: number;
	height: number;
	gapSizeBetweenBars: string;
}

interface XAxisStyles {
	labelVisibilityInterval: number;
	labelsMargin: number;
}

interface BarStyles {
	cornerRadius: number[];
	labelPosition: PositionType;
	labelDistanceFromBar: number;
	tooltipHoverColor: ChartElementColor;
}

interface ReferenceLineStyles {
	yCoordinate: number;
	color: string;
	isRenderedOnTopOfBars: boolean;
	width: number;
}

interface ResponsiveContainerStyles {
	height: Percentage | number;
}

const BarChartStackedBySign = ({
	data,
	isShownAsWidget = false,
	bars,
	valueFormatter,
	yAxisValueRange,
	customTooltip,
	lines,
	showBarLabels = StackedBarChartLabelControl.TOTAL,
	showChartListView,
}: BarChartStackedBySignProps) => {
	const Chart = lines ? ComposedChart : BarChart;
	const containerHeight = isShownAsWidget ? '100%' : CONTAINER_HEIGHT;
	const chartStyles: CustomChartStyles = {
		responsiveContainer: {
			height: containerHeight,
		},
		chart: {
			margin: { top: 18, right: 0, left: 0, bottom: 15 },
			width: 500,
			height: 300,
			gapSizeBetweenBars: '16%',
		},
		bar: {
			cornerRadius: [2, 2, 0, 0],
			labelPosition: 'top',
			labelDistanceFromBar: 12,
			tooltipHoverColor: ChartElementColor.TOOLTIP_CURSOR,
		},
		xAxis: { labelsMargin: 15, labelVisibilityInterval: 0 },
		referenceLine: {
			yCoordinate: 0,
			color: colors['$color-black-hex-16'],
			isRenderedOnTopOfBars: true,
			width: 2,
		},
	};

	const CustomChartAxisTick = (props: any) => {
		const { x, y, payload, width, textAnchor, axis } = props;
		const isYAxis = axis === 'y';
		const value = isYAxis ? valueFormatter(payload.value) : payload.value;
		const maxChars = isYAxis
			? getYAxisMaxChars(isShownAsWidget)
			: Math.ceil(width / data.length / 8);
		const yPosition = isYAxis ? y - 9 : y;

		return (
			<ChartAxisTick
				x={x}
				y={yPosition}
				width={width}
				textAnchor={textAnchor}
				fill={ChartElementColor.AXIS_TICK}
				lineHeight={14}
				fontSize={12}
				maxChars={maxChars}
				value={String(value)}
			/>
		);
	};

	const renderLabelList = (barIndex: number) => {
		if (showBarLabels === StackedBarChartLabelControl.NONE) {
			return null;
		}

		if (
			showBarLabels === StackedBarChartLabelControl.TOTAL &&
			barIndex + 1 < bars.length
		) {
			return null;
		}

		return (
			<LabelList
				position={chartStyles.bar.labelPosition}
				valueAccessor={
					showBarLabels === StackedBarChartLabelControl.TOTAL
						? (entry) => entry.total
						: undefined
				}
				formatter={(value: number) => {
					if (value === 0) {
						return;
					}

					return valueFormatter(value);
				}}
			/>
		);
	};

	return (
		<ResponsiveContainer height={containerHeight}>
			<Chart
				className={styles.stackedBarChart}
				width={chartStyles.chart.width}
				height={chartStyles.chart.height}
				data={data}
				stackOffset="sign"
				margin={chartStyles.chart.margin}
				barCategoryGap={chartStyles.chart.gapSizeBetweenBars}
				onClick={(data) =>
					!isPublicPage() &&
					doesChartItemHaveData(data) &&
					showChartListView?.({
						groupId: data.activePayload[0].payload?.id,
						listName: data.activePayload[0].payload?.name,
					})
				}
			>
				<CartesianGrid vertical={false} strokeWidth={1} />
				<XAxis
					dataKey="name"
					tickLine={false}
					axisLine={false}
					tick={<CustomChartAxisTick />}
					interval={chartStyles.xAxis.labelVisibilityInterval}
					tickMargin={chartStyles.xAxis.labelsMargin}
				/>
				<YAxis
					domain={yAxisValueRange}
					tickLine={false}
					axisLine={false}
					tick={<CustomChartAxisTick axis="y" />}
				/>
				<Tooltip
					cursor={
						<TooltipCustomCursor
							yModifier={-24}
							heightModifier={44}
						/>
					}
					{...(customTooltip ? { content: customTooltip } : {})}
				/>
				{bars.map((bar: BarChartStackedBySignBar, index: number) => {
					return (
						<RechartBar
							key={`bar_${index}`}
							dataKey={bar.dataKey}
							fill={bar.fillColor}
							stackId="stack"
							radius={chartStyles.bar.cornerRadius}
							isAnimationActive={false}
							cursor={getCursor()}
						>
							{renderLabelList(index)}
						</RechartBar>
					);
				})}
				<ReferenceLine
					y={chartStyles.referenceLine.yCoordinate}
					stroke={chartStyles.referenceLine.color}
					isFront={chartStyles.referenceLine.isRenderedOnTopOfBars}
					strokeWidth={chartStyles.referenceLine.width}
				/>
				{lines &&
					lines.map((line: any, index: number) => {
						return (
							<RechartsLine
								key={`line_${index}`}
								type="linear"
								dataKey={line.dataKey}
								stroke={line.fillColor}
								dot={false}
								activeDot={false}
								strokeWidth={3}
							/>
						);
					})}
			</Chart>
		</ResponsiveContainer>
	);
};

export default BarChartStackedBySign;
