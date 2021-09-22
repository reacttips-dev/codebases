import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes, types } from '@pipedrive/insights-core';

import {
	MapDataReturnType,
	CombinedFilters,
	UniqueSegment,
	LegendItem,
	ChartMetaDataObject,
} from '../../../types/data-layer';
import mapActivitiesChartData from './mapActivitiesChartData';
import { getColor } from '../../../utils/styleUtils';
import { getDurationInHours } from '../../../utils/duration/durationUtils';
import {
	getUniqueSegments,
	getSecondaryFilter,
	getSecondaryFilterLabel,
} from '../dataLayerHelpers';
import getFlattenedData from '../getFlattenedData';

interface ActivitiesQueryResponse {
	list?: object[];
	stats?: {
		data: object[];
		meta: ChartMetaDataObject;
	};
}

const getLegendItems = (uniqueSegments: UniqueSegment[]): LegendItem[] => {
	return uniqueSegments.map((segment, index) => {
		return {
			id: segment.id,
			title: segment.name,
			color: getColor(segment.name, index, true),
		} as LegendItem;
	});
};

const mapActivitiesData = ({
	responseData,
	filters,
	chartType,
	translator,
}: {
	responseData: ActivitiesQueryResponse;
	filters: CombinedFilters;
	chartType: types.ChartType;
	translator: Translator;
}): MapDataReturnType => {
	const chartData = responseData?.stats?.data || [];
	const {
		measureByFilterType,
		primaryFilter,
		primaryFilterLabel,
		secondaryFilter,
		secondaryFilterLabel,
		intervalFilter,
	} = filters;

	const mappedChartData = mapActivitiesChartData({
		items: chartData,
		primaryFilter,
		primaryFilterLabel,
		secondaryFilter: getSecondaryFilter(primaryFilter, secondaryFilter),
		measureByType: measureByFilterType,
		intervalFilter,
		chartType,
	});
	const uniqueSegments = getUniqueSegments({
		items: chartData,
		filter: {
			withLabel: getSecondaryFilterLabel(
				primaryFilterLabel,
				secondaryFilterLabel,
			),
			withOutLabel: getSecondaryFilter(primaryFilter, secondaryFilter),
		},
		intervalFilter,
		measureByFilter: measureByFilterType,
		translator,
		itemValueFormatter: (value: number) => {
			if (measureByFilterType === types.Activities.MeasureByType.SUM) {
				return getDurationInHours(value);
			}

			return value;
		},
	});
	const legendItems = getLegendItems(uniqueSegments);

	const groupedAndSegmentedFlatData = getFlattenedData({
		reportType: insightsTypes.ReportType.ACTIVITIES_LIST,
		chartData,
		primaryFilter,
		primaryFilterLabel,
		secondaryFilter: getSecondaryFilter(primaryFilter, secondaryFilter),
		secondaryFilterLabel: getSecondaryFilterLabel(
			primaryFilterLabel,
			secondaryFilterLabel,
		),
		measureByFilter: filters.measureByFilterType,
		intervalFilter,
		translator,
	});

	return {
		groupedAndSegmentedData: mappedChartData,
		uniqueSegments,
		sourceData: responseData?.list || [],
		groupedAndSegmentedFlatData,
		legendData: legendItems,
		chartSummaryData: undefined,
		chartMetaData: responseData?.stats?.meta,
	};
};

export default mapActivitiesData;
