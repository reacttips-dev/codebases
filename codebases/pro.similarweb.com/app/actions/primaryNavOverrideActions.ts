import { PrimaryNavOverrideMode } from "reducers/_reducers/primaryNavOverrideReducer";
import { OVERRIDE_PRIMARY_NAV } from "../action_types/primary_nav_override_action_types";

export const primaryNavOverride = (overrideMode: PrimaryNavOverrideMode) => {
    return {
        type: OVERRIDE_PRIMARY_NAV,
        payload: overrideMode,
    };
};
