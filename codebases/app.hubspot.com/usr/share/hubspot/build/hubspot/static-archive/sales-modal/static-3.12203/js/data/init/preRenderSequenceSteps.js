'use es6';

import { createRenderedSequence, createRenderedEditedSequence } from 'sales-modal/utils/enrollModal/createRenderedSequence';
import _getFormattedSignature from './_getFormattedSignature';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      signature = _ref.signature,
      unsubscribeLink = _ref.unsubscribeLink,
      unsubscribeLinkType = _ref.unsubscribeLinkType,
      renderedTemplates = _ref.renderedTemplates,
      hasEnrolledSequence = _ref.hasEnrolledSequence,
      gates = _ref.gates,
      scopes = _ref.scopes,
      isPrimarySequence = _ref.isPrimarySequence,
      enrollType = _ref.enrollType;

  if (hasEnrolledSequence) {
    return createRenderedEditedSequence({
      sequenceEnrollment: sequenceEnrollment,
      gates: gates,
      scopes: scopes,
      enrollType: enrollType
    });
  }

  return createRenderedSequence({
    signature: _getFormattedSignature(signature),
    unsubscribeLink: unsubscribeLink,
    unsubscribeLinkType: unsubscribeLinkType,
    renderedTemplates: renderedTemplates,
    sequence: sequenceEnrollment,
    gates: gates,
    scopes: scopes,
    isPrimarySequence: isPrimarySequence,
    enrollType: enrollType
  });
}