'use es6';

export var ALIAS = 'ALIAS';
export var FACSIMILE_INBOX = 'FACSIMILE_INBOX';
export var CRM_EMAIL_INTEGRATION = 'CRM_EMAIL_INTEGRATION';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}