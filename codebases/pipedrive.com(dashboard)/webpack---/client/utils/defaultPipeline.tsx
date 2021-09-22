import { v1 as uuid } from 'uuid';

export function getDefaultPipelineName(translator) {
	return translator.gettext('New pipeline');
}

export function getDefaultPipelineDealProbability() {
	return true;
}

export function getDefaultPipelineStageNames(translator) {
	return [
		translator.gettext('Qualified'),
		translator.gettext('Contact Made'),
		translator.gettext('Demo Scheduled'),
		translator.gettext('Proposal Made'),
		translator.gettext('Negotiations Started'),
	];
}

export function getDefaultStage() {
	return {
		active_flag: true,
		is_new: true,
		deal_probability: 100,
		rotten_flag: false,
		rotten_days: null,
	};
}

export function getDefaultPipelineStages(translator) {
	return getDefaultPipelineStageNames(translator).reduce((stages, stageName: string, index: number) => {
		const stageId = uuid();

		return {
			...stages,
			[stageId]: {
				id: stageId,
				order_nr: index + 1,
				name: stageName,
				...getDefaultStage(),
			},
		};
	}, {});
}

export function getDefaultPipeline(translator, stages) {
	return {
		id: uuid(),
		is_new: true,
		name: getDefaultPipelineName(translator),
		deal_probability: getDefaultPipelineDealProbability(),
		stages,
	};
}
