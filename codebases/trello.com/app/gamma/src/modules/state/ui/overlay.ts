/* eslint-disable import/no-default-export */
import { Action, actionCreator, createReducer } from '@trello/redux';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import { UtmCampaign } from 'app/gamma/src/util/cross-flow-essentials';
import { SnowplowTrackingOptions } from 'app/gamma/src/components/create-board/props';
// Action types

const SET_OVERLAY = Symbol('ui/SET_OVERLAY');
const REMOVE_OVERLAY = Symbol('ui/REMOVE_OVERLAY');

interface TrackingOptions {
  method?: string;
}

export enum OverlayType {
  CreateBoard = 'create_board',
  CreateTeam = 'create_team',
  ProductStore = 'product_store',
  PlanSelection = 'plan-selection',
}

export interface OverlayContext {
  orgId?: string;
  source?: string;
  campaign?: UtmCampaign;
}

type SetOverlayAction = Action<
  typeof SET_OVERLAY,
  {
    overlayType: OverlayType | null;
    teamType?: TeamType | null;
    productKey?: string | null;
    context?: OverlayContext;
    trackingOpts?: SnowplowTrackingOptions | TrackingOptions;
    preSelectedTeamId?: string;
  }
>;
type RemoveOverlayAction = Action<typeof REMOVE_OVERLAY, null>;

interface OverlayPayload {
  overlayType: string | null;
  teamType: TeamType | null;
  productKey: string | null;
  context: OverlayContext;
  trackingOpts: TrackingOptions;
  preSelectedTeamId: string | null;
}

export type OverlayState = OverlayPayload;

// Reducer
const initialState: OverlayState = {
  overlayType: null,
  teamType: null,
  productKey: null,
  context: {},
  trackingOpts: {},
  preSelectedTeamId: null,
};

export default createReducer(initialState, {
  [SET_OVERLAY](state: OverlayState, { payload }: SetOverlayAction) {
    return payload;
  },
  [REMOVE_OVERLAY]() {
    return initialState;
  },
});

// Action creators
export const setOverlay = actionCreator<SetOverlayAction>(SET_OVERLAY);
export const removeOverlay = actionCreator<RemoveOverlayAction>(REMOVE_OVERLAY);
