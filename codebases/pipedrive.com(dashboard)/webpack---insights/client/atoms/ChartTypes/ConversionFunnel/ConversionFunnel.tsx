import React, { useEffect } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import classNames from 'classnames';
import { Translator } from '@pipedrive/react-utils';
import { helpers } from '@pipedrive/insights-core';

import { getValueForChart, getYAxisMaxChars } from '../chartTypeUtils';
import { updatePaginationLinePosition } from './conversionFunnelUtils';
import BarWithConversionArrow from '../../BarWithConversionArrow';
import ChartTooltip from '../../ChartTooltip';
import ChartAxisTick from '../../ChartAxisTick';
import TooltipCustomCursor from '../../TooltipCustomCursor';
import getFunnelConversionTooltipItems from '../../ChartTooltip/getFunnelConversionTooltipItems';
import { CONVERSION_SHAPE } from '../../../utils/constants';
import {
	AXIS_DECIMAL_PLACES,
	ChartElementColor,
	CONTAINER_HEIGHT,
} from '../chartStyleConstants';
import { FunnelChartSummaryDataObject } from '../../../types/data-layer';
import {
	getValueFormatBasedOnMeasureBy,
	ValueFormat,
} from '../../../utils/valueFormatter';

import styles from './ConversionFunnel.pcss';

interface ConversionFunnelProps {
	isShownAsWidget?: boolean;
	data: any;
	chartSummaryData: FunnelChartSummaryDataObject;
	measureByCustomName?: string;
	measureByFilter: string;
	hasNextPage: boolean;
	translator: Translator;
	paginationLineRightPosition?: number;
	setPaginationLineRightPosition: any;
}

const ConversionFunnel = ({
	isShownAsWidget = false,
	data,
	chartSummaryData,
	measureByCustomName,
	measureByFilter,
	hasNextPage = false,
	translator,
	paginationLineRightPosition,
	setPaginationLineRightPosition,
}: ConversionFunnelProps) => {
	const measureByFilterType =
		helpers.deals.getMeasureByFilterType(measureByFilter);
	const isMeasureByMonetary =
		helpers.deals.isMeasureByMonetary(measureByFilter);

	const conversionShapeWidth =
		CONVERSION_SHAPE.BASE_WIDTH + CONVERSION_SHAPE.ARROW_WIDTH;
	const barCategoryGapRatio = 3.9;
	const chartMarginProps = isShownAsWidget
		? {
				top: 16,
				right: conversionShapeWidth * -1,
				left: -20,
				bottom: -4,
		  }
		: {
				top: 16,
				right: conversionShapeWidth * -1,
				left: 0,
				bottom: 5,
		  };
	const containerHeight = isShownAsWidget ? '100%' : CONTAINER_HEIGHT;
	const truncatedConversionShapeWidth = CONVERSION_SHAPE.BASE_WIDTH / 2;
	const allowDecimals =
		getValueFormatBasedOnMeasureBy(measureByFilter) !== ValueFormat.COUNT;

	const CustomLabel = (props: any) => {
		const { x, y, width, offset, value } = props;
		const formattedValue = getValueForChart({
			value,
			isMeasureByMonetary,
		});
		const barWidth = width - conversionShapeWidth;
		const xPosition = x + barWidth / 2;

		return (
			<text
				x={xPosition}
				y={y}
				dy={offset * -1}
				fontWeight="bold"
				fontSize={13}
				textAnchor="middle"
			>
				{formattedValue}
			</text>
		);
	};

	const CustomChartAxisTick = (props: any) => {
		const { x, y, payload, width, textAnchor, axis } = props;
		const isYAxis = axis === 'y';
		const value = payload && payload.value;
		const formattedValue = isYAxis
			? getValueForChart({
					value,
					precision: AXIS_DECIMAL_PLACES,
					isMeasureByMonetary,
			  })
			: value;
		const maxChars = isYAxis
			? getYAxisMaxChars(isShownAsWidget)
			: Math.ceil(width / data.length / 8);
		const xPosition = isYAxis ? x : x - conversionShapeWidth / 2;
		const yPosition = isYAxis ? y - 9 : y;

		useEffect(() => {
			updatePaginationLinePosition({
				isYAxis,
				hasNextPage,
				dataLength: data.length,
				axisWidth: width,
				truncatedConversionShapeWidth,
				paginationLineRightPosition,
				setPaginationLineRightPosition,
			});
		}, [width, data, hasNextPage]);

		return (
			<ChartAxisTick
				x={xPosition}
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

	const CustomTooltip = (props: any) => {
		const { active, payload, label } = props;
		const tooltipItems = getFunnelConversionTooltipItems({
			payload,
			data,
			chartSummaryData,
			hasNextPage,
			measureByFilter,
			measureByCustomName,
			translator,
		});

		if (active) {
			return (
				<ChartTooltip
					title={label}
					tooltipItems={tooltipItems}
					isReversed
				/>
			);
		}

		return null;
	};

	const renderDataPointShape = (props: any) => {
		const { x, y, width, height, index, conversionFrom } = props;

		return (
			<BarWithConversionArrow
				lastIndex={data.length - 1}
				hasNextPage={hasNextPage}
				barCategoryGapRatio={barCategoryGapRatio}
				x={x}
				y={y}
				width={width}
				height={height}
				index={index}
				conversionFrom={conversionFrom}
			/>
		);
	};

	return (
		<>
			<ResponsiveContainer height={containerHeight}>
				<BarChart
					className={classNames(styles.chart, {
						[styles.chartInWidget]: isShownAsWidget,
					})}
					margin={chartMarginProps}
					data={data}
				>
					<CartesianGrid vertical={false} strokeWidth={1} />
					<YAxis
						axisLine={false}
						tickLine={false}
						tick={<CustomChartAxisTick axis="y" />}
						allowDecimals={allowDecimals}
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={
							<TooltipCustomCursor
								yModifier={-24}
								heightModifier={24}
							/>
						}
					/>
					<Bar
						dataKey={measureByFilterType}
						label={<CustomLabel />}
						shape={renderDataPointShape}
						isAnimationActive={false}
					/>
					<XAxis
						dataKey="name"
						tickLine={false}
						axisLine={false}
						interval={0}
						tick={<CustomChartAxisTick />}
					/>
				</BarChart>
			</ResponsiveContainer>
			<div
				className={classNames(styles.paginationLine, {
					[styles.visiblePaginationLine]: hasNextPage,
				})}
				style={{ right: paginationLineRightPosition }}
			/>
		</>
	);
};

export default React.memo(ConversionFunnel);
