'use es6';

import invariant from 'react-utils/invariant';
import { AssignmentPanelInstance } from './panels/AssignmentPanel';
export default {
  openAssignmentPanel: function openAssignmentPanel(_ref) {
    var objectId = _ref.objectId,
        objectType = _ref.objectType,
        ownerId = _ref.ownerId;
    invariant(AssignmentPanelInstance, '<AssignmentPanel /> was not rendered before calling `openAssignmentPanel`');
    AssignmentPanelInstance.open({
      objectId: objectId,
      objectType: objectType,
      ownerId: ownerId
    });
  }
};