import {
    CLOSE_CONTACT_US_MODAL,
    OPEN_CONTACT_US_MODAL,
} from "../../action_types/contactus_modal_action_types";

export function contactUsModal(state = { isOpen: false }, action) {
    switch (action.type) {
        case OPEN_CONTACT_US_MODAL: {
            return {
                ...state,
                isOpen: true,
                ...action.payload,
            };
        }
        case CLOSE_CONTACT_US_MODAL: {
            return { ...state, isOpen: false };
        }
        default:
            return state;
    }
}
