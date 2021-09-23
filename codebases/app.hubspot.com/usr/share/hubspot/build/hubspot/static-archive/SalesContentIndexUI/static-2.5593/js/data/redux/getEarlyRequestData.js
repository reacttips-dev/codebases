/* eslint-disable no-undefined */
'use es6';

import quickFetch from 'quick-fetch';
import { fromJS } from 'immutable';
export default (function () {
  var earlyRequestState = quickFetch.getRequestStateByName('index-search');

  if (!earlyRequestState || earlyRequestState.errored || !earlyRequestState.finished) {
    return undefined;
  }

  return fromJS(earlyRequestState.result);
});