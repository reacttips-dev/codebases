import React from 'react';
import { Point, Rectangle } from 'recharts';

import { ChartElementColor } from '../chartStyleConstants';

export interface SingleGoalLineCustomCursorProps {
	width?: number;
	height?: number;
	points?: ReadonlyArray<Point>;
	itemsCount?: number;
}

const SingleGoalLineCustomCursor: React.FC<SingleGoalLineCustomCursorProps> = ({
	width,
	height,
	points,
	itemsCount,
}) => {
	const barWidth = width / itemsCount;
	const halfBarWidth = barWidth / 2;

	return (
		<Rectangle
			fill={String(ChartElementColor.TOOLTIP_CURSOR)}
			x={points[0].x - halfBarWidth}
			y={points[0].y}
			width={barWidth}
			height={height}
		/>
	);
};

export default SingleGoalLineCustomCursor;
