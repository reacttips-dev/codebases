import { Action, combineReducers } from 'redux';
import { AddDealAction } from '../../actions/deals';
import { DealActionTypes } from '../../actions/deals.enum';
import { MoveDealAction } from '../actions/deals';
import { SocketAddDealAction } from '../actions/deals-sockets';
import { UnlistedDealsListActionTypes } from '../actions/unlistedDealsList';

export type UnlistedDealsListRequestAction = Action<
	| UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_REQUEST
	| UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_REQUEST
>;
export type UnlistedDealsListFailureAction = Action<
	| UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_FAILURE
	| UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_FAILURE
>;
export interface UnlistedDealsListSuccessAction
	extends Action<UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUCCESS> {
	payload: {
		unlistedDealsList: Pipedrive.Deal[];
		start: number;
		nextStart: number;
		moreItems: boolean;
	};
}

export interface UnlistedDealsListSummarySuccessAction
	extends Action<UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_SUCCESS> {
	payload: Pipedrive.TotalSummary;
}

type UnlistedDealsListAction =
	| UnlistedDealsListRequestAction
	| UnlistedDealsListSuccessAction
	| UnlistedDealsListSummarySuccessAction
	| UnlistedDealsListFailureAction;

function moveDealAndReturnState(state, action: MoveDealAction) {
	let fromPeriodArray = [];

	const { dealId, deal, fromPeriodIndex, toPeriodIndex } = action.payload;

	const unlistedDeal = (state || []).find((deal: Pipedrive.Deal) => deal.id === dealId);

	if (!unlistedDeal && toPeriodIndex === -1) {
		fromPeriodArray = state.concat(deal);
	} else if (!unlistedDeal) {
		return state;
	}

	if (fromPeriodIndex === -1) {
		fromPeriodArray = state.filter((deal: Pipedrive.Deal) => deal.id !== dealId);
	}

	return [...fromPeriodArray];
}

function addDealAndReturnState(state: DealsInPeriod[], action: AddDealAction | SocketAddDealAction) {
	const { deal, dealPeriodIndex } = action.payload;

	if (dealPeriodIndex === -1) {
		return state ? state.concat(deal) : [deal];
	}

	return state;
}

function deals(state: any = [], action: UnlistedDealsListAction | MoveDealAction | AddDealAction) {
	if (action.type === UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_FAILURE) {
		return [];
	}

	if (action.type === UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUCCESS && action.payload.start !== 0) {
		// There are some cases when multiple fetches are done before state moreItems is updated.
		// Therefore we'd need to make sure that the list holds only unique values.
		const deals = [...state, ...action.payload.unlistedDealsList];
		const stringifiedDeals = deals.map((deal) => JSON.stringify(deal));
		const uniqueDeals = Array.from(new Set(stringifiedDeals)).map((deal) => JSON.parse(deal));

		return uniqueDeals;
	}

	if (action.type === UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUCCESS) {
		return action.payload.unlistedDealsList;
	}

	if (action.type === DealActionTypes.MOVE_DEAL) {
		return moveDealAndReturnState(state, action);
	}

	if (action.type === DealActionTypes.ADD_DEAL) {
		return addDealAndReturnState(state, action);
	}

	return state;
}

function nextStart(state = 0, action: UnlistedDealsListAction) {
	if (action.type === UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUCCESS && action.payload.moreItems) {
		return action.payload.nextStart;
	}

	return state;
}

function moreItems(state = false, action: UnlistedDealsListAction) {
	if (action.type === UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUCCESS) {
		return action.payload.moreItems;
	}

	return state;
}

function dealsSummary(state: any = [], action: UnlistedDealsListAction) {
	if (action.type === UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_FAILURE) {
		return [];
	}

	if (action.type === UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_SUCCESS) {
		return action.payload;
	}

	return state;
}

export default combineReducers({
	deals,
	nextStart,
	moreItems,
	dealsSummary,
});
