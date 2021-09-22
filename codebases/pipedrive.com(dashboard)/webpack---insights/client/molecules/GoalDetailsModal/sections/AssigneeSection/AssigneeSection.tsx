import React from 'react';
import { Badge, Select, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { useGoalPermissions } from '../../../../hooks/goals';
import { AssigneeType, Assignee } from '../../../../types/goals';
import {
	areTeamsEnabled,
	getCompanyId,
	getCurrentUserId,
} from '../../../../api/webapp';

import styles from '../GoalDetailsModalSection.pcss';

interface AssigneeSectionProps {
	assignee: Assignee;
	setAssignee: (assignee: Assignee) => void;
}

const AssigneeSection: React.FC<AssigneeSectionProps> = ({
	assignee,
	setAssignee,
}) => {
	const translator = useTranslator();
	const {
		canAddTeamGoal,
		canAddCompanyGoal,
		getAvailableTeamsForAddingGoal,
		getAvailableUsersForAddingGoal,
	} = useGoalPermissions();

	const isTeamsFeatureEnabled = areTeamsEnabled();
	const isAssigneeSelectionDisabled = !canAddCompanyGoal && !canAddTeamGoal;

	const getDefaultValueForAssigneeType = (assigneeType: AssigneeType) => {
		switch (assigneeType) {
			case AssigneeType.COMPANY:
				return getCompanyId();
			case AssigneeType.PERSON:
				return getCurrentUserId();
			case AssigneeType.TEAM:
				return getAvailableTeamsForAddingGoal()?.[0]?.id;
			default:
				return null;
		}
	};

	const renderCompanySelectOption = () => {
		if (!canAddCompanyGoal) {
			return null;
		}

		return (
			<Select.Option
				value={AssigneeType.COMPANY}
				className={styles.selectOption}
			>
				{translator.gettext('Company (everyone)')}
			</Select.Option>
		);
	};

	const renderTeamSelectOption = () => {
		if (!canAddTeamGoal) {
			return null;
		}

		return (
			<Select.Option
				value={AssigneeType.TEAM}
				className={styles.selectOption}
				disabled={!isTeamsFeatureEnabled}
			>
				{translator.gettext('Team')}
				{!isTeamsFeatureEnabled && (
					<Badge color="blue" outline className={styles.badge}>
						{translator.gettext('Professional')}
					</Badge>
				)}
			</Select.Option>
		);
	};

	const renderPersonSelectOption = () => (
		<Select.Option
			value={AssigneeType.PERSON}
			className={styles.selectOption}
		>
			{translator.gettext('User')}
		</Select.Option>
	);

	const AssigneeTypeSelection = (
		<Select
			onChange={(assigneeType: AssigneeType) =>
				setAssignee({
					type: assigneeType,
					id: getDefaultValueForAssigneeType(assigneeType),
				})
			}
			value={assignee?.type}
			className={styles.fullWidth}
			disabled={isAssigneeSelectionDisabled}
		>
			{renderCompanySelectOption()}
			{renderTeamSelectOption()}
			{renderPersonSelectOption()}
		</Select>
	);

	const UserSelection = (
		<Select
			filter
			className={styles.fullWidth}
			onChange={(userId: number) => {
				setAssignee({
					...assignee,
					id: userId,
				});
			}}
			value={assignee?.id}
			disabled={getAvailableUsersForAddingGoal().length <= 1}
		>
			{getAvailableUsersForAddingGoal().map((user: Pipedrive.User) => (
				<Select.Option key={user.id} value={user.id}>
					{user.name}
				</Select.Option>
			))}
		</Select>
	);

	const SecondarySelectPlaceholder = <div className={styles.fullWidth} />;

	const TeamSelection = (
		<Select
			filter
			className={styles.fullWidth}
			onChange={(teamId: number) =>
				setAssignee({
					...assignee,
					id: teamId,
				})
			}
			value={assignee?.id}
		>
			{getAvailableTeamsForAddingGoal().map((team: Pipedrive.Team) => (
				<Select.Option key={team.id} value={team.id}>
					{team.name}
				</Select.Option>
			))}
		</Select>
	);

	return (
		<div className={styles.row}>
			<div className={styles.label}>{translator.gettext('Assignee')}</div>
			<div className={styles.fieldSection}>
				{AssigneeTypeSelection}
				<Spacing horizontal="s" />
				{assignee?.type === AssigneeType.PERSON && UserSelection}
				{assignee?.type === AssigneeType.TEAM && TeamSelection}
				{assignee?.type === AssigneeType.COMPANY &&
					SecondarySelectPlaceholder}
			</div>
		</div>
	);
};

export default AssigneeSection;
