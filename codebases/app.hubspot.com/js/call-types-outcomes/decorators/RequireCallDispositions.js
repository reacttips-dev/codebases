'use es6';

import fetchAsyncDataHOC from '../../async-data-fetcher/fetchAsyncDataHOC';
import { withRequire } from '../../async-data-fetcher/withRequire';
import { getCallDispositions as requestor } from '../actions/callDispositionsActions';
import { getCallDispositionsAsyncDataFromState as selector } from '../selectors/getCallDispositions';
var RequireCallDispositions = fetchAsyncDataHOC({
  name: 'RequireCallDispositions',
  requestor: requestor,
  selector: selector,
  shouldAutoRetry: true
});
export var withCallDispositions = withRequire(RequireCallDispositions);