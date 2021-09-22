import {createSelector, Selector} from "reselect";

import {State} from "store";

import {GeekSquadMembershipDialogState} from "../../../reducers/geekSquadMembershipDialogReducer";

const getState: Selector<State, GeekSquadMembershipDialogState> = (state: State) => state.geekSquadMembershipDialog;

export const isGeekSquadMembershipDialogOpen = createSelector<State, GeekSquadMembershipDialogState, boolean>(
    [getState],
    (state) => state && state.isOpen,
);
