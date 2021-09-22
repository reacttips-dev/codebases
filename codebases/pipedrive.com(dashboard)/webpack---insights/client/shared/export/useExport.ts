import { isArray } from 'lodash';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { UniqueSegment } from '../../types/data-layer';
import { InsightsApiClient } from '../../api/apollo/insightsApiClient';
import { getInsightsApiFetchPolicy, getUrl } from '../../api/apollo/utils';
import localState from '../../utils/localState/index';
import trackReportDataDownloaded from '../../utils/metrics/export-listview-metrics';
import getReportQuery from '../../utils/queries/getReportQuery';
import { composeListViewFilterByFilter } from '../../utils/listViewUtils';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import { ListViewSegmentDataType } from '../../types/list-view';
import { getPipelineStages } from '../../api/webapp';
import { QuickFilters } from '../../types/apollo-query-types';

interface ExportHookProps {
	reportId: string;
	uniqueSegments: UniqueSegment[];
	groupedAndSegmentedData: any[];
	listSegmentData?: ListViewSegmentDataType;
	exportFormat: string;
	isListView: boolean;
	multiSelectFilter?: number[];
	quickFilters?: QuickFilters;
}

function useExport({
	reportId,
	uniqueSegments,
	groupedAndSegmentedData,
	listSegmentData,
	exportFormat,
	isListView,
	multiSelectFilter,
	quickFilters,
}: ExportHookProps) {
	const { getCachedSourceDataTable, getCachedReport } = localState();

	const report = getCachedReport(reportId);
	const dataType = report.data_type;
	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const {
		group_by: groupBy,
		filter_by: filterByFilter,
		segment_by: segmentByFilter,
		is_cumulative: isCumulative,
	} = report.unsavedReport.parameters;
	const { filter: groupByFilter, interval: intervalFilter } = groupBy;

	const cachedSourceDataTable = isArray(getCachedSourceDataTable(reportId))
		? getCachedSourceDataTable(reportId).find(
				(data: any) => data.id === reportId,
		  )
		: getCachedSourceDataTable(reportId);

	const isPieChart = chartType === insightsTypes.ChartType.PIE;

	const filterByFilterForExport = isListView
		? composeListViewFilterByFilter({
				reportType,
				listSegmentData,
				intervalFilter,
				isPieChart,
				groupByFilter,
				segmentByFilter,
				uniqueSegments,
				filterByFilter,
				isCumulative,
				groupedAndSegmentedData,
				quickFilters,
		  })
		: filterByFilter;

	const requestExportListFields = async () => {
		const query = getReportQuery(dataType, {
			chartType: insightsTypes.ChartType.TABLE,
			reportType,
			shouldQueryExportList: true,
			filterByFilter: filterByFilterForExport,
			getPipelineStages,
			multiSelectFilter,
			reportColumns: ['id', 'totalItems'], // { id: true, totalItems: true },
		});

		return InsightsApiClient.query({
			query,
			variables: {
				format: exportFormat,
				fields: cachedSourceDataTable?.columns,
			},
			context: {
				headers: { 'insights-report-id': reportId },
			},
			fetchPolicy: getInsightsApiFetchPolicy(),
		});
	};

	const downloadExportResults = (exportId: number) => {
		const reportType = getValueFromUnsavedOrOriginalReport(
			report,
			'report_type',
		);

		trackReportDataDownloaded({
			file_format: exportFormat,
			report_type: `${report.data_type}_${reportType}`,
		});

		window.location = getUrl(
			`/api/v1/exports/${exportId}/download`,
		) as unknown as Location;
	};

	return {
		requestExportListFields,
		downloadExportResults,
	};
}

export default useExport;
