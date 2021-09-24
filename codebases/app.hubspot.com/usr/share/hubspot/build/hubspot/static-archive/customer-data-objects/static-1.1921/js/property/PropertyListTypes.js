'use es6';

export var COLUMN_SETTINGS = 'COLUMN_SETTINGS';
export var FAVORITE_PROPERTIES = 'FAVORITE_PROPERTIES';
export var CREATOR_PROPERTIES = 'CREATOR_PROPERTIES';
export var DEAL_STAGE_PROPERTIES = 'DEAL_STAGE_PROPERTIES';
export var TICKET_STAGE_PROPERTIES = 'TICKET_STAGE_PROPERTIES';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}