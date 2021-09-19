import { PAGE_LOAD_EVENT } from 'constants/reduxActions';

export function pageLoaded() {
  return { type: PAGE_LOAD_EVENT };
}
