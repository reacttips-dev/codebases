'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { createFinishNode } from './libraryUtils';
export default (function () {
  return ImmutableMap({
    delays: List([0]),
    steps: List([createFinishNode()])
  });
});