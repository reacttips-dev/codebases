import {
    END_IMPERSONATION_TOOLTIP,
    START_IMPERSONATION,
} from "../action_types/impersonate_action_types";

export const startImpersonation = (showTooltip) => {
    return {
        type: START_IMPERSONATION,
        showTooltip,
    };
};

export const endImpersonationTooltip = () => {
    return {
        type: END_IMPERSONATION_TOOLTIP,
    };
};
