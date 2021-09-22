import {
    UNIVERSAL_SEARCH_ON_FOCUS,
    UNIVERSAL_SEARCH_ON_FOCUS_OUTSIDE,
} from "../../action_types/universalSearch_action_types";

function getDefaultState() {
    return {
        isOpen: false,
    };
}

function universalSearch(state = getDefaultState(), action) {
    switch (action.type) {
        case UNIVERSAL_SEARCH_ON_FOCUS: {
            return {
                ...state,
                isOpen: true,
                searchText: action.searchText,
            };
        }
        case UNIVERSAL_SEARCH_ON_FOCUS_OUTSIDE: {
            return {
                ...state,
                isOpen: false,
            };
        }
        default:
            return state;
    }
}

export default universalSearch;
