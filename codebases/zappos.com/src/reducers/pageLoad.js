import { PAGE_LOAD_EVENT } from 'constants/reduxActions';

const initialState = { loaded: false };

export default function pageLoad(state = initialState, { type }) {
  switch (type) {
    case PAGE_LOAD_EVENT:
      return { loaded: true };
    default:
      return state;
  }
}
