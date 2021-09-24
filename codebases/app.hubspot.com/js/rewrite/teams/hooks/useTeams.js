'use es6';

import { useSelector } from 'react-redux';
import { getTeams } from '../selectors/teamsSelectors';
export var useTeams = function useTeams() {
  return useSelector(getTeams);
};