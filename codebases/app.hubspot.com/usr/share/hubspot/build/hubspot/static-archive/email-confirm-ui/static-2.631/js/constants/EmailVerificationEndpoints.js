'use es6';

export var getEmailVerificationEndpoint = function getEmailVerificationEndpoint(userId) {
  return "users/v1/users/" + userId + "/verifications";
};