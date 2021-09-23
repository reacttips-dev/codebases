'use es6';

import http from 'hub-http/clients/apiClient';
import formatValidateEmail from 'reference-resolvers/formatters/formatEmailValidation';
import { List } from 'immutable'; // CONTACT is hard-coded in the URL because only contacts currently have
// email properties. This may need to be updated in future usage.

var URL = "inbounddb-objects/v1/property-validation/CONTACT/extended";
export var createValidateEmail = function createValidateEmail(_ref) {
  var httpClient = _ref.httpClient;
  return function (props) {
    // API does not know how to handle multiple incoming properties of the same type
    // This code assumes that debouncing done in input will result in only one email
    var emailProperty = {
      value: props[0],
      name: 'email'
    };
    return httpClient.post(URL, {
      data: [emailProperty]
    }).then(function (response) {
      return List([formatValidateEmail(props[0], response[0])]);
    });
  };
};
export var getValidateEmail = createValidateEmail({
  httpClient: http
});