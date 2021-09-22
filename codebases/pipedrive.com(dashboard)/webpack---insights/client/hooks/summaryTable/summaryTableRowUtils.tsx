import React from 'react';
import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { HeaderObject } from './summaryTableHeaderUtils';
import {
	getFormattedValue,
	ValueFormat,
	getSummaryTableCellFormat,
} from '../../utils/valueFormatter';
import {
	FunnelConversionSummaryTableField,
	DurationSummaryTableField,
} from '../../utils/queries/dataMappingConstants';
import {
	getDurationInDays,
	getFormattedDuration,
	getDurationInHours,
	DurationUnit,
} from '../../utils/duration/durationUtils';
import SummaryTableCellLink from '../../atoms/SummaryTableCellLink';
import { ListViewSegmentDataType } from '../../types/list-view';
import { TABLE_DATA_AVERAGE, TABLE_DATA_TOTAL } from '../../utils/constants';
import { numberFormatter } from '../../utils/numberFormatter';

export const isCellRightAligned = (key: string, primaryFilter: string) =>
	primaryFilter !== key;

export const getFormattedCellValueForDuration = ({
	headerId,
	value,
	translator,
}: {
	headerId: string | FunnelConversionSummaryTableField;
	value: number;
	translator: Translator;
}) => {
	if (headerId === DurationSummaryTableField.AVERAGE_DURATION) {
		const durationInDays = getDurationInDays(value);

		return getFormattedDuration({ duration: durationInDays, translator });
	}

	return numberFormatter.format({ value, isMonetary: false });
};

export const getFormattedCellValue = ({
	reportType,
	headerId,
	measureByFilter,
	value,
	isLastRow,
	translator,
}: {
	reportType: insightsTypes.ReportType;
	headerId: string | FunnelConversionSummaryTableField;
	measureByFilter: string;
	value: number;
	isLastRow?: boolean;
	translator?: Translator;
}) => {
	const shouldNotDisplayValue =
		reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION &&
		isLastRow &&
		headerId === FunnelConversionSummaryTableField.CONVERSION_TO_NEXT_STAGE;

	if (shouldNotDisplayValue) {
		return '-';
	}

	const valueFormat = getSummaryTableCellFormat({
		reportType,
		headerId,
		measureByFilter,
	});

	if (valueFormat === ValueFormat.DURATION) {
		return getFormattedDuration({
			duration: getDurationInHours(value),
			translator,
			unit: DurationUnit.HOURS,
		});
	}

	return getFormattedValue(value, valueFormat);
};

export const makeRowObject = ({
	reportType,
	primaryFilter,
	measureByFilter,
	headers,
	segment,
	showListView,
	isLastRow,
	isGoalReport = false,
	translator,
}: {
	reportType: insightsTypes.ReportType;
	primaryFilter: string;
	measureByFilter: string;
	headers: HeaderObject[];
	segment: any;
	showListView?: (data: ListViewSegmentDataType) => void;
	isLastRow?: boolean;
	isGoalReport?: boolean;
	translator: Translator;
}) => {
	const ROW_IDENTIFIER = 'rowIdentifier';
	const LIST_VIEW_REPORT_TYPES = [insightsTypes.ReportType.DEALS_STATS];
	const totalOrAverageRow = [TABLE_DATA_TOTAL, TABLE_DATA_AVERAGE].includes(
		segment.id,
	);

	return headers.reduce((acc: any, header: HeaderObject, index: number) => {
		const rowHead = index === 0;
		const value = segment[header.id];

		if (rowHead && totalOrAverageRow) {
			acc[ROW_IDENTIFIER] = segment.id;
		}

		if (rowHead) {
			acc[primaryFilter] = segment.name;

			return acc;
		}

		if (reportType === insightsTypes.ReportType.DEALS_DURATION) {
			acc[header.accessor] = getFormattedCellValueForDuration({
				headerId: header.accessor,
				value,
				translator,
			});

			return acc;
		}

		const formattedCellValue = getFormattedCellValue({
			reportType,
			headerId: header.accessor,
			measureByFilter,
			value,
			isLastRow,
			translator,
		});
		const isAverageColumn = segment.id === TABLE_DATA_AVERAGE;
		const isAverageRow = header.accessor === TABLE_DATA_AVERAGE;
		const isCellContentLinkedToListView =
			LIST_VIEW_REPORT_TYPES.includes(reportType) &&
			showListView &&
			!isGoalReport &&
			!isAverageColumn &&
			!isAverageRow &&
			value !== 0;

		if (isCellContentLinkedToListView) {
			acc[header.accessor] = (
				<SummaryTableCellLink
					formattedCellValue={formattedCellValue}
					header={header}
					segment={segment}
					showListView={showListView}
					totalOrAverageRow={totalOrAverageRow}
					primaryFilter={primaryFilter}
				/>
			);
		} else {
			acc[header.accessor] = formattedCellValue;
		}

		return acc;
	}, {});
};

export const getRowSegments = ({
	segments,
	reportType,
}: {
	segments: any[];
	reportType: insightsTypes.ReportType;
}) => {
	if (reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL) {
		return segments.filter((segment) => segment.id !== TABLE_DATA_TOTAL);
	}

	return segments;
};
