'use es6';

import { useGetUserAccessTypeFromScopes, ACCESS_TYPE_NOT_SPECIFIED, ACCESS_TYPE_ALLOWED } from './useGetUserAccessTypeFromScopes';
import { useCanUserEditSelectedObjects } from './useCanUserEditSelectedObjects';
import { useCanUserEditEntireQuery } from './useCanUserEditEntireQuery';
export var useCanUserEditObjects = function useCanUserEditObjects(_ref) {
  var objectIds = _ref.objectIds,
      isSelectingEntireQuery = _ref.isSelectingEntireQuery,
      count = _ref.count;
  // Method 1
  var accessTypeFromScopes = useGetUserAccessTypeFromScopes({
    isSelectingEntireQuery: isSelectingEntireQuery
  }); // Method 2

  var shouldSkipQueryPermissions = !isSelectingEntireQuery || accessTypeFromScopes !== ACCESS_TYPE_NOT_SPECIFIED;

  var _useCanUserEditEntire = useCanUserEditEntireQuery({
    skip: shouldSkipQueryPermissions,
    count: count
  }),
      canEditQuery = _useCanUserEditEntire.canEditQuery; // Method 3


  var canUserEditSelection = useCanUserEditSelectedObjects({
    selectedObjectIds: objectIds
  });
  /*
   * We have three different methods we use to check permissions.
   *
   * 1. If the user's scopes either explicitly allow or deny bulk edits, allow or deny this bulk edit.
   * 2. If not 1 and selecting all objects that match a query, we need to hit CrmSearch to confirm they can edit all the objects in the query.
   * 3. If not 1 and selecting individual items on a page, we check the permissions on each individual record (acquired via graphql).
   *
   * Ideally someday we can combine 2 and 3 into one request rather than having to switch between them.
   */
  // Case 1

  if (accessTypeFromScopes !== ACCESS_TYPE_NOT_SPECIFIED) {
    return accessTypeFromScopes === ACCESS_TYPE_ALLOWED;
  }

  if (isSelectingEntireQuery) {
    return canEditQuery;
  } // Case 3


  return canUserEditSelection;
};