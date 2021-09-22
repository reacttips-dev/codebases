import moment from 'moment';
import { flatMap } from 'lodash';

import { getActionDeal } from '../../selectors/actionPopovers';
import { getShowByOption } from './settings';

export const getDealsLoadingStatus = (state: ForecastState) => state.deals.isLoading;
export const getDealsByPeriod = (state: ForecastState) => state.deals.dealsByPeriod;
export const getAllDeals = (state: ForecastState) => {
	return flatMap(getDealsByPeriod(state), (array) => array.deals);
};
export const getDeal = (state: ForecastState, dealId: number): Pipedrive.Deal => {
	const allDeals = getAllDeals(state);

	return allDeals.find((deal) => deal.id === dealId);
};

export const getPeriodIndex = (state: ForecastState, date: string) => {
	const dealsByPeriod = getDealsByPeriod(state);

	return dealsByPeriod.findIndex((period) => {
		const periodStart = period.period_start;
		const periodEnd = period.period_end;
		// eslint-disable-next-line no-undefined
		const isDateBetweenPeriod = moment(date).isBetween(periodStart, periodEnd, undefined, '[]');

		return isDateBetweenPeriod;
	});
};

export const getDealPeriodIndex = (state: ForecastState, periodDeal?: Pipedrive.Deal) => {
	const deal = periodDeal ? periodDeal : getActionDeal(state);
	const dealsByPeriod = getDealsByPeriod(state);
	const showBy = deal.won_time ? 'won_time' : getShowByOption(state);

	return dealsByPeriod.findIndex((period) => {
		const periodStart = period.period_start;
		const periodEnd = period.period_end;
		// eslint-disable-next-line no-undefined
		const isDateBetweenPeriod = moment(deal[showBy]).isBetween(periodStart, periodEnd, undefined, '[]');

		return isDateBetweenPeriod;
	});
};
