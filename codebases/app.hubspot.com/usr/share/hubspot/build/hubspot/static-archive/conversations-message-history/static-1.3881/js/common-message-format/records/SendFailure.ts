import { Record } from 'immutable';
var SendFailure = Record({
  localizedErrorKey: null,
  errorMessage: null,
  errorMessageTokens: null,
  retryable: false
}, 'SendFailure');
export default SendFailure;