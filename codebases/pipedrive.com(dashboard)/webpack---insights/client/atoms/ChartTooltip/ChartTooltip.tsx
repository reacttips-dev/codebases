import React from 'react';

import { ChartTooltipItem } from './getChartTooltipItems';

import styles from './ChartTooltip.pcss';

export interface ChartTooltipProps {
	title?: string | number;
	subtitle?: string;
	secondarySubtitle?: string;
	tooltipItems?: ChartTooltipItem[];
	isReversed?: boolean;
}

const ChartTooltip = ({
	title,
	subtitle,
	secondarySubtitle,
	tooltipItems = [],
	isReversed = false,
}: ChartTooltipProps) => {
	const orderedTooltipItems = isReversed
		? [...tooltipItems].reverse()
		: tooltipItems;

	return (
		<div className={styles.tooltip}>
			{title && <div className={styles.tooltipTitle}>{title}</div>}
			{subtitle && (
				<div className={styles.tooltipSubtitle}>{subtitle}</div>
			)}
			{secondarySubtitle && (
				<div className={styles.tooltipSubtitle}>
					{secondarySubtitle}
				</div>
			)}
			{orderedTooltipItems.map((item, index) => (
				<div className={styles.tooltipItemContainer} key={index}>
					<div
						className={
							subtitle
								? styles.dotWithIndentation
								: styles.dotWithoutIndentation
						}
						style={{ background: item.dotColor }}
					/>

					<div>{item.label}</div>
				</div>
			))}
		</div>
	);
};

export default ChartTooltip;
