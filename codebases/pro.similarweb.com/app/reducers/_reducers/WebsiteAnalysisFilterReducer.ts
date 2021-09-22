import {
    CLOSE_DURATION_FILTER,
    OPEN_DURATION_FILTER,
} from "../../action_types/website_analysis_action-types";

export function WebsiteAnalysisFilters(state = { durationFilter: false }, action) {
    switch (action.type) {
        case OPEN_DURATION_FILTER: {
            return {
                ...state,
                durationFilter: true,
            };
        }
        case CLOSE_DURATION_FILTER: {
            return { ...state, durationFilter: false };
        }
        default:
            return state;
    }
}
