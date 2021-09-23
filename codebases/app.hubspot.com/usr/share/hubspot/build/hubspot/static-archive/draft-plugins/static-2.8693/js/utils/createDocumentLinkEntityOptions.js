'use es6';

import { DOCUMENT_CONSTANTS } from '../lib/constants';
var DOCUMENTS_LINK_ENTITY_TYPE = DOCUMENT_CONSTANTS.DOCUMENTS_LINK_ENTITY_TYPE;
export default (function (_ref) {
  var id = _ref.id,
      skipForm = _ref.skipForm,
      _ref$customText = _ref.customText,
      customText = _ref$customText === void 0 ? true : _ref$customText;
  return [DOCUMENTS_LINK_ENTITY_TYPE, 'IMMUTABLE', {
    id: id,
    skipForm: skipForm,
    customText: customText
  }];
});