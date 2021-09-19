import { SET_KILLSWITCHES } from 'store/ducks/killswitch/types';

const initialState = {};

const killswitch = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case SET_KILLSWITCHES:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default killswitch;
