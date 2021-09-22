import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import Table from '../../atoms/Table';
import useSummaryTableForFunnel from '../../hooks/summaryTable/useSummaryTableForFunnel';
import useReportOptions from '../../hooks/useReportOptions';

const SummaryTableForFunnel = ({
	groupedAndSegmentedFlatData,
	primaryFilter,
	measureByFilter,
	primaryFilterName,
}: {
	groupedAndSegmentedFlatData: any[];
	primaryFilter: string;
	measureByFilter: string;
	primaryFilterName: string;
}) => {
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);
	const { getHeaders, getRowsData, isCellRightAligned, sortBy } =
		useSummaryTableForFunnel({
			groupedAndSegmentedFlatData,
			primaryFilter,
			measureByFilter,
			primaryFilterName,
			fields,
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

export default SummaryTableForFunnel;
