import { combineReducers } from "redux";
import * as actionTypes from "action_types/popularPages_action_types";
import { defaultPopularPagesRadioFilter } from "components/React/PopularPagesFilters/popularPagesFilters.config";
/**
 * Created by olegg on 22-May-17.
 */
function getDefaultState() {
    return {
        isFetching: false,
        selectedFilter: defaultPopularPagesRadioFilter,
        checkboxIsSelected: false,
    };
}

function popularPagesFiltersState(state = getDefaultState(), action) {
    switch (action.type) {
        case actionTypes.POPULAR_PAGES_RADIO_BUTTON_CLICKED: {
            return { ...state, selectedFilter: action.radioButtonItem };
        }
        case actionTypes.POPULAR_PAGES_UTM_CHECKBOX_CLICKED: {
            return { ...state, checkboxIsSelected: !action.checkboxIsSelected };
        }
        default:
            return state;
    }
}

function popularPagesRequestMessage(state = { showRequestMessage: false, keys: "" }, action) {
    const { keys, isRobotsError } = action;
    switch (action.type) {
        case actionTypes.POPULAR_PAGES_SHOW_REQUEST_MESSAGE: {
            return { ...state, showRequestMessage: isRobotsError, keys };
        }
        case actionTypes.POPULAR_PAGES_HIDE_REQUEST_MESSAGE: {
            return { ...state, showRequestMessage: false, keys };
        }
        default:
            return state;
    }
}

export default combineReducers({ popularPagesFiltersState, popularPagesRequestMessage });
