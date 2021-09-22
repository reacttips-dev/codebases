/**
 * Constants relevant to enrollment
 */

import keysToConstants from 'js/lib/keysToConstants';

const modeKeys = [
  'EXPLICIT', // learner is enrolled after they click Join Course
  'UPSELL', // learner is prompted to join the specialization
  'PRE_ENROLLED', // learner is pre enrolled in a course that has not yet launched
  'ENROLLED', // learner is already enrolled
];

const modes = keysToConstants(modeKeys);

const exported = {
  modeKeys,
  modes,
};

export default exported;
export { modeKeys, modes };
