'use es6';

import { createStack } from 'hub-http';
import promiseClient from 'hub-http/adapters/promiseClient';
import { retry } from 'hub-http/middlewares/core';
import hubapiStack from 'hub-http/stacks/hubapi';
var RETRY_DELAY = 3000;
var RETRY_TIMES = 5;
var retryMiddleware = retry(function (_ref) {
  var status = _ref.status;
  return status !== 200;
}, {
  delay: RETRY_DELAY,
  maxRetries: RETRY_TIMES
});
export default promiseClient(createStack(hubapiStack, retryMiddleware));