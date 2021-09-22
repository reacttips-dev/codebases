import { ThunkAction } from 'redux-thunk';
import { Action, bindActionCreators } from 'redux';

import * as api from '../api';
import * as mainApi from '../../api';

import { ClosePopoverAction, OpenPopoverAction } from '../../actions/actionPopovers';
import { DealActionTypes } from '../../actions/deals.enum';
import { getSelectedPipelineId } from '../../selectors/pipelines';
import { getSelectedFilter } from '../../selectors/filters';
import { getDealPeriodIndex, getDealsLoadingStatus, getPeriodIndex } from '../selectors/deals';
import { getShowByOption, getChangeIntervalOption, getNumberOfColumnsOption } from '../selectors/settings';
import { getPeriodStartDate } from '../selectors/periodStartDate';

import { addSnackbarMessage } from '../../components/SnackbarMessage/actions';
import { SnackbarMessages } from '../../components/SnackbarMessage/getMessage';

import showDealWonAnimation from '../../utils/showDealWonAnimation';
import checkFilterMatching from '../../utils/checkFilterMatching';
import { getPdMetrics } from '../../shared/api/webapp';
import { getForecastViewOpenedMetrics } from '../utils/metrics';

export interface AddDealAction extends Action<DealActionTypes.ADD_DEAL> {
	payload: {
		deal: Pipedrive.Deal;
		dealPeriodIndex: number;
		periodStartDate: string;
	};
}

export type SetDealsRequestAction = Action<DealActionTypes.FORECAST_SET_DEALS_REQUEST>;

export interface SetDealsSuccessAction extends Action<DealActionTypes.FORECAST_SET_DEALS_SUCCESS> {
	payload: {
		deals: Pipedrive.Deal[];
	};
}

export interface SetDealsFailureAction extends Action<DealActionTypes.FORECAST_SET_DEALS_FAILURE> {
	error?: Error;
}

export type SetDealsSummaryRequestAction = Action<DealActionTypes.SET_DEALS_SUMMARY_REQUEST>;

export interface SetDealsSummarySuccessAction extends Action<DealActionTypes.SET_DEALS_SUMMARY_SUCCESS> {
	payload: {
		deals: Pipedrive.Deal[];
	};
}

export interface SetDealsSummaryFailureAction extends Action<DealActionTypes.SET_DEALS_SUMMARY_FAILURE> {
	error?: Error;
}

export interface MoveDealAndUpdateAction extends Action<DealActionTypes.MOVE_DEAL_AND_UPDATE> {
	payload: {
		dealId: number;
		periodStartDate: string;
		showBy: string;
	};
}

export interface MoveDealAction extends Action<DealActionTypes.MOVE_DEAL> {
	payload: {
		dealId: number;
		deal: Pipedrive.Deal;
		fromPeriodIndex: number;
		toPeriodIndex: number;
		showBy: string;
	};
}

export interface UnlockDealAction extends Action<DealActionTypes.UNLOCK_DEAL> {
	payload: {
		deal: Pipedrive.Deal;
		dealPeriodIndex: number;
	};
}

export interface UpdateDealAction extends Action<DealActionTypes.UPDATE_DEAL> {
	payload: {
		deal: Pipedrive.Deal;
		fromPeriodIndex: number;
	};
}

export interface DeleteDealAction extends Action<DealActionTypes.DELETE_DEAL> {
	payload: {
		deal: Pipedrive.Deal;
		dealPeriodIndex: number;
	};
}

export interface HideDealAction extends Action<DealActionTypes.HIDE_DEAL> {
	payload: {
		deal: Pipedrive.Deal;
		fromPeriodIndex: number;
	};
}

export interface UnhideDealAction extends Action<DealActionTypes.UNHIDE_DEAL> {
	payload: {
		deal: Pipedrive.Deal;
		fromPeriodIndex?: number;
	};
}

export type DealActions =
	| AddDealAction
	| DeleteDealAction
	| MoveDealAndUpdateAction
	| MoveDealAction
	| UnlockDealAction
	| HideDealAction
	| UnhideDealAction
	| UpdateDealAction
	| SetDealsRequestAction
	| SetDealsSuccessAction
	| SetDealsFailureAction
	| SetDealsSummaryRequestAction
	| SetDealsSummarySuccessAction
	| SetDealsSummaryFailureAction
	| OpenPopoverAction
	| ClosePopoverAction;

export const fetchDeals =
	(): ThunkAction<void, ForecastState, null, SetDealsRequestAction | SetDealsSuccessAction | SetDealsFailureAction> =>
	async (dispatch, getState) => {
		const state = getState();
		const selectedPipelineId = getSelectedPipelineId(state);
		const selectedFilter = getSelectedFilter(state);
		const interval = getChangeIntervalOption(state);
		const showBy = getShowByOption(state);
		const columnsNumber = getNumberOfColumnsOption(state);
		const periodStartDate = getPeriodStartDate(state);

		if (getDealsLoadingStatus(state)) {
			return;
		}

		dispatch({
			type: DealActionTypes.FORECAST_SET_DEALS_REQUEST,
		});

		try {
			const dealsByPeriod = await api.getDeals(
				selectedPipelineId,
				selectedFilter,
				interval,
				showBy,
				columnsNumber,
				periodStartDate,
				0,
			);

			dispatch({
				type: DealActionTypes.FORECAST_SET_DEALS_SUCCESS,
				// Deals endpoint returns 'null' in case there is no data for the given pipeline + filter combination
				payload: dealsByPeriod,
			});
		} catch (error) {
			dispatch({
				type: DealActionTypes.FORECAST_SET_DEALS_FAILURE,
				error,
			});
		}
	};

export const addDeal =
	(addDealResponse: Pipedrive.API.IAddDealResponse): ThunkAction<void, ForecastState, null, AddDealAction> =>
	(dispatch, getState) => {
		const state = getState();
		const deal = addDealResponse.data;
		const dealPeriodIndex = getDealPeriodIndex(state, deal);
		const dealStatus = deal.status;

		let showBy = getShowByOption(state);

		if (dealStatus === 'won') {
			showBy = 'won_time';
		}

		const additionalData = addDealResponse.additionalData || addDealResponse.additional_data || null;
		const filters = additionalData ? additionalData.matches_filters : [];
		const currentFilterObj = state.selectedFilter;
		const isMatchingFilter = checkFilterMatching(
			filters,
			currentFilterObj,
			addDealResponse.attributes || addDealResponse.data,
		);

		if (isMatchingFilter) {
			dispatch({
				type: DealActionTypes.ADD_DEAL,
				payload: {
					deal,
					dealPeriodIndex,
					periodStartDate: deal[showBy],
				},
			});
		} else {
			// TODO: Should probably show Snackbar with a message about added deal
		}
	};

export const fetchDealsSummary =
	(): ThunkAction<
		void,
		ForecastState,
		null,
		SetDealsSummarySuccessAction | SetDealsSummaryFailureAction | SetDealsSummaryRequestAction
	> =>
	async (dispatch, getState) => {
		const state = getState();
		const selectedPipelineId = getSelectedPipelineId(state);
		const selectedFilter = getSelectedFilter(state);
		const interval = getChangeIntervalOption(state);
		const showBy = getShowByOption(state);
		const columnsNumber = getNumberOfColumnsOption(state);
		const periodStartDate = getPeriodStartDate(state);

		if (getDealsLoadingStatus(state)) {
			return;
		}

		dispatch({
			type: DealActionTypes.SET_DEALS_SUMMARY_REQUEST,
		});

		try {
			const dealsByPeriod = await api.getDeals(
				selectedPipelineId,
				selectedFilter,
				interval,
				showBy,
				columnsNumber,
				periodStartDate,
				1,
			);

			dispatch({
				type: DealActionTypes.SET_DEALS_SUMMARY_SUCCESS,
				// Deals endpoint returns 'null' in case there is no data for the given pipeline + filter combination
				payload: dealsByPeriod,
			});
		} catch (error) {
			dispatch({
				type: DealActionTypes.SET_DEALS_SUMMARY_FAILURE,
				error,
			});
		}
	};

export const moveDealToPeriod =
	(
		deal: Pipedrive.Deal,
		fromPeriodIndex: number,
		toPeriodIndex: number,
		reset = false,
	): ThunkAction<void, ForecastState, null, MoveDealAction | UnlockDealAction> =>
	async (dispatch, getState) => {
		const state = getState();
		const dealStatus = deal.status;

		let showBy = getShowByOption(state);

		if (dealStatus === 'won') {
			showBy = 'won_time';
		}

		if (fromPeriodIndex === toPeriodIndex) {
			return;
		}

		dispatch({
			type: DealActionTypes.MOVE_DEAL,
			payload: {
				dealId: deal.id,
				deal,
				fromPeriodIndex,
				toPeriodIndex,
				showBy,
			},
		});

		if (reset) {
			dispatch({
				type: DealActionTypes.UNLOCK_DEAL,
				payload: {
					deal,
					dealPeriodIndex: toPeriodIndex,
				},
			});
		}
	};

export const moveDealToPeriodAndUpdate =
	(
		deal: Pipedrive.Deal,
		fromPeriodIndex: number,
		periodStartDate: any,
	): ThunkAction<void, ForecastState, null, MoveDealAndUpdateAction | UnlockDealAction> =>
	async (dispatch, getState) => {
		const actions = bindActionCreators({ fetchDealsSummary }, dispatch);
		const state = getState();

		const toPeriodIndex = getPeriodIndex(state, periodStartDate);
		const dealStatus = deal.status;

		let showBy = getShowByOption(state);

		if (dealStatus === 'won') {
			showBy = 'won_time';
		}

		if (fromPeriodIndex !== toPeriodIndex) {
			dispatch({
				type: DealActionTypes.MOVE_DEAL_AND_UPDATE,
				payload: {
					dealId: deal.id,
					periodStartDate,
					showBy,
				},
			});
		}

		const resetDeal = () => {
			dispatch({
				type: DealActionTypes.MOVE_DEAL_AND_UPDATE,
				payload: {
					dealId: deal.id,
					periodStartDate: deal.add_time,
					showBy,
				},
			});

			dispatch({
				type: DealActionTypes.UNLOCK_DEAL,
				payload: {
					deal,
					dealPeriodIndex: fromPeriodIndex,
				},
			});
		};

		try {
			const { data: updatedDeal } = await mainApi.updateDeal(deal.id, {
				[showBy]: periodStartDate,
			});

			if (toPeriodIndex !== -1) {
				dispatch({
					type: DealActionTypes.UNLOCK_DEAL,
					payload: {
						deal: updatedDeal,
						dealPeriodIndex: toPeriodIndex,
					},
				});
			}

			actions.fetchDealsSummary();
		} catch (error) {
			const actions = bindActionCreators({ addSnackbarMessage }, dispatch);
			actions.addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE });

			resetDeal();
		}
	};

export const updateDealStatus =
	(
		deal: Pipedrive.Deal,
		status: 'won' | 'lost',
		putBody: any = {},
		fromPeriodIndex: number,
	): ThunkAction<
		void,
		ForecastState,
		null,
		UpdateDealAction | DeleteDealAction | UnlockDealAction | MoveDealAndUpdateAction
	> =>
	async (dispatch, getState) => {
		const state = getState();
		const actions = bindActionCreators({ fetchDealsSummary }, dispatch);
		// We immediately update the deal as won or lost. And then later, after request is completed, we either delete
		// the deal or we "unlock" it so user can interact with it.
		dispatch({
			type: DealActionTypes.UPDATE_DEAL,
			payload: {
				deal: { ...deal, status, is_locked: true },
				fromPeriodIndex,
			},
		});

		try {
			const { additional_data: additionalData, data: updatedDeal } = await mainApi.updateDeal(deal.id, {
				status,
				...putBody,
			});

			const selectedFilter = getSelectedFilter(state);
			const matchesFilters = (additionalData && additionalData.matches_filters) || [];
			const isMatchingFilter = checkFilterMatching(matchesFilters, selectedFilter, updatedDeal);

			if (status === 'won' && selectedFilter.type === 'user') {
				const toPeriodIndex = getDealPeriodIndex(state, updatedDeal);

				dispatch({
					type: DealActionTypes.MOVE_DEAL_AND_UPDATE,
					payload: {
						dealId: deal.id,
						periodStartDate: updatedDeal.won_time,
						showBy: 'won_time',
					},
				});

				dispatch({
					type: DealActionTypes.UNLOCK_DEAL,
					payload: {
						deal: updatedDeal,
						dealPeriodIndex: toPeriodIndex,
					},
				});
			} else if (isMatchingFilter) {
				dispatch({
					type: DealActionTypes.UNLOCK_DEAL,
					payload: {
						deal: updatedDeal,
						dealPeriodIndex: fromPeriodIndex,
					},
				});
			} else {
				dispatch({
					type: DealActionTypes.DELETE_DEAL,
					payload: {
						deal,
						dealPeriodIndex: fromPeriodIndex,
					},
				});
			}

			if (status === 'won') {
				await showDealWonAnimation(deal.title);
			}

			actions.fetchDealsSummary();
		} catch (error) {
			const actions = bindActionCreators({ addSnackbarMessage }, dispatch);
			actions.addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE });

			dispatch({
				type: DealActionTypes.UPDATE_DEAL,
				payload: { deal, fromPeriodIndex },
				error,
			});

			dispatch({
				type: DealActionTypes.UNLOCK_DEAL,
				payload: {
					deal,
					dealPeriodIndex: fromPeriodIndex,
				},
			});
		}
	};

export const deleteDeal =
	(deal: Pipedrive.Deal): ThunkAction<void, ForecastState, null, DeleteDealAction | AddDealAction> =>
	async (dispatch, getState) => {
		const actions = bindActionCreators({ fetchDealsSummary }, dispatch);
		const state = getState();
		const dealPeriodIndex = getDealPeriodIndex(state, deal);
		const dealStatus = deal.status;

		let showBy = getShowByOption(state);

		if (dealStatus === 'won') {
			showBy = 'won_time';
		}

		dispatch({
			type: DealActionTypes.DELETE_DEAL,
			payload: {
				deal,
				dealPeriodIndex,
			},
		});

		try {
			await mainApi.deleteDeal(deal.id);
			actions.fetchDealsSummary();
		} catch (error) {
			const actions = bindActionCreators({ addSnackbarMessage }, dispatch);
			actions.addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE });

			dispatch({
				type: DealActionTypes.ADD_DEAL,
				payload: {
					deal,
					dealPeriodIndex,
					periodStartDate: deal[showBy],
				},
				error,
			});
		}
	};

export const hideDeal = (deal: Pipedrive.Deal, fromPeriodIndex: number): HideDealAction => ({
	type: DealActionTypes.HIDE_DEAL,
	payload: {
		deal,
		fromPeriodIndex,
	},
});

export const unhideDeal = (deal: Pipedrive.Deal, fromPeriodIndex: number): UnhideDealAction => ({
	type: DealActionTypes.UNHIDE_DEAL,
	payload: {
		deal,
		fromPeriodIndex,
	},
});

export const waitUntilDealsHaveLoadedAndTrackViewOpened =
	(): ThunkAction<void, ForecastState, null, null> => (dispatch, getState) => {
		const state = getState();

		if (state.deals.isLoading) {
			setTimeout(() => dispatch(waitUntilDealsHaveLoadedAndTrackViewOpened()), 1000);
		} else {
			dispatch(trackViewOpened());
		}
	};

export const trackViewOpened = (): ThunkAction<void, ForecastState, null, null> => (dispatch, getState) => {
	const state = getState();
	const attributes = getForecastViewOpenedMetrics(state);

	getPdMetrics().trackUsage(null, 'deal_forecast', 'opened', attributes);
};
