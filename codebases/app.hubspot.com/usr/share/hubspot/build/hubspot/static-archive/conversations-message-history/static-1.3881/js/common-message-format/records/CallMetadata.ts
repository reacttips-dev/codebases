import { Record } from 'immutable';
import { CALL_METADATA } from '../constants/attachmentTypes';
var CallMetadata = Record({
  '@type': CALL_METADATA,
  callId: 0,
  callDurationMs: 0,
  fromNumber: '',
  fromNumberExt: '',
  toNumber: '',
  toNumberExt: '',
  calleeCrmObjectId: 0,
  calleeCrmObjectTypeId: ''
}, 'CallMetadata');
export default CallMetadata;