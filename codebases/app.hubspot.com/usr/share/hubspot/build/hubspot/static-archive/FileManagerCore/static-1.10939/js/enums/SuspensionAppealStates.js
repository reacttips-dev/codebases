'use es6'; // mirror https://git.hubteam.com/HubSpot/Vetting/blob/master/VettingCore/src/main/java/com/hubspot/vetting/core/models/accountverification/AccountVerificationState.java

var UNINITIATED = 'UNINITIATED';
var PENDING = 'PENDING';
var ACCEPTED = 'ACCEPTED';
var ACCEPTED_WITHOUT_EMAIL = 'ACCEPTED_WITHOUT_EMAIL';
var REJECTED = 'REJECTED';
export default {
  UNINITIATED: UNINITIATED,
  PENDING: PENDING,
  ACCEPTED: ACCEPTED,
  ACCEPTED_WITHOUT_EMAIL: ACCEPTED_WITHOUT_EMAIL,
  REJECTED: REJECTED
};