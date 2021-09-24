'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { createAction } from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import Responder from 'conversations-internal-schema/responders/records/Responder';
import { loadExistingThread } from '../../navigation/actions/loadExistingThread';
import { loadStagedThread } from '../../navigation/actions/loadStagedThread';
import { getMostRecentOpenThread } from '../../threads/selectors/getMostRecentOpenThread';
import { fetchVisitorThreads as fetchVisitorThreadsClient } from '../../threads/clients/fetchVisitorThreads';
import { buildThread } from '../factories/buildThread';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
var getVisitorThreadsStarted = createAction(ActionTypes.GET_VISITOR_THREADS_STARTED);
export var getVisitorThreadsSuccess = createAction(ActionTypes.GET_VISITOR_THREADS_SUCCESS, function (_ref) {
  var threads = _ref.threads;
  var threadMap = threads.map(function (thread) {
    var responderRaw = thread.responder,
        threadId = thread.threadId,
        threadPreview = thread.threadPreview,
        channelDetails = thread.channelDetails,
        others = _objectWithoutProperties(thread, ["responder", "threadId", "threadPreview", "channelDetails"]);

    var responder = responderRaw ? Responder(responderRaw) : null;
    return buildThread(Object.assign({
      responder: responder,
      threadId: threadId,
      threadPreview: threadPreview,
      channelDetails: channelDetails
    }, others));
  });
  return {
    threads: threadMap
  };
});
export var getVisitorThreadsFailure = createAction(ActionTypes.GET_VISITOR_THREADS_FAILURE, function (err) {
  return err;
});
export function fetchVisitorThreads() {
  return function (dispatch, getState) {
    dispatch(getVisitorThreadsStarted());
    var sessionId = getSessionId(getState());
    var promise = fetchVisitorThreadsClient({
      sessionId: sessionId
    }).then(function (threads) {
      dispatch(getVisitorThreadsSuccess({
        threads: threads
      }));
    }).catch(function (err) {
      dispatch(getVisitorThreadsFailure(err));
    });
    promise.done();
    return promise;
  };
}
export function navigateToMostRecentThread() {
  return function (dispatch, getState) {
    var recentThread = getMostRecentOpenThread(getState());

    if (recentThread) {
      var threadId = recentThread.threadId,
          channel = recentThread.channel;
      dispatch(loadExistingThread({
        threadId: threadId,
        channel: channel
      }));
    } else {
      dispatch(loadStagedThread());
    }
  };
}