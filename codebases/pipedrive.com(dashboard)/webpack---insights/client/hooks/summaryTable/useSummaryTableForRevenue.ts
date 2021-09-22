import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';

import {
	getHeaderTotalLabel,
	getSegmentHeader,
	getColumnSortType,
	HeaderObject,
} from './summaryTableHeaderUtils';
import {
	isCellRightAligned,
	getRowSegments,
	makeRowObject,
} from './summaryTableRowUtils';
import { getSummaryTableCellFormat } from '../../utils/valueFormatter';
import { MapDataReturnType } from '../../types/data-layer';

const useSummaryTableForRevenue = ({
	reportType,
	reportData,
	primaryFilter,
	measureByFilter,
	primaryFilterName,
	fields,
	reportDataType,
}: {
	reportType: insightsTypes.ReportType;
	reportData: MapDataReturnType;
	primaryFilter: string;
	measureByFilter: string;
	primaryFilterName: string;
	fields: any[];
	reportDataType: insightsTypes.DataType;
}) => {
	const translator = useTranslator();
	const isMonetary = helpers.deals.isMeasureByMonetary(measureByFilter);
	const isMeasureByFilterCustomField =
		helpers.deals.isCustomField(measureByFilter);
	const measureByFilterType =
		helpers.deals.getMeasureByFilterType(measureByFilter);

	const getRevenueGrowthSegmentHeaders = (segment: any) => {
		const segments: any = {
			new: translator.gettext('New'),
			expansion: translator.gettext('Expansion'),
			contraction: translator.gettext('Contraction'),
			recurring: translator.gettext('Recurring'),
			churn: translator.gettext('Churn'),
		};

		return segments[segment.name];
	};

	const getRevenueSegmentHeaders = (segment: any) => {
		const segments: any = {
			recurring: translator.gettext('Recurring'),
			additional: translator.gettext('One-time'),
			installment: translator.gettext('Payment schedule'),
		};

		return segments[segment.name];
	};

	const getSegmentHeaders = (
		reportType: insightsTypes.ReportType,
		segment: any,
	) => {
		if (
			reportType ===
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT
		) {
			return getRevenueGrowthSegmentHeaders(segment);
		}

		if (reportType === insightsTypes.ReportType.DEALS_RECURRING_REVENUE) {
			return getRevenueSegmentHeaders(segment);
		}

		return getSegmentHeader(reportType, segment, translator);
	};

	const headers = (() => {
		const headersArray = [
			{
				Header: primaryFilterName || '',
				accessor: primaryFilter,
				id: primaryFilter,
				sortType: 'alphanumeric',
			},
		] as HeaderObject[];

		if (
			reportType ===
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT
		) {
			reportData.uniqueSegments.forEach((segment: any) => {
				const headerId = segment.id;
				const valueFormat = getSummaryTableCellFormat({
					reportType,
					headerId,
					measureByFilter,
				});

				headersArray.push({
					Header: getSegmentHeaders(reportType, segment),
					accessor: headerId?.toString(),
					id: headerId,
					sortType: getColumnSortType(valueFormat),
				});
			});
		}

		const headerId = measureByFilterType;
		const valueFormat = getSummaryTableCellFormat({
			reportType,
			headerId,
			measureByFilter,
		});

		headersArray.push({
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

		return headersArray;
	})();

	const getRowsData = () => {
		const rows: any[] = [];
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
					headers,
					segment,
					translator,
				}),
			);
		});

		return rows;
	};

	return {
		sortBy: [] as any[],
		getHeaders: () => headers,
		getRowsData: () => getRowsData(),
		isCellRightAligned: (key: string) =>
			isCellRightAligned(key, primaryFilter),
	};
};

export default useSummaryTableForRevenue;
