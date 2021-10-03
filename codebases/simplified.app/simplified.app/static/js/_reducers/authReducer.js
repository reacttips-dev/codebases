import {
  SET_CURRENT_USER,
  USER_VERIFIED,
  SWITCH_ORG,
  UPDATE_CURRENT_USER,
  SET_CURRENT_WORKSPACE,
  SYNC_WORKSPACES,
} from "../_actions/types";
import isEmpty from "../_validation/is-empty";

const initialState = {
  isAuthenticated: false,
  isVerified: false,
  payload: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        payload: action.payload,
      };
    case USER_VERIFIED:
      return {
        ...state,
        isVerified: true,
      };
    case SWITCH_ORG:
      return {
        ...state,
        payload: {
          ...state.payload,
          selectedOrg: action.payload,
        },
      };
    case SET_CURRENT_WORKSPACE:
      return {
        ...state,
        payload: {
          ...state.payload,
          workspaceName: action.payload.workspaceName,
        },
      };
    case UPDATE_CURRENT_USER:
      return {
        ...state,
        payload: {
          ...state.payload,
          user: action.payload,
        },
      };
    case SYNC_WORKSPACES:
      return {
        ...state,
        payload: {
          ...state.payload,
          orgs: action.payload,
        },
      };
    default:
      return state;
  }
}
