'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import * as SequenceScheduleApi from '../api/SequenceScheduleApi';
import * as SequenceScheduleActionTypes from '../constants/SequenceScheduleActionTypes';
import { PAST_ENROLLMENT_UPDATE_SUCCEEDED } from '../constants/SequenceActionTypes';
var fetchLoading = createAction(SequenceScheduleActionTypes.FETCH_LOADING, identity);
var fetchSuccessful = createAction(SequenceScheduleActionTypes.FETCH_SUCCEEDED, identity);
var fetchFailed = createAction(SequenceScheduleActionTypes.FETCH_FAILED, identity);
var pastEnrollmentUpdated = createAction(PAST_ENROLLMENT_UPDATE_SUCCEEDED, identity);
export var fetchPage = function fetchPage(nextPage) {
  return function (dispatch, getState) {
    dispatch(fetchLoading());
    var paging = getState().sequenceSchedule.get('paging');
    var query = paging.get(nextPage);
    SequenceScheduleApi.fetch(query).then(function (results) {
      var nextResults = results.get('results');
      var nextQuery = results.getIn(['paging', 'next', 'link']);
      var updatedPaging = paging.set(nextPage + 1, nextQuery);
      dispatch(fetchSuccessful({
        results: nextResults,
        page: nextPage,
        paging: updatedPaging
      }));
    }, function (err) {
      return dispatch(fetchFailed(err));
    });
  };
};
export var updateEnrollment = function updateEnrollment(enrollment) {
  return function (dispatch) {
    return SequenceScheduleApi.updateEnrollment(enrollment).then(function (updatedEnrollment) {
      return dispatch(pastEnrollmentUpdated(ImmutableMap().set(updatedEnrollment.get('id'), updatedEnrollment)));
    }).catch(function () {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.enrollmentEditFail"
        }),
        type: 'danger'
      });
    });
  };
};