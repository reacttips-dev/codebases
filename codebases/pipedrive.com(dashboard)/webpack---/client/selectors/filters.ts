export const getSelectedFilter = (state: PipelineState | ForecastState): Pipedrive.SelectedFilter =>
	state.selectedFilter;
export const getFilters = (state: PipelineState | ForecastState): Pipedrive.Filter[] => state.filters;
