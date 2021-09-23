import { Record } from 'immutable';
var defaults = {
  tokenType: undefined,
  token: undefined,
  accountSid: undefined,
  accountType: undefined,
  capabilityToken: undefined,
  timestamp: undefined
};
var Token = Record(defaults, 'Token');
export default Token;