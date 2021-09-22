import React from 'react';
import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';
import { Tooltip } from '@pipedrive/convention-ui-react';

import styles from './PieChartLabel.pcss';

interface ChartProps {
	props: {
		cx: number;
		cy: number;
		midAngle: number;
		outerRadius: number;
		percent: number;
		value: number;
	};
	isShownAsWidget: boolean;
	valueFormatter: (value: number) => string | number;
	minChars: number;
	maxChars: number;
}

const PieChartLabel = ({
	props,
	isShownAsWidget,
	valueFormatter,
	minChars,
	maxChars,
}: ChartProps) => {
	const RADIAN = Math.PI / 180;
	const { cx, cy, midAngle, outerRadius, percent, value } = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + outerRadius * cos;
	const sy = cy + outerRadius * sin;
	const mx = cx + (outerRadius + 5) * cos;
	const my = cy + (outerRadius + 15) * sin;
	const valueAccordingToCos = cos >= 0 ? 1 : -1;
	const ex = mx + valueAccordingToCos * 10;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';
	const showLabel = isShownAsWidget ? percent > 0.03 : percent > 0.01;
	const label = valueFormatter(value);

	const pieCellLabel = (input: string) => {
		const isTruncated =
			(cx < 180 && input.length > minChars) || input.length > maxChars;
		const tooltipProps = isTruncated ? null : { visible: false };
		const formattedLabel = isTruncated
			? `${input.substring(0, minChars)}...`
			: input;

		return (
			<Tooltip
				placement="top"
				portalTo={document.body}
				content={<span>{input}</span>}
				{...tooltipProps}
			>
				<tspan x={ex} y={ey} key={value}>
					{formattedLabel}
				</tspan>
			</Tooltip>
		);
	};

	return showLabel ? (
		<g>
			<path
				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
				stroke={colors['$color-black-hex-16']}
				fill="none"
			/>
			<text
				x={ex + valueAccordingToCos * 5}
				y={ey}
				textAnchor={textAnchor}
				fill={colors['$color-black-hex']}
				className={styles.labelText}
				data-test="pie-chart-label"
			>
				{pieCellLabel(String(label))}
			</text>
		</g>
	) : null;
};

export default PieChartLabel;
