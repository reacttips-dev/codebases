'use es6';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { getTeamsAction } from '../actions/teamsActions';
import { getTeamsFetchStatus } from '../selectors/teamsSelectors';
export var useFetchTeams = function useFetchTeams() {
  var dispatch = useDispatch();
  var status = useSelector(getTeamsFetchStatus);
  useEffect(function () {
    if (status === UNINITIALIZED) {
      dispatch(getTeamsAction());
    }
  }, [status, dispatch]);
  return status === SUCCEEDED;
};