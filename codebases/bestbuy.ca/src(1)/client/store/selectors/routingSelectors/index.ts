import {createSelector, Selector} from "reselect";
import {State} from "store";
import {RoutingState} from "../../../reducers";

export const getRouting: Selector<State, RoutingState> = (state: State) => state.routing;

export const getRoutingAltLangUrl = createSelector<State, RoutingState, string | undefined>(
    [getRouting],
    (state) => state.altLangUrl,
);

export const getLocationBeforeTransitions = createSelector<
    State,
    RoutingState,
    RoutingState["locationBeforeTransitions"]
>([getRouting], (state) => state.locationBeforeTransitions);
