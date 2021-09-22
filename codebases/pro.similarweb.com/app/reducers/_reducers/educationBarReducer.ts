import {
    TOGGLE_EDUCATION_BAR,
    TOGGLE_EDUCATION_BAR_SIMPLE,
} from "action_types/educationBar_action_types";

function getDefaultState(): object {
    return {
        isOpen: false,
    };
}

function toggleEducationBar(state: object = getDefaultState(), action): object {
    switch (action.type) {
        case TOGGLE_EDUCATION_BAR: {
            return Object.assign({}, state, { isOpen: action.isOpen, article: action.article });
        }
        case TOGGLE_EDUCATION_BAR_SIMPLE: {
            return Object.assign({}, state, { isOpen: !state["isOpen"] });
        }
        default:
            return state;
    }
}

export default toggleEducationBar;
