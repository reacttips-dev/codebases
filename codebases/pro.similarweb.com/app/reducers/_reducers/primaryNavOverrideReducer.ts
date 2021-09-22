import { OVERRIDE_PRIMARY_NAV } from "../../action_types/primary_nav_override_action_types";

export enum PrimaryNavOverrideMode {
    All = "all",
    Legacy = "legacy",
    S1 = "s1",
    S2 = "s2",
}

interface PrimaryNavOverrideState {
    navOverrideMode: PrimaryNavOverrideMode;
}

const getDefaultState = (): PrimaryNavOverrideState => {
    return {
        navOverrideMode: PrimaryNavOverrideMode.S2,
    };
};

const handlers = {
    [OVERRIDE_PRIMARY_NAV]: (state, action) => {
        return { navOverrideMode: action.payload };
    },
};

const primaryNavOverrideReducer = (state = getDefaultState(), action) => {
    const handler = handlers[action.type];

    if (handler) {
        return handler(state, action);
    }

    return state;
};

export default primaryNavOverrideReducer;
