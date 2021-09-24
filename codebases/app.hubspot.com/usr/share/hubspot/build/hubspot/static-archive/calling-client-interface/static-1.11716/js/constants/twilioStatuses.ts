// https://www.twilio.com/docs/voice/client/javascript/connection
export var TWILIO_PENDING = 'pending';
export var TWILIO_CONNECTING = 'connecting';
export var TWILIO_RINGING = 'ringing';
export var TWILIO_OPEN = 'open';
export var TWILIO_CLOSED = 'closed';
export var RINGING_STATUSES = [TWILIO_CONNECTING, TWILIO_RINGING];
export var IN_PROGRESS_STATUSES = [TWILIO_OPEN];
export var ENDING_STATUSES = [TWILIO_CLOSED];