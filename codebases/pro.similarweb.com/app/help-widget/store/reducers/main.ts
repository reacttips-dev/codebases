import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { retainCount } from "./retainCountReducer";

/* Reducers */

export const helpWidget = combineReducers({ retainCount });

/* Selectors */

const selectHelpWidget = createSelector(
    ({ helpWidget }) => helpWidget,
    (_) => _,
);

const selectRetainCountState = createSelector(selectHelpWidget, ({ retainCount }) => retainCount);

export const selectCount = createSelector(selectRetainCountState, (_) => _.count);
export const selectPreviousCount = createSelector(selectRetainCountState, (_) => _.previousCount);
