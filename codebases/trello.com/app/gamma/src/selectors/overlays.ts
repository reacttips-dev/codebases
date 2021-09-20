import { State } from 'app/gamma/src/modules/types';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import { SnowplowTrackingOptions } from 'app/gamma/src/components/create-board/props';

export const getActiveOverlay = (state: State): string | null => {
  const { overlayType } = state.ui.overlay;
  return overlayType;
};

export const getTeamType = (state: State): TeamType | null => {
  const { teamType } = state.ui.overlay;
  return teamType;
};

export const getOverlayContext = (state: State): object => {
  const { context } = state.ui.overlay;
  return context;
};

export const getOverlayType = (state: State): string | null => {
  const { overlayType } = state.ui.overlay;
  return overlayType;
};

export const getCreateBoardOverlayLegacyTrackingOptions = (
  state: State,
): SnowplowTrackingOptions | object => {
  const { trackingOpts } = state.ui.overlay;
  return trackingOpts;
};

export const getPreSelectedTeamId = (state: State): string | null => {
  const { preSelectedTeamId } = state.ui.overlay;
  return preSelectedTeamId;
};
