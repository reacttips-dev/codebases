import React from 'react';

import Table from '../../atoms/Table';
import useSummaryTable from '../../hooks/summaryTable/useSummaryTableForDuration';

const SummaryTableForDuration = ({
	primaryFilter,
	measureByFilter,
	primaryFilterName,
	groupedAndSegmentedFlatData,
}: {
	groupedAndSegmentedFlatData: any[];
	primaryFilter: string;
	measureByFilter: string;
	primaryFilterName: string;
}) => {
	const { getHeaders, getRowsData, isCellRightAligned } = useSummaryTable({
		groupedAndSegmentedFlatData,
		primaryFilter,
		measureByFilter,
		primaryFilterName,
	});

	return (
		<Table
			data={getRowsData()}
			columns={getHeaders()}
			sortBy={[]}
			isCellRightAligned={isCellRightAligned}
		/>
	);
};

export default SummaryTableForDuration;
