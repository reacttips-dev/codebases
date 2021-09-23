'use es6';

var quickFetch = window.quickFetch;

if (!window.quickFetch) {
  console.warn('[quick-fetch] quickFetchScript was not included. Falling back to stubbed implementation.');
  quickFetch = {
    afterAuth: function afterAuth() {},
    clearAllRequests: function clearAllRequests() {},
    getApiUrl: function getApiUrl() {},
    getPortalId: function getPortalId() {},
    getRequestStateByName: function getRequestStateByName() {
      return null;
    },
    makeEarlyRequest: function makeEarlyRequest() {},
    makeLoginVerifyRequest: function makeLoginVerifyRequest() {},
    removeEarlyRequest: function removeEarlyRequest() {},
    getCookie: function getCookie() {
      return null;
    }
  };
}

export default quickFetch;