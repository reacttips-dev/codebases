'use es6';

import get from 'transmute/get';
import getIn from 'transmute/getIn';
export var getAppIdentifier = get('appIdentifier');
export var getClientStatus = get('clientStatus');
export var getSelectedCallMethod = get('selectedCallMethod');
export var getSelectedFromNumber = get('selectedFromNumber');
export var getSelectedConnectFromNumber = get('selectedConnectFromNumber');
export var getOwnerId = get('ownerId');
export var getShouldAutoStartCall = get('shouldAutoStartCall');
export var getIsCallActive = get('isCallActive');
export var getToNumberIdentifier = get('toNumberIdentifier');
export var getCallEndStatus = get('callEndStatus');
export var getIsQueueTask = get('isQueueTask');
export var getSubject = get('subject');
export var getSubjectId = getIn(['subject', 'subjectId']);
export var getObjectTypeId = getIn(['subject', 'objectTypeId']);
export var getThreadId = get('threadId');