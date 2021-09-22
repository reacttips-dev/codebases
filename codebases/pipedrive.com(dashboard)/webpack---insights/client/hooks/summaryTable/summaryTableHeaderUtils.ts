import memoize from 'memoizee';
import { Row } from 'react-table';
import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	SegmentId,
	FunnelConversionSummaryTableField,
} from '../../utils/queries/dataMappingConstants';
import {
	ValueFormat,
	getSummaryTableCellFormat,
} from '../../utils/valueFormatter';
import {
	sortByValueTypeField,
	sortByNumericTypeField,
} from '../../utils/listViewUtils';
import { MapDataReturnType } from '../../types/data-layer';

export interface HeaderObject {
	Header: string;
	accessor: string | FunnelConversionSummaryTableField;
	id: string | FunnelConversionSummaryTableField;
	sortType: string | ((prev: any, next: any, item: any) => number);
}

// This should come from dynamicLabels.js
export const getColumnHeaderLabel = (fields: any[], key: string) =>
	(fields.find((field) => field.uiName === key) || {}).translatedName || key;

export const getHeaderAverageLabel = ({
	fields,
	measureByFilter,
	isMeasureByFilterCustomField,
	translator,
}: {
	fields: any[];
	measureByFilter: string;
	isMeasureByFilterCustomField: boolean;
	translator: Translator;
}) => {
	if (isMeasureByFilterCustomField) {
		return `${translator.gettext('Average')} ${getColumnHeaderLabel(
			fields,
			measureByFilter,
		)}`;
	}

	if (measureByFilter === insightsTypes.Deals.MeasureByType.WEIGHTED_VALUE) {
		return translator.gettext('Average weighted value');
	}

	if (measureByFilter === insightsTypes.Deals.MeasureByType.PRODUCTS_SUM) {
		return translator.gettext('Average product value');
	}

	return translator.gettext('Average deal value');
};

const getDefaultTotalHeaderLabel = ({
	isMonetary,
	translator,
	reportDataType,
}: {
	isMonetary: boolean;
	translator: Translator;
	reportDataType: insightsTypes.DataType;
}) => {
	return isMonetary
		? translator.pgettext(
				'Total value of [report data type]',
				'Total value of %s',
				reportDataType,
		  )
		: translator.pgettext(
				'Total count of [report data type]',
				'Total count of %s',
				reportDataType,
		  );
};

const getActivitiesTotalHeaderLabel = ({
	measureByFilter,
	isMonetary,
	translator,
	reportDataType,
}: {
	isMonetary: boolean;
	translator: Translator;
	reportDataType: insightsTypes.DataType;
	measureByFilter: string;
}) => {
	if (measureByFilter === insightsTypes.Activities.MesaureByField.DURATION) {
		return translator.gettext('Total duration');
	}

	return getDefaultTotalHeaderLabel({
		isMonetary,
		translator,
		reportDataType,
	});
};

const getDealsTotalHeaderLabel = ({
	isMeasureByFilterCustomField,
	measureByFilter,
	isMonetary,
	translator,
	reportDataType,
	fields,
}: {
	isMeasureByFilterCustomField: boolean;
	isMonetary: boolean;
	translator: Translator;
	reportDataType: insightsTypes.DataType;
	measureByFilter: string;
	fields: any[];
}) => {
	if (isMeasureByFilterCustomField) {
		return `${translator.gettext('Total')} ${getColumnHeaderLabel(
			fields,
			measureByFilter,
		)}`;
	}

	if (measureByFilter === insightsTypes.Deals.MeasureByType.PAYMENTS_AMOUNT) {
		return translator.gettext('Total value of payments');
	}

	if (
		measureByFilter ===
		insightsTypes.Deals.MeasureByType.PAYMENTS_CHANGE_AMOUNT
	) {
		return translator.gettext('Net growth');
	}

	if (measureByFilter === insightsTypes.Deals.MeasureByType.WEIGHTED_VALUE) {
		return translator.gettext('Total weighted value');
	}

	if (measureByFilter === insightsTypes.Deals.MeasureByType.PRODUCTS_SUM) {
		return translator.gettext('Total product value');
	}

	if (measureByFilter === insightsTypes.Deals.MeasureByType.PRODUCTS_AMOUNT) {
		return translator.gettext('Total number of products');
	}

	return getDefaultTotalHeaderLabel({
		isMonetary,
		translator,
		reportDataType,
	});
};

export const getHeaderTotalLabel = ({
	fields,
	measureByFilter,
	isMeasureByFilterCustomField,
	isMonetary,
	translator,
	reportDataType,
}: {
	fields: any[];
	measureByFilter: string;
	isMeasureByFilterCustomField: boolean;
	isMonetary: boolean;
	translator: Translator;
	reportDataType: insightsTypes.DataType;
}) => {
	if (reportDataType === insightsTypes.DataType.ACTIVITIES) {
		return getActivitiesTotalHeaderLabel({
			measureByFilter,
			isMonetary,
			translator,
			reportDataType,
		});
	}

	if (reportDataType === insightsTypes.DataType.MAILS) {
		return getDefaultTotalHeaderLabel({
			isMonetary: false,
			translator,
			reportDataType,
		});
	}

	if (reportDataType === insightsTypes.DataType.DEALS) {
		return getDealsTotalHeaderLabel({
			fields,
			measureByFilter,
			isMeasureByFilterCustomField,
			isMonetary,
			translator,
			reportDataType,
		});
	}

	return '';
};

const getSegmentHeaderForOverallConversion = (
	segment: any,
	translator: Translator,
) => {
	if (segment.id === SegmentId.WON) {
		return translator.gettext('Win rate');
	}

	if (segment.id === SegmentId.LOST) {
		return translator.gettext('Loss rate');
	}

	return '';
};

export const getSegmentHeader = (
	reportType: insightsTypes.ReportType,
	segment: any,
	translator: Translator,
) => {
	if (reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL) {
		return getSegmentHeaderForOverallConversion(segment, translator);
	}

	return segment.name;
};

export const getColumnSortType = (valueFormat: ValueFormat) => {
	const monetaryCustomSorting = memoize(
		(rowA: Row, rowB: Row, columnId: string) =>
			sortByValueTypeField(rowA, rowB, columnId),
	);
	const numericCustomSorting = memoize(
		(rowA: Row, rowB: Row, columnId: string) =>
			sortByNumericTypeField(rowA, rowB, columnId),
	);

	return valueFormat === ValueFormat.MONETARY
		? monetaryCustomSorting
		: numericCustomSorting;
};

export const addHeadersBasedOnSegments = ({
	reportData,
	headers,
	reportType,
	translator,
	measureByFilter,
}: {
	reportData: MapDataReturnType;
	headers: HeaderObject[];
	reportType: insightsTypes.ReportType;
	translator: Translator;
	measureByFilter: string;
}) => {
	reportData.uniqueSegments.forEach((segment) => {
		const headerId = segment.id;
		const valueFormat = getSummaryTableCellFormat({
			reportType,
			headerId: headerId?.toString(),
			measureByFilter,
		});

		headers.push({
			Header: getSegmentHeader(reportType, segment, translator),
			accessor: headerId?.toString(),
			id: headerId as string,
			sortType: getColumnSortType(valueFormat),
		});
	});
};
