'use es6';

import invariant from 'react-utils/invariant';
import ThreadHistory from '../records/ThreadHistory';
export var threadHistoryInvariant = function threadHistoryInvariant(threadHistory) {
  return invariant(threadHistory instanceof ThreadHistory, 'Expected threadHistory to be a `ThreadHistory` not a `%s`', typeof threadHistory);
};