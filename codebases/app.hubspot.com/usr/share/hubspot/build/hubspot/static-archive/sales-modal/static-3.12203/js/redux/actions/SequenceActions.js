'use es6';

import Raven from 'Raven';
import partial from 'transmute/partial';
import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import * as SequencesApi from 'sales-modal/api/SequencesApi';
import { SEQUENCE_FETCH_STARTED, SEQUENCE_FETCH_SUCCEEDED, SEQUENCE_FETCH_FAILED } from '../actionTypes';
export var fetchSequenceStarted = partial(simpleAction, SEQUENCE_FETCH_STARTED);
export var fetchSequenceSucceeded = partial(simpleAction, SEQUENCE_FETCH_SUCCEEDED);
export var fetchSequenceFailed = partial(simpleAction, SEQUENCE_FETCH_FAILED);
export var fetchSequence = function fetchSequence(id) {
  return function (dispatch) {
    dispatch(fetchSequenceStarted());
    SequencesApi.fetchById(id).then(function (payload) {
      return dispatch(fetchSequenceSucceeded({
        sequence: payload
      }));
    }, function (err) {
      dispatch(fetchSequenceFailed());
      Raven.captureMessage('[sales-modal] Failed to fetch sequence by id', {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText
        }
      });
    });
  };
};