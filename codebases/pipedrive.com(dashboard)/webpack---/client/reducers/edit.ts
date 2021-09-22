import { combineReducers } from 'redux';
import { updateStageState, updateStageOrderNumber, addNewStageToState, deleteStage } from './edit.utils';
import {
	EditActionTypes,
	SetPipelineEditModeAction,
	SetPipelineEditModeDataAction,
	EditStageNameAction,
	EditStageProbabilityAction,
	EditStageRottingDaysAction,
	EditStageRottingStateAction,
	DeleteStageAction,
	EditPipelineNameAction,
	EditPipelineProbabilityAction,
	EditStageOrderNrAction,
	AddStageAction,
	SetFocusedStageAction,
	SetDraggedStatusAction,
	SetEntryPointAction,
	CloseMoveStageMessageAction,
	SetScrolledStatusAction,
	AddHandlePlaybooksAndWebFormsOptionsAction,
} from '../actions/edit';

function mode(state = false, action: SetPipelineEditModeAction) {
	if (action.type === EditActionTypes.SET_PIPELINE_EDIT_MODE) {
		return action.mode;
	}

	return state;
}

function focusedStage(state = false, action: SetFocusedStageAction) {
	if (action.type === EditActionTypes.SET_FOCUSED_STAGE) {
		return action.stageId;
	}

	return state;
}

function dragged(state = false, action: SetDraggedStatusAction) {
	if (action.type === EditActionTypes.SET_DRAGGED_STATUS) {
		return action.draggedStatus;
	}

	return state;
}

function entryPoint(state = '', action: SetEntryPointAction) {
	if (action.type === EditActionTypes.SET_ENTRY_POINT) {
		return action.entryPoint;
	}

	return state;
}

function scrolled(state = false, action: SetScrolledStatusAction) {
	if (action.type === EditActionTypes.SET_SCROLLED_STATUS) {
		return action.scrolledStatus;
	}

	return state;
}

export type EditDataState = {
	id?: number;
	name?: string;
	order_nr?: number;
	stages?: {
		[stageId: number]: Pipedrive.Stage & {
			move_deals_to_stage_id: number;
			move_playbooks_to_stage_id: number;
			move_web_forms_to_stage_id: number;
		};
	};
};

// eslint-disable-next-line complexity
function data(
	state: EditDataState = {},
	action:
		| SetPipelineEditModeDataAction
		| EditStageNameAction
		| EditStageProbabilityAction
		| EditStageRottingDaysAction
		| EditStageRottingStateAction
		| EditStageOrderNrAction
		| DeleteStageAction
		| EditPipelineNameAction
		| EditPipelineProbabilityAction
		| AddStageAction,
) {
	if (action.type === EditActionTypes.SET_PIPELINE_EDIT_MODE_DATA) {
		return action.pipeline;
	}

	if (action.type === EditActionTypes.EDIT_STAGE_NAME) {
		return updateStageState(state, action.stageId, { name: action.name });
	}

	if (action.type === EditActionTypes.EDIT_STAGE_PROBABILITY) {
		return updateStageState(state, action.stageId, {
			deal_probability: action.dealProbability,
		});
	}

	if (action.type === EditActionTypes.EDIT_STAGE_ROTTING_DAYS) {
		return updateStageState(state, action.stageId, { rotten_days: action.rottenDays });
	}

	if (action.type === EditActionTypes.EDIT_STAGE_ROTTING_STATE) {
		return updateStageState(state, action.stageId, { rotten_flag: action.rottingState });
	}

	if (action.type === EditActionTypes.DELETE_STAGE) {
		return deleteStage(state, action);
	}

	if (action.type === EditActionTypes.EDIT_STAGE_ORDER_NR) {
		return updateStageOrderNumber(state, action.stageId, action.orderNumber);
	}

	if (action.type === EditActionTypes.EDIT_PIPELINE_NAME) {
		return {
			...state,
			name: action.name,
		};
	}

	if (action.type === EditActionTypes.EDIT_PIPELINE_PROBABILITY) {
		return {
			...state,
			deal_probability: action.pipelineProbability,
		};
	}

	if (action.type === EditActionTypes.ADD_STAGE) {
		return addNewStageToState(state, action);
	}

	return state;
}

function playbooksAndWebFormsHandlingOptions(
	state: HandlePlaybooksAndWebFormsOptions[] = [],
	action: AddHandlePlaybooksAndWebFormsOptionsAction,
) {
	if (action.type === EditActionTypes.ADD_HANDLE_PLAYBOOKS_AND_WEB_FORMS_OPTIONS) {
		return [...state, action.options];
	}

	return state;
}

const defaultMoveStageMessageState = {
	isVisible: false,
	isClosed: false,
};

function moveStageMessage(
	state: PipelineState['edit']['moveStageMessage'] = defaultMoveStageMessageState,
	action: EditStageOrderNrAction | SetPipelineEditModeAction | CloseMoveStageMessageAction,
) {
	if (action.type === EditActionTypes.EDIT_STAGE_ORDER_NR && !state.isClosed) {
		return {
			isVisible: true,
			isClosed: false,
		};
	}

	if (action.type === EditActionTypes.CLOSE_MOVE_STAGE_MESSAGE) {
		return {
			isVisible: false,
			isClosed: true,
		};
	}

	if (action.type === EditActionTypes.SET_PIPELINE_EDIT_MODE) {
		return { ...defaultMoveStageMessageState };
	}

	return state;
}

export default combineReducers({
	mode,
	focusedStage,
	dragged,
	scrolled,
	entryPoint,
	data,
	playbooksAndWebFormsHandlingOptions,
	moveStageMessage,
});
