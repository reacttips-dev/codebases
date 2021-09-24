'use es6';

import { EntityTypes } from '../lib/mergeTagConstants';
export default (function (data) {
  return [EntityTypes.MERGE_TAG, 'IMMUTABLE', data];
});