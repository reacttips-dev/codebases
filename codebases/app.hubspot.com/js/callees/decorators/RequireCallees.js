'use es6';

import fetchAsyncDataHOC from '../../async-data-fetcher/fetchAsyncDataHOC';
import { withRequire } from '../../async-data-fetcher/withRequire';
import { fetchCallees } from '../actions/calleesActions';
import { getCalleesFromState } from '../selectors/calleesSelectors';
var RequireCallees = fetchAsyncDataHOC({
  name: 'RequireCallee',
  requestor: fetchCallees,
  selector: getCalleesFromState,
  resolveRequestParams: function resolveRequestParams(props) {
    var subjectId = props.subjectId,
        objectTypeId = props.objectTypeId;
    return {
      objectTypeId: objectTypeId,
      objectId: subjectId
    };
  },
  shouldAutoRetry: true
});
export var withCallees = withRequire(RequireCallees);