import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import Table from '../../atoms/Table';
import useSummaryTableForGoal from '../../hooks/summaryTable/useSummaryTableForGoal';
import { MapDataReturnType } from '../../types/data-layer';
import { Goal } from '../../types/goals';

const SummaryTableForGoal = ({
	reportType,
	reportData,
	primaryFilter,
	measureByFilter,
	primaryFilterName,
	reportDataType,
	goal,
}: {
	reportType: insightsTypes.ReportType;
	reportData: MapDataReturnType;
	primaryFilter: string;
	measureByFilter: string;
	primaryFilterName: string;
	reportDataType: insightsTypes.DataType;
	goal: Goal;
}) => {
	const {
		headers: columnsFromHeaders,
		rows,
		isCellRightAligned,
		sortBy,
	} = useSummaryTableForGoal({
		reportType,
		reportData,
		primaryFilter,
		measureByFilter,
		primaryFilterName,
		reportDataType,
		goal,
	});

	return (
		<Table
			data={rows}
			columns={columnsFromHeaders}
			sortBy={sortBy}
			isCellRightAligned={isCellRightAligned}
		/>
	);
};

export default SummaryTableForGoal;
