'use es6';

import { Record, Map as ImmutableMap, List } from 'immutable';
import * as StatusTypes from '../../StatusTypes';
export default Record({
  config: null,
  configured: null,
  status: StatusTypes.PENDING,
  currentPhase: null,
  data: null,
  promise: null,
  debug: ImmutableMap({
    exceptions: List(),
    phases: ImmutableMap()
  })
}, 'ResolveState');