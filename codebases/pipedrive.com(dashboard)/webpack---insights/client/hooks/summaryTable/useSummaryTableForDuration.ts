import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { HeaderObject, getColumnSortType } from './summaryTableHeaderUtils';
import { getSummaryTableCellFormat } from '../../utils/valueFormatter';
import { isCellRightAligned, makeRowObject } from './summaryTableRowUtils';
import { DurationSummaryTableField } from '../../utils/queries/dataMappingConstants';
import { DEAL_STAGE_LOG_STAGE_ID } from '../../utils/constants';

const useSummaryTable = ({
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
	const translator = useTranslator();

	const headers = (() => {
		const isPrimaryFilterStageEntered =
			primaryFilter === DEAL_STAGE_LOG_STAGE_ID;
		const averageColumnId = DurationSummaryTableField.AVERAGE_DURATION;
		const totalColumnId = DurationSummaryTableField.NUMBER_OF_DEALS;
		const averageColumnValueFormat = getSummaryTableCellFormat({
			reportType: insightsTypes.ReportType.DEALS_DURATION,
			headerId: averageColumnId,
			measureByFilter,
		});
		const totalColumnValueFormat = getSummaryTableCellFormat({
			reportType: insightsTypes.ReportType.DEALS_DURATION,
			headerId: totalColumnId,
			measureByFilter,
		});

		return [
			{
				Header: primaryFilterName,
				accessor: primaryFilter,
				id: primaryFilter,
				sortType: 'alphanumeric',
			},
			{
				Header: isPrimaryFilterStageEntered
					? translator.gettext('Average time in stage')
					: translator.gettext('Average sales cycle'),
				accessor: averageColumnId,
				id: averageColumnId,
				sortType: getColumnSortType(averageColumnValueFormat),
			},
			{
				Header: translator.gettext('Number of deals'),
				accessor: totalColumnId,
				id: totalColumnId,
				sortType: getColumnSortType(totalColumnValueFormat),
			},
		] as HeaderObject[];
	})();

	const getRowsData = () => {
		return groupedAndSegmentedFlatData.map((segment: any) =>
			makeRowObject({
				reportType: insightsTypes.ReportType.DEALS_DURATION,
				primaryFilter,
				measureByFilter,
				headers,
				segment,
				translator,
			}),
		);
	};

	return {
		getHeaders: () => headers,
		getRowsData: () => getRowsData(),
		isCellRightAligned: (key: string) =>
			isCellRightAligned(key, primaryFilter),
	};
};

export default useSummaryTable;
