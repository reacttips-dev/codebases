import { PipelineActions, PipelineActionTypes } from '../actions/pipelines';

export default function selectedPipelineId(state = null, action: PipelineActions) {
	if (action.type === PipelineActionTypes.SET_SELECTED_PIPELINE_ID) {
		return action.payload;
	}

	return state;
}
