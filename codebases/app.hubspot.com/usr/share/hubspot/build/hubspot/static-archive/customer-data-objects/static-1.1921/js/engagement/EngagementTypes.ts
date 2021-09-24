export var EMAIL = 'EMAIL';
export var EMAIL_ACTIVITY = 'EMAIL_ACTIVITY';
export var TASK = 'TASK';
export var MEETING = 'MEETING';
export var CALL = 'CALL';
export var NOTE = 'NOTE';
export var INCOMING_EMAIL = 'INCOMING_EMAIL';
export var FORWARDED_EMAIL = 'FORWARDED_EMAIL';
export var FEEDBACK_SUBMISSION = 'FEEDBACK_SUBMISSION';
export var CONVERSATION_SESSION = 'CONVERSATION_SESSION';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking
// @ts-expect-error module/module.exports aren't currently supported

if (!!module && !!module.exports) {
  // @ts-expect-error module/module.exports aren't currently supported
  module.exports.default = Object.assign({}, module.exports);
}