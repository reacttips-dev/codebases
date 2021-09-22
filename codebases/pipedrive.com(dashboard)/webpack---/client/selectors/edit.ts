import { orderBy } from 'lodash';
import { EditModes } from '../utils/constants';

export const getPipelineEditMode = (state: PipelineState) => state.edit.mode;

export const getFocusedStage = (state: PipelineState) => state.edit.focusedStage;

export const getDraggedStatus = (state: PipelineState) => state.edit.dragged;

export const getEntryPoint = (state: PipelineState) => state.edit.entryPoint;

export const getScrolledStatus = (state: PipelineState) => state.edit.scrolled;

export const getPipelineEditModeData = (state: PipelineState) => state.edit.data;

export const getPipelineEditModePlaybooksAndWebFormsHandlingOptions = (state: PipelineState) =>
	state.edit.playbooksAndWebFormsHandlingOptions;

export const getPipelineEditModeStages = (state: PipelineState) => {
	const filteredStages = Object.values(state.edit.data.stages).filter((stage) => stage.active_flag);

	return orderBy(Object.values(filteredStages), 'order_nr');
};

export const getEditPipelineStage = (state: PipelineState, stageId: number) => {
	return state.edit.data.stages[stageId];
};

export const isStageMovedMessageVisible = (state: PipelineState) => {
	return (
		getPipelineEditMode(state) === EditModes.EDIT &&
		state.edit.moveStageMessage.isVisible &&
		!state.edit.moveStageMessage.isClosed
	);
};
