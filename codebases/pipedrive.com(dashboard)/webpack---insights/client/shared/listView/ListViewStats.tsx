import React from 'react';
import { Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { DataType } from '@pipedrive/insights-core/lib/types';

import { numberFormatter } from '../../utils/numberFormatter';
import ExportDialogButton from '../export/exportDialogButton/ExportDialogButton';
import { hasPermission, PERMISSIONS } from '../../api/webapp';

import styles from './ListViewStats.pcss';

interface ListViewStatsProps {
	dataType: DataType;
	dataStats: any;
	setItemsCount: React.Dispatch<React.SetStateAction<number>>;
	setIsListViewVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setIsExportListViewDialogVisible: React.Dispatch<
		React.SetStateAction<boolean>
	>;
}

const ListViewStats = ({
	dataType,
	dataStats,
	setItemsCount,
	setIsListViewVisible,
	setIsExportListViewDialogVisible,
}: ListViewStatsProps) => {
	const translator = useTranslator();

	const getTranslatedCountStatsLabel = (count: number) => {
		const formattedCount = numberFormatter.format({
			value: count,
			isMonetary: false,
		});

		switch (dataType) {
			case insightsTypes.DataType.DEALS:
				return translator.ngettext(
					'%s deal',
					'%s deals',
					count,
					formattedCount,
				);
			case insightsTypes.DataType.ACTIVITIES:
				return translator.ngettext(
					'%s activity',
					'%s activities',
					count,
					formattedCount,
				);
			case insightsTypes.DataType.MAILS:
				return translator.ngettext(
					'%s email',
					'%s emails',
					count,
					formattedCount,
				);
			default:
				return '';
		}
	};

	const renderExportButton = () => {
		if (dataType === DataType.MAILS) {
			return null;
		}

		return (
			<ExportDialogButton
				onClick={() => {
					setItemsCount(dataStats?.count);
					setIsExportListViewDialogVisible(true);
					setIsListViewVisible(false);
				}}
				buttonText={translator.gettext('Export results')}
				hasPermission={hasPermission(PERMISSIONS.exportDataFromLists)}
				className={styles.exportButton}
			/>
		);
	};

	const isNumber = (value: any) =>
		typeof value === 'number' && !Number.isNaN(value);

	const dataStatsParts = [];

	if (isNumber(dataStats.sum) && dataType === insightsTypes.DataType.DEALS) {
		dataStatsParts.push(
			numberFormatter.format({
				value: dataStats.sum,
				isMonetary: true,
			}),
		);
	}

	if (isNumber(dataStats.count)) {
		dataStatsParts.push(getTranslatedCountStatsLabel(dataStats.count));
	}

	return (
		<Spacing all="m" className={styles.subHeader}>
			<span className={styles.stats}>
				{`${dataStatsParts.join(' · ')}`}
			</span>
			{renderExportButton()}
		</Spacing>
	);
};

export default ListViewStats;
