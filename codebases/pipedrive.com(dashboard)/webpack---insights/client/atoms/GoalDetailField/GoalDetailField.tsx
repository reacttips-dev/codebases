import React from 'react';
import { Icon, Tooltip } from '@pipedrive/convention-ui-react';

import styles from './GoalDetailField.pcss';

interface GoalDetailFieldProps {
	icon: string;
	label: string | number;
	tooltipText: string;
}

const GoalDetailField: React.FC<GoalDetailFieldProps> = ({
	icon,
	label,
	tooltipText,
}) => {
	return (
		<div className={styles.field}>
			<Tooltip
				placement="left"
				content={tooltipText}
				portalTo={document.body}
			>
				<div className={styles.item}>
					<Icon
						icon={icon}
						size="s"
						color="black-64"
						className={styles.icon}
					/>
					<span className={styles.label}>{label}</span>
				</div>
			</Tooltip>
		</div>
	);
};

export default GoalDetailField;
