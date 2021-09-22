import { Layout } from 'react-grid-layout';
import { Translator } from '@pipedrive/react-utils';

import { getReportById } from '../../utils/helpers';
import {
	Dashboard,
	DashboardReport,
	Report,
} from '../../types/apollo-query-types';
import { getGoalByReportId } from '../../hooks/goals/goalUtils';
import { trackReportRemovedFromDashboard } from '../../utils/metrics/report-analytics';
import { updateDashboardReports } from '../../api/commands/dashboards';
import { snackbarMessageVar } from '../../api/vars/settingsApi';

interface HandleUpdateDashboardReportsProps {
	dashboardReports: DashboardReport[];
	dashboard: Dashboard;
	layout: Layout[];
	newItem: Layout;
	reports: Report[];
	dashboards: Dashboard[];
	updateDashboardReports: typeof updateDashboardReports;
	translator: Translator;
	element?: HTMLElement;
	event?: any;
}

export const handleUpdateDashboardReports = async ({
	dashboardReports,
	dashboard,
	layout,
	newItem,
	reports,
	dashboards,
	updateDashboardReports,
	translator,
	element,
	event,
}: HandleUpdateDashboardReportsProps) => {
	const reportId = newItem.i;
	const isRemoveEvent = event?.target.dataset.targetId === 'REMOVE-REPORT';

	let updatedReports: DashboardReport[] = [];

	if (isRemoveEvent) {
		updatedReports = dashboardReports.filter(
			(reportItem) => reportItem.id !== reportId,
		);
		element?.classList.add('react-grid-item-hidden');
	} else {
		updatedReports = dashboardReports.map((reportItem) => {
			const reportFromLayout = layout.find((i) => i.i === reportItem.id);
			const { x, y, w, h } = reportFromLayout;

			return {
				...reportItem,
				position: [x, y, w, h],
			};
		});
	}

	updatedReports = updatedReports.map((reportItem) => {
		// @ts-ignore
		const { report_type, ...reportProps } = reportItem;

		return {
			...reportProps,
		};
	});

	await updateDashboardReports(dashboard.id, updatedReports);

	if (isRemoveEvent) {
		const report = getReportById(reportId, reports);
		const itemRemovedMessage = report.is_goals_report
			? translator.pgettext(
					'[Goal name] goal has been removed from this dashboard.',
					'%s goal has been removed from this dashboard.',
					getGoalByReportId(reportId).name,
			  )
			: translator.pgettext(
					'[Report name] report has been removed from this dashboard.',
					'%s report has been removed from this dashboard.',
					report.name,
			  );

		snackbarMessageVar(itemRemovedMessage);

		trackReportRemovedFromDashboard({
			dashboard,
			dashboards,
			reportId,
		});
	}
};

export const getFirstWidget = (layout: { lg: any[]; md: any[]; sm: any[] }) => {
	const clonedArray = [...layout?.lg];

	clonedArray.sort((a, b) => {
		return a?.x - b?.x;
	});

	clonedArray.sort((a, b) => {
		return a?.y - b?.y;
	});

	return clonedArray.length && clonedArray[0];
};
