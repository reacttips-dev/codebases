'use es6';

import { useSelector } from 'react-redux';
import { getCurrentUserTeamsAsJS } from '../selectors/authSelectors';
export var useCurrentUserTeams = function useCurrentUserTeams() {
  return useSelector(getCurrentUserTeamsAsJS);
};