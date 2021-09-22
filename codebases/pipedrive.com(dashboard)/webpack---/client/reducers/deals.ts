import { isArray, mergeWith } from 'lodash';
import moment from 'moment';
import { combineReducers } from 'redux';
import { AddDealAction, DealActions, DeleteDealAction, MoveDealAction, SetDealsSuccessAction } from '../actions/deals';
import { DealActionTypes } from '../actions/deals.enum';
import {
	SocketActionTypes,
	SocketAddDealAction,
	SocketDealActions,
	SocketMoveDealAction,
} from '../actions/deals-sockets';
import { PopoverActions, PopoverActionTypes } from '../actions/actionPopovers';
import { STAGE_CHANGE_TIME_THROTTLE_IN_SECONDS } from '../utils/constants';

function isLoading(state = false, action: DealActions) {
	if (action.type === DealActionTypes.SET_DEALS_REQUEST) {
		return true;
	}

	if (
		action.type === DealActionTypes.SET_DEALS_SUCCESS ||
		action.type === DealActionTypes.SET_DEALS_FAILURE ||
		action.type === DealActionTypes.RESET_LOADED_DEALS_COUNT
	) {
		return false;
	}

	return state;
}

function loadedDealsCount(state = 0, action: DealActions) {
	if (action.type === DealActionTypes.SET_DEALS_REQUEST) {
		return state + action.payload.limit;
	}

	if (action.type === DealActionTypes.RESET_LOADED_DEALS_COUNT) {
		return 0;
	}

	return state;
}

function hasMoreDeals(state = false, action: DealActions) {
	if (action.type === DealActionTypes.SET_DEALS_FAILURE) {
		return false;
	}

	if (action.type === DealActionTypes.SET_DEALS_SUCCESS) {
		return action.payload.hasMore;
	}

	return state;
}

function isError(state = false, action: DealActions) {
	if (action.type === DealActionTypes.SET_DEALS_FAILURE) {
		return true;
	}

	if (action.type === DealActionTypes.SET_DEALS_REQUEST || action.type === DealActionTypes.SET_DEALS_SUCCESS) {
		return false;
	}

	return state;
}

type ByStagesState = { [stageId: number]: any };

function replaceDealInStage(state: PipelineState['deals']['byStages'], dealToUpdate: Pipedrive.Deal) {
	return updateDealInState(state, dealToUpdate, dealToUpdate);
}

function updateDealInState(
	state: PipelineState['deals']['byStages'],
	dealToUpdate: Pipedrive.Deal,
	newAttributes: Partial<Pipedrive.Deal>,
) {
	const stageId = dealToUpdate.stage_id;

	return {
		...state,
		[stageId]: (state[stageId] || []).map((deal: Pipedrive.Deal) => {
			return dealToUpdate.id === deal.id
				? {
						...deal,
						...newAttributes,
				  }
				: deal;
		}),
	};
}

function addDealAndReturnState(state: ByStagesState = {}, action: AddDealAction | SocketAddDealAction): ByStagesState {
	const deal = action.payload;
	const mainStage = deal.stage_id;
	const isDealInStage = (state[mainStage] || []).find((dealInStage: Pipedrive.Stage) => dealInStage.id === deal.id);

	if (isDealInStage) {
		return state;
	}

	return {
		...state,
		[mainStage]: state[mainStage] ? state[mainStage].concat(deal) : [deal],
	};
}

function setDealsSuccessAndReturnState(state: ByStagesState = {}, action: SetDealsSuccessAction): ByStagesState {
	const dealsByStages = action.payload.deals.reduce((byStages: { [stageId: number]: any }, deal: Pipedrive.Deal) => {
		const stageId = deal.stage_id;

		byStages[stageId] = byStages[stageId] ? byStages[stageId].concat(deal) : [deal];

		return byStages;
	}, {});

	if (!action.payload.mergeWithCurrentState) {
		return dealsByStages;
	}

	return mergeWith({}, state, dealsByStages, (prevDeals, newDeals) => {
		if (isArray(prevDeals)) {
			return prevDeals.concat(newDeals);
		}
	});
}

function socketDeleteDealAndReturnState(state: ByStagesState = {}, deal: Pipedrive.Deal): ByStagesState {
	const mainStage = deal.stage_id;
	const isDealInStage = (state[mainStage] || []).find((dealInStage: Pipedrive.Deal) => dealInStage.id === deal.id);

	if (!isDealInStage) {
		return state;
	}

	return {
		...state,
		[mainStage]: state[mainStage].filter((dealInStage: Pipedrive.Deal) => dealInStage.id !== deal.id),
	};
}

function moveDealAndReturnState(state: ByStagesState = {}, action: MoveDealAction): ByStagesState {
	const { dealId, fromStageId, toStageId } = action.payload;
	const deal = (state[fromStageId] || []).find((deal: Pipedrive.Deal) => deal.id === dealId);

	if (!deal) {
		return state;
	}

	const updatedDeal = {
		...deal,
		stage_id: toStageId,
		is_locked: true,
		// We keep track of the change time here, so that we can discard any socket update events that come in after this change. This is needed
		// to make sure that socket events do not overwrite stage changes if you change the stage again a second time.
		stage_change_time: moment.utc().unix(),
	};

	return {
		...state,
		[fromStageId]: state[fromStageId].filter((deal: Pipedrive.Deal) => deal.id !== dealId),
		[toStageId]: state[toStageId] ? state[toStageId].concat(updatedDeal) : [updatedDeal],
	};
}

function socketMoveDealAndReturnState(state: ByStagesState = {}, action: SocketMoveDealAction): ByStagesState {
	const { dealId, fromStageId, toStageId, force } = action.payload;
	const deal = (state[fromStageId] || []).find((deal: Pipedrive.Deal) => deal.id === dealId);

	if (!deal) {
		return state;
	}

	const stageChangedTooFast =
		!force &&
		deal.stage_change_time &&
		Math.abs(moment.utc().unix() - deal.stage_change_time) <= STAGE_CHANGE_TIME_THROTTLE_IN_SECONDS;

	if (stageChangedTooFast) {
		return state;
	}

	const updatedDeal = {
		...deal,
		stage_id: toStageId,
		stage_change_time: null,
	};

	return {
		...state,
		[fromStageId]: state[fromStageId].filter((deal: Pipedrive.Deal) => deal.id !== dealId),
		[toStageId]: state[toStageId] ? state[toStageId].concat(updatedDeal) : [updatedDeal],
	};
}

function deleteDealAndReturnState(state: ByStagesState = {}, action: DeleteDealAction): ByStagesState {
	const { id: dealId, stage_id: stageId } = action.payload;

	return {
		...state,
		[stageId]: state[stageId].filter((deal: Pipedrive.Deal) => deal.id !== dealId),
	};
}

function unlockDealAndReturnState(state: ByStagesState = {}, deal: Pipedrive.Deal): ByStagesState {
	return updateDealInState(state, deal, { is_locked: false });
}

function hideDealAndReturnState(state: ByStagesState = {}, deal: Pipedrive.Deal): ByStagesState {
	return updateDealInState(state, deal, {
		is_hidden: true,
	});
}

function unhideDealAndReturnState(state: ByStagesState = {}, deal: Pipedrive.Deal): ByStagesState {
	return updateDealInState(state, deal, {
		is_hidden: false,
	});
}

// eslint-disable-next-line complexity
function byStages(state: ByStagesState = {}, action: DealActions | SocketDealActions | PopoverActions): ByStagesState {
	switch (action.type) {
		case DealActionTypes.SET_DEALS_SUCCESS:
			return setDealsSuccessAndReturnState(state, action);

		case SocketActionTypes.SOCKET_DELETE_DEAL:
			return socketDeleteDealAndReturnState(state, action.payload);

		case DealActionTypes.MOVE_DEAL:
			return moveDealAndReturnState(state, action);

		case SocketActionTypes.SOCKET_MOVE_DEAL:
			return socketMoveDealAndReturnState(state, action);

		case DealActionTypes.DELETE_DEAL:
			return deleteDealAndReturnState(state, action);

		case DealActionTypes.UNLOCK_DEAL:
			return unlockDealAndReturnState(state, action.payload);

		case DealActionTypes.HIDE_DEAL:
			return hideDealAndReturnState(state, action.payload);

		case DealActionTypes.ADD_DEAL:
		case SocketActionTypes.SOCKET_ADD_DEAL:
			return addDealAndReturnState(state, action);

		case DealActionTypes.UPDATE_DEAL:
		case SocketActionTypes.SOCKET_UPDATE_DEAL:
			return replaceDealInStage(state, action.payload);

		case DealActionTypes.UNHIDE_DEAL:
			return unhideDealAndReturnState(state, action.payload);

		case PopoverActionTypes.CLOSE_ACTION_POPOVERS:
			return unhideDealAndReturnState(state, action.payload.deal);

		case DealActionTypes.SET_DEALS_FAILURE:
		case DealActionTypes.RESET_LOADED_DEALS_COUNT:
			return {};
	}

	return state;
}

export default combineReducers({
	isLoading,
	loadedDealsCount,
	isError,
	hasMoreDeals,
	byStages,
});
