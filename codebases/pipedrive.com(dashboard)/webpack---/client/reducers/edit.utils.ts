import { AddStageAction, DeleteStageAction } from '../actions/edit';
import { EditDataState } from './edit';

export function updateStageState(
	state: EditDataState,
	stageId: number,
	newAttributes: Partial<Pipedrive.Stage & { move_deals_to_stage_id: number; delete_deals: boolean }>,
) {
	return {
		...state,
		stages: {
			...state.stages,
			[stageId]: {
				...state.stages[stageId],
				...newAttributes,
			},
		},
	};
}

export function updateStageOrderNumber(state: EditDataState, stageId: number, orderNumber: number) {
	const currentStageOrderNumber = state.stages[stageId].order_nr;
	const isOrderIncreased = orderNumber > currentStageOrderNumber;

	const newState = updateStageState(state, stageId, {
		order_nr: isOrderIncreased ? orderNumber - 1 : orderNumber,
	});

	return Object.values(state.stages).reduce((newState, stage: Pipedrive.Stage) => {
		const stageMustBeChanged =
			(isOrderIncreased
				? stage.order_nr < orderNumber && stage.order_nr > currentStageOrderNumber
				: stage.order_nr >= orderNumber && stage.order_nr < currentStageOrderNumber) && stage.id !== stageId;

		if (stageMustBeChanged) {
			return updateStageState(newState, stage.id, {
				order_nr: isOrderIncreased ? stage.order_nr - 1 : stage.order_nr + 1,
			});
		}

		return newState;
	}, newState);
}

export function deleteStage(state: EditDataState, action: DeleteStageAction) {
	const newState = updateStageState(state, action.currentStageId, {
		active_flag: false,
		move_deals_to_stage_id: action.moveDealsToStageId,
		delete_deals: action.deleteDeals,
	});

	const deletedStage = state.stages[action.currentStageId];

	return Object.values(state.stages).reduce((state, stage) => {
		let newState = state;

		// Update stages which were already marked as deleted and the deals were supposed to be moved
		// to the stage which we are deleting now.
		if (!stage.active_flag && stage.move_deals_to_stage_id === action.currentStageId) {
			newState = updateStageState(state, stage.id, {
				move_deals_to_stage_id: action.moveDealsToStageId,
			});
		}

		if (stage.active_flag && stage.order_nr > deletedStage.order_nr) {
			newState = updateStageState(state, stage.id, {
				order_nr: stage.order_nr - 1,
			});
		}

		return newState;
	}, newState);
}

export function addNewStageToState(state: EditDataState, action: AddStageAction) {
	// Loop through objects to update order number before adding new stage
	const updatedState = Object.values(state.stages).reduce((state, stage: Pipedrive.Stage) => {
		if (stage.active_flag && stage.order_nr >= action.stage.order_nr) {
			return updateStageState(state, stage.id, { order_nr: stage.order_nr + 1 });
		}

		return state;
	}, state);

	return {
		...updatedState,
		stages: {
			...updatedState.stages,
			[action.stage.id]: {
				id: action.stage.id,
				active_flag: true,
				deal_probability: 100,
				name: 'New Stage',
				order_nr: action.stage.order_nr,
				pipeline_id: action.stage.pipeline_id,
				rotten_days: null,
				rotten_flag: false,
				is_new: true,
			},
		},
	};
}
