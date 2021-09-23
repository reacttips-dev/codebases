'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as SequenceActionTypes from '../constants/SequenceActionTypes';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
var initialState = ImmutableMap();
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SequenceActionTypes.ENROLLMENT_FETCH_SUCCESS:
      return state.set(action.payload.vid, action.payload.enrollmentState);

    case SequenceActionTypes.BULK_ENROLL_SUCCESS:
      {
        var results = action.payload.results;
        return state.filter(function (_, key) {
          return !results.get('successes').contains(String(key));
        });
      }

    case SequenceActionTypes.ENROLL_SUCCESS:
      return state.delete(action.payload.get('vid'));

    case SequenceActionTypes.UNENROLL_BATCH_SUCCESS_CRMOBJECTS:
      action.payload.forEach(function (enrollment) {
        state = state.delete(+getPropertyValue(enrollment, 'hs_contact_id'));
      });
      return state;

    case SequenceActionTypes.UNENROLL_BATCH_SUCCESS:
      action.payload.forEach(function (enrollment) {
        state = state.delete(enrollment.get('vid'));
      });
      return state;

    default:
      return state;
  }
});