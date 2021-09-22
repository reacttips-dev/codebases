import React from 'react';

import { LegentDataType, LegendItem } from '../../types/data-layer';

import styles from './ChartLegend.pcss';

const ChartLegend = ({
	legendData,
	isLegendReversed,
}: {
	legendData: LegentDataType;
	isLegendReversed?: boolean;
}) => {
	const renderLegendItems = () =>
		Object.values(legendData).map((item: LegendItem) => (
			<li
				data-test="chart-legend-item"
				key={`${item.title}_${item.color}`}
				className={styles.item}
			>
				<span
					className={styles.color}
					style={{ backgroundColor: item.color }}
				/>
				<span className={styles.label}>{item.title}</span>
			</li>
		));

	return (
		<div
			className={styles.legendContainer}
			data-test="chart-legend-container"
		>
			<ul className={styles.list}>
				{isLegendReversed
					? renderLegendItems().reverse()
					: renderLegendItems()}
			</ul>
		</div>
	);
};

export default ChartLegend;
