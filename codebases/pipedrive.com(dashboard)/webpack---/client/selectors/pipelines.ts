export const getSelectedPipelineId = (state: PipelineState | ForecastState): number => state.selectedPipelineId;
export const getSelectedPipelineName = (state: PipelineState | ForecastState) =>
	state.pipelines[state.selectedPipelineId].name;
export const getSelectedPipeline = (state: PipelineState | ForecastState) => state.pipelines[state.selectedPipelineId];
export const getPipelines = (state: PipelineState): PipelineState['pipelines'] => state.pipelines;
export const getViewerPipelines = (state: Viewer.State): Viewer.Pipelines => state.pipelines;
export const getPipelinesLength = (state: PipelineState): number => Object.values(state.pipelines).length;
export const getStages = (state: PipelineState, pipelineId: number): Pipedrive.Pipeline['stages'] =>
	state.pipelines[pipelineId].stages;
export const getStagesCount = (state: PipelineState, pipelineId: number): number =>
	Object.keys(state.pipelines[pipelineId].stages).length;
export const getPipelineById = (state: PipelineState, pipelineId: number) => state.pipelines[pipelineId];
