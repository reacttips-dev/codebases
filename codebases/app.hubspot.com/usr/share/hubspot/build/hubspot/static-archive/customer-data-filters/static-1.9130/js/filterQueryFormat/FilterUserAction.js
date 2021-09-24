'use es6';

import { Record } from 'immutable';
import { USED_XOFILTEREDITOR } from './UsageActionTypes';
export default Record({
  action: USED_XOFILTEREDITOR,
  condition: undefined,
  filterFamily: undefined,
  refinement: undefined,
  panelKey: '',
  subAction: ''
}, 'FilterUserAction');