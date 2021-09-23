'use es6';

import { HAS_MISSING_MERGE_TAGS, HAS_SEND_LIMIT_ERRORS, HAS_PRIVATE_TEMPLATE, HAS_NO_TIME_SLOTS } from 'sales-modal/constants/StepErrorTypes';
export var getEnrollButtonError = function getEnrollButtonError(erroringSteps) {
  var enrollErrors = erroringSteps.flatten().toList();

  if (enrollErrors.contains(HAS_PRIVATE_TEMPLATE)) {
    return 'privateTemplate';
  }

  if (enrollErrors.size > 1) {
    return 'other';
  }

  if (enrollErrors.contains(HAS_MISSING_MERGE_TAGS)) {
    return 'mergeTags';
  }

  if (enrollErrors.contains(HAS_SEND_LIMIT_ERRORS) || enrollErrors.contains(HAS_NO_TIME_SLOTS)) {
    return 'sendLimit_jsx';
  }

  return 'other';
};