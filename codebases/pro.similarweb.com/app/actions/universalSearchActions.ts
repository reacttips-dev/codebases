import {
    UNIVERSAL_SEARCH_ON_FOCUS,
    UNIVERSAL_SEARCH_ON_FOCUS_OUTSIDE,
} from "../action_types/universalSearch_action_types";

export const universalSearchOnFocus = (searchText) => ({
    type: UNIVERSAL_SEARCH_ON_FOCUS,
    searchText,
});

export const universalSearchOnFocusOutside = () => ({
    type: UNIVERSAL_SEARCH_ON_FOCUS_OUTSIDE,
});
