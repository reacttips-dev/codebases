import React from 'react';
import { Select } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { Interval } from '../../../../types/goals';
import { getIntervalLabel } from '../../goalDetailsModalUtils';

import styles from '../GoalDetailsModalSection.pcss';

interface IntervalSectionProps {
	interval: Interval;
	setInterval: (interval: Interval) => void;
}

const IntervalSection: React.FC<IntervalSectionProps> = ({
	interval,
	setInterval,
}) => {
	const translator = useTranslator();

	return (
		<div className={styles.row}>
			<div className={styles.label}>{translator.gettext('Interval')}</div>
			<div className={styles.fieldSection}>
				<Select
					value={interval}
					className={styles.fullWidth}
					onChange={(interval: Interval) => setInterval(interval)}
				>
					<Select.Option value={Interval.WEEKLY}>
						{getIntervalLabel(Interval.WEEKLY, translator)}
					</Select.Option>
					<Select.Option value={Interval.MONTHLY}>
						{getIntervalLabel(Interval.MONTHLY, translator)}
					</Select.Option>
					<Select.Option value={Interval.QUARTERLY}>
						{getIntervalLabel(Interval.QUARTERLY, translator)}
					</Select.Option>
					<Select.Option value={Interval.YEARLY}>
						{getIntervalLabel(Interval.YEARLY, translator)}
					</Select.Option>
				</Select>
			</div>
		</div>
	);
};

export default IntervalSection;
