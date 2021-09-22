import moment from 'moment';
import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { getFilterRange } from '../../utils/helpers';
import localState from '../../utils/localState';
import { isGroupByTime } from '../../atoms/ChartGroupByFilter/chartGroupByUtils';
import { FilterType, FORECAST_MAX_ITEMS_PER_PAGE } from '../../utils/constants';

const EXPECTED_CLOSE_DATE_OR_WON_TIME = 'expectedCloseDateOrWonTime';

interface PeriodFilter {
	period: string;
	startDate: string;
	endDate: string;
	inMonths: number;
}

export interface IntervalOption {
	label: string;
	name: insightsTypes.Interval;
	tooltipText?: string;
	disabled?: boolean;
}

const getPeriodLength = (filter: PeriodFilter) => {
	const startDate = moment(filter.startDate);
	const endDate = moment(filter.endDate);

	return endDate.diff(startDate, 'days') + 1;
};

const getIntervalOptionMaxPeriod = (option: IntervalOption) => {
	switch (option.name) {
		case insightsTypes.Interval.DAY:
			return 1 * FORECAST_MAX_ITEMS_PER_PAGE;
		case insightsTypes.Interval.WEEK:
			return 7 * FORECAST_MAX_ITEMS_PER_PAGE;
		case insightsTypes.Interval.MONTH:
			return (366 / 12) * FORECAST_MAX_ITEMS_PER_PAGE;
		case insightsTypes.Interval.QUARTER:
			return (366 / 4) * FORECAST_MAX_ITEMS_PER_PAGE;
		default:
			return null;
	}
};

const applyPeriodLengthFilter = (
	options: IntervalOption[],
	periodLengthInDays: number,
	translator: Translator,
) => {
	return options.map((option) => {
		const maxPeriodInDays = getIntervalOptionMaxPeriod(option);
		const isTooShortInterval =
			maxPeriodInDays && maxPeriodInDays < periodLengthInDays;

		return {
			...option,
			...(isTooShortInterval && {
				tooltipText: translator.gettext(
					'Select a shorter time filter to view results in shorter intervals',
				),
				disabled: true,
			}),
		};
	});
};

const getIntervalOptions = ({
	filterByFilter,
	reportType,
	options,
	translator,
}: {
	filterByFilter?: insightsTypes.Filter[];
	reportType: insightsTypes.ReportType;
	options: IntervalOption[];
	translator: Translator;
}) => {
	if (reportType !== insightsTypes.ReportType.DEALS_REVENUE_FORECAST) {
		return options;
	}

	const periodFilter = getFilterRange({
		reportFilters: filterByFilter,
		filterType: EXPECTED_CLOSE_DATE_OR_WON_TIME,
	});
	const periodLengthInDays = getPeriodLength(periodFilter);

	return applyPeriodLengthFilter(options, periodLengthInDays, translator);
};

const getSmallestAllowedInterval = (options: IntervalOption[]) => {
	return options.find((option) => !option.disabled);
};

export const canUseCurrentInterval = (
	intervalOptions: IntervalOption[],
	interval: insightsTypes.Interval | boolean,
) =>
	!!intervalOptions?.find(
		(option) => option.name === interval && !option.disabled,
	);

export const getOnePeriodLowerInterval = (
	period: string,
): insightsTypes.Interval => {
	const intervalMap: { [key: string]: string[] } = {
		day: ['today', 'yesterday', 'week', 'lastWeek', 'lastTwoWeeks'],
		week: ['month', 'lastMonth'],
		month: ['quarter', 'lastQuarter'],
		quarter: ['year', 'lastYear', 'custom'],
	};

	return Object.keys(intervalMap).find((key) =>
		intervalMap[key].includes(period),
	) as insightsTypes.Interval;
};

export const getInterval = ({
	filterByFilter,
	groupByFilter,
	intervalOptions,
}: {
	filterByFilter: insightsTypes.Filter[];
	intervalOptions: IntervalOption[];
	groupByFilter: insightsTypes.Deals.GroupByFilter;
}) => {
	const DEFAULT_INTERVAL = insightsTypes.Interval.QUARTER;

	const hasDisabledIntervalOptions = intervalOptions.some(
		(option: IntervalOption) => option.disabled,
	);

	if (hasDisabledIntervalOptions) {
		return getSmallestAllowedInterval(intervalOptions).name;
	}

	const dateFilters = filterByFilter.filter(
		(filter: insightsTypes.Filter) => filter.type === FilterType.DATE,
	);

	if (dateFilters.length) {
		const lastDateFilter = dateFilters[dateFilters.length - 1];
		const dateFilterMatchingGroupBy = dateFilters.find(
			(filter: insightsTypes.Filter) =>
				filter.filter === groupByFilter.filter,
		);

		return getOnePeriodLowerInterval(
			dateFilterMatchingGroupBy?.period ?? lastDateFilter.period,
		);
	}

	return DEFAULT_INTERVAL;
};

export const getAndSaveIntervalFilter = ({
	filterByFilter,
	intervalOptions,
	groupByFilter,
	setUnsavedReport,
	isGoalsReport,
}: {
	filterByFilter: insightsTypes.Filter[];
	intervalOptions: IntervalOption[];
	groupByFilter: insightsTypes.Deals.GroupByFilter;
	setUnsavedReport: (updatableObject: Object) => void;
	isGoalsReport: boolean;
}) => {
	const { filter, interval } = groupByFilter;
	const isGroupedByTime = isGroupByTime(filter);

	if (
		canUseCurrentInterval(intervalOptions, interval) ||
		!isGroupedByTime ||
		isGoalsReport
	) {
		return interval as insightsTypes.Interval;
	}

	const newInterval = getInterval({
		filterByFilter,
		groupByFilter,
		intervalOptions,
	});

	setUnsavedReport({
		parameters: {
			group_by: { filter, interval: newInterval },
			__typename: 'reportreportParametersInput',
		},
	});

	return newInterval;
};

export default ({
	translator,
	groupByFilter,
	reportType,
	filterByFilter,
	isGoalsReport = false,
}: {
	translator: Translator;
	groupByFilter: insightsTypes.Deals.GroupByFilter;
	reportType: insightsTypes.ReportType;
	filterByFilter: insightsTypes.Filter[];
	saveReport?: Function;
	isGoalsReport?: boolean;
}) => {
	const { setUnsavedReport } = localState();
	const options = [
		{
			label: translator.gettext('Daily'),
			name: insightsTypes.Interval.DAY,
		},
		{
			label: translator.gettext('Weekly'),
			name: insightsTypes.Interval.WEEK,
		},
		{
			label: translator.gettext('Monthly'),
			name: insightsTypes.Interval.MONTH,
		},
		{
			label: translator.gettext('Quarterly'),
			name: insightsTypes.Interval.QUARTER,
		},
		{
			label: translator.gettext('Yearly'),
			name: insightsTypes.Interval.YEAR,
		},
	];

	const intervalOptions = getIntervalOptions({
		filterByFilter,
		reportType,
		options,
		translator,
	});

	return {
		intervalOptions,
		intervalFilter: getAndSaveIntervalFilter({
			filterByFilter,
			intervalOptions,
			groupByFilter,
			setUnsavedReport,
			isGoalsReport,
		}),
	};
};
