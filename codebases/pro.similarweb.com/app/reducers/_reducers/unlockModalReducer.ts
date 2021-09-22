import {
    CLOSE_UNLOCK_FEATURE_MODAL,
    OPEN_UNLOCK_FEATURE_MODAL,
} from "../../action_types/unlock_modal_action_types";

export function unlockModal(state = { isOpen: false, unlockHook: {} }, action) {
    switch (action.type) {
        case OPEN_UNLOCK_FEATURE_MODAL: {
            return {
                ...state,
                isOpen: true,
                unlockHook: action.payload.unlockHook,
            };
        }
        case CLOSE_UNLOCK_FEATURE_MODAL: {
            return { ...state, isOpen: false };
        }
        default:
            return state;
    }
}
