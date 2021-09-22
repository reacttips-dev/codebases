import {
    END_IMPERSONATION_TOOLTIP,
    START_IMPERSONATION,
} from "../../action_types/impersonate_action_types";

function getDefaultState() {
    return {
        impersonateMode: false,
    };
}

function impersonation(state = getDefaultState(), action): object {
    switch (action.type) {
        case START_IMPERSONATION: {
            return {
                ...state,
                impersonateMode: true,
                impersonateTooltip: action.showTooltip,
            };
        }
        case END_IMPERSONATION_TOOLTIP: {
            return {
                ...state,
                impersonateTooltip: false,
            };
        }
        default:
            return state;
    }
}

export default impersonation;
