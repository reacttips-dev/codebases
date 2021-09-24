'use es6';

import { useSelector } from 'react-redux';
import { DEAL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getScopesSet } from '../../auth/selectors/authSelectors';
import has from 'transmute/has';
import { EDIT } from '../constants/RequestActions';
import { ALL } from '../constants/AccessLevels';
import { useScopeMapping } from '../../objectTypes/hooks/useScopeMapping';
export var ACCESS_TYPE_ALLOWED = 'ACCESS_TYPE_ALLOWED';
export var ACCESS_TYPE_DENIED = 'ACCESS_TYPE_DENIED';
export var ACCESS_TYPE_NOT_SPECIFIED = 'ACCESS_TYPE_NOT_SPECIFIED';

var isBETPortal = function isBETPortal(scopes) {
  return has('bet-enforce-deal-stage-restrictions', scopes);
};

export var betIsBulkEditAllRestricted = function betIsBulkEditAllRestricted(_ref) {
  var allSelected = _ref.allSelected,
      objectTypeId = _ref.objectTypeId,
      scopesSet = _ref.scopesSet;

  if (!isBETPortal(scopesSet)) {
    return false;
  }

  return allSelected && objectTypeId === DEAL_TYPE_ID && !has('bet-crm-bypass-validation', scopesSet);
};
export var useGetUserAccessTypeFromScopes = function useGetUserAccessTypeFromScopes(_ref2) {
  var allSelected = _ref2.allSelected;
  var objectTypeId = useSelectedObjectTypeId();
  var scopesSet = useSelector(getScopesSet);
  var editAllScope = useScopeMapping({
    requestAction: EDIT,
    accessLevel: ALL
  });

  if (betIsBulkEditAllRestricted({
    allSelected: allSelected,
    objectTypeId: objectTypeId,
    scopesSet: scopesSet
  })) {
    return ACCESS_TYPE_DENIED;
  }

  if (has(editAllScope, scopesSet)) {
    return ACCESS_TYPE_ALLOWED;
  }

  return ACCESS_TYPE_NOT_SPECIFIED;
};