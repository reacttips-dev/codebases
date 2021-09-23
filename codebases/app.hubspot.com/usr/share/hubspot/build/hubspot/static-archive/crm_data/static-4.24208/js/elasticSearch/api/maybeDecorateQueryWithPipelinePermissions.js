'use es6';

import { DEAL_TYPE_ID, ObjectTypesToIds, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { HIDDEN } from '../../pipelinePermissions/pipelinePermissionsConstants';
import { List } from 'immutable';
import { isLoading } from '../../flux/LoadingStatus';
import { pipelinePermissionsDep } from '../../pipelinePermissions/pipelinePermissionsDep';
export var getPipelinePermissionsFilter = function getPipelinePermissionsFilter(objectTypeId) {
  // HACK: For the query decoration to work, we must wait on the pipeline permissions fetch
  // for deals or the pipelines fetch for tickets at the app root. Otherwise we'll just bail out.
  var permissions = pipelinePermissionsDep.deref({
    objectTypeId: objectTypeId
  }); // If PLP isn't fetched (or the fetch fails) we're failing open intentionally to allow users to
  // fetch whatever data they choose. This code is best-effort, meant to smooth over the UX concerns
  // of PLP v1 and not actually meant to provide any security guarantees. It is primarily meant
  // to run on the index page - other apps don't fetch PLP and that's intentional for v1.

  if (isLoading(permissions)) {
    return null;
  }

  var isDeal = objectTypeId === DEAL_TYPE_ID;
  var hiddenPipelineIds = Object.keys(permissions).filter(function (pipelineId) {
    return permissions[pipelineId] === HIDDEN;
  });

  if (!hiddenPipelineIds.length) {
    return null;
  } // HACK: We're hardcoding the pipeline property name here because this code path
  // is legacy and will only ever be used by deals and tickets. If you're porting
  // this to IKEA, please derive the pipeline property name from the type definition.


  return {
    operator: 'NOT_IN',
    property: isDeal ? 'pipeline' : 'hs_pipeline',
    values: hiddenPipelineIds
  };
};
export var maybeDecorateQueryWithPipelinePermissions = function maybeDecorateQueryWithPipelinePermissions(objectType, query) {
  var objectTypeId = ObjectTypesToIds[objectType] || objectType;

  if (![DEAL_TYPE_ID, TICKET_TYPE_ID].includes(objectTypeId)) {
    return query;
  }

  var hiddenPipelinesFilter = getPipelinePermissionsFilter(objectTypeId);

  if (hiddenPipelinesFilter) {
    return query.updateIn(['filterGroups', 0, 'filters'], function () {
      var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
      return filters.push(hiddenPipelinesFilter);
    });
  }

  return query;
};