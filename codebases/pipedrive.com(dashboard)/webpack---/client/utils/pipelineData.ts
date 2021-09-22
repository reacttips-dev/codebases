export function getPipelineAttributeStatus(originalPipeline, updatedPipeline, attribute) {
	return originalPipeline[attribute] === updatedPipeline[attribute] ? 'no' : 'yes';
}

export function getStageAttributeChangedCount(originalPipeline, updatedPipeline, attribute) {
	return Object.values(updatedPipeline.stages).reduce((count: number, stage: any) => {
		if (originalPipeline.stages[stage.id] && stage[attribute] !== originalPipeline.stages[stage.id][attribute]) {
			return count + 1;
		}

		return count;
	}, 0);
}

export function getAddedStagesLength(pipeline) {
	return Object.values(pipeline.stages).filter((stage: any) => stage.is_new).length;
}

export function getActiveStagesLength(pipeline) {
	return Object.values(pipeline.stages).filter((stage: any) => stage.active_flag).length;
}

export function getDisabledAttributeCount(updatedPipeline, attribute) {
	return Object.values(updatedPipeline.stages).reduce((count: number, stage: any) => {
		if (!stage[attribute]) {
			return count + 1;
		}

		return count;
	}, 0);
}

export function hasPipelineDataChanged(originalPipeline, updatedPipeline, draggedStatus) {
	const stageAttributesArray = ['name', 'deal_probability', 'rotten_flag', 'rotten_days'];

	let pipelineDataChanged = false;

	stageAttributesArray.forEach((attribute) => {
		if (getStageAttributeChangedCount(originalPipeline, updatedPipeline, attribute) > 0) {
			pipelineDataChanged = true;
		}
	});

	if (originalPipeline.name !== updatedPipeline.name) {
		pipelineDataChanged = true;
	} else if (originalPipeline.deal_probability !== updatedPipeline.deal_probability) {
		pipelineDataChanged = true;
	} else if (getAddedStagesLength(updatedPipeline) > 0) {
		pipelineDataChanged = true;
	} else if (draggedStatus) {
		pipelineDataChanged = true;
	} else if (getDisabledAttributeCount(updatedPipeline, 'active_flag') > 0) {
		pipelineDataChanged = true;
	}

	return pipelineDataChanged;
}
