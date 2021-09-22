export const isActive = (state: PipelineState) => state.view.isActive;
export const getDealTileSize = (state: PipelineState) => state.view.dealTileSize;
export const getViewerState = (state: PipelineState) => state.view.isViewer;
export const getIsUpsellingSent = (state: Viewer.State) => state.view.isUpsellingSent;
