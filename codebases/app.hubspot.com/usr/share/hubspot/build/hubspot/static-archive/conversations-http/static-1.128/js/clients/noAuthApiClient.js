'use es6';

import { createStack } from 'hub-http';
import promiseClient from 'hub-http/adapters/promiseClient';
import noAuthWithCredentialsHubapi from 'hub-http/stacks/noAuthWithCredentialsHubapi';
import { checkNetworkOnTimeout } from '../middlewares/checkNetworkOnTimeout';
var stack = createStack(noAuthWithCredentialsHubapi, checkNetworkOnTimeout());
var noAuthApiClient = promiseClient(stack);
export default noAuthApiClient;