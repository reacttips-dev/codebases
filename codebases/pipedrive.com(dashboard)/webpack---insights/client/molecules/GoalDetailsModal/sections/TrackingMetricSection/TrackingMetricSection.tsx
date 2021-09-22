import React from 'react';
import { Radio, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { TrackingMetric } from '../../../../types/goals';

import styles from '../GoalDetailsModalSection.pcss';

interface TrackingMetricSectionProps {
	trackingMetric: TrackingMetric;
	setTrackingMetric: (trackingMetric: TrackingMetric) => void;
}

const TrackingMetricSection: React.FC<TrackingMetricSectionProps> = ({
	trackingMetric,
	setTrackingMetric,
}) => {
	const translator = useTranslator();

	return (
		<div className={styles.row}>
			<div className={styles.label}>
				{translator.gettext('Tracking metric')}
			</div>
			<div className={styles.fieldSection}>
				<Radio
					name={TrackingMetric.VALUE}
					checked={trackingMetric === TrackingMetric.VALUE}
					onChange={() => setTrackingMetric(TrackingMetric.VALUE)}
				>
					{translator.gettext('Value')}
				</Radio>
				<Spacing horizontal="s" />
				<Radio
					name={TrackingMetric.COUNT}
					checked={trackingMetric === TrackingMetric.COUNT}
					onChange={() => setTrackingMetric(TrackingMetric.COUNT)}
				>
					{translator.gettext('Count')}
				</Radio>
			</div>
		</div>
	);
};

export default TrackingMetricSection;
