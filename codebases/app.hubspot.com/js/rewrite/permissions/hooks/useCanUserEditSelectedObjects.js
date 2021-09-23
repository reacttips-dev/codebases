'use es6';

import get from 'transmute/get';
import { useTableQueryCache } from '../../table/hooks/useTableQueryCache'; // NOTE: This code assumes the set of selected objects will *always* be a subset of the objects in the query.
// This should be safe because you can only select specific objects from
// a single page of the query, which we should always have in memory.

export var useCanUserEditSelectedObjects = function useCanUserEditSelectedObjects(_ref) {
  var selectedObjectIds = _ref.selectedObjectIds;

  var _useTableQueryCache = useTableQueryCache(),
      data = _useTableQueryCache.data; // HACK: We're going to drastically improve this logic once https://git.hubteam.com/HubSpot/CrmMeta/pull/581
  // lands, so for now let's just hack if the user changes the query while the bulk actions are open
  // (adds/removes a column, etc).


  if (!data) {
    return false;
  }

  return data.results // Filter only to selected objects
  .filter(function (_ref2) {
    var id = _ref2.id;
    return selectedObjectIds.includes(id);
  }) // Check if the user can edit each selected object
  .every(function (_ref3) {
    var userPermissions = _ref3.userPermissions;
    return get('currentUserCanEdit', userPermissions);
  });
};