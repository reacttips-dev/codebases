import { getSelectedPipelineId } from '../../selectors/pipelines';
import { getAllDeals } from '../selectors/deals';
import {
	getArrangeByOption,
	getChangeIntervalOption,
	getNumberOfColumnsOption,
	getShowByOption,
} from '../selectors/settings';
import { getUnlistedDealsListSummary } from '../selectors/unlistedDealsList';

const trackingValues = {
	field: 'show_by',
	nextMore: 'jump_forward',
	previousMore: 'jump_back',
	reset: 'today',
	next: 'next',
	previous: 'previous',
	arrange: 'arrange_by',
	show: 'show_by',
	add_time: 'deal_created',
	open: 'open_deals_first',
	won: 'won_deals_first',
	3: '3_columns',
	4: '4_columns',
	5: '5_columns',
};

export function getForecastSettingsChangedMetrics(state, setting, value) {
	const pipelineId = getSelectedPipelineId(state);
	const allDeals = getAllDeals(state);
	const dealCount = allDeals.length;

	return {
		pipeline_id: pipelineId,
		deal_count: dealCount,
		setting_value: trackingValues[value] || value,
		setting: trackingValues[setting] || setting,
		new_forecast: true,
	};
}

export function getForecastTimeperiodChangedMetrics(pipelineId, dealCount, timePeriodChange) {
	return {
		pipeline_id: pipelineId,
		deal_count: dealCount,
		time_period_change: timePeriodChange,
		new_forecast: true,
	};
}

export function getForecastViewOpenedMetrics(state: ForecastState) {
	const pipelineId = getSelectedPipelineId(state);
	const allDeals = getAllDeals(state);
	const dealCount = allDeals.length;
	const dealsSummary = getUnlistedDealsListSummary(state);
	const showBy = getShowByOption(state);
	const arrangeBy = getArrangeByOption(state);
	const numberOfColumns = getNumberOfColumnsOption(state);
	const interval = getChangeIntervalOption(state);

	return {
		pipeline_id: pipelineId,
		deal_count: dealCount,
		not_shown_deal_count: dealsSummary.total_count,
		show_by: showBy,
		arrange_by: trackingValues[arrangeBy],
		columns: `${numberOfColumns}_columns`,
		interval,
		new_forecast: true,
	};
}
