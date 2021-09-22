import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { getDealPeriodIndex } from '../forecast-view/selectors/deals';
import { getActionDeal } from '../selectors/actionPopovers';
import { ViewTypes } from '../utils/constants';

type StoreStateType = PipelineState | ForecastState;

export enum PopoverActionTypes {
	OPEN_ACTION_POPOVER = 'OPEN_ACTION_POPOVER',
	CLOSE_ACTION_POPOVERS = 'CLOSE_ACTION_POPOVERS',
}

export interface OpenPopoverAction extends Action<PopoverActionTypes.OPEN_ACTION_POPOVER> {
	payload?: {
		popover?: ACTION_POPOVERS;
		deal: Pipedrive.Deal;
	};
}

export interface ClosePopoverAction extends Action<PopoverActionTypes.CLOSE_ACTION_POPOVERS> {
	payload: {
		deal: Pipedrive.Deal;
		fromPeriodIndex?: number;
	};
}

export type PopoverActions = OpenPopoverAction | ClosePopoverAction;

export enum ACTION_POPOVERS {
	LOST,
	MOVE,
}

export const openActionPopover = (popover: ACTION_POPOVERS, deal: Pipedrive.Deal): OpenPopoverAction => ({
	type: PopoverActionTypes.OPEN_ACTION_POPOVER,
	payload: {
		popover,
		deal,
	},
});

export const closeActionPopovers =
	(viewType?: ViewTypes): ThunkAction<void, StoreStateType, null, ClosePopoverAction> =>
	(dispatch, getState) => {
		const state = getState();
		const selectedDeal = getActionDeal(state);

		if (!selectedDeal) {
			return;
		}

		dispatch({
			type: PopoverActionTypes.CLOSE_ACTION_POPOVERS,
			payload: {
				deal: selectedDeal,
				// @ts-ignore
				fromPeriodIndex: viewType === ViewTypes.FORECAST ? getDealPeriodIndex(state, selectedDeal) : null,
			},
		});
	};
