import { uniq } from 'lodash';
import { Periods } from '@pipedrive/insights-core/lib/periods';

import { getDashboardReports } from '../../utils/helpers';
import { SettingsApiClient } from '../../api/apollo/settingsApiClient';
import { GET_USER_SETTINGS, GET_PUBLIC_LINKS } from '../../api/graphql';
import { PERMISSIONS, getPdMetrics, hasPermission } from '../../api/webapp';
import { wrapWithTryCatch } from './helpers';
import { Dashboard } from '../../types/apollo-query-types';
import { trackingParamsVar } from '../../api/vars/settingsApi';

export const DashboardActionSource = {
	ADD_DASHBOARD: 'add_dashboard',
	NEW_REPORT: 'new_report',
	EXISTING_REPORT: 'existing_report',
	EXISTING_GOAL: 'existing_goal',
};

export const trackDashboardOpened = wrapWithTryCatch(
	(dashboard: Dashboard, currentUserId: number) => {
		const {
			currentUserSettings: { reports },
		} = SettingsApiClient.readQuery({
			query: GET_USER_SETTINGS,
		});

		const trackingParams = trackingParamsVar();
		const dashboardReports = getDashboardReports(dashboard, reports);
		const reportTypes = uniq(
			dashboardReports.map((report) => report.data_type),
		);

		const emptyReportsCount = document.querySelectorAll(
			'[data-tracking="widget-empty"]',
		).length;

		const trackingData = {
			dashboard_id: dashboard.id,
			reports_count: dashboard.reports.length,
			report_types: reportTypes,
			empty_reports_count: emptyReportsCount,
			entry_point: trackingParams.entryPoint,
			shared_links_count: 0,
			is_shared: dashboard.user_id !== currentUserId,
		};

		if (!hasPermission(PERMISSIONS.shareInsights)) {
			getPdMetrics().trackUsage(
				null,
				'dashboard',
				'opened',
				trackingData,
			);

			return;
		}

		SettingsApiClient.query({
			query: GET_PUBLIC_LINKS,
			variables: { dashboardId: dashboard.id },
		})
			.then(
				({
					data: {
						publicLinks: { data = [] },
					},
				}) => {
					trackingData.shared_links_count = Number(
						data && data.length,
					);
				},
			)
			// @ts-ignore
			.finally(() => {
				getPdMetrics().trackUsage(
					null,
					'dashboard',
					'opened',
					trackingData,
				);
			});
	},
);

export const trackDashboardCreated = wrapWithTryCatch(
	(dashboardId: string, source: string) => {
		getPdMetrics().trackUsage(null, 'dashboard', 'created', {
			dashboard_id: dashboardId,
			source,
		});
	},
);

export const trackDashboardCreationCanceled = wrapWithTryCatch(
	(source: string) => {
		getPdMetrics().trackUsage(null, 'dashboard', 'creation_canceled', {
			source,
		});
	},
);

export const trackDashboardRenamed = wrapWithTryCatch((dashboardId: string) => {
	getPdMetrics().trackUsage(null, 'dashboard', 'renamed', {
		dashboard_id: dashboardId,
	});
});

export const trackDashboardDeleted = wrapWithTryCatch(
	(dashboard: Dashboard) => {
		getPdMetrics().trackUsage(null, 'dashboard', 'deleted', {
			dashboard_id: dashboard.id,
			reports_count: dashboard.reports.length,
		});
	},
);

export const trackDashboardReportResized = wrapWithTryCatch(
	(reportId: string, dashboardId: string) => {
		getPdMetrics().trackUsage(null, 'dashboard', 'report_resized', {
			dashboard_id: dashboardId,
			report_id: reportId,
		});
	},
);

export const trackDashboardReportReordered = wrapWithTryCatch(
	(reportId: string, dashboardId: string) => {
		getPdMetrics().trackUsage(null, 'dashboard', 'report_reordered', {
			dashboard_id: dashboardId,
			report_id: reportId,
		});
	},
);

export const trackDashboardQuickFiltersApplied = wrapWithTryCatch(
	(
		dashboardId: string,
		quickFilter: any,
		period: Periods,
		userType: string,
	) => {
		const data = {
			dashboard_id: dashboardId,
			quick_filter: quickFilter,
		} as any;

		if (period) {
			data.period = period;
		}

		if (userType) {
			data.user_type = userType;
		}

		getPdMetrics().trackUsage(
			null,
			'dashboard',
			'quickfilters_applied',
			data,
		);
	},
);
