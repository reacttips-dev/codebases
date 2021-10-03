import { BottomPanelViewTypes } from "../_utils/constants";
import { CLOSE_BOTTOM_PANEL, OPEN_BOTTOM_PANEL } from "./types";

export const openBottomPanel = (panelType = null) => ({
  type: OPEN_BOTTOM_PANEL,
  payload: panelType ?? BottomPanelViewTypes.PREVIEW_ARTBOARDS,
});

export const closeBottomPanel = () => ({
  type: CLOSE_BOTTOM_PANEL,
});
