import { Record } from 'immutable';
var defaults = {
  causes: null,
  code: null,
  description: null,
  message: null,
  name: null,
  originalError: null,
  solutions: null
};
// https://twilio.github.io/twilio-client.js/interfaces/voice.twilioerror.html
export default Record(defaults, 'DeviceError');