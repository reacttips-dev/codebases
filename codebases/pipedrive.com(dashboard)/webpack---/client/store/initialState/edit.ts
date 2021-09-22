import { EditModes } from '../../utils/constants';
import { getDefaultPipelineStages, getDefaultPipeline } from '../../utils/defaultPipeline';
import { getFirstStageFromPipeline } from '../../utils/stages';
import { getEditMode } from '../../utils/edit';

export function getEditModePipeline(editMode: EditModes, selectedPipelineId, pipelines, translator) {
	if (editMode === EditModes.CREATE) {
		const stages = getDefaultPipelineStages(translator);

		return getDefaultPipeline(translator, stages);
	}

	return pipelines[selectedPipelineId];
}

export default function getInitialEditData(selectedPipelineId, pipelines, translator) {
	const editMode = getEditMode();
	const editModePipeline = getEditModePipeline(editMode, selectedPipelineId, pipelines, translator);

	let firstStageFromPipeline;

	if (Object.keys(editModePipeline.stages).length > 0) {
		firstStageFromPipeline = getFirstStageFromPipeline(editModePipeline.stages);
	}

	return {
		mode: editMode,
		data: editModePipeline,
		focusedStage: firstStageFromPipeline ? firstStageFromPipeline.id : false,
	};
}
