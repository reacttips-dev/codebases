import { isEqual, reduce } from 'lodash';
import { Action, bindActionCreators } from 'redux';
import { getDeal } from '../selectors/deals';
import { getSelectedFilter } from '../selectors/filters';
import { getSelectedPipelineId } from '../selectors/pipelines';
import checkFilterMatching from '../utils/checkFilterMatching';
import { debouncedFetchAllStatistics as fetchAllStatistics } from './summary';
import { ThunkAction } from 'redux-thunk';
import { getCurrentUserId } from '../shared/api/webapp';
import { RELEVANT_DEAL_FIELDS } from '../utils/constants';

export enum SocketActionTypes {
	SOCKET_ADD_DEAL = 'SOCKET_ADD_DEAL',
	SOCKET_UPDATE_DEAL = 'SOCKET_UPDATE_DEAL',
	SOCKET_DELETE_DEAL = 'SOCKET_DELETE_DEAL',
	SOCKET_MOVE_DEAL = 'SOCKET_MOVE_DEAL',
}

export interface SocketAddDealAction extends Action<SocketActionTypes.SOCKET_ADD_DEAL> {
	payload?: Pipedrive.Deal;
}

export interface SocketDeleteDealAction extends Action<SocketActionTypes.SOCKET_DELETE_DEAL> {
	payload?: Pipedrive.Deal;
}

export interface SocketMoveDealAction extends Action<SocketActionTypes.SOCKET_MOVE_DEAL> {
	payload?: {
		dealId: number;
		fromStageId: number;
		toStageId: number;
		force: boolean;
	};
}

export interface SocketUpdateDealAction extends Action<SocketActionTypes.SOCKET_UPDATE_DEAL> {
	payload?: Pipedrive.Deal;
}

export type SocketDealActions =
	| SocketAddDealAction
	| SocketDeleteDealAction
	| SocketMoveDealAction
	| SocketUpdateDealAction;

export const socketAddDeal =
	(
		deal: Pipedrive.Deal,
		matchesFilters: Pipedrive.API.IAdditionalData['matches_filters'],
	): ThunkAction<void, PipelineState, null, SocketAddDealAction> =>
	(dispatch, getState) => {
		const actions = bindActionCreators({ fetchAllStatistics }, dispatch);
		const state = getState();
		const dealInPipeline = getDeal(state, deal.id);
		const selectedFilter = getSelectedFilter(getState());
		const isMatchingFilter = checkFilterMatching(matchesFilters, selectedFilter, deal);

		if (dealInPipeline || !isMatchingFilter) {
			return;
		}

		dispatch({
			type: SocketActionTypes.SOCKET_ADD_DEAL,
			payload: deal,
		});

		actions.fetchAllStatistics({ includeGoals: false });
	};

export const socketDeleteDeal =
	(deal: Pipedrive.Deal): ThunkAction<void, PipelineState, null, SocketDeleteDealAction> =>
	(dispatch, getState) => {
		const actions = bindActionCreators({ fetchAllStatistics }, dispatch);
		const state = getState();
		const dealInPipeline = getDeal(state, deal.id);

		if (!dealInPipeline) {
			return;
		}

		dispatch({
			type: SocketActionTypes.SOCKET_DELETE_DEAL,
			payload: deal,
		});

		actions.fetchAllStatistics({ includeGoals: false });
	};

const getUpdatedFields = (deal: Pipedrive.Deal, previousDeal?: Pipedrive.Deal) => {
	return reduce(
		deal,
		(result, value, key) => {
			return isEqual(value, previousDeal[key]) ? result : result.concat(key);
		},
		[],
	);
};

export const socketUpdateDeal =
	(
		deal: Pipedrive.Deal,
		matchesFilters: Pipedrive.API.IAdditionalData['matches_filters'],
		previousDeal: Pipedrive.Deal,
		originatingUserId: number,
		userAgent = '',
	): ThunkAction<void, PipelineState, null, SocketMoveDealAction | SocketUpdateDealAction> =>
	// eslint-disable-next-line complexity
	(dispatch, getState) => {
		const actions = bindActionCreators({ fetchAllStatistics, socketDeleteDeal, socketAddDeal }, dispatch);
		const state = getState();
		const currentUserId = getCurrentUserId();
		const dealInPipeline = getDeal(state, deal.id);
		const updatedFields: Partial<Pipedrive.Deal> = getUpdatedFields(deal, dealInPipeline || previousDeal);
		const isRelevantFieldUpdated = updatedFields.some((field: string) => RELEVANT_DEAL_FIELDS.includes(field));

		if (!isRelevantFieldUpdated) {
			return false;
		}

		const isStageUpdated = updatedFields.includes('stage_id');
		const isValueUpdated = updatedFields.includes('value') || updatedFields.includes('currency');
		const isCurrentUser = originatingUserId === currentUserId;

		const currentFilterObj = state.selectedFilter;
		const isCurrentMatchingFilter = checkFilterMatching(matchesFilters, currentFilterObj, deal);
		const selectedPipelineId = getSelectedPipelineId(state);

		const currentDealInSelectedPipeline = selectedPipelineId === deal.pipeline_id;
		const previousDealInSelectedPipeline = selectedPipelineId === previousDeal.pipeline_id;
		const pipelineHasChanged = deal.pipeline_id !== previousDeal.pipeline_id;
		const previousAndCurrentInSelectedPipeline = currentDealInSelectedPipeline && previousDealInSelectedPipeline;

		if (previousAndCurrentInSelectedPipeline && isCurrentMatchingFilter && dealInPipeline) {
			if (isStageUpdated) {
				dispatch({
					type: SocketActionTypes.SOCKET_MOVE_DEAL,
					payload: {
						dealId: deal.id,
						fromStageId: previousDeal.stage_id,
						toStageId: deal.stage_id,
						// There is some logic built in to not move deals from stages more than once per 10 seconds through sockets.
						// this is to fix issues where deals get moved back and forth. But workflow automations must override this behaviour.
						force: userAgent === 'automation-phpapp-proxy',
					},
				});

				actions.fetchAllStatistics({ includeGoals: false });
			} else {
				dispatch({
					type: SocketActionTypes.SOCKET_UPDATE_DEAL,
					payload: deal,
				});

				if (isValueUpdated) {
					actions.fetchAllStatistics({ includeGoals: false });
				}
			}
		} else if (
			isCurrentUser &&
			!isCurrentMatchingFilter &&
			previousAndCurrentInSelectedPipeline &&
			dealInPipeline
		) {
			actions.socketDeleteDeal(previousDeal);
		} else if (
			!isCurrentUser &&
			!isCurrentMatchingFilter &&
			previousAndCurrentInSelectedPipeline &&
			dealInPipeline
		) {
			dispatch({
				type: SocketActionTypes.SOCKET_UPDATE_DEAL,
				payload: deal,
			});
		} else if (previousAndCurrentInSelectedPipeline && isCurrentMatchingFilter && !dealInPipeline) {
			actions.socketAddDeal(deal, matchesFilters);
		} else if (pipelineHasChanged && currentDealInSelectedPipeline) {
			actions.socketAddDeal(deal, matchesFilters);
		} else if (pipelineHasChanged && previousDealInSelectedPipeline) {
			actions.socketDeleteDeal(previousDeal);
		}
	};
