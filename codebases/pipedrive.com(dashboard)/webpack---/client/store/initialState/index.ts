import extractPipelines from './pipelines';
import extractFilters from './filters';
import getSelectedPipelineId from './selectedPipeline';
import getSelectedFilter from './selectedFilter';
import getInitialEditData from './edit';
import { changeUrl } from '../../shared/api/webapp';
import { getEditMode } from '../../utils/edit';

export default async function getInitialState(webappApi: Webapp.API, translator) {
	const pipelines = extractPipelines(webappApi);
	const filters = await extractFilters();

	const selectedPipelineId = getSelectedPipelineId(pipelines);
	const selectedFilter = getSelectedFilter(selectedPipelineId, filters);
	const initialEditData = getInitialEditData(selectedPipelineId, pipelines, translator);
	const editMode = getEditMode();

	changeUrl(selectedPipelineId, selectedFilter.type, selectedFilter.value, editMode);

	return {
		pipelines,
		filters,
		selectedFilter: {
			type: selectedFilter.type,
			value: selectedFilter.value,
		},
		selectedPipelineId,
		edit: initialEditData,
	};
}
