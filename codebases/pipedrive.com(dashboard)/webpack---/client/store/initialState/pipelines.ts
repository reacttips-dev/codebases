import { keyBy, sortBy } from 'lodash';

const getAllStages = (api: Webapp.API) => {
	return api.userSelf.get('stages').filter(keepActiveStages).map(pluckRelevantStageFields);
};

export default function extractPipelines(webappApi: Webapp.API): Pipedrive.Pipeline[] {
	const allStages = getAllStages(webappApi);
	const pipelinesArray = webappApi.userSelf.pipelines.map(convertPipelineBackboneModel);

	return sortBy(allStages, 'order_nr').reduce(linkStageToPipeline, keyBy(pipelinesArray, 'id'));
}

function convertPipelineBackboneModel(pipelineModel: Backbone.Model): Pipedrive.Pipeline {
	return new PipelineBackboneModel(pipelineModel);
}

export function mergePipelineWithStages(pipelines: Viewer.Pipelines, stages: [Pipedrive.Stage]): Viewer.Pipelines {
	return sortBy(stages, 'order_nr').reduce(linkStageToPipeline, keyBy(pipelines, 'pipelineId'));
}

function keepActiveStages(stage: Pipedrive.Stage) {
	return stage.active_flag;
}

function pluckRelevantStageFields(stage: Pipedrive.Stage): Pipedrive.Stage {
	const { id, active_flag, name, order_nr, pipeline_id, rotten_days, rotten_flag, deal_probability } = stage;

	return {
		id,
		active_flag,
		name,
		order_nr,
		pipeline_id,
		rotten_days,
		rotten_flag,
		deal_probability,
	};
}

function PipelineBackboneModel(model: Backbone.Model) {
	this.id = model.get('id');
	this.name = model.get('name');
	this.order_nr = model.get('order_nr');
	this.stage_ids = [];
	this.stages = {};
	this.deal_probability = model.get('deal_probability');
}

function linkStageToPipeline<T>(pipelinesObj: T, stage: Pipedrive.Stage) {
	const pipeline = pipelinesObj[stage.pipeline_id];

	if (!pipeline) {
		return pipelinesObj;
	}

	pipeline.stage_ids.push(stage.id);
	pipeline.stages[stage.id] = stage;

	return pipelinesObj;
}
