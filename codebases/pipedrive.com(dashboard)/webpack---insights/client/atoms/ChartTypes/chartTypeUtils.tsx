import React from 'react';
import {
	AxisDomain,
	Bar as RechartBar,
	LabelList,
	PositionType,
} from 'recharts';
import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { numberFormatter } from '../../utils/numberFormatter';
import { getColor, getCursor } from '../../utils/styleUtils';
import { UniqueSegment } from '../../types/data-layer';

interface CustomLabelProps {
	width: number;
	value: number;
}

export const getValueForChart = ({
	value,
	isMeasureByMonetary,
	precision = 3,
}: {
	value: number;
	isMeasureByMonetary: boolean;
	precision?: number;
}): string | number => {
	if (!isMeasureByMonetary && value < 1000) {
		return value;
	}

	return numberFormatter.abbreviateNumber({
		value,
		precision,
		isMonetary: isMeasureByMonetary,
	});
};

export const getYAxisMaxChars = (isWidget: boolean) => (isWidget ? 6 : 8);

export const getAxisDomain = (
	data: UniqueSegment[],
): [AxisDomain, AxisDomain] => (data.length ? [0, 'auto'] : [0, 10]);

export const doesChartItemHaveData = (chartData: {
	activeCoordinate: { x: number; y: number };
	activeLabel: string;
	activePayload: any[];
	activeTooltipIndex: number;
	chartX: number;
	chartY: number;
}) =>
	chartData?.activePayload?.length > 0 &&
	chartData?.activePayload?.some((segment) => segment.value);

export const isStackedBarOrderReversed = (segmentByFilter: string) =>
	['stageId', 'type'].includes(segmentByFilter);

const getBar = ({
	dataKey,
	segmentName,
	uniqueSegments,
	hasSegment,
	valueFormatter,
	labelPosition,
	staticDataKey,
	barIndex = 0,
	chartType,
	segmentBy,
}: {
	dataKey: string;
	segmentName: string;
	uniqueSegments: UniqueSegment[];
	hasSegment: boolean;
	valueFormatter: (value: number) => string;
	staticDataKey?: string;
	barIndex?: number;
	labelPosition: PositionType;
	chartType: insightsTypes.ChartType;
	isRevenueReport?: boolean;
	segmentBy?: string;
}) => {
	const isLastSegment = isStackedBarOrderReversed(segmentBy)
		? barIndex === 0
		: barIndex === uniqueSegments.length - 1;
	const shouldAddLabel = !!staticDataKey || isLastSegment;

	const renderCustomLabel = (props: CustomLabelProps) => {
		const { width, value } = props;
		const canBarFitLabel = width > 21;
		const isBarChart = chartType === insightsTypes.ChartType.BAR;

		if (shouldAddLabel && (canBarFitLabel || isBarChart)) {
			return valueFormatter(value);
		}
		return null;
	};

	return (
		<RechartBar
			key={dataKey}
			dataKey={dataKey}
			name={segmentName}
			fill={getColor(segmentName, barIndex, hasSegment)}
			stroke={colors['$color-white-hex']}
			isAnimationActive={false}
			cursor={getCursor()}
			stackId="a"
		>
			<LabelList
				dataKey={undefined} // hack to make sure label is always applied to the most top segment & all label values are added together
				position={labelPosition}
				content={renderCustomLabel}
			/>
		</RechartBar>
	);
};

export const getBars = ({
	segmentBy,
	uniqueSegments,
	hasSegment,
	valueFormatter,
	staticDataKey,
	labelPosition,
	chartType,
}: {
	segmentBy: string;
	uniqueSegments: UniqueSegment[];
	hasSegment: boolean;
	valueFormatter: (value: number) => string;
	staticDataKey?: string;
	labelPosition: PositionType;
	chartType: insightsTypes.ChartType;
	isRevenueReport?: boolean;
}) => {
	const getBarDefaultProps = {
		uniqueSegments,
		hasSegment,
		valueFormatter,
		staticDataKey,
		labelPosition,
		chartType,
	};

	if (staticDataKey) {
		return getBar({
			...getBarDefaultProps,
			dataKey: staticDataKey,
			segmentName: segmentBy,
			segmentBy,
		});
	}

	const bars = uniqueSegments.map((segment: any, index: number) =>
		getBar({
			...getBarDefaultProps,
			dataKey: `${segmentBy}.${segment.id}`,
			segmentName: segment.name,
			barIndex: index,
			segmentBy,
		}),
	);

	return isStackedBarOrderReversed(segmentBy) ? bars.reverse() : bars;
};
