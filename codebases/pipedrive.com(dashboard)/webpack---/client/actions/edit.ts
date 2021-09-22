import { Dispatch, Action } from 'redux';
import { sortBy } from 'lodash';
import { EditModes, EntryPoints } from '../utils/constants';
import { ThunkAction } from 'redux-thunk';
import { addSnackbarMessage, AddSnackbarMessageAction } from '../components/SnackbarMessage/actions';
import { SnackbarMessages } from '../components/SnackbarMessage/getMessage';
import { v1 as uuid } from 'uuid';
import { getFirstStageFromPipeline } from '../utils/stages';
import { getPipelineEditModeData } from '../selectors/edit';
import { getSelectedPipelineId } from '../selectors/pipelines';
import { getSelectedFilter } from '../selectors/filters';
import { getDefaultPipelineStages, getDefaultPipeline } from '../utils/defaultPipeline';
import { Translator } from '@pipedrive/react-utils';
import {
	DeleteStageDealsDialogContentOptions,
	DealsData,
} from '../components/EditPipeline/EditStage/EditStageBody/DeleteStageDialog';
import { changeUrl } from '../shared/api/webapp';

export enum EditActionTypes {
	SET_PIPELINE_EDIT_MODE = 'SET_PIPELINE_EDIT_MODE',
	SET_PIPELINE_EDIT_MODE_DATA = 'SET_PIPELINE_EDIT_MODE_DATA',
	SET_FOCUSED_STAGE = 'SET_FOCUSED_STAGE',
	SET_DRAGGED_STATUS = 'SET_DRAGGED_STATUS',
	SET_ENTRY_POINT = 'SET_ENTRY_POINT',
	SET_SCROLLED_STATUS = 'SET_SCROLLED_STATUS',
	// Edit stage attribute actions
	EDIT_STAGE_NAME = 'EDIT_STAGE_NAME',
	EDIT_STAGE_PROBABILITY = 'EDIT_STAGE_PROBABILITY',
	EDIT_STAGE_ROTTING_DAYS = 'EDIT_STAGE_ROTTING_DAYS',
	EDIT_STAGE_ROTTING_STATE = 'EDIT_STAGE_ROTTING_STATE',
	EDIT_STAGE_ORDER_NR = 'EDIT_STAGE_ORDER_NR',
	ADD_STAGE = 'ADD_STAGE',
	DELETE_STAGE = 'DELETE_STAGE',
	// Edit pipeline actions
	EDIT_PIPELINE_NAME = 'EDIT_PIPELINE_NAME',
	EDIT_PIPELINE_PROBABILITY = 'EDIT_PIPELINE_PROBABILITY',
	// Other
	CLOSE_MOVE_STAGE_MESSAGE = 'CLOSE_MOVE_STAGE_MESSAGE',
	// LeadBooster and Web Forms
	ADD_HANDLE_PLAYBOOKS_AND_WEB_FORMS_OPTIONS = 'ADD_HANDLE_PLAYBOOKS_AND_WEB_FORMS_OPTIONS',
}

// Action types
export interface SetPipelineEditModeAction extends Action<EditActionTypes.SET_PIPELINE_EDIT_MODE> {
	mode: EditModes;
}

export interface SetPipelineEditModeDataAction extends Action<EditActionTypes.SET_PIPELINE_EDIT_MODE_DATA> {
	pipeline: Record<string, unknown>;
}

export interface SetFocusedStageAction extends Action<EditActionTypes.SET_FOCUSED_STAGE> {
	stageId: number;
}

export interface SetDraggedStatusAction extends Action<EditActionTypes.SET_DRAGGED_STATUS> {
	draggedStatus: boolean;
}

export interface SetEntryPointAction extends Action<EditActionTypes.SET_ENTRY_POINT> {
	entryPoint: EntryPoints;
}

export interface SetScrolledStatusAction extends Action<EditActionTypes.SET_SCROLLED_STATUS> {
	scrolledStatus: boolean;
}

export interface EditStageNameAction extends Action<EditActionTypes.EDIT_STAGE_NAME> {
	name: string;
	stageId: number;
}

export interface EditStageProbabilityAction extends Action<EditActionTypes.EDIT_STAGE_PROBABILITY> {
	dealProbability: number;
	stageId: number;
}

export interface EditStageRottingDaysAction extends Action<EditActionTypes.EDIT_STAGE_ROTTING_DAYS> {
	rottenDays: number;
	stageId: number;
}

export interface EditStageRottingStateAction extends Action<EditActionTypes.EDIT_STAGE_ROTTING_STATE> {
	rottingState: boolean;
	stageId: number;
}

export interface EditStageOrderNrAction extends Action<EditActionTypes.EDIT_STAGE_ORDER_NR> {
	stageId: number;
	orderNumber: number;
}

export interface AddStageAction extends Action<EditActionTypes.ADD_STAGE> {
	stage: Partial<Pipedrive.Stage>;
}

export interface DeleteStageAction extends Action<EditActionTypes.DELETE_STAGE> {
	currentStageId: number;
	moveDealsToStageId: number | null;
	deleteDeals: boolean;
}

export interface EditPipelineNameAction extends Action<EditActionTypes.EDIT_PIPELINE_NAME> {
	name: string;
}

export interface EditPipelineProbabilityAction extends Action<EditActionTypes.EDIT_PIPELINE_PROBABILITY> {
	pipelineProbability: boolean;
}

export type CloseMoveStageMessageAction = Action<EditActionTypes.CLOSE_MOVE_STAGE_MESSAGE>;

export interface AddHandlePlaybooksAndWebFormsOptionsAction
	extends Action<EditActionTypes.ADD_HANDLE_PLAYBOOKS_AND_WEB_FORMS_OPTIONS> {
	options: HandlePlaybooksAndWebFormsOptions;
}

// Actions
export const setPipelineEditModeStatus = (mode: EditModes): SetPipelineEditModeAction => ({
	type: EditActionTypes.SET_PIPELINE_EDIT_MODE,
	mode,
});

export const setDraggedStatus = (draggedStatus: boolean): SetDraggedStatusAction => ({
	type: EditActionTypes.SET_DRAGGED_STATUS,
	draggedStatus,
});

export const setScrolledStatus = (scrolledStatus: boolean): SetScrolledStatusAction => ({
	type: EditActionTypes.SET_SCROLLED_STATUS,
	scrolledStatus,
});

export const cancelPipelineEditMode =
	(): ThunkAction<
		void,
		PipelineState,
		null,
		SetPipelineEditModeAction | SetDraggedStatusAction | SetScrolledStatusAction
	> =>
	async (dispatch, getState) => {
		const state = getState();
		const filter = getSelectedFilter(state);
		const selectedPipelineId = getSelectedPipelineId(state);

		dispatch(setPipelineEditModeStatus(EditModes.OFF));
		dispatch(setDraggedStatus(false));
		dispatch(setScrolledStatus(false));

		changeUrl(selectedPipelineId, filter.type, filter.value, EditModes.OFF);
	};

export const setPipelineEditMode =
	(
		pipeline: any,
	): ThunkAction<
		void,
		PipelineState,
		null,
		SetPipelineEditModeAction | SetPipelineEditModeDataAction | SetFocusedStageAction
	> =>
	async (dispatch, getState) => {
		const state = getState();
		const filter = getSelectedFilter(state);
		const selectedPipelineId = getSelectedPipelineId(state);

		dispatch({
			type: EditActionTypes.SET_PIPELINE_EDIT_MODE_DATA,
			pipeline,
		});

		if (Object.values(pipeline.stages).length) {
			const firstStage = getFirstStageFromPipeline(pipeline.stages);

			dispatch(setFocusedStage(firstStage.id));
		} else {
			dispatch(addStage({ pipeline_id: pipeline.id }, 1));
		}

		dispatch(setPipelineEditModeStatus(EditModes.EDIT));
		changeUrl(selectedPipelineId, filter.type, filter.value, EditModes.EDIT);
	};

export const setPipelineCreateMode =
	(
		translator: Translator,
	): ThunkAction<
		void,
		PipelineState,
		null,
		SetPipelineEditModeAction | SetPipelineEditModeDataAction | SetFocusedStageAction | AddSnackbarMessageAction
	> =>
	async (dispatch, getState) => {
		try {
			const state = getState();
			const filter = getSelectedFilter(state);
			const selectedPipelineId = getSelectedPipelineId(state);
			const stages = getDefaultPipelineStages(translator);
			const firstStage = getFirstStageFromPipeline(stages);
			const pipeline = getDefaultPipeline(translator, stages);

			dispatch({
				type: EditActionTypes.SET_PIPELINE_EDIT_MODE_DATA,
				pipeline,
			});
			dispatch(setPipelineEditModeStatus(EditModes.CREATE));
			dispatch(setFocusedStage(firstStage.id));
			changeUrl(selectedPipelineId, filter.type, filter.value, EditModes.CREATE);
		} catch (err) {
			dispatch(addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE }));
		}
	};

export const setFocusedStage = (stageId: number): SetFocusedStageAction => ({
	type: EditActionTypes.SET_FOCUSED_STAGE,
	stageId,
});

export const setEntryPoint = (entryPoint: EntryPoints): SetEntryPointAction => ({
	type: EditActionTypes.SET_ENTRY_POINT,
	entryPoint,
});

export const editStageName = (name: string, stageId: number): EditStageNameAction => ({
	type: EditActionTypes.EDIT_STAGE_NAME,
	name,
	stageId,
});

export const editStageProbability = (dealProbability: number, stageId: number): EditStageProbabilityAction => ({
	type: EditActionTypes.EDIT_STAGE_PROBABILITY,
	dealProbability,
	stageId,
});

export const editStageRottingDays = (rottenDays: number, stageId: number) => ({
	type: EditActionTypes.EDIT_STAGE_ROTTING_DAYS,
	rottenDays,
	stageId,
});

export const editStageRottingState = (rottingState: boolean, stageId: number) => ({
	type: EditActionTypes.EDIT_STAGE_ROTTING_STATE,
	rottingState,
	stageId,
});

export const editStageOrderNumber = (orderNumber: number, stageId: number) => ({
	type: EditActionTypes.EDIT_STAGE_ORDER_NR,
	orderNumber,
	stageId,
});

export const addHandlePlaybooksAndWebFormsOptions = (
	options: HandlePlaybooksAndWebFormsOptions,
): AddHandlePlaybooksAndWebFormsOptionsAction => ({
	type: EditActionTypes.ADD_HANDLE_PLAYBOOKS_AND_WEB_FORMS_OPTIONS,
	options,
});

export const deleteStage =
	(
		stageId: number,
		dealsData: DealsData,
		handlePlaybooksAndWebFormsOptions: HandlePlaybooksAndWebFormsOptions | null,
	) =>
	(
		dispatch: Dispatch<DeleteStageAction | SetFocusedStageAction | AddHandlePlaybooksAndWebFormsOptionsAction>,
		getState: () => PipelineState,
	) => {
		const state = getState();
		const { stages } = getPipelineEditModeData(state);
		const stagesArray = sortBy(Object.values(stages), ['order_nr']);
		const currentStageIndex = stagesArray.findIndex((stage) => stage.id === stageId);
		const focusStage = stagesArray[currentStageIndex - 1] || stagesArray[currentStageIndex + 1];

		const moveDealsToStageId = dealsData && dealsData.newStageId;

		// If playbooks or Web Forms should be handled, save it in redux to be handled while saving the pipeline.
		if (handlePlaybooksAndWebFormsOptions) {
			dispatch(addHandlePlaybooksAndWebFormsOptions(handlePlaybooksAndWebFormsOptions));
		}

		dispatch({
			type: EditActionTypes.DELETE_STAGE,
			currentStageId: stageId,
			moveDealsToStageId,
			deleteDeals: dealsData.option === DeleteStageDealsDialogContentOptions.DELETE,
		});

		dispatch(setFocusedStage(focusStage.id));
	};

export const editPipelineName = (name: string): EditPipelineNameAction => ({
	type: EditActionTypes.EDIT_PIPELINE_NAME,
	name,
});

export const editPipelineProbability = (pipelineProbability: boolean): EditPipelineProbabilityAction => ({
	type: EditActionTypes.EDIT_PIPELINE_PROBABILITY,
	pipelineProbability,
});

export const addStage =
	(
		stage: Partial<Pipedrive.Stage>,
		orderNr: number,
	): ThunkAction<void, PipelineState, null, AddStageAction | AddSnackbarMessageAction | SetFocusedStageAction> =>
	async (dispatch) => {
		try {
			const stageId = uuid();

			dispatch({
				type: EditActionTypes.ADD_STAGE,
				stage: {
					id: stageId,
					order_nr: orderNr,
					name: 'New Stage',
					active_flag: true,
					deal_probability: 100,
					pipeline_id: stage.pipeline_id,
					rotten_flag: false,
					rotten_days: null,
				},
			});
			dispatch(setFocusedStage(stageId));
		} catch (err) {
			dispatch(addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE }));
		}
	};

export const closeMoveStageMessage = (): CloseMoveStageMessageAction => ({
	type: EditActionTypes.CLOSE_MOVE_STAGE_MESSAGE,
});
