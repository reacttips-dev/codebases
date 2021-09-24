'use es6';

import Immutable from 'immutable';
import { FETCH_EMBED_CODE_ATTEMPTED, FETCH_EMBED_CODE_FAILED, FETCH_EMBED_CODE_SUCCCEEDED, FETCH_USER_ACCESS_TO_EXTERNAL_EMBEDS_STATE_ATTEMPTED, FETCH_USER_ACCESS_TO_EXTERNAL_EMBEDS_STATE_SUCCEEDED } from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
var DEFAULT_STATE = Immutable.Map({
  fetchEmbedCodeRequestStatus: RequestStatus.UNINITIALIZED,
  fetchUserAccessToPaidVidyardAccountRequestStatus: RequestStatus.UNINITIALIZED,
  script: '',
  embedCode: '',
  userHasAccessToPaidVidyardAccount: false
});
export default function EmbedCode() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      script = action.script,
      embedCode = action.embedCode;

  switch (type) {
    case FETCH_EMBED_CODE_ATTEMPTED:
      return state.set('fetchEmbedCodeRequestStatus', RequestStatus.PENDING);

    case FETCH_EMBED_CODE_FAILED:
      return state.set('fetchEmbedCodeRequestStatus', RequestStatus.FAILED);

    case FETCH_EMBED_CODE_SUCCCEEDED:
      return state.merge({
        fetchEmbedCodeRequestStatus: RequestStatus.SUCCEEDED,
        script: script,
        embedCode: embedCode
      });

    case FETCH_USER_ACCESS_TO_EXTERNAL_EMBEDS_STATE_SUCCEEDED:
      return state.merge({
        userHasAccessToPaidVidyardAccount: true,
        fetchUserAccessToPaidVidyardAccountRequestStatus: RequestStatus.SUCCEEDED
      });

    case FETCH_USER_ACCESS_TO_EXTERNAL_EMBEDS_STATE_ATTEMPTED:
      return state.merge({
        fetchUserAccessToPaidVidyardAccountRequestStatus: RequestStatus.PENDING
      });

    default:
      return state;
  }
}