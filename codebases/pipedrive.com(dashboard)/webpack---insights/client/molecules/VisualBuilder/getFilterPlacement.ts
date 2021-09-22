import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	FilterPlacementStyles,
	FilterPopoverPlacements,
} from '../../utils/constants';

const { HORIZONTAL, VERTICAL, HIDDEN } = FilterPlacementStyles;
const { BOTTOM_END, BOTTOM_START, RIGHT_START } = FilterPopoverPlacements;

const getMeasureByFilterPlacement = (
	reportType: insightsTypes.ReportType,
	chartType: insightsTypes.ChartType,
) => {
	const defaultMeasureByPlacement = VERTICAL;

	const nonConventionalMeasureByPlacement: any = {
		[insightsTypes.ChartType.BAR]: {
			[insightsTypes.ReportType.DEALS_STATS]: HORIZONTAL,
			[insightsTypes.ReportType.ACTIVITIES_STATS]: HORIZONTAL,
			[insightsTypes.ReportType.MAILS_STATS]: HORIZONTAL,
			[insightsTypes.ReportType.DEALS_DURATION]: HIDDEN,
			[insightsTypes.ReportType.DEALS_PROGRESS]: HORIZONTAL,
		},
		[insightsTypes.ChartType.COLUMN]: {
			[insightsTypes.ReportType.DEALS_DURATION]: HIDDEN,
			[insightsTypes.ReportType.MAILS_STATS]: HIDDEN,
		},
		[insightsTypes.ChartType.PIE]: {
			[insightsTypes.ReportType.DEALS_STATS]: HORIZONTAL,
			[insightsTypes.ReportType.ACTIVITIES_STATS]: HORIZONTAL,
		},
		[insightsTypes.ChartType.SCORECARD]: {
			[insightsTypes.ReportType.DEALS_STATS]: HORIZONTAL,
			[insightsTypes.ReportType.DEALS_CONVERSION_OVERALL]: HORIZONTAL,
			[insightsTypes.ReportType.DEALS_DURATION]: HORIZONTAL,
			[insightsTypes.ReportType.ACTIVITIES_STATS]: HORIZONTAL,
			[insightsTypes.ReportType.DEALS_REVENUE_FORECAST]: HORIZONTAL,
			[insightsTypes.ReportType.DEALS_RECURRING_REVENUE]: HORIZONTAL,
			[insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT]:
				HORIZONTAL,
			[insightsTypes.ReportType.MAILS_STATS]: HORIZONTAL,
		},
	};

	const reportSpecificPlacement =
		nonConventionalMeasureByPlacement[chartType] &&
		nonConventionalMeasureByPlacement[chartType][reportType];

	return reportSpecificPlacement || defaultMeasureByPlacement;
};

const getGroupingFilterPlacement = (
	reportType: insightsTypes.ReportType,
	chartType: insightsTypes.ChartType,
) => {
	const defaultGroupByPlacement = HORIZONTAL;

	const nonConventionalGroupByPlacement: any = {
		[insightsTypes.ChartType.BAR]: {
			[insightsTypes.ReportType.DEALS_STATS]: VERTICAL,
			[insightsTypes.ReportType.DEALS_DURATION]: VERTICAL,
			[insightsTypes.ReportType.DEALS_PROGRESS]: VERTICAL,
			[insightsTypes.ReportType.ACTIVITIES_STATS]: VERTICAL,
			[insightsTypes.ReportType.MAILS_STATS]: VERTICAL,
		},
		[insightsTypes.ChartType.PIE]: {
			[insightsTypes.ReportType.DEALS_STATS]: HIDDEN,
			[insightsTypes.ReportType.ACTIVITIES_STATS]: HIDDEN,
		},
		[insightsTypes.ChartType.SCORECARD]: {
			[insightsTypes.ReportType.DEALS_STATS]: HIDDEN,
			[insightsTypes.ReportType.DEALS_CONVERSION_OVERALL]: HIDDEN,
			[insightsTypes.ReportType.DEALS_DURATION]: HIDDEN,
			[insightsTypes.ReportType.ACTIVITIES_STATS]: HIDDEN,
			[insightsTypes.ReportType.DEALS_REVENUE_FORECAST]: HIDDEN,
			[insightsTypes.ReportType.DEALS_RECURRING_REVENUE]: HIDDEN,
			[insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT]: HIDDEN,
			[insightsTypes.ReportType.MAILS_STATS]: HIDDEN,
		},
	};

	const reportSpecificPlacement =
		nonConventionalGroupByPlacement[chartType] &&
		nonConventionalGroupByPlacement[chartType][reportType];

	return reportSpecificPlacement || defaultGroupByPlacement;
};

export default (
	reportType: insightsTypes.ReportType,
	chartType: insightsTypes.ChartType,
) => {
	const getFilterStyle = (isMeasureBy: boolean) => {
		if (isMeasureBy) {
			return getMeasureByFilterPlacement(reportType, chartType);
		}

		return getGroupingFilterPlacement(reportType, chartType);
	};

	const getPopoverPlacement = (isMeasureBy: boolean) => {
		switch (chartType) {
			case insightsTypes.ChartType.COLUMN:
				return isMeasureBy ? RIGHT_START : BOTTOM_END;
			case insightsTypes.ChartType.FUNNEL:
				return isMeasureBy ? RIGHT_START : BOTTOM_START;
			case insightsTypes.ChartType.BAR:
			case insightsTypes.ChartType.PIE:
				return isMeasureBy ? BOTTOM_END : RIGHT_START;
			case insightsTypes.ChartType.STACKED_BAR_CHART:
				return isMeasureBy ? RIGHT_START : BOTTOM_END;
			default:
				return BOTTOM_END;
		}
	};

	return {
		measureByFilterStyle: getFilterStyle(true),
		groupByFilterStyle: getFilterStyle(false),
		multiSelectFilterStyle: getFilterStyle(false),
		isCumulativeFilterStyle: getFilterStyle(false),
		measureByPopoverPlacement: getPopoverPlacement(true),
		groupByPopoverPlacement: getPopoverPlacement(false),
		multiSelectPopoverPlacement: getPopoverPlacement(false),
		isCumulativePopoverPlacement: getPopoverPlacement(false),
	};
};
