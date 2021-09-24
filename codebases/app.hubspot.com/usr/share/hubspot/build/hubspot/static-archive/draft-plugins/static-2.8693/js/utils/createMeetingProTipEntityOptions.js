'use es6';

import { MEETINGS_PRO_TIP_ENTITY_KEY } from '../lib/constants';
export default (function (phrase, offset, blockKey) {
  return [MEETINGS_PRO_TIP_ENTITY_KEY, 'MUTABLE', {
    phrase: phrase,
    offset: offset,
    blockKey: blockKey
  }];
});