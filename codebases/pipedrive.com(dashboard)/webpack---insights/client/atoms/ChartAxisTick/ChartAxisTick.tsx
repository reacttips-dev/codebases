import React from 'react';
import { Tooltip } from '@pipedrive/convention-ui-react';

import { ChartElementColor } from '../ChartTypes/chartStyleConstants';

interface ChartAxisTickProps {
	x: number;
	y: number;
	width: number;
	lineHeight: number;
	fontSize: number;
	fill: ChartElementColor;
	value: string;
	maxChars: number;
	textAnchor: string;
}

const ChartAxisTick: React.FC<ChartAxisTickProps> = ({
	x,
	y,
	width,
	lineHeight,
	fontSize,
	fill,
	value,
	maxChars,
	textAnchor,
}) => {
	const tickLabel = (input: string) => {
		const isTruncated = input.length > maxChars;
		const tooltipProps = isTruncated ? null : { visible: false };
		const formattedLabel = isTruncated
			? `${input.substring(0, maxChars - 3)}...`
			: input;

		return (
			<Tooltip
				placement="top"
				portalTo={document.body}
				content={<span>{input}</span>}
				{...tooltipProps}
			>
				<tspan x={0} y={lineHeight} key={value}>
					{formattedLabel}
				</tspan>
			</Tooltip>
		);
	};

	return (
		<g transform={`translate(${x},${y})`}>
			<text
				width={width}
				height="auto"
				textAnchor={textAnchor}
				fontSize={fontSize}
				fill={fill as unknown as string}
			>
				{tickLabel(value)}
			</text>
		</g>
	);
};

export default ChartAxisTick;
