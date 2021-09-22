import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import Table from '../../atoms/Table';
import useSummaryTableForRevenue from '../../hooks/summaryTable/useSummaryTableForRevenue';
import { MapDataReturnType } from '../../types/data-layer';

const SummaryTableForRevenue = ({
	reportType,
	reportData,
	primaryFilter,
	measureByFilter,
	primaryFilterName,
	fields,
	reportDataType,
}: {
	reportType: insightsTypes.ReportType;
	reportData: MapDataReturnType;
	primaryFilter: string;
	measureByFilter: string;
	primaryFilterName: string;
	fields: any[];
	reportDataType: insightsTypes.DataType;
}) => {
	const { getHeaders, getRowsData, isCellRightAligned, sortBy } =
		useSummaryTableForRevenue({
			reportType,
			reportData,
			primaryFilter,
			measureByFilter,
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

export default SummaryTableForRevenue;
