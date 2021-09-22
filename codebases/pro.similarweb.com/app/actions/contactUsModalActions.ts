import {
    CLOSE_CONTACT_US_MODAL,
    OPEN_CONTACT_US_MODAL,
} from "../action_types/contactus_modal_action_types";

export function openContactUsModal(label: string) {
    return {
        type: OPEN_CONTACT_US_MODAL,
        payload: {
            label,
        },
    };
}

export function closeContactUsModal() {
    return {
        type: CLOSE_CONTACT_US_MODAL,
    };
}
