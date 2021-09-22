import moment from 'moment';
import { combineReducers } from 'redux';
import { PopoverActionTypes, PopoverActions } from '../../actions/actionPopovers';
import { DealActions, MoveDealAction, AddDealAction, MoveDealAndUpdateAction } from '../actions/deals';
import {
	SocketActionTypes,
	SocketAddDealAction,
	SocketDealActions,
	SocketMoveDealAction,
} from '../actions/deals-sockets';
import { DealActionTypes } from '../../actions/deals.enum';
import { STAGE_CHANGE_TIME_THROTTLE_IN_SECONDS } from '../../utils/constants';

function isLoading(state = false, action: DealActions) {
	if (action.type === DealActionTypes.FORECAST_SET_DEALS_REQUEST) {
		return true;
	}

	if (
		action.type === DealActionTypes.FORECAST_SET_DEALS_SUCCESS ||
		action.type === DealActionTypes.FORECAST_SET_DEALS_FAILURE
	) {
		return false;
	}

	return state;
}

function isError(state = false, action: DealActions) {
	if (action.type === DealActionTypes.FORECAST_SET_DEALS_FAILURE) {
		return true;
	}

	if (
		action.type === DealActionTypes.FORECAST_SET_DEALS_REQUEST ||
		action.type === DealActionTypes.FORECAST_SET_DEALS_SUCCESS
	) {
		return false;
	}

	return state;
}

function moveDealAndReturnState(state: DealsInPeriod[], action: MoveDealAction) {
	const { dealId, deal, fromPeriodIndex, toPeriodIndex } = action.payload;
	const periodDeal =
		fromPeriodIndex === -1
			? deal
			: (state[fromPeriodIndex].deals || []).find((deal: Pipedrive.Deal) => deal.id === dealId);

	if (!periodDeal) {
		return state;
	}

	const updatedDeal = {
		...periodDeal,
		is_locked: true,
		// We keep track of the change time here, so that we can discard any socket update events that come in after this change. This is needed
		// to make sure that socket events do not overwrite stage changes if you change the stage again a second time.
		stage_change_time: moment.utc().unix(),
	};

	const newState = state.map((period: DealsInPeriod, index: number) => {
		if (index === fromPeriodIndex) {
			const fromPeriodArray = state[fromPeriodIndex].deals.filter((deal: Pipedrive.Deal) => deal.id !== dealId);

			period.deals = fromPeriodArray;
		}

		if (index === toPeriodIndex) {
			period.deals = state[index].deals
				? state[index].deals.concat(updatedDeal)
				: (state[index].deals = [updatedDeal]);
		}

		return { ...period };
	});

	return newState;
}

function moveDealAndUpdateReturnState(state: DealsInPeriod[], action: MoveDealAndUpdateAction) {
	const { dealId, periodStartDate, showBy } = action.payload;
	const currentIndex = state.findIndex((period) => {
		return period.deals.find((dealInPeriod) => dealInPeriod.id === dealId);
	});
	const periodDeal = (state[currentIndex].deals || []).find((deal: Pipedrive.Deal) => deal.id === dealId);

	if (!periodDeal) {
		return state;
	}

	const updatedDeal = {
		...periodDeal,
		[showBy]: periodStartDate,
		is_locked: true,
		// We keep track of the change time here, so that we can discard any socket update events that come in after this change. This is needed
		// to make sure that socket events do not overwrite stage changes if you change the stage again a second time.
		period_change_time: moment.utc().unix(),
	};

	const newState = state.map((period: DealsInPeriod, index: number) => {
		const periodStart = period.period_start;
		const periodEnd = period.period_end;
		// eslint-disable-next-line no-undefined
		const isStartDateInPeriod = moment(periodStartDate).isBetween(periodStart, periodEnd, undefined, '[]');

		if (index === currentIndex) {
			const fromPeriodArray = state[currentIndex].deals.filter((deal: Pipedrive.Deal) => deal.id !== dealId);

			period.deals = fromPeriodArray;
		}

		if (isStartDateInPeriod) {
			const isDealInToArray = period.deals.find((deal: Pipedrive.Deal) => deal.id === dealId);

			if (isDealInToArray) {
				period.deals = period.deals.map((periodDeal) => (periodDeal.id === dealId ? updatedDeal : periodDeal));
			} else {
				period.deals = period.deals ? period.deals.concat(updatedDeal) : [updatedDeal];
			}
		}

		return { ...period };
	});

	return newState;
}

function socketMoveDealAndReturnState(state: DealsInPeriod[], action: SocketMoveDealAction) {
	const { dealId, deal, fromPeriodIndex, periodStartDate, showBy, force } = action.payload;
	const periodDeal =
		fromPeriodIndex === -1
			? deal
			: (state[fromPeriodIndex].deals || []).find((deal: Pipedrive.Deal) => deal.id === dealId);

	if (!periodDeal) {
		return state;
	}

	const stageChangedTooFast =
		!force &&
		deal.stage_change_time &&
		Math.abs(moment.utc().unix() - deal.period_change_time) <= STAGE_CHANGE_TIME_THROTTLE_IN_SECONDS;

	if (stageChangedTooFast) {
		return state;
	}

	const updatedDeal = {
		...periodDeal,
		[showBy]: periodStartDate,
		period_change_time: null,
	};

	const newState = state.map((period: DealsInPeriod, index: number) => {
		const periodStart = period.period_start;
		const periodEnd = period.period_end;
		// eslint-disable-next-line no-undefined
		const isStartDateInPeriod = moment(periodStartDate).isBetween(periodStart, periodEnd, undefined, '[]');

		if (index === fromPeriodIndex) {
			const fromPeriodArray = state[fromPeriodIndex].deals.filter((deal: Pipedrive.Deal) => deal.id !== dealId);

			period.deals = fromPeriodArray;
		}

		if (isStartDateInPeriod) {
			period.deals = state[index].deals
				? state[index].deals.concat(updatedDeal)
				: (state[index].deals = [updatedDeal]);
		}

		return { ...period };
	});

	return newState;
}

function updateDealInState(
	state: DealsInPeriod[],
	dealToUpdate: Pipedrive.Deal,
	toPeriodIndex: number,
	newAttributes: Partial<Pipedrive.Deal>,
) {
	return state.map((period: DealsInPeriod, index: number) => {
		if (index === toPeriodIndex) {
			const updatedDeals = (period.deals || []).map((deal: Pipedrive.Deal) => {
				return dealToUpdate.id === deal.id
					? {
							...deal,
							...newAttributes,
					  }
					: deal;
			});

			period.deals = updatedDeals;
		}

		return { ...period };
	});
}

function unlockDealAndReturnState(state: DealsInPeriod[], payload: { deal: Pipedrive.Deal; dealPeriodIndex: number }) {
	return updateDealInState(state, payload.deal, payload.dealPeriodIndex, { is_locked: false });
}

function replaceDealInStage(state: DealsInPeriod[], payload: { deal: Pipedrive.Deal; fromPeriodIndex: number }) {
	return updateDealInState(state, payload.deal, payload.fromPeriodIndex, payload.deal);
}

function addDealAndReturnState(state: DealsInPeriod[], action: AddDealAction | SocketAddDealAction) {
	const { deal, dealPeriodIndex, periodStartDate } = action.payload;
	const isDealInPeriod =
		dealPeriodIndex !== -1 &&
		(state[dealPeriodIndex].deals || []).find((dealInPeriod: Pipedrive.Deal) => dealInPeriod.id === deal.id);

	if (isDealInPeriod) {
		return state;
	}

	return state.map((period: DealsInPeriod, index: number) => {
		const periodStart = period.period_start;
		const periodEnd = period.period_end;
		// eslint-disable-next-line no-undefined
		const isStartDateInPeriod = moment(periodStartDate).isBetween(periodStart, periodEnd, undefined, '[]');

		if (isStartDateInPeriod) {
			period.deals = state[index].deals ? state[index].deals.concat(deal) : (state[index].deals = [deal]);
		}

		return { ...period };
	});
}

function deleteDealAndReturnState(state: DealsInPeriod[], payload: { deal: Pipedrive.Deal; dealPeriodIndex: number }) {
	const { deal, dealPeriodIndex } = payload;

	const fromPeriodArray = state[dealPeriodIndex].deals.filter(
		(periodDeal: Pipedrive.Deal) => periodDeal.id !== deal.id,
	);

	const newState = state.map((period, index) => {
		if (index === dealPeriodIndex) {
			period.deals = fromPeriodArray;
		}

		return { ...period };
	});

	return newState;
}

function socketDeleteDealAndReturnState(
	state: DealsInPeriod[],
	payload: { deal: Pipedrive.Deal; dealPeriodIndex: number },
) {
	const { deal, dealPeriodIndex } = payload;
	const isDealInPeriod = (state[dealPeriodIndex].deals || []).find(
		(dealInPeriod: Pipedrive.Deal) => dealInPeriod.id === deal.id,
	);

	if (!isDealInPeriod) {
		return state;
	}

	const fromPeriodArray = state[dealPeriodIndex].deals.filter(
		(periodDeal: Pipedrive.Deal) => periodDeal.id !== deal.id,
	);

	const newState = state.map((period, index) => {
		if (index === dealPeriodIndex) {
			period.deals = fromPeriodArray;
		}

		return { ...period };
	});

	return newState;
}

function hideDealAndReturnState(state: DealsInPeriod[], payload: { deal: Pipedrive.Deal; fromPeriodIndex: number }) {
	return updateDealInState(state, payload.deal, payload.fromPeriodIndex, {
		is_hidden: true,
	});
}

function unhideDealAndReturnState(state: DealsInPeriod[], payload: { deal: Pipedrive.Deal; fromPeriodIndex?: number }) {
	return updateDealInState(state, payload.deal, payload.fromPeriodIndex, {
		is_hidden: false,
	});
}

function updatePeriodsTotals(state: DealsInPeriod[], payload) {
	return state.map((period: DealsInPeriod, index: number) => {
		const updatedPeriod = payload[index];

		return {
			...period,
			totals: updatedPeriod.totals,
			totals_converted: updatedPeriod.totals_converted,
		};
	});
}

// eslint-disable-next-line complexity
function dealsByPeriod(state: any = [], action: DealActions | SocketDealActions | PopoverActions) {
	switch (action.type) {
		case DealActionTypes.FORECAST_SET_DEALS_FAILURE:
			return [];

		case DealActionTypes.FORECAST_SET_DEALS_SUCCESS:
			return action.payload;

		case DealActionTypes.SET_DEALS_SUMMARY_SUCCESS:
			return updatePeriodsTotals(state, action.payload);

		case DealActionTypes.MOVE_DEAL_AND_UPDATE:
			return moveDealAndUpdateReturnState(state, action);

		case DealActionTypes.MOVE_DEAL:
			return moveDealAndReturnState(state, action);

		case SocketActionTypes.SOCKET_MOVE_DEAL:
			return socketMoveDealAndReturnState(state, action);

		case DealActionTypes.UNLOCK_DEAL:
			return unlockDealAndReturnState(state, action.payload);

		case DealActionTypes.UPDATE_DEAL:
		case SocketActionTypes.SOCKET_UPDATE_DEAL:
			return replaceDealInStage(state, action.payload);

		case DealActionTypes.HIDE_DEAL:
			return hideDealAndReturnState(state, action.payload);

		case DealActionTypes.UNHIDE_DEAL:
		case PopoverActionTypes.CLOSE_ACTION_POPOVERS:
			return unhideDealAndReturnState(state, action.payload);

		case DealActionTypes.DELETE_DEAL:
			return deleteDealAndReturnState(state, action.payload);

		case SocketActionTypes.SOCKET_DELETE_DEAL:
			return socketDeleteDealAndReturnState(state, action.payload);

		case DealActionTypes.ADD_DEAL:
		case SocketActionTypes.SOCKET_ADD_DEAL:
			return addDealAndReturnState(state, action);
	}

	return state;
}

export default combineReducers({
	isLoading,
	isError,
	dealsByPeriod,
});
