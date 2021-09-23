// @ts-expect-error dependency missing types
import { createStack } from 'hub-http';
import promiseClient from 'hub-http/adapters/promiseClient'; // @ts-expect-error dependency missing types

import { retry } from 'hub-http/middlewares/core'; // @ts-expect-error dependency missing types

import hubapiStack from 'hub-http/stacks/hubapi';
var SUCCESS_NO_CONTENT_STATUS_CODE = 204;
var retryMiddleware = retry( // @ts-expect-error dependency missing types
function (_ref) {
  var status = _ref.status;
  return status !== SUCCESS_NO_CONTENT_STATUS_CODE;
}, {
  delay: 1000,
  maxRetries: 5
}); // @ts-expect-error dependency missing types

export default promiseClient(createStack(hubapiStack, retryMiddleware));