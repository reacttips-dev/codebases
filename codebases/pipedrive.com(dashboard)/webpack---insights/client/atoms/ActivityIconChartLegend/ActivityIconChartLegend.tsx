import React from 'react';

import ActivityIcon from '../ActivityIcon';
import { LegendItem, LegentDataType } from '../../types/data-layer';
import { getActivityTypeIconKey } from '../../utils/activityHelpers';

import styles from './ActivityIconChartLegend.pcss';

const ActivityIconChartLegend: React.FC<{
	legendData: LegentDataType;
}> = ({ legendData }) => {
	return (
		<div
			className={styles.legendContainer}
			data-test="activity-icon-chart-legend-container"
		>
			<ul className={styles.list}>
				{Object.values(legendData).map((item: LegendItem) => (
					<li
						data-test="activity-icon-chart-legend-item"
						key={`${item.title}_${item.color}`}
						className={styles.item}
					>
						<ActivityIcon
							icon={getActivityTypeIconKey(item.id)}
							color={item.color}
						/>

						<span className={styles.label}>{item.title}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ActivityIconChartLegend;
