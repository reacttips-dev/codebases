import React, { useState } from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { getLogger } from '../../api/webapp';
import { ListViewSegmentDataType } from '../../types/list-view';
import { LOGGER_FACILITY } from '../../utils/constants';
import { trackListViewOpened } from '../../utils/metrics/report-analytics';

function useListViewOptions(
	chartType?: insightsTypes.ChartType,
	reportType?: insightsTypes.ReportType,
): {
	isListViewVisible: boolean;
	setIsListViewVisible: React.Dispatch<React.SetStateAction<boolean>>;
	listSegmentData: ListViewSegmentDataType;
	showListView: (data: ListViewSegmentDataType) => void;
	isExportListViewDialogVisible: boolean;
	setIsExportListViewDialogVisible: React.Dispatch<
		React.SetStateAction<boolean>
	>;
	itemsCount: number;
	setItemsCount: React.Dispatch<React.SetStateAction<number>>;
} {
	const [isListViewVisible, setIsListViewVisible] = useState(false);
	const [listSegmentData, setListSegmentData] = useState(null);

	const showListView = (data: ListViewSegmentDataType) => {
		if (data.warning) {
			getLogger().remote(
				'warning',
				'Can not open list view',
				{
					warning: data.warning,
				},
				LOGGER_FACILITY,
			);

			return;
		}

		trackListViewOpened(chartType, reportType);
		setIsListViewVisible(true);
		setListSegmentData(data);
	};

	const [isExportListViewDialogVisible, setIsExportListViewDialogVisible] =
		useState(false);

	const [itemsCount, setItemsCount] = useState(0);

	return {
		isListViewVisible,
		setIsListViewVisible,
		listSegmentData,
		showListView,
		isExportListViewDialogVisible,
		setIsExportListViewDialogVisible,
		itemsCount,
		setItemsCount,
	};
}

export default useListViewOptions;
