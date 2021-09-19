import realAbReducer from 'react-redux-hydra/lib/reducer';

import { SERIALIZE_STATE } from 'constants/reduxActions';

const addAbReducer = reducersObj => {
  const abReducer = (state = { tests: [], assignments: {}, queue: [] }, action) => {
    if (action.type === SERIALIZE_STATE && action.cached) {
      // clear assignments and queue so that we can cache the page :(
      return Object.assign({}, state, { assignments: {}, queue: [] });
    }

    // dispatch to the real ab reducer from rrh.
    return realAbReducer(state, action);
  };

  return Object.assign({}, reducersObj, { ab: abReducer });
};

export default addAbReducer;
