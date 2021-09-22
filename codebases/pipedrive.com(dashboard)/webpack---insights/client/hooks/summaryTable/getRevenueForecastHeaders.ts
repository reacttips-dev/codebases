import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	addHeadersBasedOnSegments,
	getHeaderAverageLabel,
	getHeaderTotalLabel,
	getColumnSortType,
	HeaderObject,
} from './summaryTableHeaderUtils';
import { getSummaryTableCellFormat } from '../../utils/valueFormatter';
import { summaryColumnTypes } from '../../utils/constants';
import { MapDataReturnType } from '../../types/data-layer';

export default ({
	reportData,
	primaryFilter,
	measureByFilter,
	fields,
	reportDataType,
	isMeasureByFilterCustomField,
	isMonetary,
	measureByFilterType,
	translator,
}: {
	reportData: MapDataReturnType;
	primaryFilter: string;
	measureByFilter: string;
	fields: any[];
	reportDataType: insightsTypes.DataType;
	isMeasureByFilterCustomField: boolean;
	isMonetary: boolean;
	measureByFilterType: string;
	translator: Translator;
}) => {
	const headers = [
		{
			Header: translator.gettext('Forecast period'),
			accessor: primaryFilter,
			id: primaryFilter,
			sortType: 'alphanumeric',
		},
	] as HeaderObject[];

	addHeadersBasedOnSegments({
		reportData,
		headers,
		reportType: insightsTypes.ReportType.DEALS_REVENUE_FORECAST,
		translator,
		measureByFilter,
	});

	const averageColumnId = summaryColumnTypes.AVG;
	const totalColumnId = measureByFilterType;
	const averageColumnValueFormat = getSummaryTableCellFormat({
		reportType: insightsTypes.ReportType.DEALS_REVENUE_FORECAST,
		headerId: averageColumnId,
		measureByFilter,
	});
	const totalColumnValueFormat = getSummaryTableCellFormat({
		reportType: insightsTypes.ReportType.DEALS_REVENUE_FORECAST,
		headerId: totalColumnId,
		measureByFilter,
	});

	headers.push({
		Header: getHeaderAverageLabel({
			fields,
			measureByFilter,
			isMeasureByFilterCustomField,
			translator,
		}),
		accessor: averageColumnId,
		id: averageColumnId,
		sortType: getColumnSortType(averageColumnValueFormat),
	});
	headers.push({
		Header: getHeaderTotalLabel({
			fields,
			measureByFilter,
			isMeasureByFilterCustomField,
			isMonetary,
			translator,
			reportDataType,
		}),
		accessor: totalColumnId,
		id: totalColumnId,
		sortType: getColumnSortType(totalColumnValueFormat),
	});

	return headers;
};
