import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

import { getSelectedPipelineId } from '../../selectors/pipelines';
import { getSelectedFilter } from '../../selectors/filters';
import { getNextStart } from '../selectors/unlistedDealsList';
import * as api from '../api';

export enum UnlistedDealsListActionTypes {
	SET_UNLISTED_DEALS_LIST_REQUEST = 'SET_UNLISTED_DEALS_LIST_REQUEST',
	SET_UNLISTED_DEALS_LIST_SUCCESS = 'SET_UNLISTED_DEALS_LIST_SUCCESS',
	SET_UNLISTED_DEALS_LIST_FAILURE = 'SET_UNLISTED_DEALS_LIST_FAILURE',
	SET_UNLISTED_DEALS_LIST_SUMMARY_REQUEST = 'SET_UNLISTED_DEALS_LIST_SUMMARY_REQUEST',
	SET_UNLISTED_DEALS_LIST_SUMMARY_SUCCESS = 'SET_UNLISTED_DEALS_LIST_SUMMARY_SUCCESS',
	SET_UNLISTED_DEALS_LIST_SUMMARY_FAILURE = 'SET_UNLISTED_DEALS_LIST_SUMMARY_FAILURE',
}

export type SetDealsRequestAction = Action<
	| UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_REQUEST
	| UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_REQUEST
>;

export interface SetDealsSuccessAction extends Action<UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUCCESS> {
	payload: {
		unlistedDealsList: {
			deals: Pipedrive.Deal[];
		};
		start: number;
		nextStart: number;
		moreItems: boolean;
	};
}

export interface SetDealsSummarySuccessAction
	extends Action<UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_SUCCESS> {
	payload: Pipedrive.TotalSummary;
}

export interface SetDealsFailureAction
	extends Action<
		| UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_FAILURE
		| UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_FAILURE
	> {
	error?: Error;
}

export const fetchUnlistedDealsList =
	(): ThunkAction<void, ForecastState, null, SetDealsRequestAction | SetDealsSuccessAction | SetDealsFailureAction> =>
	async (dispatch, getState) => {
		const state = getState();
		const selectedPipelineId = getSelectedPipelineId(state);
		const nextStart = getNextStart(state);
		const selectedFilter = getSelectedFilter(state);

		dispatch({
			type: UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_REQUEST,
		});

		try {
			const { data: unlistedDealsList, additionalData } = await api.getUnlistedDealsList(
				selectedPipelineId,
				selectedFilter,
				nextStart,
			);

			dispatch({
				type: UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUCCESS,
				payload: {
					unlistedDealsList,
					start: additionalData.pagination.start,
					nextStart: additionalData.pagination.next_start,
					moreItems: additionalData.pagination.more_items_in_collection,
				},
			});
		} catch (error) {
			dispatch({
				type: UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_FAILURE,
				error,
			});
		}
	};

export const fetchUnlistedDealsListSummary =
	(): ThunkAction<
		void,
		ForecastState,
		null,
		SetDealsRequestAction | SetDealsSuccessAction | SetDealsSummarySuccessAction | SetDealsFailureAction
	> =>
	async (dispatch, getState) => {
		const state = getState();
		const selectedPipelineId = getSelectedPipelineId(state);
		const selectedFilter = getSelectedFilter(state);

		dispatch({
			type: UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_REQUEST,
		});

		try {
			const unlistedDealsListSummary = await api.getUnlistedDealsListSummary(selectedPipelineId, selectedFilter);

			dispatch({
				type: UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_SUCCESS,
				payload: unlistedDealsListSummary,
			});
		} catch (error) {
			dispatch({
				type: UnlistedDealsListActionTypes.SET_UNLISTED_DEALS_LIST_SUMMARY_FAILURE,
				error,
			});
		}
	};
