import React from 'react';
import classNames from 'classnames';
import { Icon } from '@pipedrive/convention-ui-react';

import { PERMISSION_TYPES } from '../../../../utils/constants';
import usePlanPermissions from '../../../../hooks/usePlanPermissions';
import { GoalReportType } from '../../../../types/goals';

import styles from './SidemenuListItem.pcss';

export const getInformativeIcon = ({
	isLocked,
	isSharedDashboard,
	isSharedReport,
	canDragThisItem,
	isDashboard,
}: {
	isLocked: boolean;
	isSharedDashboard: boolean;
	isSharedReport: boolean;
	canDragThisItem: boolean;
	isDashboard: boolean;
}) => {
	if (isLocked) {
		return (
			<Icon
				icon="locked"
				size="s"
				className={classNames(styles.icon, styles.iconLocked)}
				data-test="sidemenu-locked-icon"
			/>
		);
	}

	if (isSharedDashboard) {
		return <Icon icon="team" size="s" className={styles.icon} />;
	}

	if (isSharedReport) {
		return <Icon icon="team-folder" size="s" className={styles.icon} />;
	}

	if (canDragThisItem) {
		return (
			<Icon
				icon={isDashboard ? 'drag-handle' : 'move'}
				size="s"
				className={classNames(styles.icon, styles.iconDrag)}
			/>
		);
	}

	return null;
};

export const isItemLocked = ({
	item,
	index,
	isDashboard,
	isGoal,
}: {
	item: any;
	index: number;
	isDashboard: boolean;
	isGoal: boolean;
}) => {
	const { hasPermission, canSeeReport } = usePlanPermissions();

	if (isGoal) {
		return item?.is_locked;
	}

	if (isDashboard) {
		return !hasPermission(PERMISSION_TYPES.dynamic.seeThisDashboard, index);
	}

	return !canSeeReport(item);
};

export const getItemReportType = (item: any, isGoal: boolean) => {
	if (isGoal) {
		const reportType =
			item?.type?.name?.toUpperCase() as keyof typeof GoalReportType;

		return GoalReportType[reportType];
	}

	return item.report_type;
};

export const canDragItem = (
	item: any,
	isDashboard: boolean,
	canHaveMultipleDashboards: boolean,
) => !item.is_new && (isDashboard ? canHaveMultipleDashboards : true);
