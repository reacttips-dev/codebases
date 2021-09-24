'use es6';

import once from 'hs-lodash/once';
import { ActionTypes } from './ActionDefinitions';
/*****************************************************************
 * Constants for panel UI
 ****************************************************************/

export var getActionTypes = once(function () {
  return [{
    value: ActionTypes.UNENROLL_FROM_SEQUENCE,
    iconName: 'sequences',
    titleMessage: 'sequencesAutomation.action.unenroll.buttonLabel',
    'data-test-id': 'action-type-unenroll'
  }, {
    value: ActionTypes.ENROLL_IN_SEQUENCE,
    iconName: 'sequences',
    titleMessage: 'sequencesAutomation.action.enroll.buttonLabel',
    'data-test-id': 'action-type-enroll'
  }];
});