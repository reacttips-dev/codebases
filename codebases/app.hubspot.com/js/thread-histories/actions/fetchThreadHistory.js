'use es6';

import getIn from 'transmute/getIn';
import { createDeprecatedAsyncAction } from 'conversations-async-data/async-action/createDeprecatedAsyncAction';
import { prepareThreadHistoryResponse } from '../operators/prepareThreadHistoryResponse';
import { fetchThreadHistoryClient } from '../clients/fetchThreadHistoryClient';
import { FETCH_THREAD_HISTORY } from '../constants/ActionTypes';
import { getSenderPairs } from '../operators/getSenderPairs';
import { fetchAgentResponderIfNecessary } from '../../actions/AgentResponderActions';
export var asyncFetchThreadHistory = createDeprecatedAsyncAction({
  requestFn: fetchThreadHistoryClient,
  actionTypes: FETCH_THREAD_HISTORY,
  toRecordFn: prepareThreadHistoryResponse
});
export function fetchThreadHistory(_ref) {
  var offsetOrdinal = _ref.offsetOrdinal,
      offsetTimestamp = _ref.offsetTimestamp,
      threadId = _ref.threadId,
      sessionId = _ref.sessionId;
  return function (dispatch) {
    dispatch(asyncFetchThreadHistory({
      offsetOrdinal: offsetOrdinal,
      offsetTimestamp: offsetTimestamp,
      threadId: threadId,
      sessionId: sessionId
    })).then(function (_ref2) {
      var payload = _ref2.payload;
      var threadHistory = getIn(['data', 'threadHistory'], payload);
      var responders = getSenderPairs(threadHistory);
      responders.forEach(function (senderPair) {
        var senderId = getIn(['senderId'], senderPair);
        var senderType = getIn(['senderType'], senderPair);
        dispatch(fetchAgentResponderIfNecessary({
          senderId: senderId,
          senderType: senderType
        }));
      });
    });
  };
}