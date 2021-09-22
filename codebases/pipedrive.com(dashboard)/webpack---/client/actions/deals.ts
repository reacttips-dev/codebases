import { Action, bindActionCreators } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as api from '../api';
import { trackDealClosed, trackStageChange } from '../shared/api/webapp';
import { DEALS_TO_LOAD } from '../utils/constants';
import { getSelectedFilter } from '../selectors/filters';
import { getSelectedPipelineId } from '../selectors/pipelines';
import checkFilterMatching from '../utils/checkFilterMatching';
import showDealWonAnimation from '../utils/showDealWonAnimation';
import sortDealsByActivityNextDate from '../utils/sortDealsByActivityNextDate';
import { fetchAllStatistics } from './summary';
import { addSnackbarMessage } from '../components/SnackbarMessage/actions';
import { SnackbarMessages } from '../components/SnackbarMessage/getMessage';
import { isLoading, getLoadedDealsCount } from '../selectors/deals';
import validateRequiredFields from '../utils/validateRequiredFields';
import { DealActionTypes } from './deals.enum';

export interface AddDealAction extends Action<DealActionTypes.ADD_DEAL> {
	payload: Pipedrive.Deal;
}

export interface DeleteDealAction extends Action<DealActionTypes.DELETE_DEAL> {
	payload: Pipedrive.Deal;
}

export interface MoveDealAction extends Action<DealActionTypes.MOVE_DEAL> {
	payload: {
		dealId: number;
		fromStageId: number;
		toStageId: number;
	};
}

export interface UnlockDealAction extends Action<DealActionTypes.UNLOCK_DEAL> {
	payload: Pipedrive.Deal;
}

export interface HideDealAction extends Action<DealActionTypes.HIDE_DEAL> {
	payload: Pipedrive.Deal;
}

export interface UnhideDealAction extends Action<DealActionTypes.UNHIDE_DEAL> {
	payload: Pipedrive.Deal;
}

export interface UpdateDealAction extends Action<DealActionTypes.UPDATE_DEAL> {
	payload: Pipedrive.Deal;
}

export interface SetDealsRequestAction extends Action<DealActionTypes.SET_DEALS_REQUEST> {
	payload: {
		limit: number;
	};
}

export interface SetDealsSuccessAction extends Action<DealActionTypes.SET_DEALS_SUCCESS> {
	payload: {
		deals: Pipedrive.Deal[];
		mergeWithCurrentState: boolean;
		hasMore: boolean;
	};
}

export interface SetDealsFailureAction extends Action<DealActionTypes.SET_DEALS_FAILURE> {
	error?: Error;
}

export interface RefreshDealFailureAction extends Action<DealActionTypes.REFRESH_DEAL_FAILURE> {
	error?: Error;
}

export interface ResetLoadedDealsCountAction extends Action<DealActionTypes.RESET_LOADED_DEALS_COUNT> {
	payload: Pipedrive.Deal;
}

export type DealActions =
	| AddDealAction
	| DeleteDealAction
	| MoveDealAction
	| UnlockDealAction
	| HideDealAction
	| UnhideDealAction
	| UpdateDealAction
	| SetDealsRequestAction
	| SetDealsSuccessAction
	| SetDealsFailureAction
	| RefreshDealFailureAction
	| ResetLoadedDealsCountAction;

export const addDeal =
	(addDealResponse: Pipedrive.API.IAddDealResponse): ThunkAction<void, PipelineState, null, AddDealAction> =>
	(dispatch, getState) => {
		const actions = bindActionCreators({ fetchAllStatistics }, dispatch);
		const state = getState();
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
				// Need to make a copy as otherwise the deal attributes may be mutated in webapp, which will cause our
				// our socket-events not to properly update the view
				payload: { ...addDealResponse.data },
			});
		} else {
			// TODO: Should probably show Snackbar with a message about added deal
		}

		actions.fetchAllStatistics({ includeGoals: false });
	};

export const fetchDeals =
	(
		limit: number = DEALS_TO_LOAD,
	): ThunkAction<void, PipelineState, null, SetDealsRequestAction | SetDealsSuccessAction | SetDealsFailureAction> =>
	async (dispatch, getState) => {
		const state = getState();
		const selectedPipelineId = getSelectedPipelineId(state);
		const selectedFilter = getSelectedFilter(state);
		const loadedDealsCount = getLoadedDealsCount(state);

		if (isLoading(state)) {
			return;
		}

		dispatch({
			type: DealActionTypes.SET_DEALS_REQUEST,
			payload: {
				limit,
			},
		});

		try {
			const { deals = [], additionalData } = await api.getDeals(
				selectedPipelineId,
				selectedFilter,
				limit,
				loadedDealsCount,
			);

			dispatch({
				type: DealActionTypes.SET_DEALS_SUCCESS,
				// Deals endpoint returns 'null' in case there is no data for the given pipeline + filter combination
				payload: {
					deals: deals ? sortDealsByActivityNextDate(deals) : [],
					mergeWithCurrentState: loadedDealsCount > 0,
					hasMore: additionalData ? additionalData.pagination.more_items_in_collection : false,
				},
			});
		} catch (error) {
			dispatch({
				type: DealActionTypes.SET_DEALS_FAILURE,
				error,
			});
		}
	};

export const moveDealToStage =
	(
		deal: Pipedrive.Deal,
		fromStageId: number,
		toStageId: number,
		includeValidateRequiredFields = true,
	): ThunkAction<void, PipelineState, null, MoveDealAction | UnlockDealAction> =>
	async (dispatch) => {
		if (deal.stage_id === toStageId) {
			return;
		}

		dispatch({
			type: DealActionTypes.MOVE_DEAL,
			payload: {
				dealId: deal.id,
				fromStageId,
				toStageId,
			},
		});

		const resetDeal = () => {
			dispatch({
				type: DealActionTypes.MOVE_DEAL,
				payload: {
					dealId: deal.id,
					fromStageId: toStageId,
					toStageId: fromStageId,
				},
			});

			dispatch({
				type: DealActionTypes.UNLOCK_DEAL,
				payload: deal,
			});
		};

		const saveDeal = async (updatedProperties: Partial<Pipedrive.Deal>) => {
			try {
				const { data: updatedDeal } = await api.updateDeal(deal.id, {
					stage_id: toStageId,
					...updatedProperties,
				});
				dispatch(fetchAllStatistics({ includeGoals: false }));

				dispatch({
					type: DealActionTypes.UNLOCK_DEAL,
					payload: updatedDeal,
				});

				trackStageChange(updatedDeal, deal);
			} catch (error) {
				const actions = bindActionCreators({ addSnackbarMessage }, dispatch);
				actions.addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE });

				resetDeal();
			}
		};

		if (includeValidateRequiredFields) {
			validateRequiredFields({
				deal,
				dealUpdateProperties: { stage_id: toStageId },
				onSave: saveDeal,
				onError: saveDeal,
				onCancel: resetDeal,
			});
		} else {
			saveDeal({});
		}
	};

export const moveDealToOtherPipeline =
	(
		currentDeal: Pipedrive.Deal,
		pipelineId: number,
		stageId: number,
	): ThunkAction<void, PipelineState, null, DeleteDealAction | AddDealAction> =>
	async (dispatch) => {
		dispatch({
			type: DealActionTypes.DELETE_DEAL,
			payload: currentDeal,
		});

		try {
			const { data: updatedDeal } = await api.updateDeal(currentDeal.id, {
				pipeline_id: pipelineId,
				stage_id: stageId,
			});

			dispatch(fetchAllStatistics({ includeGoals: false }));
			trackStageChange(updatedDeal, currentDeal);
		} catch (error) {
			const actions = bindActionCreators({ addSnackbarMessage }, dispatch);
			actions.addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE });

			dispatch({
				type: DealActionTypes.ADD_DEAL,
				payload: currentDeal,
				error,
			});
		}
	};

export const deleteDeal =
	(deal: Pipedrive.Deal): ThunkAction<void, PipelineState, null, DeleteDealAction | AddDealAction> =>
	async (dispatch) => {
		dispatch({
			type: DealActionTypes.DELETE_DEAL,
			payload: deal,
		});

		try {
			await api.deleteDeal(deal.id);
			dispatch(fetchAllStatistics({ includeGoals: false }));
		} catch (error) {
			const actions = bindActionCreators({ addSnackbarMessage }, dispatch);
			actions.addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE });

			dispatch({
				type: DealActionTypes.ADD_DEAL,
				payload: deal,
				error,
			});
		}
	};

export const updateDealStatus =
	(
		deal: Pipedrive.Deal,
		status: 'won' | 'lost',
		putBody: any = {},
		showAnimation = true,
	): ThunkAction<void, PipelineState, null, UpdateDealAction | DeleteDealAction | UnlockDealAction> =>
	async (dispatch, getState) => {
		// We immediately update the deal as won or lost. And then later, after request is completed, we either delete
		// the deal or we "unlock" it so user can interact with it.
		dispatch({
			type: DealActionTypes.UPDATE_DEAL,
			payload: {
				...deal,
				status,
				is_locked: true,
			},
		});

		try {
			const { additional_data: additionalData, data: updatedDeal } = await api.updateDeal(deal.id, {
				status,
				...putBody,
			});

			const selectedFilter = getSelectedFilter(getState());
			const matchesFilters = (additionalData && additionalData.matches_filters) || [];
			const isMatchingFilter = checkFilterMatching(matchesFilters, selectedFilter, updatedDeal);

			if (isMatchingFilter) {
				dispatch({
					type: DealActionTypes.UNLOCK_DEAL,
					payload: updatedDeal,
				});
			} else {
				dispatch({
					type: DealActionTypes.DELETE_DEAL,
					payload: deal,
				});
			}

			// A deal might have a weighted value, but after it is marked as won the value counts for 100%.
			dispatch(fetchAllStatistics({ includeGoals: false }));
			trackDealClosed(updatedDeal, status);

			if (status === 'won' && showAnimation) {
				await showDealWonAnimation(deal.title);
			}
		} catch (error) {
			const actions = bindActionCreators({ addSnackbarMessage }, dispatch);
			actions.addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE });

			dispatch({
				type: DealActionTypes.UPDATE_DEAL,
				payload: deal,
				error,
			});

			dispatch({
				type: DealActionTypes.UNLOCK_DEAL,
				payload: deal,
			});
		}
	};

export const refreshDeal =
	(dealId: number): ThunkAction<void, PipelineState, null, UpdateDealAction | RefreshDealFailureAction> =>
	async (dispatch) => {
		try {
			const deal = await api.getDeal(dealId);

			dispatch({
				type: DealActionTypes.UPDATE_DEAL,
				payload: deal,
			});
		} catch (error) {
			dispatch({
				type: DealActionTypes.REFRESH_DEAL_FAILURE,
				error,
			});
		}
	};

export const hideDeal = (deal: Pipedrive.Deal): HideDealAction => ({
	type: DealActionTypes.HIDE_DEAL,
	payload: deal,
});

export const unhideDeal = (deal: Pipedrive.Deal): UnhideDealAction => ({
	type: DealActionTypes.UNHIDE_DEAL,
	payload: deal,
});

export const resetLoadedDealsCount = () => ({ type: DealActionTypes.RESET_LOADED_DEALS_COUNT });
