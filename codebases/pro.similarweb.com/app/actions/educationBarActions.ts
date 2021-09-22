import {
    TOGGLE_EDUCATION_BAR,
    TOGGLE_EDUCATION_BAR_SIMPLE,
} from "../action_types/educationBar_action_types";

export const toggleEducationBar = (isOpen: boolean, article?) => {
    return {
        type: TOGGLE_EDUCATION_BAR,
        isOpen,
        article,
    };
};

export const toggleEducationBarSimple = () => {
    return {
        type: TOGGLE_EDUCATION_BAR_SIMPLE,
    };
};
