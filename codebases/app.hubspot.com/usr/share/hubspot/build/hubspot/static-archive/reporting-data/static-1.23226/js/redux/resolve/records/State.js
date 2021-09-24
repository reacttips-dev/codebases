'use es6';

import { Record, Map as ImmutableMap } from 'immutable';
/**
 * {
 *   configs: Map<Config, number>,
 *   resolving: Map<number, ResolveState>
 * }
 */

export default Record({
  runId: null,
  configs: ImmutableMap(),
  resolving: ImmutableMap()
});