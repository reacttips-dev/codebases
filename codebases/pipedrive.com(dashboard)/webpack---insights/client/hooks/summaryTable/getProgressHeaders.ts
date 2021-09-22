import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { getSummaryTableCellFormat } from '../../utils/valueFormatter';
import { getColumnSortType, HeaderObject } from './summaryTableHeaderUtils';
import {
	PROGRESS_DEFAULT_GROUPING,
	summaryColumnTypes,
} from '../../utils/constants';
import { MapDataReturnType } from '../../types/data-layer';

export default ({
	reportData,
	primaryFilter,
	hasSelectedSecondaryFilter,
	primaryFilterName,
	measureByFilter,
	translator,
}: {
	reportData: MapDataReturnType;
	hasSelectedSecondaryFilter: boolean;
	primaryFilter: string;
	primaryFilterName: string;
	measureByFilter: string;
	translator: Translator;
}) => {
	const headers = [
		{
			Header:
				primaryFilter === PROGRESS_DEFAULT_GROUPING
					? translator.gettext('Stage entered')
					: primaryFilterName,
			accessor: primaryFilter,
			id: primaryFilter,
			sortType: 'alphanumeric',
		},
	] as HeaderObject[];

	if (hasSelectedSecondaryFilter) {
		reportData.uniqueSegments.forEach((segment) => {
			const headerId = segment.id ? segment.id.toString() : 'other';
			const valueFormat = getSummaryTableCellFormat({
				reportType: insightsTypes.ReportType.DEALS_PROGRESS,
				headerId,
				measureByFilter,
			});

			headers.push({
				Header: segment.name,
				accessor: segment.id?.toString(),
				id: headerId,
				sortType: getColumnSortType(valueFormat),
			});
		});
	} else {
		const averageColumnId = summaryColumnTypes.AVG;
		const totalColumnId = summaryColumnTypes.COUNT;
		const averageColumnValueFormat = getSummaryTableCellFormat({
			reportType: insightsTypes.ReportType.DEALS_PROGRESS,
			headerId: averageColumnId,
			measureByFilter,
		});
		const totalColumnValueFormat = getSummaryTableCellFormat({
			reportType: insightsTypes.ReportType.DEALS_PROGRESS,
			headerId: totalColumnId,
			measureByFilter,
		});

		headers.push({
			Header: translator.gettext('Average'),
			accessor: averageColumnId,
			id: averageColumnId,
			sortType: getColumnSortType(averageColumnValueFormat),
		});

		headers.push({
			Header: translator.gettext('Total'),
			accessor: totalColumnId,
			id: totalColumnId,
			sortType: getColumnSortType(totalColumnValueFormat),
		});
	}

	return headers;
};
