import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { ReportParentType, ReportEntity, ReportEntityType } from './constants';

interface ReportDefaultTypeLabels {
	title: string;
	subtitle: string;
	info?: string;
}

interface ReportTypeLabels {
	newTitle: string;
	subtypeLabel?: string;
}

export const getReportParentTypeLabels = (
	reportType: ReportParentType,
	translator: Translator,
): ReportDefaultTypeLabels => {
	switch (reportType) {
		case ReportParentType.CONVERSION:
			return {
				title: translator.gettext('Conversion'),
				subtitle: translator.gettext('What is your win or loss rate?'),
				info: translator.gettext(
					'Deals converting to won or lost. “Funnel” shows conversion between stages. ' +
						'“Win/loss” shows win and loss rates for various groups (such as owner, organization, time periods, etc).',
				),
			};
		case ReportParentType.RECURRING_REVENUE:
			return {
				title: translator.gettext('Subscription revenue'),
				subtitle: translator.gettext(
					'What is your subscription revenue?',
				),
			};
		case ReportParentType.RECURRING_REVENUE_MOVEMENT:
			return {
				title: translator.gettext('Recurring revenue growth'),
				subtitle: translator.gettext(
					'How did your recurring revenue change?',
				),
			};
		case ReportParentType.REVENUE_FORECAST:
			return {
				title: translator.gettext('Revenue forecast'),
				subtitle: translator.gettext(
					'How much revenue can you expect?',
				),
				info: translator.gettext(
					'Expected revenue based on the total value of open and won deals, and the time they are expected to be won or were won. ' +
						'You can choose between regular or cumulative forecast (below the chart).',
				),
			};
		case ReportParentType.ACTIVITY:
			return {
				title: translator.gettext('Activities performance'),
				subtitle: translator.gettext(
					'How many activities were added, completed or planned?',
				),
			};
		case ReportParentType.EMAIL:
			return {
				title: translator.gettext('Emails performance'),
				subtitle: translator.gettext(
					'How many emails were sent, received or opened?',
				),
			};
		case ReportParentType.DURATION:
			return {
				title: translator.gettext('Duration'),
				subtitle: translator.gettext('How long is your sales cycle?'),
				info: translator.gettext(
					'Average duration of sales cycle by various groups (such as owner, organization, etc). ' +
						'Group by “Stage entered” to see average time a deal remains in each stage.',
				),
			};
		case ReportParentType.PROGRESS:
			return {
				title: translator.gettext('Progress'),
				subtitle: translator.gettext(
					'Are your deals moving forward in pipeline?',
				),
				info: translator.gettext(
					'Deal advancement through stages. Counts each stage a deal has entered within a time period. ' +
						'E.g., if a deal moves from stage 1 to stage 4, the report  includes it in stages 2, 3 and 4.',
				),
			};
		case ReportParentType.STATS:
		default:
			return {
				title: translator.gettext('Performance'),
				subtitle: translator.gettext(
					'How much did you start, win, or lose?',
				),
				info: translator.gettext(
					'Performance of deals. You can filter, group and segment deal data (both by default and custom fields) and visualize results in various ways. ' +
						'Group by a date field to see results over time.',
				),
			};
	}
};

export const getReportTypeLabels = (
	reportType: insightsTypes.ReportType,
	translator: Translator,
): ReportTypeLabels => {
	switch (reportType) {
		case insightsTypes.ReportType.DEALS_CONVERSION_OVERALL:
			return {
				newTitle: translator.gettext('New overall conversion report'),
				subtypeLabel: translator.gettext('Win/loss'),
			};
		case insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION:
			return {
				newTitle: translator.gettext('New funnel conversion report'),
				subtypeLabel: translator.gettext('Funnel'),
			};
		case insightsTypes.ReportType.DEALS_PROGRESS:
			return {
				newTitle: translator.gettext('New deal progress report'),
			};
		case insightsTypes.ReportType.DEALS_DURATION:
			return {
				newTitle: translator.gettext('New deal duration report'),
			};

		case insightsTypes.ReportType.DEALS_RECURRING_REVENUE:
			return {
				newTitle: translator.gettext('New subscription revenue report'),
			};
		case insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT:
			return {
				newTitle: translator.gettext(
					'New recurring revenue growth report',
				),
			};
		case insightsTypes.ReportType.DEALS_REVENUE_FORECAST:
			return {
				newTitle: translator.gettext('New revenue forecast report'),
			};
		case insightsTypes.ReportType.DEALS_STATS:
			return {
				newTitle: translator.gettext('New deal performance report'),
			};
		case insightsTypes.ReportType.ACTIVITIES_STATS:
			return {
				newTitle: translator.gettext('New activity report'),
			};
		case insightsTypes.ReportType.MAILS_STATS:
			return {
				newTitle: translator.gettext('New emails report'),
			};
		default:
			return {
				newTitle: translator.gettext('New report'),
			};
	}
};

export const getCurrentReportParentType = (
	currentReportType: insightsTypes.ReportType,
): ReportParentType => {
	switch (currentReportType) {
		case insightsTypes.ReportType.DEALS_STATS:
			return ReportParentType.STATS;
		case insightsTypes.ReportType.DEALS_CONVERSION_OVERALL:
		case insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION:
			return ReportParentType.CONVERSION;
		case insightsTypes.ReportType.DEALS_RECURRING_REVENUE:
			return ReportParentType.RECURRING_REVENUE;
		case insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT:
			return ReportParentType.RECURRING_REVENUE_MOVEMENT;
		case insightsTypes.ReportType.DEALS_REVENUE_FORECAST:
			return ReportParentType.REVENUE_FORECAST;
		case insightsTypes.ReportType.DEALS_PROGRESS:
			return ReportParentType.PROGRESS;
		case insightsTypes.ReportType.DEALS_DURATION:
			return ReportParentType.DURATION;
		case insightsTypes.ReportType.ACTIVITIES_STATS:
			return ReportParentType.ACTIVITY;
		case insightsTypes.ReportType.MAILS_STATS:
			return ReportParentType.EMAIL;
		default:
			return null;
	}
};

export const isTheSameParentType = (
	defaultType: insightsTypes.ReportType,
	currentReportType: insightsTypes.ReportType,
): boolean => {
	const defaultTypeParentReportType = getCurrentReportParentType(defaultType);
	const currentReportTypeParentReportType =
		getCurrentReportParentType(currentReportType);

	return defaultTypeParentReportType === currentReportTypeParentReportType;
};

export const getEntityReportTypes = (translator: Translator) => {
	const dealEntities = {
		[ReportEntityType.DEAL]: {
			type: ReportEntityType.DEAL,
			name: translator.gettext('Deal'),
			icon: 'deal',
			reportTypes: [
				ReportParentType.STATS,
				ReportParentType.CONVERSION,
				ReportParentType.DURATION,
				ReportParentType.PROGRESS,
			],
		},
	};
	const activityEntities = {
		[ReportEntityType.ACTIVITY]: {
			type: ReportEntityType.ACTIVITY,
			name: translator.gettext('Activity'),
			icon: 'calendar',
			reportTypes: [ReportParentType.ACTIVITY, ReportParentType.EMAIL],
		},
	};
	const recurringRevenueEntities = {
		[ReportEntityType.REVENUE]: {
			type: ReportEntityType.REVENUE,
			name: translator.gettext('Forecast and subscription'),
			icon: 'forecast',
			reportTypes: [
				ReportParentType.REVENUE_FORECAST,
				ReportParentType.RECURRING_REVENUE,
				ReportParentType.RECURRING_REVENUE_MOVEMENT,
			],
		},
	};

	return {
		...activityEntities,
		...dealEntities,
		...recurringRevenueEntities,
	} as { [key in ReportEntity['type']]: ReportEntity };
};

export const getReportTypesUnderSameEntity = (
	currentReportParentType: ReportParentType,
	translator: Translator,
) => {
	const reportEntities = getEntityReportTypes(translator);
	const currentEntity = Object.values(reportEntities).find((entity) =>
		entity.reportTypes.includes(currentReportParentType),
	);

	return currentEntity.reportTypes;
};

export const getAvailableReportChartTypes = ({
	translator,
	reportType,
	isGoalsReport,
}: {
	translator: Translator;
	reportType: insightsTypes.ReportType;
	isGoalsReport?: boolean;
}): {
	name: insightsTypes.ChartType;
	icon: string;
	label: string;
	availableInReportTypes: insightsTypes.ReportType[];
	disabledInReportTypes?: insightsTypes.ReportType[];
}[] => {
	enum ChartIcon {
		BAR_Y = 'chart-bar-y',
		BAR_X = 'chart-bar-x',
		PIE = 'chart-pie',
		TABLE = 'chart-table',
		SCORECARD = 'chart-scorecard',
	}
	const COLUMN_CHART_LABEL = translator.gettext('Column chart');
	const BAR_CHART_LABEL = translator.gettext('Bar chart');
	const PIE_CHART_LABEL = translator.gettext('Pie chart');
	const SCORECARD_CHART_LABEL = translator.gettext('Scorecard');
	const TABLE_CHART_LABEL = translator.gettext('Table');

	const CHART_TYPES = [
		{
			name: insightsTypes.ChartType.COLUMN,
			icon: ChartIcon.BAR_Y,
			label: COLUMN_CHART_LABEL,
			isAvailableForGoals: true,
			availableInReportTypes: [
				insightsTypes.ReportType.DEALS_STATS,
				insightsTypes.ReportType.DEALS_DURATION,
				insightsTypes.ReportType.DEALS_PROGRESS,
				insightsTypes.ReportType.ACTIVITIES_STATS,
				insightsTypes.ReportType.MAILS_STATS,
				insightsTypes.ReportType.DEALS_REVENUE_FORECAST,
			],
		},
		{
			name: insightsTypes.ChartType.BAR,
			icon: ChartIcon.BAR_X,
			label: BAR_CHART_LABEL,
			isAvailableForGoals: false,
			availableInReportTypes: [
				insightsTypes.ReportType.DEALS_STATS,
				insightsTypes.ReportType.DEALS_DURATION,
				insightsTypes.ReportType.DEALS_PROGRESS,
				insightsTypes.ReportType.ACTIVITIES_STATS,
				insightsTypes.ReportType.MAILS_STATS,
			],
		},
		{
			name: insightsTypes.ChartType.PIE,
			icon: ChartIcon.PIE,
			label: PIE_CHART_LABEL,
			isAvailableForGoals: false,
			availableInReportTypes: [
				insightsTypes.ReportType.DEALS_STATS,
				insightsTypes.ReportType.ACTIVITIES_STATS,
			],
		},
		{
			name: insightsTypes.ChartType.STACKED_BAR_CHART,
			icon: ChartIcon.BAR_Y,
			label: COLUMN_CHART_LABEL,
			isAvailableForGoals: false,
			availableInReportTypes: [
				insightsTypes.ReportType.DEALS_CONVERSION_OVERALL,
				insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
				insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
			],
		},
		{
			name: insightsTypes.ChartType.FUNNEL,
			icon: ChartIcon.BAR_Y,
			label: COLUMN_CHART_LABEL,
			isAvailableForGoals: false,
			availableInReportTypes: [
				insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
			],
			disabledInReportTypes: [
				insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
			],
		},
		{
			name: insightsTypes.ChartType.SCORECARD,
			icon: ChartIcon.SCORECARD,
			label: SCORECARD_CHART_LABEL,
			isAvailableForGoals: false,
			availableInReportTypes: [
				insightsTypes.ReportType.DEALS_STATS,
				insightsTypes.ReportType.DEALS_CONVERSION_OVERALL,
				insightsTypes.ReportType.DEALS_DURATION,
				insightsTypes.ReportType.ACTIVITIES_STATS,
				insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
				insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
				insightsTypes.ReportType.MAILS_STATS,
				insightsTypes.ReportType.DEALS_REVENUE_FORECAST,
			],
		},
		{
			name: insightsTypes.ChartType.TABLE,
			icon: ChartIcon.TABLE,
			label: TABLE_CHART_LABEL,
			isAvailableForGoals: false,
			availableInReportTypes: [
				insightsTypes.ReportType.DEALS_STATS,
				insightsTypes.ReportType.ACTIVITIES_STATS,
				insightsTypes.ReportType.MAILS_STATS,
			],
		},
	];

	return CHART_TYPES.filter((type) =>
		isGoalsReport
			? type.isAvailableForGoals
			: type.availableInReportTypes?.includes(reportType),
	);
};

export type TableTypeKey = 'sourceTableTabName' | 'summaryTableTabName';

export const getAvailableReportTableTypeNames = ({
	translator,
	chartType,
	dataType,
}: {
	translator: Translator;
	chartType: insightsTypes.ChartType;
	dataType: insightsTypes.DataType;
}): { [Key in TableTypeKey]?: string } => {
	const isScorecardChart = chartType === insightsTypes.ChartType.SCORECARD;
	const showSummaryTable = !isScorecardChart;

	const getSourceDataTabName = () => {
		switch (dataType) {
			case insightsTypes.DataType.DEALS:
				return translator.gettext('Deals');
			case insightsTypes.DataType.ACTIVITIES:
				return translator.gettext('Activities');
			case insightsTypes.DataType.MAILS:
				return translator.gettext('Emails');
			default:
				return translator.gettext('Data');
		}
	};

	const sourceTableTabName = getSourceDataTabName();

	if (showSummaryTable) {
		const summaryTableTabName = translator.gettext('Summary');

		return { sourceTableTabName, summaryTableTabName };
	}

	return { sourceTableTabName };
};
