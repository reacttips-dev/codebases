import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import useSettingsApi from '../../../../hooks/useSettingsApi';
import {
	isReportAlreadyInDashboard,
	hasMaximumAmountOfReportsInDashboard,
} from '../../../../utils/helpers';
import { ReportAddedToDashboardSource } from '../../../../utils/metrics/report-analytics';
import {
	ACCEPTED_DROP_TARGET_ITEMS,
	SideMenuItemGroup,
} from '../../../../utils/constants';
import { getGoalById } from '../../../../api/commands/goals';
import { SidemenuSettings } from '../../../../types/apollo-query-types';
import { canAddReportToDashboard } from '../../../../utils/dragAndDropUtils';
import { doesItemHaveAnotherOwner } from '../../../../utils/sharingUtils';
import { isDraggingReportVar } from '../../../../api/vars/settingsApi';

export interface DraggableItem {
	id: string;
	user_id: number;
	index: number;
	name: string;
	type: string;
}

const useDragAndDrop = ({
	item,
	type,
	index,
	moveMenuItem,
	canDragThisItem,
	isDashboard,
	currentUserId,
	ref,
}: {
	item: any;
	type: keyof SidemenuSettings;
	index: number;
	moveMenuItem: Function;
	canDragThisItem: boolean;
	isDashboard: boolean;
	currentUserId: number;
	ref: any;
}) => {
	const { addReportToDashboard } = useSettingsApi();

	const [{ isDragging }, drag] = useDrag({
		item: {
			id: item.id,
			name: item.name,
			type,
			index,
			user_id: item.user_id,
		},
		canDrag: canDragThisItem,
		collect: (monitor) => ({ isDragging: monitor.isDragging() }),
		begin: () => {
			if (!isDashboard) {
				isDraggingReportVar(true);
			}
		},
		end: () => {
			if (!isDashboard) {
				isDraggingReportVar(false);
			}
		},
	});

	const [
		{
			isAlreadyInDashboard,
			isMaximumReportsReached,
			isHover,
			isGoalTypeReport,
			isDraggingOtherUserReport,
		},
		drop,
	] = useDrop({
		accept: isDashboard ? ACCEPTED_DROP_TARGET_ITEMS : [],
		drop: async (report: DraggableItem) => {
			const reportId =
				report.type === SideMenuItemGroup.GOALS
					? getGoalById(report.id)?.report_ids[0]
					: report.id;

			if (
				canAddReportToDashboard({
					dashboard: item,
					report,
					reportId,
					currentUserId,
				})
			) {
				await addReportToDashboard(
					item.id,
					reportId,
					ReportAddedToDashboardSource.DRAG_TO_DASHBOARD_AREA,
				);
			}
		},
		collect: (monitor) => {
			const isOver = monitor.isOver();
			const canDrop = monitor.canDrop();
			const monitoredItem = monitor.getItem();

			const isGoalTypeReport =
				monitoredItem?.type === SideMenuItemGroup.GOALS;
			const reportId = isGoalTypeReport
				? getGoalById(monitoredItem?.id)?.report_ids[0]
				: monitoredItem?.id;

			const isHover = isOver && canDrop;

			return {
				isHover,
				isAlreadyInDashboard:
					isHover && isReportAlreadyInDashboard(item, reportId),
				isMaximumReportsReached:
					isHover && hasMaximumAmountOfReportsInDashboard(item),
				isDraggingOtherUserReport: doesItemHaveAnotherOwner(
					monitoredItem,
					currentUserId,
				),
				isGoalTypeReport,
			};
		},
	});

	const [, dropSort] = useDrop({
		accept: type,
		canDrop: () => false,
		hover: useCallback(
			({ id: draggedId }) => {
				if (draggedId !== item.id) {
					moveMenuItem(draggedId, index);
				}
			},
			[item.id, moveMenuItem],
		),
	});

	drag(drop(dropSort(ref)));

	return {
		isDragging,
		isAlreadyInDashboard,
		isMaximumReportsReached,
		isDraggingOtherUserReport,
		isHover,
		isGoalTypeReport,
	};
};

export default useDragAndDrop;
