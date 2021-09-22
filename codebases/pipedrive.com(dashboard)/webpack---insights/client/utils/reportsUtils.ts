import { Report } from '../types/apollo-query-types';
import { ReportId } from '../types/report-options';

export const hasPagination = (hasNextPage: boolean, pageNumber: number) => {
	return hasNextPage || pageNumber > 0;
};

export const findCachedReportById = (
	reportId: ReportId,
	cachedReports: Report[],
	setCachedReport: (id: ReportId, updatableObject: object) => Report,
) =>
	cachedReports.find((report) => report.id === reportId) ||
	setCachedReport(reportId, { data: null });
