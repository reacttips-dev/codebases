'use es6';

export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      fromAddress = _ref.fromAddress,
      inboxAddress = _ref.inboxAddress;

  if (fromAddress === null) {
    return sequenceEnrollment;
  }

  return sequenceEnrollment.withMutations(function (_sequenceEnrollment) {
    return _sequenceEnrollment.set('fromAddress', fromAddress).set('inboxAddress', inboxAddress);
  });
}