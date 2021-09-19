import { DROP_FLOW_END, DROP_FLOW_START } from 'constants/reduxActions';
export const defaultState = { inProgress: false };

export default function drop(state = defaultState, { type }) {
  switch (type) {
    case DROP_FLOW_START: {
      return { ...state, inProgress: true };
    }
    case DROP_FLOW_END: {
      return { ...state, inProgress: false };
    }
    default: {
      return state;
    }
  }
}
