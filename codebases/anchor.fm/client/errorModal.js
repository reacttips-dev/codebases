const defaultState = {
  error: null, // a string
};

const RECEIVE_ERROR = '@@errorModal/RECEIVE_ERROR';

// reducer
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case RECEIVE_ERROR:
      return {
        error: action.payload.error,
      };
    default:
      return state;
  }
}

export function receiveError(error) {
  return {
    type: RECEIVE_ERROR,
    payload: { error },
  };
}
