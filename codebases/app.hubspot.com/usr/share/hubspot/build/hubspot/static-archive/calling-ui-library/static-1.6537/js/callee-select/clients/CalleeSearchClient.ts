import http from 'hub-http/clients/apiClient';
export var fetchCalleeSearchResults = function fetchCalleeSearchResults(_ref) {
  var objectTypeId = _ref.objectTypeId,
      objectId = _ref.objectId,
      searchText = _ref.searchText,
      timestamp = _ref.timestamp;
  return http.get("twilio/v1/callee-search/" + objectTypeId + "/" + objectId + "/", {
    query: {
      query: searchText,
      clienttimeout: 14000,
      maxResults: 50
    }
  }).then(function (response) {
    return {
      response: response,
      timestamp: timestamp,
      searchText: searchText
    };
  }).catch(function (error) {
    return {
      error: error,
      timestamp: timestamp,
      searchText: searchText
    };
  });
};