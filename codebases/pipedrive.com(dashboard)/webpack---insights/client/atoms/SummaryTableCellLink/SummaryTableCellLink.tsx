import React from 'react';

import { HeaderObject } from '../../hooks/summaryTable/summaryTableHeaderUtils';
import { OTHER_SEGMENT, summaryColumnTypes } from '../../utils/constants';
import { ListViewSegmentDataType } from '../../types/list-view';
import { isGroupByTime } from '../ChartGroupByFilter/chartGroupByUtils';

import styles from './SummaryTableCellLink.pcss';

const SummaryTableCellLink: React.FC<{
	header: HeaderObject;
	segment: any;
	totalOrAverageRow: boolean;
	formattedCellValue: string | number;
	showListView: (data: ListViewSegmentDataType) => void;
	primaryFilter: string;
}> = ({
	header,
	segment,
	showListView,
	totalOrAverageRow = false,
	formattedCellValue,
	primaryFilter,
}) => {
	const totalColumn = (
		[summaryColumnTypes.COUNT, summaryColumnTypes.SUM] as any[]
	).includes(header.id);
	const isDate = isGroupByTime(primaryFilter);

	const getListName = ({
		totalColumn,
		totalOrAverageRow,
		header,
		segment,
	}: {
		totalColumn: boolean;
		totalOrAverageRow: boolean;
		header: HeaderObject;
		segment: any;
	}) => {
		if (totalColumn) {
			return segment.name;
		}

		if (totalOrAverageRow) {
			return header.Header;
		}

		const isOtherGroupAndOtherSegment =
			segment.id === null && header.id === OTHER_SEGMENT;

		if (isOtherGroupAndOtherSegment) {
			return header.Header;
		}

		return `${segment.name}, ${header.Header}`;
	};

	const getWarning = () => {
		if (totalOrAverageRow && header.id === OTHER_SEGMENT) {
			return 'Total list of other segments is not available yet.';
		}

		if (isDate && segment.id === null) {
			return 'Total list of other groups for chart that is grouped by dates is not available yet.';
		}

		return null;
	};

	return (
		<span
			className={styles.link}
			onClick={() =>
				showListView({
					listName: getListName({
						totalColumn,
						totalOrAverageRow,
						header,
						segment,
					}),
					groupId: totalOrAverageRow
						? null
						: segment.id || OTHER_SEGMENT,
					segmentId: totalColumn ? null : header.id,
					warning: getWarning(),
				})
			}
		>
			{formattedCellValue}
		</span>
	);
};

export default SummaryTableCellLink;
