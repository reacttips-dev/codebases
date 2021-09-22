import {
    SET_SECONDARY_BAR_TYPE,
    TOGGLE_SECONDARY_BAR,
} from "action_types/secondary_bar_action_types";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const toggleSecondaryBar = (isOpened: boolean) => {
    return {
        type: TOGGLE_SECONDARY_BAR,
        isSecondaryBarOpened: isOpened,
    };
};

export const setSecondaryBarType = (secondaryBarType: SecondaryBarType) => {
    return {
        type: SET_SECONDARY_BAR_TYPE,
        secondaryBarType,
    };
};
