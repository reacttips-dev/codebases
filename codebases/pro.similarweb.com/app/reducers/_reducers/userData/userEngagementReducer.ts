import {
    ALL_STATES_COMPARE_STATUS,
    STATE_COMPARE_STATUS,
    USER_DID_COMPARE,
    USER_DID_NOT_COMPARE,
} from "../../../action_types/common_action_types";

export interface IUserEngagementsState {
    userDidCompare: boolean;
    states: string[];
}

function getDefaultState(): IUserEngagementsState {
    return {
        userDidCompare: true,
        states: [],
    };
}

function userEngagement(state: IUserEngagementsState = getDefaultState(), action): object {
    switch (action.type) {
        case USER_DID_COMPARE: {
            return {
                ...state,
                userDidCompare: true,
            };
        }
        case USER_DID_NOT_COMPARE: {
            return {
                ...state,
                userDidCompare: false,
            };
        }
        case STATE_COMPARE_STATUS:
            return {
                ...state,
                states: [...state.states, action.stateId],
            };
        case ALL_STATES_COMPARE_STATUS:
            return {
                ...state,
                states: action.states,
            };
        default:
            return state;
    }
}

export default userEngagement;
