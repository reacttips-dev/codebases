import { UPDATE_IFRAME_SHEERID_SOURCE } from 'constants/reduxActions';

export default function iframe(state = { updatedHref: '' }, action) {
  const { type, href } = action;

  switch (type) {
    case UPDATE_IFRAME_SHEERID_SOURCE:
      return Object.assign({}, state, { updatedHref: href });
    default:
      return state;
  }
}
