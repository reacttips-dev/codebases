'use es6';

import fetchAsyncDataHOC from '../../async-data-fetcher/fetchAsyncDataHOC';
import { withRequire } from '../../async-data-fetcher/withRequire';
import { getTaskAssociationDefinitions as requestor } from '../actions/taskAssociationDefinitionsActions';
import { getTaskAssociationDefinitionsAsyncDataFromState as selector } from '../selectors/getTaskAssociationDefinitions';
var RequireTaskAssociationDefinitions = fetchAsyncDataHOC({
  name: 'RequireTaskAssociationDefinitions',
  requestor: requestor,
  selector: selector,
  shouldAutoRetry: true
});
export var withTaskAssociationDefinitions = withRequire(RequireTaskAssociationDefinitions);