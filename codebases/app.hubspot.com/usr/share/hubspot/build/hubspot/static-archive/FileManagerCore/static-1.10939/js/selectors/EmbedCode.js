'use es6';

export var getFetchEmbedCodeRequestStatus = function getFetchEmbedCodeRequestStatus(state) {
  return state.embedCode.get('fetchEmbedCodeRequestStatus');
};
export var getScript = function getScript(state) {
  return state.embedCode.get('script');
};
export var getEmbedCode = function getEmbedCode(state) {
  return state.embedCode.get('embedCode');
};
export var getUserHasAccessToPaidVidyardAccount = function getUserHasAccessToPaidVidyardAccount(state) {
  return state.embedCode.get('userHasAccessToPaidVidyardAccount');
};
export var getFetchUserAccessToPaidVidyardAccountRequestStatus = function getFetchUserAccessToPaidVidyardAccountRequestStatus(state) {
  return state.embedCode.get('fetchUserAccessToPaidVidyardAccountRequestStatus');
};