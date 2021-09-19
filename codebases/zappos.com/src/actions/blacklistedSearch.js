import { BLACKLISTED_SEARCH } from 'constants/reduxActions';

export function blacklistedSearch(term) {
  return {
    type: BLACKLISTED_SEARCH,
    term
  };
}
