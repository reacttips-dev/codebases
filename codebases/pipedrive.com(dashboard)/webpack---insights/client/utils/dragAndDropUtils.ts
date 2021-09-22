import { DraggableItem } from '../sidemenu/sidemenuCollapseContent/sidemenuListItems/sidemenuListItem/useDragAndDrop';
import { Dashboard, Report } from '../types/apollo-query-types';
import {
	isReportAlreadyInDashboard,
	hasMaximumAmountOfReportsInDashboard,
} from './helpers';
import { isCurrentUserItemOwner } from './sharingUtils';

export const canAddReportToDashboard = ({
	dashboard,
	report,
	reportId,
	currentUserId,
}: {
	dashboard: Dashboard;
	report: DraggableItem | Report;
	reportId: string;
	currentUserId: number;
}) =>
	!isReportAlreadyInDashboard(dashboard, reportId) &&
	!hasMaximumAmountOfReportsInDashboard(dashboard) &&
	isCurrentUserItemOwner(dashboard, currentUserId) &&
	isCurrentUserItemOwner(report as Report, currentUserId);
