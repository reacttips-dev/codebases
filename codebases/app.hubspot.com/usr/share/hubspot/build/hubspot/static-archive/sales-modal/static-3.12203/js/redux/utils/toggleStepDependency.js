'use es6';

import { List } from 'immutable';
import SequenceStepDependencyRecord from 'sales-modal/data/SequenceStepDependencyRecord';
export default (function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      requiredByStepOrder = _ref.requiredByStepOrder,
      reliesOnStepOrder = _ref.reliesOnStepOrder,
      dependencyType = _ref.dependencyType;
  return sequenceEnrollment.updateIn(['steps', requiredByStepOrder, 'dependencies'], function (dependencies) {
    return dependencies.isEmpty() ? List([SequenceStepDependencyRecord({
      portalId: sequenceEnrollment.get('portalId'),
      requiredByStepOrder: requiredByStepOrder,
      reliesOnStepOrder: reliesOnStepOrder,
      dependencyType: dependencyType,
      sequenceId: sequenceEnrollment.get('id')
    })]) : List();
  });
});