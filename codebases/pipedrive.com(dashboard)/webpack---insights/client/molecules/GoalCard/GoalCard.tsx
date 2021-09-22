import React from 'react';
import { Spacing, Separator } from '@pipedrive/convention-ui-react';

import GoalDetailField from '../../atoms/GoalDetailField/GoalDetailField';
import ReportPanel from '../../atoms/ReportPanel';
import { GoalCardData, GoalDataKey } from '../../types/goals';

import styles from './GoalCard.pcss';

interface GoalCardProps {
	goalCardData: GoalCardData;
}

const GoalCard: React.FC<GoalCardProps> = ({ goalCardData }) => {
	const LEFT_COLUMN_ITEMS = [
		GoalDataKey.ASSIGNEE,
		GoalDataKey.TYPE,
		GoalDataKey.PIPELINE,
	];
	const RIGHT_COLUMN_ITEMS = [
		GoalDataKey.INTERVAL,
		GoalDataKey.DURATION,
		GoalDataKey.EXPECTED_OUTCOME,
	];

	const renderGoalCardFields = (fieldKeys: string[]) => {
		return fieldKeys.map((field) => {
			const { icon, label, tooltipText } = goalCardData[field];

			return (
				<GoalDetailField
					key={label}
					icon={icon}
					label={label}
					tooltipText={tooltipText}
				/>
			);
		});
	};

	return (
		<ReportPanel className={styles.wrapper}>
			<div className={styles.card}>
				<div className={styles.column}>
					<Spacing horizontal="s">
						{renderGoalCardFields(LEFT_COLUMN_ITEMS)}
					</Spacing>
				</div>
				<Separator type="vertical" />
				<div className={styles.column}>
					<Spacing horizontal="s">
						{renderGoalCardFields(RIGHT_COLUMN_ITEMS)}
					</Spacing>
				</div>
			</div>
		</ReportPanel>
	);
};

export default GoalCard;
