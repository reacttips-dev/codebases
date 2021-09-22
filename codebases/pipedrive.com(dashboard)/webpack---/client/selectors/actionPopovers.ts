export const isMovePopoverVisible = (state: PipelineState | ForecastState): boolean =>
	state.actionPopovers.isMovePopoverVisible;
export const isLostPopoverVisible = (state: PipelineState | ForecastState): boolean =>
	state.actionPopovers.isLostPopoverVisible;
export const getActionDeal = (state: PipelineState | ForecastState): Pipedrive.Deal =>
	state.actionPopovers.selectedDeal;
