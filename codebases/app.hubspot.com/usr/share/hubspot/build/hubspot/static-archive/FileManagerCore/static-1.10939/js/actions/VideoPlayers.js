'use es6';

import * as VideoPlayersApi from '../api/VideoPlayers';
import { FETCH_EMBED_CODE_ATTEMPTED, FETCH_EMBED_CODE_FAILED, FETCH_EMBED_CODE_SUCCCEEDED, FETCH_USER_ACCESS_TO_EXTERNAL_EMBEDS_STATE_ATTEMPTED, FETCH_USER_ACCESS_TO_EXTERNAL_EMBEDS_STATE_SUCCEEDED } from './ActionTypes';
import { getScriptaAndEmbedCode } from '../utils/network';
import { FetchEmbedCodeFailedNotification } from '../utils/notifications';
var fetchEmbedCodeAttemptedAction = {
  type: FETCH_EMBED_CODE_ATTEMPTED
};
var fetchEmbedCodeFailedAction = {
  type: FETCH_EMBED_CODE_FAILED,
  meta: {
    notification: FetchEmbedCodeFailedNotification
  }
};

function getFetchEmbedCodeSucceeded(script, embedCode) {
  return {
    type: FETCH_EMBED_CODE_SUCCCEEDED,
    script: script,
    embedCode: embedCode
  };
}

export function fetchEmbedCode(playerId, provider, playerAttributes) {
  return function (dispatch) {
    dispatch(fetchEmbedCodeAttemptedAction);
    VideoPlayersApi.fetchEmbedCode(playerId, provider, playerAttributes).then(function (response) {
      var _getScriptaAndEmbedCo = getScriptaAndEmbedCode(response),
          script = _getScriptaAndEmbedCo.script,
          embedCode = _getScriptaAndEmbedCo.embedCode;

      dispatch(getFetchEmbedCodeSucceeded(script, embedCode));
    }, function () {
      dispatch(fetchEmbedCodeFailedAction);
    }).done();
  };
}
export function fetchUserAccessToPaidVidyardAccountState() {
  return function (dispatch) {
    dispatch({
      type: FETCH_USER_ACCESS_TO_EXTERNAL_EMBEDS_STATE_ATTEMPTED
    });
    VideoPlayersApi.fetchUserAccessToPaidVidyardAccountState().then(function () {
      dispatch({
        type: FETCH_USER_ACCESS_TO_EXTERNAL_EMBEDS_STATE_SUCCEEDED
      });
    }, function () {// no need to handle error here
    }).done();
  };
}