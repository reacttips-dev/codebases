import { Record } from 'immutable';
var Status = Record({
  source: null,
  messageStatus: null,
  timestamp: null,
  sendFailure: null
}, 'Status');
export default Status;