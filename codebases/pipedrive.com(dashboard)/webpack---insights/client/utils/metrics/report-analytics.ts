import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	getReportById,
	getReportAddedToDashboardsCount,
} from '../../utils/helpers';
import { parseReportParametersForDashboardView } from '../../utils/reportObjectHelpers';
import { getPdMetrics } from '../../api/webapp';
import { wrapWithTryCatch, getReportTypeForTracking } from './helpers';
import { UnsavedReport } from '../../types/apollo-local-types';
import { Dashboard, Report } from '../../types/apollo-query-types';

const TableViewType = {
	DETAILS: 'details',
	SUMMARY: 'summary',
};

export const ReportActionSource = {
	ADD_REPORT: 'add_report',
	SAVE_AS_NEW: 'save_as_new',
};

export const ReportAddedToDashboardSource = {
	DRAG_TO_DASHBOARD_AREA: 'drag_to_dashboard_area',
	FROM_REPORT: 'from_report',
};

export const trackReportCreated = wrapWithTryCatch(
	(report: Report, dashboardCount: number, source: string) => {
		const parsedReport = parseReportParametersForDashboardView(
			report,
		) as UnsavedReport;
		const params = parsedReport.parameters;
		const groupBy = params.group_by;
		const reportType = getReportTypeForTracking(
			parsedReport.data_type,
			parsedReport.report_type,
		);

		const hasCustomFieldFilter = parsedReport.parameters.filter_by.some(
			(filter) => {
				return filter.filter.includes('__');
			},
		);

		getPdMetrics().trackUsage(null, 'report', 'created', {
			report_id: parsedReport.id,
			report_type: reportType,
			chart_type: parsedReport.chart_type,
			measure_by: params.measure_by,
			group_by: groupBy && groupBy.filter,
			time_interval: groupBy && (groupBy.interval || null),
			segment_by: params.segment_by,
			filter_condition_count: params.filter_by && params.filter_by.length,
			custom_field_used_in_filter: hasCustomFieldFilter,
			dashboard_count: dashboardCount,
			source,
		});
	},
);

export const trackReportCreationCanceled = wrapWithTryCatch(() => {
	getPdMetrics().trackUsage(null, 'report', 'creation_canceled', {});
});

export const trackReportRenamed = wrapWithTryCatch((reportId: string) => {
	getPdMetrics().trackUsage(null, 'report', 'renamed', {
		report_id: reportId,
	});
});

export const trackReportEdited = wrapWithTryCatch((reportId: string) => {
	getPdMetrics().trackUsage(null, 'report', 'edited', {
		report_id: reportId,
	});
});

export const trackReportEditingCanceled = wrapWithTryCatch(
	(reportId: string) => {
		getPdMetrics().trackUsage(null, 'report', 'editing_canceled', {
			report_id: reportId,
		});
	},
);

export const trackReportAddedToDashboard = wrapWithTryCatch(
	(trackingData: {
		reportId: string;
		dashboard: Dashboard;
		source: string;
		dashboards: Dashboard[];
	}) => {
		const { reportId, dashboard, source, dashboards } = trackingData;
		const reportAddedToDashboardsCount = getReportAddedToDashboardsCount(
			reportId,
			dashboards,
		);

		getPdMetrics().trackUsage(null, 'report', 'added_to_dashboard', {
			report_id: reportId,
			dashboard_id: dashboard.id,
			source,
			dashboard_count: reportAddedToDashboardsCount,
		});
	},
);

export const trackMenuItemsReordered = wrapWithTryCatch(
	(type: string, typeCount: number) => {
		getPdMetrics().trackUsage(null, type, 'reordered', {
			[`${type}_count`]: typeCount,
		});
	},
);
export const trackReportRemovedFromDashboard = wrapWithTryCatch(
	(trackingData: {
		reportId: string;
		dashboard: Dashboard;
		dashboards: Dashboard[];
	}) => {
		const { reportId, dashboard, dashboards } = trackingData;
		const reportAddedToDashboardsCount = getReportAddedToDashboardsCount(
			reportId,
			dashboards,
		);

		getPdMetrics().trackUsage(null, 'report', 'removed_from_dashboard', {
			report_id: reportId,
			dashboard_id: dashboard.id,
			dashboard_count: reportAddedToDashboardsCount,
		});
	},
);
export const trackReportTableViewTypeChanged = wrapWithTryCatch(
	(reportId: string, viewType: string) => {
		getPdMetrics().trackUsage(null, 'report', 'table_view_type_changed', {
			report_id: reportId,
			table_view_type:
				viewType === 'source-data'
					? TableViewType.DETAILS
					: TableViewType.SUMMARY,
		});
	},
);

export const trackReportOpened = wrapWithTryCatch(
	({
		reportId,
		source,
		entryPoint,
		reports,
		dashboards,
	}: {
		reportId: string;
		source: string;
		entryPoint: string;
		reports: Report[];
		dashboards: Dashboard[];
	}) => {
		const report = parseReportParametersForDashboardView(
			getReportById(reportId, reports),
		) as UnsavedReport;
		const params = report.parameters;
		const groupBy = params.group_by;
		const reportType = getReportTypeForTracking(
			report.data_type,
			report.report_type,
		);

		const trackingData = {
			report_id: reportId,
			source,
			entry_point: entryPoint,
			report_type: reportType,
			chart_type: report.chart_type,
			measure_by: params.measure_by,
			group_by: groupBy && groupBy.filter,
			time_interval: groupBy && (groupBy.interval || null),
			segment_by: params.segment_by,
			filter_condition_count: params.filter_by && params.filter_by.length,
			dashboard_count: getReportAddedToDashboardsCount(
				reportId,
				dashboards,
			),
		};

		getPdMetrics().trackUsage(null, 'report', 'opened', trackingData);
	},
);

export const trackReportDeleted = wrapWithTryCatch((reportId: string) => {
	const data = {
		report_id: reportId,
	};

	getPdMetrics().trackUsage(null, 'report', 'deleted', data);
});

export const trackListViewOpened = wrapWithTryCatch(
	(
		chartType?: insightsTypes.ChartType,
		reportType?: insightsTypes.ReportType,
	) => {
		const trackingData = {
			chart_type: chartType,
			report_type: reportType,
		};

		getPdMetrics().trackUsage(
			null,
			'report_data_list',
			'opened',
			trackingData,
		);
	},
);
