'use es6';

import Immutable from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var URI = 'filemanager/api/v3/players';
export function createPlayerForVideo(fileId) {
  var http = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : apiClient;
  return http.post(URI, {
    data: {
      file_id: fileId,
      try_reuse: true
    }
  }).then(Immutable.fromJS);
}
export function fetchVideoFileByPlayerId(playerId) {
  var http = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : apiClient;
  return http.get(URI + "/" + playerId + "/videos/file-metadata").then(Immutable.fromJS);
}
export function softDeleteHubLVideoPlayer(playerId) {
  var http = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : apiClient;
  return http.delete(URI + "/" + playerId);
}
export function fetchEmbedCode(playerId, provider) {
  var playerAttributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var http = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : apiClient;
  return http.post(URI + "/" + playerId + "/embed-codes", {
    data: {
      player_id: playerId,
      provider: provider,
      usage: 'EXTERNAL_EMBEDDED',
      player_attributes: playerAttributes
    }
  }).then(Immutable.fromJS);
}
export function fetchUserAccessToPaidVidyardAccountState() {
  var http = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : apiClient;
  return http.get(URI + "/external-embed-access").then(Immutable.fromJS);
}