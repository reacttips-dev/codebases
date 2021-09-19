import { UPDATE_SEARCH_LAYOUT } from 'constants/reduxActions';

export default function searchLayout(state = '', action) {
  const { type, layout } = action;
  switch (type) {
    case UPDATE_SEARCH_LAYOUT:
      return layout;
    default:
      return state;
  }
}
