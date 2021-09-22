import { types as insightsTypes } from '@pipedrive/insights-core';

import { getGoalErrorType } from '../../../molecules/Chart/chartUtils';
import { QuickFilters } from '../../../types/apollo-query-types';
import {
	ChartMetaDataObject,
	MapDataReturnType,
} from '../../../types/data-layer';
import { Goal } from '../../../types/goals';
import { applyQuickFiltersToReportFilters } from '../../../utils/quickFilterUtils';
import { hasPagination } from '../../../utils/reportsUtils';

interface ShouldShowPaginationProps {
	chartMetaData: ChartMetaDataObject;
	chartType: insightsTypes.ChartType;
	pageNumber: number;
	quickFilters: QuickFilters;
	goal: Goal;
	isGoalsReport: boolean;
}

interface GetIsWidgetLegendVisibleProps {
	hasSegment: boolean;
	reportData: MapDataReturnType;
	isChartTypeScorecard: boolean;
	isChartTypeTable: boolean;
}

interface ShouldNotNavigateProps {
	hasNoData: boolean;
	isChartTypeTable: boolean;
	contentAreaNode: React.RefObject<HTMLDivElement>;
	filtersListSummaryNode: React.RefObject<HTMLDivElement>;
	event: React.MouseEvent | React.KeyboardEvent;
	isWidgetClickable: boolean;
}

const chartTypesWithoutPagination = [
	insightsTypes.ChartType.SCORECARD,
	insightsTypes.ChartType.PIE,
];

export const shouldShowPagination = ({
	chartMetaData,
	chartType,
	pageNumber,
	quickFilters,
	goal,
	isGoalsReport,
}: ShouldShowPaginationProps) => {
	if (chartTypesWithoutPagination.includes(chartType)) {
		return false;
	}

	const goalError =
		isGoalsReport &&
		getGoalErrorType({
			quickFilters,
			goal,
		});

	if (goalError) {
		return false;
	}

	return hasPagination(chartMetaData?.hasNextPage, pageNumber);
};

export const getWidgetTitle = (goal: Goal, reportName: string) =>
	goal?.name ?? reportName;

export const getAppliedFiltersForReport = (
	reportFilters: any,
	quickFilters: {
		user: any;
		period: any;
	},
) => {
	if (quickFilters) {
		const { period: dateQuickFilter, user: userQuickFilter } = quickFilters;

		if (dateQuickFilter || userQuickFilter) {
			return applyQuickFiltersToReportFilters(
				reportFilters,
				quickFilters,
				true,
			);
		}
	}

	return reportFilters;
};

const closeCoachmarkWithoutNavigation = (event: any) =>
	event?.target?.className?.baseVal?.includes('closeCoachmark');

export const getIsWidgetLegendVisible = ({
	hasSegment,
	reportData,
	isChartTypeScorecard,
	isChartTypeTable,
}: GetIsWidgetLegendVisibleProps) =>
	hasSegment &&
	reportData?.legendData &&
	!(isChartTypeScorecard || isChartTypeTable);

export const shouldNotNavigate = ({
	hasNoData,
	isChartTypeTable,
	contentAreaNode,
	filtersListSummaryNode,
	event,
	isWidgetClickable,
}: ShouldNotNavigateProps) => {
	if (!isWidgetClickable) {
		return true;
	}

	if (closeCoachmarkWithoutNavigation(event)) {
		return true;
	}

	const isCurrentWidgetSummaryTrigger =
		filtersListSummaryNode?.current?.contains(event.target as Node);

	if (isCurrentWidgetSummaryTrigger) {
		return true;
	}

	const isClickOnTableArea =
		isChartTypeTable &&
		contentAreaNode?.current?.contains(event.target as Node);

	return isClickOnTableArea && !hasNoData;
};
