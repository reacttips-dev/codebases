import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { HeaderObject, getColumnSortType } from './summaryTableHeaderUtils';
import { getSummaryTableCellFormat } from '../../utils/valueFormatter';
import { isCellRightAligned, makeRowObject } from './summaryTableRowUtils';
import { getMeasureByLabel } from '../../utils/filterUtils';
import { FunnelConversionSummaryTableField } from '../../utils/queries/dataMappingConstants';

const useSummaryTable = ({
	groupedAndSegmentedFlatData,
	primaryFilter,
	measureByFilter,
	primaryFilterName,
	fields,
}: {
	groupedAndSegmentedFlatData: any[];
	primaryFilter: string;
	measureByFilter: string;
	primaryFilterName: string;
	fields: any[];
}) => {
	const translator = useTranslator();

	const headers = (() => {
		const measureByLabel = getMeasureByLabel(
			measureByFilter,
			fields,
			translator,
		);
		const reachedStageColumnId =
			FunnelConversionSummaryTableField.REACHED_STAGE;
		const conversionToNextColumnId =
			FunnelConversionSummaryTableField.CONVERSION_TO_NEXT_STAGE;
		const conversionToWonColumnId =
			FunnelConversionSummaryTableField.CONVERSION_TO_WON;
		const conversionToLostColumnId =
			FunnelConversionSummaryTableField.CONVERSION_TO_LOST;
		const reachedStageColumnValueFormat = getSummaryTableCellFormat({
			reportType: insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
			headerId: reachedStageColumnId,
			measureByFilter,
		});
		const conversionToNextColumnValueFormat = getSummaryTableCellFormat({
			reportType: insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
			headerId: conversionToNextColumnId,
			measureByFilter,
		});
		const conversionToWonColumnValueFormat = getSummaryTableCellFormat({
			reportType: insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
			headerId: conversionToWonColumnId,
			measureByFilter,
		});
		const conversionToLostColumnValueFormat = getSummaryTableCellFormat({
			reportType: insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
			headerId: conversionToLostColumnId,
			measureByFilter,
		});

		return [
			{
				Header: primaryFilterName || '',
				accessor: primaryFilter,
				id: primaryFilter,
				sortType: 'alphanumeric',
			},
			{
				Header: `${translator.gettext(
					'Reached stage',
				)} (${measureByLabel})`,
				accessor: reachedStageColumnId,
				id: reachedStageColumnId,
				sortType: getColumnSortType(reachedStageColumnValueFormat),
			},
			{
				Header: translator.gettext(
					'Conversion to next stage (incl. won deals)',
				),
				accessor: conversionToNextColumnId,
				id: conversionToNextColumnId,
				sortType: getColumnSortType(conversionToNextColumnValueFormat),
			},
			{
				Header: translator.gettext(
					'Conversion to won (directly from stage)',
				),
				accessor: conversionToWonColumnId,
				id: conversionToWonColumnId,
				sortType: getColumnSortType(conversionToWonColumnValueFormat),
			},
			{
				Header: translator.gettext('Conversion to lost'),
				accessor: conversionToLostColumnId,
				id: conversionToLostColumnId,
				sortType: getColumnSortType(conversionToLostColumnValueFormat),
			},
		] as HeaderObject[];
	})();

	const getRowsData = () => {
		return groupedAndSegmentedFlatData.map(
			(segment: any, index: number) => {
				const isLastRow =
					groupedAndSegmentedFlatData.length === index + 1;

				return makeRowObject({
					reportType:
						insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
					primaryFilter,
					measureByFilter,
					headers,
					segment,
					isLastRow,
					translator,
				});
			},
		);
	};

	return {
		sortBy: [] as any[],
		getHeaders: () => headers,
		getRowsData: () => getRowsData(),
		isCellRightAligned: (key: string) =>
			isCellRightAligned(key, primaryFilter),
	};
};

export default useSummaryTable;
