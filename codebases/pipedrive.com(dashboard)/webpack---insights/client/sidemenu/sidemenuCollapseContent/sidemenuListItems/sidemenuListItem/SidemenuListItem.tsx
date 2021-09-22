import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Icon, Tooltip } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { getUrl } from '../../../../utils/helpers';
import { getReportIcon } from '../../../../utils/styleUtils';
import {
	ENTRYPOINT_PROPERTIES,
	REPORT_OPENED_SOURCE_PROPERTIES,
} from '../../../../utils/metrics/analytics-properties';
import useRouter from '../../../../hooks/useRouter';
import HighlightedText from '../../../../atoms/HighlightedText';
import {
	SelectedItemType,
	SidemenuSettings,
} from '../../../../types/apollo-query-types';
import {
	getMoveItemToDashboardWarningMessage,
	getSharedItemTooltipContent,
} from '../../../../utils/messagesUtils';
import {
	canDragItem,
	getInformativeIcon,
	getItemReportType,
	isItemLocked,
} from './SidemenuListItemUtils';
import {
	doesItemHaveAnotherOwner,
	isItemSharedWithOthers,
} from '../../../../utils/sharingUtils';
import useDragAndDrop from './useDragAndDrop';
import { trackingParamsVar } from '../../../../api/vars/settingsApi';
import {
	getCurrentUserId,
	getUserById,
	getActivityTypeById,
} from '../../../../api/webapp';

import styles from './SidemenuListItem.pcss';

export interface SidemenuListItemProps {
	item: any;
	type: keyof SidemenuSettings;
	index: number;
	isActive: boolean;
	searchText: string;
	moveMenuItem: Function;
	isNavigationDisabled: boolean;
	canHaveMultipleDashboards: boolean;
	isOverOtherItem: boolean;
}

const SidemenuListItem: React.FC<SidemenuListItemProps> = ({
	item,
	type,
	index,
	isActive,
	searchText,
	moveMenuItem,
	isNavigationDisabled,
	canHaveMultipleDashboards,
	isOverOtherItem,
}) => {
	const translator = useTranslator();
	const ref = useRef<HTMLLIElement>(null);
	const nameSpanElem = useRef<HTMLSpanElement>(null);
	const [isHoveredItemTextTruncated, setIsHoveredItemTextTruncated] =
		useState<boolean>(false);
	const [goTo] = useRouter();
	const currentUserId = getCurrentUserId();
	const isDashboard = type === SelectedItemType.DASHBOARDS;
	const isGoal = type === SelectedItemType.GOALS;
	const isLocked = isItemLocked({
		item,
		index,
		isDashboard,
		isGoal,
	});

	const itemReportType = getItemReportType(item, isGoal);
	const canDragThisItem = canDragItem(
		item,
		isDashboard,
		canHaveMultipleDashboards,
	);
	const isSharedItem = isItemSharedWithOthers(item, currentUserId);
	const isSharedDashboard = isDashboard && isSharedItem;
	const isSharedReport = !isDashboard && !isGoal && isSharedItem;
	const isOtherUserDashboard =
		isDashboard && doesItemHaveAnotherOwner(item, currentUserId);

	const {
		isDragging,
		isAlreadyInDashboard,
		isMaximumReportsReached,
		isHover,
		isGoalTypeReport,
		isDraggingOtherUserReport,
	} = useDragAndDrop({
		item,
		type,
		index,
		moveMenuItem,
		canDragThisItem,
		isDashboard,
		currentUserId,
		ref,
	});

	const canDrop =
		!isAlreadyInDashboard &&
		!isMaximumReportsReached &&
		!isDraggingOtherUserReport &&
		!isOtherUserDashboard;
	const showWarning = isHover && !canDrop;

	const handleNavigation = (event: React.SyntheticEvent) => {
		event.preventDefault();

		trackingParamsVar({
			source: REPORT_OPENED_SOURCE_PROPERTIES.sidebar,
			entryPoint: ENTRYPOINT_PROPERTIES[type],
		});

		if (isActive || isNavigationDisabled) {
			return;
		}

		goTo({ id: item.id, type });
	};

	const content = (
		<a
			href={getUrl(type, item.id)}
			style={{
				opacity: isDragging ? '0.5' : '1',
			}}
			className={classNames(
				styles.link,
				{
					[styles.linkActive]: isActive && !showWarning,
				},
				{
					[styles.canDragThisItem]: canDragThisItem,
				},
			)}
			onClick={handleNavigation}
			data-test={`sidemenu-${type}-${item.name}`}
		>
			<span className={styles.name}>
				<Icon
					icon={
						isDashboard
							? item.type
							: getReportIcon({
									reportType:
										itemReportType as insightsTypes.ReportType,
									getActivityTypeById,
									item,
							  })
					}
					size="s"
					className={styles.icon}
				/>
				<span className={styles.nameSpan} ref={nameSpanElem}>
					<HighlightedText text={item.name} highlight={searchText} />
				</span>
			</span>
			{getInformativeIcon({
				isLocked,
				isSharedDashboard,
				isSharedReport,
				canDragThisItem,
				isDashboard,
			})}
		</a>
	);

	const getListItemWithTootltip = () => {
		if (showWarning) {
			return (
				<Tooltip
					placement="right"
					visible
					content={getMoveItemToDashboardWarningMessage({
						isMaximumReportsReached,
						isAlreadyInDashboard,
						isGoalTypeReport,
						translator,
						isOtherUserReport: isDraggingOtherUserReport,
						isOtherUserDashboard,
						...(isOtherUserDashboard && {
							dashboardOwnerName: getUserById(item.user_id)?.name,
						}),
					})}
					portalTo={document.body}
				>
					{content}
				</Tooltip>
			);
		}

		if (isSharedItem && !isGoal) {
			return (
				<Tooltip
					placement="right"
					content={getSharedItemTooltipContent({
						isSharedDashboard,
						isSharedReport,
						translator,
					})}
					portalTo={document.body}
				>
					{content}
				</Tooltip>
			);
		}

		const tooltipVisibilityProp =
			isHoveredItemTextTruncated && !isOverOtherItem
				? null
				: { visible: false };

		return (
			<Tooltip
				placement="right"
				portalTo={document.body}
				content={item.name}
				{...tooltipVisibilityProp}
			>
				{content}
			</Tooltip>
		);
	};

	return (
		<li
			ref={ref}
			className={classNames(styles.listItem, {
				[styles.hoverActive]: isHover,
				[styles.hasWarning]: showWarning,
			})}
			onMouseEnter={() =>
				setIsHoveredItemTextTruncated(
					nameSpanElem.current.scrollWidth >
						nameSpanElem.current.offsetWidth,
				)
			}
			onMouseLeave={() => setIsHoveredItemTextTruncated(false)}
		>
			{getListItemWithTootltip()}
		</li>
	);
};

export default React.memo(SidemenuListItem);
