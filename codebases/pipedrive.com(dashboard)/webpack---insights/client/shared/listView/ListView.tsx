import React, { useEffect } from 'react';
import { isArray } from 'lodash';
import {
	Modal,
	Spinner,
	Button,
	Spacing,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import localState from '../../utils/localState/index';
import useListView from './useListView';
import useRouter from '../../hooks/useRouter';
import ListViewSourceTable from './listViewSourceTable/ListViewSourceTable';
import { MapDataReturnType } from '../../types/data-layer';
import { getSourceData } from '../../utils/responseUtils';
import { getErrorMessage } from '../../utils/messagesUtils';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import { ListViewSegmentDataType } from '../../types/list-view';
import { QuickFilters } from '../../types/apollo-query-types';
import EmptyTableChartSVG from '../../utils/svg/EmptyTableChart.svg';
import ListViewStats from './ListViewStats';

import styles from './ListView.pcss';

interface ListViewProps {
	reportId: string;
	listSegmentData: ListViewSegmentDataType;
	setItemsCount: React.Dispatch<React.SetStateAction<number>>;
	setIsListViewVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setIsExportListViewDialogVisible: React.Dispatch<
		React.SetStateAction<boolean>
	>;
	reportData: MapDataReturnType;
	quickFilters?: QuickFilters;
}

const ListView = ({
	reportId,
	listSegmentData,
	reportData,
	quickFilters,
	setItemsCount,
	setIsListViewVisible,
	setIsExportListViewDialogVisible,
}: ListViewProps) => {
	const translator = useTranslator();
	const [, on, off] = useRouter();

	useEffect(() => {
		const closeModal = () => setIsListViewVisible(false);

		on('routeChange', closeModal);

		return () => off('routeChange', closeModal);
	});

	const { groupedAndSegmentedData, uniqueSegments } = reportData;

	const { getCachedSourceDataTable, getCachedReport } = localState();
	const report = getCachedReport(reportId);

	const dataType = report.data_type;
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');
	const {
		group_by: groupBy,
		filter_by: filterByFilter,
		segment_by: segmentByFilter,
		measure_by: measureByFilter,
	} = report.unsavedReport.parameters;
	const { filter: groupByFilter, interval: intervalFilter } = groupBy;

	const cachedSourceDataTable = isArray(getCachedSourceDataTable(reportId))
		? getCachedSourceDataTable(reportId).find(
				(data: any) => data.id === reportId,
		  )
		: getCachedSourceDataTable(reportId);

	const {
		isLoading,
		isError,
		reportDataType,
		listViewData,
		listViewFilterByFilter,
		listViewTitle,
		queryListPath,
	} = useListView({
		report,
		cachedSourceDataTable,
		listSegmentData,
		uniqueSegments,
		groupByFilter,
		segmentByFilter,
		filterByFilter,
		intervalFilter,
		chartType,
		measureByFilter,
		dataType,
		groupedAndSegmentedData,
		quickFilters,
	});

	const listResponseData = listViewData?.[dataType];
	const listSourceData = getSourceData(queryListPath, listResponseData);
	const hasData = listSourceData?.length > 0;
	const errorMessage = getErrorMessage(translator);
	const shouldRenderListViewStats =
		!isLoading && !isError && hasData && listViewData?.stats;

	const renderListViewContent = () => {
		if (isLoading) {
			return (
				<div className={styles.loader}>
					<Spinner />
				</div>
			);
		}

		if (isError || !listSourceData) {
			return (
				<Spacing all="m" className={styles.error}>
					{errorMessage}
				</Spacing>
			);
		}

		if (!hasData) {
			return (
				<div className={styles.emptyView}>
					<EmptyTableChartSVG />
					<p className={styles.emptyViewText}>
						{translator.gettext('No data to show')}
					</p>
				</div>
			);
		}

		return (
			<ListViewSourceTable
				reportDataType={reportDataType}
				filterByFilter={filterByFilter}
				listViewFilterByFilter={listViewFilterByFilter}
				reportId={reportId}
				reportType={reportType}
				listSourceData={listSourceData}
			/>
		);
	};

	return (
		<Modal
			visible
			backdrop
			closeOnEsc
			header={listViewTitle}
			footer={
				<>
					<Button
						className={styles.footerAction}
						onClick={() => setIsListViewVisible(false)}
					>
						{translator.gettext('Close')}
					</Button>
				</>
			}
			onClose={() => setIsListViewVisible(false)}
			spacing="none"
		>
			{shouldRenderListViewStats && (
				<ListViewStats
					dataType={dataType}
					dataStats={listViewData?.stats}
					setItemsCount={setItemsCount}
					setIsListViewVisible={setIsListViewVisible}
					setIsExportListViewDialogVisible={
						setIsExportListViewDialogVisible
					}
				/>
			)}
			{renderListViewContent()}
		</Modal>
	);
};

export default React.memo(ListView);
