import React from 'react';
import { Select } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { getActivityTypes } from '../../../../api/webapp';

import styles from '../GoalDetailsModalSection.pcss';

interface ActivityTypeSectionProps {
	activityType: number;
	setActivityType: (activityTypeId: number) => void;
}

const ActivityTypeSection: React.FC<ActivityTypeSectionProps> = ({
	activityType,
	setActivityType,
}) => {
	const translator = useTranslator();

	return (
		<div className={styles.row}>
			<div className={styles.label}>
				{translator.gettext('Activity type')}
			</div>
			<div className={styles.fieldSection}>
				<Select
					className={styles.fullWidth}
					onChange={(selectedActivityId: number) => {
						return setActivityType(selectedActivityId);
					}}
					value={activityType}
				>
					{getActivityTypes().map(
						(activityType: Pipedrive.ActivityType) => (
							<Select.Option
								key={activityType.key_string}
								value={activityType.id}
							>
								{activityType.name}
							</Select.Option>
						),
					)}
				</Select>
			</div>
		</div>
	);
};

export default ActivityTypeSection;
