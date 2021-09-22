import { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { get as getWebappApi } from '../../api/webapp';
import { InsightsApiClient } from '../../api/apollo/insightsApiClient';
import {
	CHART_FIRST_PAGE_INDEX,
	PAGINATION_SIZE,
	FLAT_RESPONSE_DATA_TYPES,
} from '../../utils/constants';
import { getQueryListPath } from '../../utils/responseUtils';
import { getChartData } from '../dataLayer/deals/mapDealsData';
import getReportQuery from '../../utils/queries/getReportQuery';
import { UniqueSegment } from '../../types/data-layer';
import {
	composeListViewFilterByFilter,
	getListViewTitle,
	getAdditionalFilterTypeFromGroup,
	getAdditionalFilterTypeFromSegment,
	needsFilterFromSegmentBy,
} from '../../utils/listViewUtils';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import { ListViewSegmentDataType } from '../../types/list-view';
import { getInsightsApiFetchPolicy } from '../../api/apollo/utils';
import { QuickFilters } from '../../types/apollo-query-types';

interface ListViewHookProps {
	report: any;
	cachedSourceDataTable: any;
	listSegmentData: ListViewSegmentDataType;
	uniqueSegments: UniqueSegment[];
	groupByFilter: string;
	filterByFilter: insightsTypes.Filter[];
	segmentByFilter: string | undefined;
	intervalFilter: insightsTypes.Interval | boolean;
	chartType: insightsTypes.ChartType;
	measureByFilter: string;
	dataType: insightsTypes.DataType;
	groupedAndSegmentedData: any;
	quickFilters?: QuickFilters;
}

interface ListViewStats {
	sum?: number;
	count?: number;
}

function useListView({
	report,
	cachedSourceDataTable,
	listSegmentData,
	uniqueSegments,
	groupByFilter,
	filterByFilter,
	segmentByFilter,
	intervalFilter,
	chartType,
	measureByFilter,
	dataType,
	groupedAndSegmentedData,
	quickFilters,
}: ListViewHookProps) {
	const WebappApi = getWebappApi();
	const translator = useTranslator();

	const { id: reportId, data_type: reportDataType } = report;
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const { is_cumulative: isCumulative } = report.unsavedReport.parameters;
	const isPieChart = chartType === insightsTypes.ChartType.PIE;
	const defaultCurrency = WebappApi.userSelf.settings.default_currency;
	const timeZone = WebappApi.userSelf.timezone_name?.replace(/\s/g, '_');

	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [listViewData, setListViewData] = useState(null);

	const listViewFilterByFilter = composeListViewFilterByFilter({
		reportType,
		listSegmentData,
		intervalFilter,
		isPieChart,
		groupByFilter,
		segmentByFilter,
		uniqueSegments,
		filterByFilter,
		groupedAndSegmentedData,
		isCumulative,
		quickFilters,
	});

	const listViewTitle = getListViewTitle(
		listSegmentData.listName,
		dataType,
		translator,
	);

	const getStats = (response: any): ListViewStats => {
		const filtersArray = listViewFilterByFilter.map(
			(filter: any) => filter.filter,
		);

		const { data: chartData } = FLAT_RESPONSE_DATA_TYPES.includes(dataType)
			? response.stats
			: getChartData({
					responseData: response,
					dataType: reportDataType,
					reportType,
					chartType,
					filterTypes: filtersArray,
			  });

		if (!chartData) {
			return {};
		}

		return chartData.reduce(
			(
				segmentsTotalStats: ListViewStats,
				currentSegment: ListViewStats,
			) => {
				return {
					sum: segmentsTotalStats.sum + currentSegment.sum,
					count: segmentsTotalStats.count + currentSegment.count,
				};
			},
			{ count: 0, sum: 0 },
		);
	};

	const listViewColumns = cachedSourceDataTable?.columns?.filter(
		(key: string) => key !== 'name',
	);

	useEffect(() => {
		const fetchListData = async () => {
			try {
				const requestFields = async (
					from: number,
					size: number,
					columns: string[],
				) => {
					// additionally to quering the list, we also make a query for chart data
					// because of table title (to get the number and sum in case of deals inside the table)
					// groupBy and segmentBy should not be sent to query builder:
					// - groupBy value is used instead as filter (see composeListViewFilterByFilter)
					// - no segmentation is needed (we query only one bucket which count and sum are exactly what's needed)
					const query = getReportQuery(dataType, {
						reportType,
						chartType: insightsTypes.ChartType.TABLE,
						shouldQueryList: true,
						shouldQueryChartData: true,
						filterByFilter: listViewFilterByFilter,
						reportColumns: columns,
						defaultCurrency,
						isWeightedValue:
							measureByFilter ===
							insightsTypes.Deals.MeasureByType.WEIGHTED_VALUE,
						statsFields: { sum: true, count: true },
						timeZone,
					});

					return InsightsApiClient.query({
						query,
						variables: {
							from,
							size,
							...(dataType === insightsTypes.DataType.DEALS
								? {
										lastPage: CHART_FIRST_PAGE_INDEX,
								  }
								: {
										chartDataFrom: CHART_FIRST_PAGE_INDEX,
								  }),
							chartDataSize: 1,
							segmentSize: 1,
							sortOrder: 'desc',
							// there will be only one bucket's information retrieved, so sortBy here doesn't need to match measureBy
							sortBy: 'count',
						},
						context: {
							headers: { 'insights-report-id': reportId },
						},
						fetchPolicy: getInsightsApiFetchPolicy(),
					});
				};

				const requestedFields = await requestFields(
					0,
					PAGINATION_SIZE,
					listViewColumns,
				);

				const fieldsData = requestedFields.data;

				setListViewData({
					...fieldsData,
					stats: getStats(fieldsData[reportDataType]),
				});
			} catch (error) {
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchListData();
	}, []);

	const getFiltersForPath = () => {
		if (quickFilters) {
			return listViewFilterByFilter;
		}

		const extraFilterFromGroup =
			(listSegmentData.groupId || listSegmentData.segmentId) &&
			getAdditionalFilterTypeFromGroup({
				isPieChart,
				reportType,
				groupByFilter,
				segmentByFilter,
			});
		const extraFilterFromSegment =
			needsFilterFromSegmentBy(
				listSegmentData.segmentId,
				segmentByFilter,
				isPieChart,
			) &&
			getAdditionalFilterTypeFromSegment({
				isPieChart,
				segmentByFilter,
			});
		const filtersWithoutDuplicates = filter(
			filterByFilter,
			(filter: any) =>
				filter.filter !== extraFilterFromGroup &&
				filter.filter !== extraFilterFromSegment,
		);

		return [
			...filtersWithoutDuplicates,
			...(extraFilterFromGroup ? [{ filter: extraFilterFromGroup }] : []),
			...(extraFilterFromSegment
				? [{ filter: extraFilterFromSegment }]
				: []),
		];
	};

	const queryListPath = getQueryListPath({
		filterByFilter: getFiltersForPath(),
		dataType,
		reportType,
	});

	return {
		isLoading,
		isError,
		reportId,
		reportDataType,
		listViewTitle,
		listViewData,
		listViewFilterByFilter,
		queryListPath,
	};
}

export default useListView;
