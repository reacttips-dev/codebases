import React from 'react';
import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';

import { getCursor } from '../../../utils/styleUtils';

interface RechartsProps {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	index?: number;
}

interface CustomGoalBarOwnProps {
	barIndex: number;
}

export interface CustomGoalBarProps
	extends RechartsProps,
		CustomGoalBarOwnProps {}

const CustomGoalBar: React.FC<CustomGoalBarProps> = (props) => {
	const { x, y, width, height, index, barIndex } = props;

	return (
		barIndex === index && (
			<g cursor={getCursor()}>
				<rect
					width={width}
					height={height}
					fill={colors['$color-green-hex-64']}
					x={x}
					y={y}
				/>
				{/* White border on top of value bar */}
				<rect
					width={width}
					height={1}
					fill={colors['$color-white-hex']}
					x={x}
					y={y - 1}
				/>
			</g>
		)
	);
};

export default CustomGoalBar;
