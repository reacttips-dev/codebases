import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import Table from '../../atoms/Table';
import SourceTableSettings from '../../molecules/SourceTableSettings';
import useReportOptions from '../../hooks/useReportOptions';
import { MapDataReturnType } from '../../types/data-layer';
import localState from '../../utils/localState';
import useSettingsApi from '../../hooks/useSettingsApi';
import {
	getCachedColumns,
	getPreparedSourceTableData,
	getPreparedTableHeaderColumns,
	getPublicTableColumnsArray,
	getRequestDataSize,
	getRequestedData,
	getTableColumnsArray,
	getWebappApiParameters,
	hasReachedEnd,
	isReportCached,
} from '../../hooks/sourceTable/sourceTableUtils';
import useIntervalOptions from '../VisualBuilder/useIntervalOptions';
import { getQueryListPath, getSourceData } from '../../utils/responseUtils';
import { GET_CACHED_SOURCE_DATA_TABLE_BY_ID } from '../../api/graphql';
import { isCellRightAligned } from '../../utils/helpers';
import { PAGINATION_SIZE } from '../../utils/constants';
import { getLogger, get as getWebappApi } from '../../api/webapp';
import { InsightsApiClient } from '../../api/apollo/insightsApiClient';

import styles from './SourceTable.pcss';

interface SourceTableProps {
	widget?: boolean;
	reportDataType: insightsTypes.DataType;
	filterByFilter: insightsTypes.Filter[];
	listSourceData?: object[];
	reportData?: MapDataReturnType;
	reportType: insightsTypes.ReportType;
	reportId: string;
	canReorderColumns?: boolean;
	selectedStages?: number[];
	groupByFilter?: string;
	isGoalsReport?: boolean;
}

const SourceTable = ({
	widget = false,
	reportDataType,
	reportData,
	reportType,
	filterByFilter,
	reportId,
	canReorderColumns = true,
	selectedStages,
	groupByFilter,
	isGoalsReport = false,
}: SourceTableProps) => {
	const isPublicPage = window?.app?.isPublic;
	const translator = useTranslator();

	const { fields } = useReportOptions(reportDataType);
	const [isUpdatingColumns, setIsUpdatingColumns] = useState(false);

	const intervalFilter = useMemo(
		() =>
			groupByFilter &&
			useIntervalOptions({
				translator,
				groupByFilter: groupByFilter as any,
				reportType,
				filterByFilter,
				isGoalsReport,
			}).intervalFilter,
		[],
	);
	const { data: cachedSourceDataTable, loading } = useQuery(
		GET_CACHED_SOURCE_DATA_TABLE_BY_ID,
		{
			client: InsightsApiClient,
			variables: { id: reportId },
		},
	);

	const { setCachedSourceDataTable } = localState();
	const { updateReportColumns } = useSettingsApi();
	const WebappApi = getWebappApi();
	const { currentUserId } = getWebappApiParameters(WebappApi);
	const queryListPath = useMemo(
		() => ({
			sourceData: getQueryListPath({
				filterByFilter,
				dataType: reportDataType,
				reportType,
			}),
		}),
		[filterByFilter],
	);
	const cachedTable = cachedSourceDataTable?.sourceTableData;

	const getTableDataAndColumns = () => {
		if (isReportCached(cachedTable)) {
			return {
				tableSourceData: cachedTable?.data,
				tableColumnsArray: getCachedColumns(cachedTable),
			};
		}

		const tableColumnsArray = isPublicPage
			? getPublicTableColumnsArray(reportId)
			: getTableColumnsArray(reportId);

		return {
			tableSourceData: reportData?.sourceData,
			tableColumnsArray,
		};
	};

	const { tableSourceData, tableColumnsArray } = getTableDataAndColumns();

	const hasNoData =
		getPreparedSourceTableData(tableSourceData, translator, reportDataType)
			.length < 1;

	if (loading || hasNoData) {
		return null;
	}

	const onFetchMore = async () => {
		if (hasReachedEnd(tableSourceData)) {
			return null;
		}

		const { data: requestedData } = await getRequestedData({
			pagination: { from: tableSourceData.length, size: PAGINATION_SIZE },
			columns: tableColumnsArray,
			reportDataType,
			reportType,
			webappAPI: WebappApi,
			reportId,
			groupByFilter,
			intervalFilter,
			filterByFilter,
			selectedStages,
		});

		const requestedNextData = getSourceData(
			queryListPath.sourceData,
			requestedData[reportDataType],
		);

		if (!requestedNextData.length) {
			return tableSourceData;
		}

		await setCachedSourceDataTable(reportId, {
			tableColumnsArray,
			data: [...tableSourceData, ...requestedNextData],
		});

		return null;
	};

	const getColumnsData = async (
		from: number,
		size: number,
		columns: string[],
		queryListPath: string,
	) => {
		const { data: requestedData } = await getRequestedData({
			pagination: { from, size },
			columns,
			reportDataType,
			reportType,
			webappAPI: WebappApi,
			reportId,
			groupByFilter,
			intervalFilter,
			filterByFilter,
			selectedStages,
		});

		return getSourceData(queryListPath, requestedData[reportDataType]);
	};

	const updateColumns = async (columns: string[]) => {
		if (!columns.length) {
			return;
		}

		setIsUpdatingColumns(true);

		try {
			const requestedSourceData = await getColumnsData(
				0,
				getRequestDataSize(cachedTable),
				columns,
				queryListPath.sourceData,
			);

			await updateReportColumns(reportId, columns);
			await setCachedSourceDataTable(reportId, {
				columns,
				data: requestedSourceData,
			});
		} catch (err) {
			getLogger().remote(
				'error',
				`Could not update source table columns because of error: ${err}`,
			);
		} finally {
			setIsUpdatingColumns(false);
		}
	};

	return (
		<div className={styles.sourceTableWrapper}>
			<Table
				sortBy={[
					{
						id: tableColumnsArray?.[0],
						desc: true,
					},
				]}
				isInsideWidget={widget}
				data={getPreparedSourceTableData(
					tableSourceData,
					translator,
					reportDataType,
				)}
				columns={getPreparedTableHeaderColumns({
					tableColumnsArray,
					isPublicPage,
					reportType,
					currentUserId,
					tableSourceData,
					fields,
				})}
				updateColumns={updateColumns}
				onFetchMore={onFetchMore}
				showDataLoader={!hasReachedEnd(tableSourceData) && !widget}
				isCellRightAligned={isCellRightAligned}
				canReorderColumns={canReorderColumns}
			/>
			{!widget && (
				<SourceTableSettings
					updateColumns={updateColumns}
					columns={tableColumnsArray}
					isUpdatingColumns={isUpdatingColumns}
					fields={fields}
				/>
			)}
		</div>
	);
};

export default SourceTable;
