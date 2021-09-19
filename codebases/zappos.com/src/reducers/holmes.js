import {
  STORE_HOLMES
} from 'constants/reduxActions';

export default function holmes(state = false, action) {
  const { type, holmes } = action;

  switch (type) {
    case STORE_HOLMES:
      return { ...holmes };
    default:
      return state;
  }
}
