import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import Table from '../../atoms/Table';
import useSummaryTable from '../../hooks/summaryTable/useSummaryTable';
import useReportOptions from '../../hooks/useReportOptions';
import ListView from '../../shared/listView/ListView';
import ExportDialog from '../../shared/export/ExportDialog';
import { MapDataReturnType } from '../../types/data-layer';
import useListViewOptions from '../../shared/listView/useListViewOptions';

const SummaryTable = ({
	reportId,
	reportType,
	reportData,
	primaryFilter,
	measureByFilter,
	secondaryFilter,
	primaryFilterName,
	reportDataType,
}: {
	reportId: string;
	reportType: insightsTypes.ReportType;
	reportData: MapDataReturnType;
	primaryFilter: string;
	measureByFilter: string;
	secondaryFilter: string;
	primaryFilterName: string;
	reportDataType: insightsTypes.DataType;
}) => {
	const {
		isListViewVisible,
		setIsListViewVisible,
		listSegmentData,
		showListView,
		isExportListViewDialogVisible,
		setIsExportListViewDialogVisible,
		itemsCount,
		setItemsCount,
	} = useListViewOptions(insightsTypes.ChartType.TABLE, reportType);

	const { fields } = useReportOptions(reportDataType);

	const { getHeaders, getRowsData, isCellRightAligned, sortBy } =
		useSummaryTable({
			reportType,
			reportData,
			primaryFilter,
			measureByFilter,
			secondaryFilter,
			primaryFilterName,
			fields,
			reportDataType,
			showListView,
		});

	return (
		<>
			{isListViewVisible && (
				<ListView
					reportId={reportId}
					listSegmentData={listSegmentData}
					reportData={reportData}
					setItemsCount={setItemsCount}
					setIsListViewVisible={setIsListViewVisible}
					setIsExportListViewDialogVisible={
						setIsExportListViewDialogVisible
					}
				/>
			)}

			{isExportListViewDialogVisible && (
				<ExportDialog
					itemsCount={itemsCount}
					setIsListViewVisible={setIsListViewVisible}
					setIsExportListViewDialogVisible={
						setIsExportListViewDialogVisible
					}
					reportId={reportId}
					reportData={reportData}
					listSegmentData={listSegmentData}
					isListView={true}
				/>
			)}
			<Table
				data={getRowsData()}
				columns={getHeaders()}
				sortBy={sortBy}
				isCellRightAligned={isCellRightAligned}
			/>
		</>
	);
};

export default SummaryTable;
