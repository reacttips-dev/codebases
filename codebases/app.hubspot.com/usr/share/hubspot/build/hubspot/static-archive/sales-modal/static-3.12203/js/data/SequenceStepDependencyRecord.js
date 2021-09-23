'use es6';

import { Record } from 'immutable';
var SequenceStepDependencyRecord = Record({
  portalId: null,
  requiredByStepOrder: null,
  reliesOnStepOrder: null,
  dependencyType: null,
  sequenceId: null
}, 'SequenceStepDependencyRecord');
export default SequenceStepDependencyRecord;