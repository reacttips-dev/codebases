import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import Table from '../../atoms/Table';
import useSummaryTable from '../../hooks/summaryTable/useSummaryTable';
import useReportOptions from '../../hooks/useReportOptions';
import { MapDataReturnType } from '../../types/data-layer';

const SummaryTableForProgress = ({
	primaryFilter,
	measureByFilter,
	primaryFilterName,
	reportType,
	reportData,
	secondaryFilter,
	reportDataType,
}: {
	primaryFilter: string;
	measureByFilter: string;
	primaryFilterName: string;
	reportType: insightsTypes.ReportType;
	reportData: MapDataReturnType;
	secondaryFilter: string;
	reportDataType: insightsTypes.DataType;
}) => {
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);

	const { getRowsData, isCellRightAligned, getHeaders, sortBy } =
		useSummaryTable({
			reportType,
			reportData,
			primaryFilter,
			measureByFilter,
			secondaryFilter,
			primaryFilterName,
			fields,
			reportDataType,
		});

	return (
		<Table
			data={getRowsData()}
			columns={getHeaders()}
			sortBy={sortBy}
			isCellRightAligned={isCellRightAligned}
		/>
	);
};

export default SummaryTableForProgress;
