'use es6';

export var selectSequenceActiveContacts = function selectSequenceActiveContacts(state) {
  return state.sequenceActiveContacts;
};
export var selectSequencePausedContacts = function selectSequencePausedContacts(state) {
  return state.sequencePausedContacts;
};
export var selectSequenceUserEnrollmentTotals = function selectSequenceUserEnrollmentTotals(state) {
  return state.sequenceUserEnrollmentTotals;
};
export var selectSequenceActiveContactsById = function selectSequenceActiveContactsById(sequenceId) {
  return function (state) {
    var contacts = selectSequenceActiveContacts(state);
    return contacts && contacts[sequenceId];
  };
};
export var selectSequencePausedContactsById = function selectSequencePausedContactsById(sequenceId) {
  return function (state) {
    var contacts = selectSequencePausedContacts(state);
    return contacts && contacts[sequenceId];
  };
};
export var selectAllSequenceActiveContacts = function selectAllSequenceActiveContacts(state) {
  var contacts = selectSequenceUserEnrollmentTotals(state);
  return contacts && contacts['active'];
};
export var selectAllSequencePausedContacts = function selectAllSequencePausedContacts(state) {
  var contacts = selectSequenceUserEnrollmentTotals(state);
  return contacts && contacts['paused'];
};