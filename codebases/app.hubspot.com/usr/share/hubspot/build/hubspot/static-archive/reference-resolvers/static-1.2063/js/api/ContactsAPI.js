'use es6';

import http from 'hub-http/clients/apiClient';
import formatContactsByEmail from 'reference-resolvers/formatters/formatContactsByEmail';
var BASE_URI = 'contacts/v1/contact';
export var createFetchContactByEmailAddress = function createFetchContactByEmailAddress(_ref) {
  var httpClient = _ref.httpClient;
  return function (emailAddresses) {
    return Promise.all(emailAddresses.map(function (emailAddress) {
      return httpClient.get(BASE_URI + "/email/" + encodeURIComponent(emailAddress) + "/profile").then(function (contact) {
        return {
          emailAddress: emailAddress,
          contact: contact
        };
      }, function (error) {
        return {
          emailAddress: emailAddress,
          error: error
        };
      });
    })).then(formatContactsByEmail);
  };
};
export var fetchContactByEmailAddress = createFetchContactByEmailAddress({
  httpClient: http
});