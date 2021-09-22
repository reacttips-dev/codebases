import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Interval } from '@pipedrive/insights-core/lib/types';

import ChartAxisTick from '../../ChartAxisTick';
import { ChartElementColor } from '../chartStyleConstants';
import { isoDateType } from '../../../utils/dateFormatter';

interface RechartsProps {
	x?: number;
	y?: number;
	payload?: any;
	width?: number;
	textAnchor?: any;
}

interface CustomChartAxisTickOwnProps {
	axis?: 'x' | 'y';
	yAxisTickFormatter: (value: number) => any;
	formatIntervals: (interval: Interval, isoDate: isoDateType) => any;
	intervalFilter: insightsTypes.Interval;
	getYAxisMaxChars: (isWidget: boolean) => any;
	isWidget: boolean;
	groupedAndSegmentedData: any[];
}

export interface CustomChartAxisTickProps
	extends RechartsProps,
		CustomChartAxisTickOwnProps {}

const CustomChartAxisTick: React.FC<CustomChartAxisTickProps> = (props) => {
	const {
		x,
		y,
		payload,
		width,
		textAnchor,
		axis,
		yAxisTickFormatter,
		formatIntervals,
		intervalFilter,
		getYAxisMaxChars,
		isWidget,
		groupedAndSegmentedData,
	} = props;

	const { value } = payload;

	const isYAxis = axis === 'y';
	const formattedValue =
		isYAxis && yAxisTickFormatter
			? yAxisTickFormatter(value)
			: formatIntervals(intervalFilter, value) || value;

	const maxChars = isYAxis
		? getYAxisMaxChars(isWidget)
		: Math.ceil(width / groupedAndSegmentedData.length / 8);
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
			value={String(formattedValue)}
		/>
	);
};

export default CustomChartAxisTick;
