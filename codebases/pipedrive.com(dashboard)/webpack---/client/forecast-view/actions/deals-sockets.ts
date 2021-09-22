import { isEqual, reduce } from 'lodash';
import { Action, bindActionCreators } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { getDeal, getDealPeriodIndex } from '../selectors/deals';
import { getSelectedPipelineId } from '../../selectors/pipelines';
import { getShowByOption } from '../selectors/settings';
import { getSelectedFilter } from '../../selectors/filters';
import checkFilterMatching from '../../utils/checkFilterMatching';
import { RELEVANT_FORECAST_DEAL_FIELDS } from '../../utils/constants';
import { getCurrentUserId } from '../../shared/api/webapp';

export enum SocketActionTypes {
	SOCKET_ADD_DEAL = 'SOCKET_ADD_DEAL',
	SOCKET_UPDATE_DEAL = 'SOCKET_UPDATE_DEAL',
	SOCKET_DELETE_DEAL = 'SOCKET_DELETE_DEAL',
	SOCKET_MOVE_DEAL = 'SOCKET_MOVE_DEAL',
}

export interface SocketAddDealAction extends Action<SocketActionTypes.SOCKET_ADD_DEAL> {
	payload?: {
		deal: Pipedrive.Deal;
		dealPeriodIndex: number;
		periodStartDate: string;
	};
}

export interface SocketDeleteDealAction extends Action<SocketActionTypes.SOCKET_DELETE_DEAL> {
	payload?: {
		deal: Pipedrive.Deal;
		dealPeriodIndex: number;
	};
}

export interface SocketMoveDealAction extends Action<SocketActionTypes.SOCKET_MOVE_DEAL> {
	payload?: {
		deal: Pipedrive.Deal;
		dealId: number;
		fromPeriodIndex: number;
		toPeriodIndex: number;
		periodStartDate: string;
		showBy: string;
		force: boolean;
	};
}

export interface SocketUpdateDealAction extends Action<SocketActionTypes.SOCKET_UPDATE_DEAL> {
	payload: {
		deal: Pipedrive.Deal;
		fromPeriodIndex: number;
	};
}

export type SocketDealActions =
	| SocketAddDealAction
	| SocketDeleteDealAction
	| SocketMoveDealAction
	| SocketUpdateDealAction;

export const socketAddDeal =
	(
		deal: Pipedrive.Deal,
		dealPeriodIndex,
		periodStartDate,
		matchesFilters: Pipedrive.API.IAdditionalData['matches_filters'],
	): ThunkAction<void, ForecastState, null, SocketAddDealAction> =>
	(dispatch, getState) => {
		const state = getState();
		const dealInPipeline = getDeal(state, deal.id);
		const selectedFilter = getSelectedFilter(state);
		const isMatchingFilter = checkFilterMatching(matchesFilters, selectedFilter, deal);

		if (dealInPipeline || !isMatchingFilter || dealPeriodIndex < 0) {
			return;
		}

		dispatch({
			type: SocketActionTypes.SOCKET_ADD_DEAL,
			payload: {
				deal,
				dealPeriodIndex,
				periodStartDate,
			},
		});
	};

export const socketDeleteDeal =
	(deal: Pipedrive.Deal, dealPeriodIndex: number): ThunkAction<void, ForecastState, null, SocketDeleteDealAction> =>
	(dispatch, getState) => {
		const state = getState();
		const dealInPipeline = getDeal(state, deal.id);

		if (!dealInPipeline) {
			return;
		}

		dispatch({
			type: SocketActionTypes.SOCKET_DELETE_DEAL,
			payload: {
				deal,
				dealPeriodIndex,
			},
		});
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
	): ThunkAction<void, ForecastState, null, SocketMoveDealAction | SocketUpdateDealAction> =>
	// eslint-disable-next-line complexity
	(dispatch, getState) => {
		const actions = bindActionCreators({ socketDeleteDeal, socketAddDeal }, dispatch);
		const state = getState();
		const currentUserId = getCurrentUserId();
		const dealInPipeline = getDeal(state, deal.id);
		const updatedFields: Partial<Pipedrive.Deal> = getUpdatedFields(deal, dealInPipeline || previousDeal);
		const isRelevantFieldUpdated = updatedFields.some((field: string) =>
			RELEVANT_FORECAST_DEAL_FIELDS.includes(field),
		);
		const dealStatus = deal.status;
		let showBy = getShowByOption(state);

		if (dealStatus === 'won') {
			showBy = 'won_time';
		}

		const dealPeriodIndex = getDealPeriodIndex(state, deal);
		const previousDealPeriodIndex = getDealPeriodIndex(state, previousDeal);

		if (!isRelevantFieldUpdated) {
			return false;
		}

		const isPeriodUpdated = dealPeriodIndex !== previousDealPeriodIndex;
		const isCurrentUser = originatingUserId === currentUserId;

		const currentFilterObj = state.selectedFilter;
		const isCurrentMatchingFilter = checkFilterMatching(matchesFilters, currentFilterObj, deal);
		const selectedPipelineId = getSelectedPipelineId(state);

		const currentDealInSelectedPipeline = selectedPipelineId === deal.pipeline_id;
		const previousDealInSelectedPipeline = selectedPipelineId === previousDeal.pipeline_id;
		const pipelineHasChanged = deal.pipeline_id !== previousDeal.pipeline_id;
		const previousAndCurrentInSelectedPipeline = currentDealInSelectedPipeline && previousDealInSelectedPipeline;

		if (previousAndCurrentInSelectedPipeline && isCurrentMatchingFilter && dealInPipeline) {
			if (isPeriodUpdated) {
				dispatch({
					type: SocketActionTypes.SOCKET_MOVE_DEAL,
					payload: {
						deal,
						dealId: deal.id,
						fromPeriodIndex: previousDealPeriodIndex,
						toPeriodIndex: dealPeriodIndex,
						periodStartDate: deal[showBy],
						showBy,
						force: userAgent === 'automation-phpapp-proxy',
					},
				});
			} else {
				dispatch({
					type: SocketActionTypes.SOCKET_UPDATE_DEAL,
					payload: {
						deal,
						fromPeriodIndex: dealPeriodIndex,
					},
				});
			}
		} else if (
			isCurrentUser &&
			!isCurrentMatchingFilter &&
			previousAndCurrentInSelectedPipeline &&
			dealInPipeline
		) {
			actions.socketDeleteDeal(previousDeal, dealPeriodIndex);
		} else if (
			!isCurrentUser &&
			!isCurrentMatchingFilter &&
			previousAndCurrentInSelectedPipeline &&
			dealInPipeline
		) {
			dispatch({
				type: SocketActionTypes.SOCKET_UPDATE_DEAL,
				payload: {
					deal,
					fromPeriodIndex: dealPeriodIndex,
				},
			});
		} else if (previousAndCurrentInSelectedPipeline && isCurrentMatchingFilter && !dealInPipeline) {
			actions.socketAddDeal(deal, dealPeriodIndex, deal[showBy], matchesFilters);
		} else if (pipelineHasChanged && currentDealInSelectedPipeline) {
			actions.socketAddDeal(deal, dealPeriodIndex, deal[showBy], matchesFilters);
		} else if (pipelineHasChanged && previousDealInSelectedPipeline) {
			actions.socketDeleteDeal(previousDeal, dealPeriodIndex);
		}
	};
