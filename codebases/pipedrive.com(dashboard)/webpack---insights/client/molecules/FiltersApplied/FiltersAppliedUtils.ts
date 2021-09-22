import { types as insightsTypes } from '@pipedrive/insights-core';

const PAYMENTS_DUE_FIELD = 'payments.due_at';
const PAYMENTS_PAYMENT_TYPE_FIELD = 'payments.payment_type';
const DEAL_STAGE_LOG_STAGE_ID_FIELD = 'deal_stage_log.stage_id';
const DEAL_STAGE_LOG_ADD_TIME_FIELD = 'deal_stage_log.add_time';
const DEAL_PRODUCTS_PRODUCT_ID = 'deal_products.product_id';
const EXPECTED_CLOSE_DATE_OR_WON_TIME_FIELD = 'expected_close_date_or_won_time';
const STAGE_CHANGE_TIME_FIELD = 'stage_change_time';
const STAGE_ID_FIELD = 'stage_id';
const WON_TIME_FIELD = 'won_time';
const LOST_TIME_FIELD = 'lost_time';

const NON_PAYMENT_REPORTS_GENERAL_BLACKLIST = [
	PAYMENTS_DUE_FIELD,
	PAYMENTS_PAYMENT_TYPE_FIELD,
	EXPECTED_CLOSE_DATE_OR_WON_TIME_FIELD,
	DEAL_PRODUCTS_PRODUCT_ID,
];
const CONVERSION_REPORTS_BLACKLIST = [WON_TIME_FIELD, LOST_TIME_FIELD];

const STATS_FILTERS_BLACKLIST = [
	STAGE_CHANGE_TIME_FIELD,
	DEAL_STAGE_LOG_ADD_TIME_FIELD,
	DEAL_STAGE_LOG_STAGE_ID_FIELD,
	...NON_PAYMENT_REPORTS_GENERAL_BLACKLIST.filter(
		(field) => field !== DEAL_PRODUCTS_PRODUCT_ID,
	),
];
const REVENUE_REPORTS_FILTERS_BLACKLIST = [
	DEAL_STAGE_LOG_ADD_TIME_FIELD,
	DEAL_STAGE_LOG_STAGE_ID_FIELD,
	DEAL_PRODUCTS_PRODUCT_ID,
	EXPECTED_CLOSE_DATE_OR_WON_TIME_FIELD,
];
const PROGRESS_AND_DURATION_FILTERS_BLACKLIST = [
	STAGE_ID_FIELD,
	...NON_PAYMENT_REPORTS_GENERAL_BLACKLIST,
];
const FUNNEL_CONVERSION_FILTERS_BLACKLIST = [
	DEAL_STAGE_LOG_ADD_TIME_FIELD,
	DEAL_STAGE_LOG_STAGE_ID_FIELD,
	STAGE_ID_FIELD,
	...CONVERSION_REPORTS_BLACKLIST,
	...NON_PAYMENT_REPORTS_GENERAL_BLACKLIST,
];
const REVENUE_FORECAST_FILTERS_BLACKLIST = [
	STAGE_CHANGE_TIME_FIELD,
	DEAL_STAGE_LOG_ADD_TIME_FIELD,
	DEAL_STAGE_LOG_STAGE_ID_FIELD,
	DEAL_PRODUCTS_PRODUCT_ID,
	PAYMENTS_DUE_FIELD,
	PAYMENTS_PAYMENT_TYPE_FIELD,
];

const filterOptionsBasedOnFilterBlacklist = (
	options: any[],
	blacklist: string[] = [],
) => {
	return options.filter((option: any) => !blacklist.includes(option.key));
};

const getFilterOptions = (
	options: any[],
	reportType: insightsTypes.ReportType,
) => {
	if (reportType === insightsTypes.ReportType.DEALS_STATS) {
		return filterOptionsBasedOnFilterBlacklist(
			options,
			STATS_FILTERS_BLACKLIST,
		);
	}

	if (
		[
			insightsTypes.ReportType.DEALS_PROGRESS,
			insightsTypes.ReportType.DEALS_DURATION,
		].includes(reportType)
	) {
		return filterOptionsBasedOnFilterBlacklist(
			options,
			PROGRESS_AND_DURATION_FILTERS_BLACKLIST,
		);
	}

	const isRevenueReport = [
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
	].includes(reportType);

	if (isRevenueReport) {
		return filterOptionsBasedOnFilterBlacklist(
			options,
			REVENUE_REPORTS_FILTERS_BLACKLIST,
		);
	}

	if (reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION) {
		return filterOptionsBasedOnFilterBlacklist(
			options,
			FUNNEL_CONVERSION_FILTERS_BLACKLIST,
		);
	}

	if (reportType === insightsTypes.ReportType.DEALS_REVENUE_FORECAST) {
		return filterOptionsBasedOnFilterBlacklist(
			options,
			REVENUE_FORECAST_FILTERS_BLACKLIST,
		);
	}

	if (reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL) {
		return filterOptionsBasedOnFilterBlacklist(options, [
			...NON_PAYMENT_REPORTS_GENERAL_BLACKLIST,
			...CONVERSION_REPORTS_BLACKLIST,
		]);
	}

	return filterOptionsBasedOnFilterBlacklist(
		options,
		NON_PAYMENT_REPORTS_GENERAL_BLACKLIST,
	);
};

export default getFilterOptions;
