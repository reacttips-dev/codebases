'use es6';

import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import threadSubject from 'sales-modal/redux/utils/threadSubject';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      step = _ref.step,
      metadata = _ref.metadata,
      isSubjectChange = _ref.isSubjectChange;
  var stepOrder = step.get('stepOrder');
  var metaType = step.get('action') === SEND_TEMPLATE ? 'templateMeta' : 'taskMeta';
  var metadataPath = ['steps', stepOrder, 'actionMeta', metaType];
  var sequenceEnrollmentWithUpdatedMetadata = sequenceEnrollment.setIn(metadataPath, metadata);
  return isSubjectChange ? threadSubject({
    sequenceEnrollment: sequenceEnrollmentWithUpdatedMetadata
  }) : sequenceEnrollmentWithUpdatedMetadata;
}