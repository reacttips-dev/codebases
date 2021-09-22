import {
    ALL_STATES_COMPARE_STATUS,
    STATE_COMPARE_STATUS,
    USER_DID_COMPARE,
    USER_DID_NOT_COMPARE,
} from "../../action_types/common_action_types";

export const setUserCompareStatusAction = (didCompare) => {
    return {
        type: didCompare ? USER_DID_COMPARE : USER_DID_NOT_COMPARE,
    };
};

export const setStateCompareStatusAction = (stateId) => {
    return {
        type: STATE_COMPARE_STATUS,
        stateId,
    };
};

export const setAllStatesCompareStatusAction = (states) => {
    return {
        type: ALL_STATES_COMPARE_STATUS,
        states,
    };
};
