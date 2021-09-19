import { RECEIVE_EGC_DATA, SET_EGC_DESIGN } from 'constants/reduxActions';
export default function(state = {}, action) {
  const { type, data, asin } = action;
  switch (type) {
    case RECEIVE_EGC_DATA:
      const newState = { designs: data };
      if (data.length) {
        newState.asin = data[0].asin;
      }
      return newState;
    case SET_EGC_DESIGN:
      return {
        ...state,
        asin
      };
    default:
      return state;
  }
}
