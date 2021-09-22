import React from 'react';
import classNames from 'classnames';
import { useTranslator } from '@pipedrive/react-utils';
import { DateRange } from '@pipedrive/form-fields';

import { Duration } from '../../../../types/goals';

import styles from '../GoalDetailsModalSection.pcss';

interface DurationSectionProps {
	duration: Duration;
	setDuration: (duration: Duration) => void;
	error?: string;
	allowClearEnd?: boolean;
	label: string;
}

const DurationSection: React.FC<DurationSectionProps> = ({
	duration,
	setDuration,
	error,
	allowClearEnd = true,
	label,
}) => {
	const translator = useTranslator();

	return (
		<div className={styles.row}>
			<div className={styles.label}>{label}</div>
			<div className={styles.fieldSection}>
				<DateRange
					value={{
						startDate: duration?.start,
						endDate: duration?.end,
					}}
					className={classNames(styles.fullWidth, styles.dateRange)}
					startOpen={false}
					// @ts-ignore
					onComponentChange={({ startDate, endDate }) => {
						setDuration({ start: startDate, end: endDate });
					}}
					placeholderTextEnd={translator.gettext('No end date')}
					allowClearEnd={allowClearEnd}
					error={error}
				/>
			</div>
		</div>
	);
};

export default DurationSection;
