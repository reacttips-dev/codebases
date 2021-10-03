import { GET_SUBSCRIPTION } from "../_actions/types";

const initialState = {
  subscribedPlan: {},
  availableFeatures: [],
};

const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBSCRIPTION:
      return {
        ...state,
        subscribedPlan: action.payload.subscription,
        availableFeatures: action.payload.features,
      };
    default:
      return state;
  }
};

export default subscriptionReducer;
