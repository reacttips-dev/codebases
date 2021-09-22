import { sortBy } from 'lodash';
import { getUserSetting } from '../../shared/api/webapp/index';

export default function getSelectedPipelineId(
	pipelines: Pipedrive.Pipelines,
	pathName: string = document.location.pathname,
): number {
	const pipelineId = parsePipelineFromUrl(pathName) || getUserSetting('current_pipeline_id');

	if (!pipelineId || isInvalidPipeline(pipelineId, pipelines)) {
		const sortedPipelines = sortBy<Pipedrive.Pipeline>(Object.values(pipelines), 'order_nr');
		return sortedPipelines[0].id;
	}

	return pipelineId;
}

function parsePipelineFromUrl(pathName: string): number {
	const urlParts = pathName.match(/\/(pipeline)\/(\d+)/);

	if (!urlParts || urlParts.length < 3) {
		return null;
	}

	return Number(urlParts[2]);
}

function isInvalidPipeline(pipelineId: number, pipelines: Pipedrive.Pipelines): boolean {
	return !Object.keys(pipelines).some((existingPipelineId) => Number(existingPipelineId) === pipelineId);
}
