import { useMemo } from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import { getLogger, get as getWebappApi } from '../../../api/webapp';
import { isCellRightAligned } from '../../../utils/helpers';
import localState from '../../../utils/localState/index';
import { PAGINATION_SIZE } from '../../../utils/constants';
import useSettingsApi from '../../../hooks/useSettingsApi';
import { getQueryListPath, getSourceData } from '../../../utils/responseUtils';
import { TranslatedField } from '../../../types/report-options';
import {
	hasReachedEnd,
	getPreparedSourceTableData,
	getRequestDataSize,
	getWebappApiParameters,
	getPreparedTableHeaderColumns,
	getRequestedData,
} from '../../../hooks/sourceTable/sourceTableUtils';

interface ListViewDataBuffer {
	columns: string[];
	data: object[];
}

const useListSourceTable = ({
	filterByFilter,
	listViewFilterByFilter = [],
	fields,
	reportDataType,
	reportType,
	reportId,
	setIsUpdatingColumns,
	listViewDataBuffer,
	setListViewDataBuffer,
}: {
	filterByFilter: insightsTypes.Filter[];
	listViewFilterByFilter: insightsTypes.Filter[];
	fields: TranslatedField[];
	reportDataType: insightsTypes.DataType;
	reportType: insightsTypes.ReportType;
	reportId: string;
	setIsUpdatingColumns: React.Dispatch<React.SetStateAction<boolean>>;
	listViewDataBuffer: ListViewDataBuffer;
	setListViewDataBuffer: React.Dispatch<
		React.SetStateAction<ListViewDataBuffer>
	>;
}) => {
	const { setCachedSourceDataTable } = localState();
	const { updateReportColumns } = useSettingsApi();
	const WebappApi = getWebappApi();
	const translator = useTranslator();

	const { currentUserId } = getWebappApiParameters(WebappApi);
	const queryListPath = useMemo(() => {
		return {
			sourceData: getQueryListPath({
				filterByFilter,
				dataType: reportDataType,
				reportType,
			}),
			listView: getQueryListPath({
				filterByFilter: listViewFilterByFilter,
				dataType: reportDataType,
				reportType,
			}),
		};
	}, [listViewFilterByFilter]);
	const { data, columns } = listViewDataBuffer;

	const onFetchMore = async () => {
		if (hasReachedEnd(data)) {
			return null;
		}

		const requestedData = await getRequestedData({
			pagination: {
				from: data.length,
				size: PAGINATION_SIZE,
			},
			columns,
			reportDataType,
			reportType,
			webappAPI: WebappApi,
			reportId,
			filterByFilter: listViewFilterByFilter,
		});

		const requestedNextData = getSourceData(
			queryListPath.listView,
			requestedData.data[reportDataType],
		);

		if (!requestedNextData.length) {
			return data;
		}

		setListViewDataBuffer({
			columns,
			data: [...data, ...requestedNextData],
		});

		return null;
	};

	const getColumnsData = async ({
		from,
		size,
		columns,
		filters,
		queryListPath,
	}: {
		from: number;
		size: number;
		columns: string[];
		filters: insightsTypes.Filter[];
		queryListPath: string;
	}) => {
		const requestedData = await getRequestedData({
			pagination: { from, size },
			columns,
			reportDataType,
			reportType,
			webappAPI: WebappApi,
			reportId,
			filterByFilter: filters,
		});

		return getSourceData(queryListPath, requestedData.data[reportDataType]);
	};

	const updateSourceTableColumns = async (
		newColumns: string[],
		data: any[],
	) => {
		await setCachedSourceDataTable(reportId, {
			columns: newColumns,
			data,
		});
	};

	const updateColumns = async (newColumns: string[]) => {
		if (!newColumns.length) {
			return;
		}

		setIsUpdatingColumns(true);

		try {
			const requestedSourceData = await getColumnsData({
				from: 0,
				size: getRequestDataSize(data),
				columns: newColumns,
				filters: filterByFilter,
				queryListPath: queryListPath.sourceData,
			});

			const requestedListData = await getColumnsData({
				from: 0,
				size: data.length,
				columns: newColumns,
				filters: listViewFilterByFilter,
				queryListPath: queryListPath.listView,
			});

			await updateReportColumns(reportId, newColumns);
			setListViewDataBuffer({
				columns: newColumns,
				data: requestedListData,
			});
			await updateSourceTableColumns(newColumns, requestedSourceData);
		} catch (err) {
			getLogger().remote(
				'error',
				`Could not update source table columns because of error: ${err}`,
			);
		} finally {
			setIsUpdatingColumns(false);
		}
	};

	return {
		tableColumns: getPreparedTableHeaderColumns({
			tableColumnsArray: columns,
			isPublicPage: false,
			reportType,
			currentUserId,
			tableSourceData: data,
			fields,
		}),
		hasReachedEnd: hasReachedEnd(data),
		isCellRightAligned: (key: string) => isCellRightAligned(key),
		data: getPreparedSourceTableData(data, translator, reportDataType),
		updateColumns: (columns: string[]) => updateColumns(columns),
		onFetchMore: () => onFetchMore(),
	};
};

export default useListSourceTable;
