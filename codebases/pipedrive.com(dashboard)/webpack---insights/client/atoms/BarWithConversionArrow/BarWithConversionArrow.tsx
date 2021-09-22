import React from 'react';
import { Rectangle } from 'recharts';

import { CONVERSION_SHAPE } from '../../utils/constants';
import { FunnelChartItemColor } from '../ChartTypes/chartStyleConstants';

interface BarWithConversionArrowProps {
	lastIndex: number;
	hasNextPage: boolean;
	barCategoryGapRatio: number;
	x: number;
	y: number;
	width: number;
	height: number;
	index: number;
	conversionFrom?: number;
}

const BarWithConversionArrow = (props: BarWithConversionArrowProps) => {
	const {
		x,
		y,
		width,
		height,
		index,
		lastIndex,
		conversionFrom,
		hasNextPage,
		barCategoryGapRatio,
	} = props;

	const conversionShapeWidth =
		CONVERSION_SHAPE.BASE_WIDTH + CONVERSION_SHAPE.ARROW_WIDTH;
	const barWidth = width - conversionShapeWidth;

	const stageBar = index !== lastIndex;
	const barFill = stageBar
		? FunnelChartItemColor.STAGE_BAR
		: FunnelChartItemColor.WON_BAR;

	const rectangleProps = {
		...props,
		width: barWidth,
		x,
		fill: barFill,
	};

	const getConversionArrow = (xCoordinate: number, yCoordinate: number) => {
		const baseWidth = CONVERSION_SHAPE.BASE_WIDTH;
		const arrowWidth = CONVERSION_SHAPE.ARROW_WIDTH;

		return `M${xCoordinate},${yCoordinate}
			L${xCoordinate + baseWidth} ${yCoordinate}
			L${xCoordinate + arrowWidth + baseWidth}${' '}
			${yCoordinate + CONVERSION_SHAPE.HEIGTH / 2}
			L${xCoordinate + baseWidth} ${yCoordinate + CONVERSION_SHAPE.HEIGTH}
			L${xCoordinate} ${yCoordinate + CONVERSION_SHAPE.HEIGTH}
			Z`;
	};

	const getTruncatedConversionArrow = (
		xCoordinate: number,
		yCoordinate: number,
	) => {
		const width = CONVERSION_SHAPE.BASE_WIDTH / 2;

		return `M${xCoordinate},${yCoordinate}
			L${xCoordinate + width} ${yCoordinate}
			L${xCoordinate + width} ${yCoordinate + CONVERSION_SHAPE.HEIGTH}
			L${xCoordinate} ${yCoordinate + CONVERSION_SHAPE.HEIGTH}
			Z`;
	};

	const getConversionShape = (
		xCoordinate: number,
		yCoordinate: number,
		index: number,
	) => {
		if (hasNextPage && index === lastIndex - 1) {
			return getTruncatedConversionArrow(xCoordinate, yCoordinate);
		}

		return getConversionArrow(xCoordinate, yCoordinate);
	};

	const ConversionElement = () => {
		const chartHeight = y + height;
		const dataPointWidth = x + width;
		const conversionShapeYCoordinate =
			chartHeight -
			(CONVERSION_SHAPE.HEIGHT_FROM_X_AXIS + CONVERSION_SHAPE.HEIGTH);
		const barCategoryGapWidth = width / barCategoryGapRatio;
		const conversionShapeXCoordinate =
			dataPointWidth - conversionShapeWidth + barCategoryGapWidth / 2;

		return (
			<>
				<path
					key={index}
					d={getConversionShape(
						conversionShapeXCoordinate,
						conversionShapeYCoordinate,
						index,
					)}
					stroke="none"
					fill={FunnelChartItemColor.CONVERSION_ARROW}
				/>
				<text
					key={`${index}_text`}
					x={
						conversionShapeXCoordinate +
						CONVERSION_SHAPE.PADDING.HORIZONTAL
					}
					y={
						conversionShapeYCoordinate +
						CONVERSION_SHAPE.PADDING.VERTICAL
					}
					fill="#fff"
					fontSize={13}
					textAnchor="middle"
					dominantBaseline="middle"
				>
					{conversionFrom}%
				</text>
			</>
		);
	};

	return (
		<g>
			<Rectangle {...rectangleProps} />
			{index !== lastIndex && <ConversionElement />}
		</g>
	);
};

export default React.memo(BarWithConversionArrow);
