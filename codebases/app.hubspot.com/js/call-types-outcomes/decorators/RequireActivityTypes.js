'use es6';

import fetchAsyncDataHOC from '../../async-data-fetcher/fetchAsyncDataHOC';
import { withRequire } from '../../async-data-fetcher/withRequire';
import { getActivityTypes as requestor } from '../actions/activityTypesActions';
import { getActivityTypesAsyncDataFromState as selector } from '../selectors/getActivityTypes';
var RequireActivityTypes = fetchAsyncDataHOC({
  name: 'RequireActivityTypes',
  requestor: requestor,
  selector: selector,
  shouldAutoRetry: true
});
export var withActivityTypes = withRequire(RequireActivityTypes);