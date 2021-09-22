import {
    UPDATE_USER_WORKSPACE_OPTIN_STATE,
    WORKSPACE_OPTIN_DISMISS_DOT_SHOW,
} from "../../../action_types/optIn_workspace_action_types";

function getDefaultState(): object {
    return {
        userWorkspaceOptInState: "",
        dismissNotificationDot: null,
    };
}

function workspaceOptInReducer(state: object = getDefaultState(), action): object {
    switch (action.type) {
        case UPDATE_USER_WORKSPACE_OPTIN_STATE: {
            return {
                ...state,
                userWorkspaceOptInState: action.optInState,
            };
        }
        case WORKSPACE_OPTIN_DISMISS_DOT_SHOW: {
            return {
                ...state,
                dismissNotificationDot: true,
            };
        }
        default:
            return state;
    }
}

export default workspaceOptInReducer;
