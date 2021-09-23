'use es6';

import { MEETINGS_LINK_ENTITY_TYPE } from '../lib/constants';
export default (function (type) {
  var customText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var linkURL = arguments.length > 2 ? arguments[2] : undefined;
  return [MEETINGS_LINK_ENTITY_TYPE, 'IMMUTABLE', {
    type: type,
    customText: customText,
    linkURL: linkURL
  }];
});