import React, { useState } from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useQuery } from '@apollo/client';

import Table from '../../../atoms/Table';
import useListSourceTable from './useListSourceTable';
import SourceTableSettings from '../../../molecules/SourceTableSettings';
import useReportOptions from '../../../hooks/useReportOptions';
import { GET_CACHED_SOURCE_DATA_TABLE_BY_ID } from '../../../api/graphql';
import { InsightsApiClient } from '../../../api/apollo/insightsApiClient';
import {
	isReportCached,
	getCachedColumns,
	getTableColumnsArray,
} from '../../../hooks/sourceTable/sourceTableUtils';

import styles from './ListViewSourceTable.pcss';

interface ListViewSourceTableProps {
	reportDataType: insightsTypes.DataType;
	filterByFilter: insightsTypes.Filter[];
	listViewFilterByFilter?: insightsTypes.Filter[];
	listSourceData?: object[];
	reportType: insightsTypes.ReportType;
	reportId: string;
}

const ListViewSourceTable = ({
	reportDataType,
	reportType,
	filterByFilter,
	listViewFilterByFilter,
	reportId,
	listSourceData,
}: ListViewSourceTableProps) => {
	const { data: cachedSourceDataTable, loading } = useQuery(
		GET_CACHED_SOURCE_DATA_TABLE_BY_ID,
		{
			client: InsightsApiClient,
			variables: { id: reportId },
		},
	);
	const cachedTable = cachedSourceDataTable?.sourceTableData;
	const [isUpdatingColumns, setIsUpdatingColumns] = useState(false);
	const [listViewDataBuffer, setListViewDataBuffer] = useState({
		data: listSourceData,
		columns: isReportCached(cachedTable)
			? getCachedColumns(cachedTable)
			: getTableColumnsArray(reportId),
	});
	const { fields } = useReportOptions(reportDataType);

	const {
		tableColumns,
		data,
		isCellRightAligned,
		onFetchMore,
		updateColumns,
		hasReachedEnd,
	} = useListSourceTable({
		filterByFilter,
		listViewFilterByFilter,
		fields,
		reportDataType,
		reportType,
		reportId,
		setIsUpdatingColumns,
		listViewDataBuffer,
		setListViewDataBuffer,
	});

	const hasNoData = data.length < 1;

	if (loading || hasNoData) {
		return null;
	}

	return (
		<div className={styles.sourceTableWrapper}>
			<Table
				sortBy={[
					{
						id: listViewDataBuffer.columns?.[0],
						desc: true,
					},
				]}
				isInsideWidget={false}
				data={data}
				columns={tableColumns}
				updateColumns={updateColumns}
				onFetchMore={onFetchMore}
				showDataLoader={!hasReachedEnd}
				isCellRightAligned={isCellRightAligned}
				canReorderColumns
			/>
			<SourceTableSettings
				updateColumns={updateColumns}
				columns={listViewDataBuffer.columns}
				isUpdatingColumns={isUpdatingColumns}
				fields={fields}
			/>
		</div>
	);
};

export default ListViewSourceTable;
