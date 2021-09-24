'use es6';

import { LINK_ENTITY_TYPE } from 'draft-plugins/lib/constants';
export default (function (url, isTargetBlank, isNoFollow) {
  return [LINK_ENTITY_TYPE, 'MUTABLE', {
    url: url,
    isNoFollow: isNoFollow,
    isTargetBlank: isTargetBlank
  }];
});