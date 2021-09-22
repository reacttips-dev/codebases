import update from 'immutability-helper';

import { Dashboard, DashboardReport } from '../types/apollo-query-types';

interface GetReportsParams {
	dashboard: Dashboard;
	dashboardReports: DashboardReport[];
	uniqueId: string;
	layouts: any;
	isDraggingReport: boolean;
}

export const getReports = ({
	dashboard,
	dashboardReports,
	uniqueId,
	layouts,
	isDraggingReport,
}: GetReportsParams) => {
	if (isDraggingReport && layouts.lg.length > 0) {
		return update(dashboard, {
			reports: {
				$set: [
					{
						id: uniqueId,
						position: [0, 0, 1, 3],
					},
				].concat(dashboardReports),
			},
		});
	}

	return update(dashboard, {
		reports: {
			$set: dashboardReports.filter((r) => r.id !== uniqueId),
		},
	});
};
