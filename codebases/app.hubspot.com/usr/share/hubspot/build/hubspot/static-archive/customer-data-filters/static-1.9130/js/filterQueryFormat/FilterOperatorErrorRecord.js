'use es6';

import { Record } from 'immutable';
export default Record({
  error: false,
  message: '',
  opts: {
    isRefinement: false,
    preventDefault: false
  }
}, 'FilterOperatorErrorRecord');