import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	MapDataReturnType,
	CombinedFilters,
	UniqueSegment,
	LegendItem,
	ChartMetaDataObject,
} from '../../../types/data-layer';
import mapMailsChartData from './mapMailsChartData';
import { getColor } from '../../../utils/styleUtils';
import {
	getUniqueSegments,
	getSecondaryFilter,
	getSecondaryFilterLabel,
	getSegmentName,
	getGroupName,
} from '../dataLayerHelpers';
import getFlattenedData from '../getFlattenedData';
import {
	ENUM_TYPE_FIELDS,
	getEnumFieldLabel,
	MailsEnumField,
} from './mapMailsDataUtils';

interface ActivitiesQueryResponse {
	list?: object[];
	stats?: {
		data: object[];
		meta: object;
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

const mapMailsData = ({
	responseData,
	filters,
	translator,
	chartType,
}: {
	responseData: ActivitiesQueryResponse;
	filters: CombinedFilters;
	translator: Translator;
	chartType: insightsTypes.ChartType;
}): MapDataReturnType => {
	const chartData = responseData?.stats?.data || [];
	const {
		measureByFilterType,
		primaryFilter,
		secondaryFilter,
		secondaryFilterLabel,
		primaryFilterLabel,
		intervalFilter,
	} = filters;

	const mappedChartData = mapMailsChartData({
		items: chartData,
		primaryFilter,
		primaryFilterLabel,
		secondaryFilter: getSecondaryFilter(primaryFilter, secondaryFilter),
		measureByType: measureByFilterType,
		intervalFilter,
		translator,
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
		customSegmentNameGetter: (params) => {
			const { basicSegmentKey, filter } = params;
			const filterKey = filter.withOutLabel;

			if (ENUM_TYPE_FIELDS.includes(filterKey)) {
				return getEnumFieldLabel(
					filterKey,
					basicSegmentKey as MailsEnumField,
					translator,
				);
			}

			return getSegmentName(params);
		},
	});
	const legendItems = getLegendItems(uniqueSegments);

	const groupedAndSegmentedFlatData = getFlattenedData({
		reportType: insightsTypes.ReportType.MAILS_LIST,
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
		customGroupNameGetter: (params) => {
			const { filter, item } = params;

			if (ENUM_TYPE_FIELDS.includes(filter)) {
				return getEnumFieldLabel(
					filter,
					item as MailsEnumField,
					translator,
				);
			}

			return getGroupName(params);
		},
	});

	const chartMetaData = responseData?.stats?.meta as ChartMetaDataObject;

	return {
		groupedAndSegmentedData: mappedChartData,
		uniqueSegments,
		sourceData: responseData?.list || [],
		groupedAndSegmentedFlatData,
		legendData: legendItems,
		chartSummaryData: undefined,
		chartMetaData,
	};
};

export default mapMailsData;
