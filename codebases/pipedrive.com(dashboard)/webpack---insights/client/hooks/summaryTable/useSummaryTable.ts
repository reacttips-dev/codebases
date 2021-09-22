import { useTranslator } from '@pipedrive/react-utils';
import { helpers, types as insightsTypes } from '@pipedrive/insights-core';

import {
	addHeadersBasedOnSegments,
	getHeaderAverageLabel,
	getHeaderTotalLabel,
	getColumnSortType,
	HeaderObject,
} from './summaryTableHeaderUtils';
import {
	isCellRightAligned,
	getRowSegments,
	makeRowObject,
} from './summaryTableRowUtils';
import getRevenueForecastHeaders from './getRevenueForecastHeaders';
import getProgressHeaders from './getProgressHeaders';
import { getSummaryTableCellFormat } from '../../utils/valueFormatter';
import { summaryColumnTypes } from '../../utils/constants';
import { MapDataReturnType } from '../../types/data-layer';

const REPORT_DATA_TYPES_WITH_NO_MONETARY_MEASURE_BY = [
	insightsTypes.DataType.ACTIVITIES,
	insightsTypes.DataType.MAILS,
];
const MEASURE_BY_FIELDS_WITHOUT_AVERAGE_COLUMN = [
	insightsTypes.Deals.MeasureByType.PRODUCTS_AMOUNT,
];

const useSummaryTable = ({
	reportType,
	reportData,
	primaryFilter,
	measureByFilter,
	secondaryFilter,
	primaryFilterName,
	fields,
	reportDataType,
	showListView,
}: {
	reportType: insightsTypes.ReportType;
	reportData: MapDataReturnType;
	primaryFilter: string;
	measureByFilter: string;
	secondaryFilter?: string;
	primaryFilterName: string;
	fields: any[];
	reportDataType: insightsTypes.DataType;
	showListView?: (data: object) => void;
}) => {
	const translator = useTranslator();
	const isMonetary = helpers.deals.isMeasureByMonetary(measureByFilter);
	const isMeasureByFilterCustomField =
		helpers.deals.isCustomField(measureByFilter);

	const measureByFilterType = helpers.getMeasureByStatsFieldKey(
		reportDataType,
		measureByFilter,
	);
	const hasSelectedSecondaryFilter =
		secondaryFilter && secondaryFilter !== primaryFilter;
	const reportHasAverageAndTotalColumns = !(
		REPORT_DATA_TYPES_WITH_NO_MONETARY_MEASURE_BY.includes(
			reportDataType,
		) ||
		MEASURE_BY_FIELDS_WITHOUT_AVERAGE_COLUMN.includes(
			measureByFilter as insightsTypes.Deals.MeasureByType,
		)
	);

	const getHeaders = () => {
		const headers = [
			{
				Header: primaryFilterName || '',
				accessor: primaryFilter,
				id: primaryFilter,
				sortType: 'alphanumeric',
			},
		] as HeaderObject[];

		if (hasSelectedSecondaryFilter) {
			addHeadersBasedOnSegments({
				reportData,
				headers,
				reportType,
				translator,
				measureByFilter,
			});
		}

		if (reportHasAverageAndTotalColumns) {
			const headerId = summaryColumnTypes.AVG;
			const valueFormat = getSummaryTableCellFormat({
				reportType,
				headerId,
				measureByFilter,
			});

			headers.push({
				Header: getHeaderAverageLabel({
					fields,
					measureByFilter,
					isMeasureByFilterCustomField,
					translator,
				}),
				accessor: headerId,
				id: headerId,
				sortType: getColumnSortType(valueFormat),
			});
		}

		if (
			[summaryColumnTypes.SUM, summaryColumnTypes.COUNT].includes(
				measureByFilter,
			)
		) {
			if (reportHasAverageAndTotalColumns) {
				const headerId = summaryColumnTypes.SUM;
				const valueFormat = getSummaryTableCellFormat({
					reportType,
					headerId,
					measureByFilter,
				});

				headers.push({
					Header: getHeaderTotalLabel({
						fields,
						measureByFilter: summaryColumnTypes.SUM,
						isMeasureByFilterCustomField,
						isMonetary: true,
						translator,
						reportDataType,
					}),
					accessor: headerId,
					id: headerId,
					sortType: getColumnSortType(valueFormat),
				});
			}

			const headerId = summaryColumnTypes.COUNT;
			const valueFormat = getSummaryTableCellFormat({
				reportType,
				headerId,
				measureByFilter,
			});

			headers.push({
				Header: getHeaderTotalLabel({
					fields,
					measureByFilter: summaryColumnTypes.COUNT,
					isMeasureByFilterCustomField,
					isMonetary: false,
					translator,
					reportDataType,
				}),
				accessor: headerId,
				id: headerId,
				sortType: getColumnSortType(valueFormat),
			});
		} else {
			const headerId = measureByFilterType;
			const valueFormat = getSummaryTableCellFormat({
				reportType,
				headerId,
				measureByFilter,
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
				accessor: headerId,
				id: headerId,
				sortType: getColumnSortType(valueFormat),
			});
		}

		return headers;
	};

	const headersForRows = (() => {
		if (reportType === insightsTypes.ReportType.DEALS_PROGRESS) {
			return getProgressHeaders({
				reportData,
				primaryFilter,
				hasSelectedSecondaryFilter,
				primaryFilterName,
				measureByFilter,
				translator,
			});
		}

		if (reportType === insightsTypes.ReportType.DEALS_REVENUE_FORECAST) {
			return getRevenueForecastHeaders({
				reportData,
				primaryFilter,
				measureByFilter,
				fields,
				reportDataType,
				isMeasureByFilterCustomField,
				isMonetary,
				measureByFilterType,
				translator,
			});
		}

		return getHeaders();
	})();

	const getRowsData = () => {
		const rows = [] as any[];
		const segments = reportData.groupedAndSegmentedFlatData;
		const rowSegments = getRowSegments({
			segments,
			reportType,
		});

		rowSegments.forEach((segment) => {
			rows.push(
				makeRowObject({
					reportType,
					primaryFilter,
					measureByFilter,
					headers: headersForRows,
					segment,
					translator,
					showListView,
				}),
			);
		});

		return rows;
	};

	const sortBy = [] as any[];

	return {
		sortBy,
		getHeaders: () => headersForRows,
		getRowsData: () => getRowsData(),
		isCellRightAligned: (key: string) =>
			isCellRightAligned(key, primaryFilter),
	};
};

export default useSummaryTable;
