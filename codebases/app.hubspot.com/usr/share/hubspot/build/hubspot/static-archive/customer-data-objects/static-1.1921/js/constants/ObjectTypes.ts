export var COMPANY = 'COMPANY';
export var CONTACT = 'CONTACT';
export var CONVERSATION = 'CONVERSATION';
export var DEAL = 'DEAL';
export var ENGAGEMENT = 'ENGAGEMENT';
export var FEEDBACK_SUBMISSION = 'FEEDBACK_SUBMISSION';
export var FORM = 'FORM';
export var LINE_ITEM = 'LINE_ITEM';
export var OBJECT_LIST = 'OBJECT_LIST';
export var PRODUCT = 'PRODUCT';
export var QUOTE = 'QUOTE';
export var QUOTE_MODULE = 'QUOTE_MODULE';
export var QUOTE_MODULE_FIELD = 'QUOTE_MODULE_FIELD';
export var QUOTE_TEMPLATE = 'QUOTE_TEMPLATE';
export var SEQUENCE_ENROLLMENT = 'SEQUENCE_ENROLLMENT';
export var TASK = 'TASK';
export var TICKET = 'TICKET';
export var VISIT = 'VISIT';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking
// @ts-expect-error module/module.exports aren't currently supported

if (!!module && !!module.exports) {
  // @ts-expect-error module/module.exports aren't currently supported
  module.exports.default = module.exports;
}