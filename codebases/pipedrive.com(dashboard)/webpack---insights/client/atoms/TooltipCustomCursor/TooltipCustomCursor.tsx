import React from 'react';
import { Rectangle } from 'recharts';

import { ChartElementColor } from '../ChartTypes/chartStyleConstants';

export interface TooltipCustomCursorProps {
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	yModifier?: number;
	heightModifier?: number;
	widthModifier?: number;
}

const TooltipCustomCursor: React.FC<TooltipCustomCursorProps> = ({
	x,
	y,
	width,
	height,
	yModifier = 0,
	heightModifier = 0,
	widthModifier = 0,
}) => (
	<Rectangle
		fill={ChartElementColor.TOOLTIP_CURSOR as any as string}
		x={x}
		y={y + yModifier}
		width={width + widthModifier}
		height={height + heightModifier}
	/>
);

export default TooltipCustomCursor;
