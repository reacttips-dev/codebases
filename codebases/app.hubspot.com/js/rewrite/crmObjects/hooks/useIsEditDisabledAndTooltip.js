'use es6';

import withGateOverride from 'crm_data/gates/withGateOverride';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes';
import { EDIT } from '../../permissions/constants/RequestActions';
import { ALL, OWNED, TEAM_OWNED, UNASSIGNED } from '../../permissions/constants/AccessLevels';
import { useScopeMapping } from '../../objectTypes/hooks/useScopeMapping'; // This is a conversion of https://git.hubteam.com/HubSpot/CRM/blob/4f24c97c93072c8edecbcf1c1ce569bd46037bc2/crm_ui/static/js/grid/permissions/bulkActionPermissions.js#L20-L37

export var useIsEditDisabledAndTooltip = function useIsEditDisabledAndTooltip(_ref) {
  var canEditSelection = _ref.canEditSelection,
      isSelectingEntireQuery = _ref.isSelectingEntireQuery;
  var hasAllGates = useHasAllGates();
  var hasAllScopes = useHasAllScopes();
  var editAllScope = useScopeMapping({
    requestAction: EDIT,
    accessLevel: ALL
  });
  var editTeamScope = useScopeMapping({
    requestAction: EDIT,
    accessLevel: TEAM_OWNED
  });
  var editOwnedScope = useScopeMapping({
    requestAction: EDIT,
    accessLevel: OWNED
  });
  var editUnassignedScope = useScopeMapping({
    requestAction: EDIT,
    accessLevel: UNASSIGNED
  });

  if (![editAllScope, editTeamScope, editOwnedScope, editUnassignedScope].some(function (scope) {
    return hasAllScopes(scope);
  })) {
    return {
      disabled: true,
      disabledTooltipMessage: 'index.bulkActions.permissions.disabled.edit'
    };
  }

  if (!canEditSelection) {
    return {
      disabled: true,
      disabledTooltipMessage: 'index.bulkActions.permissions.disabled.editRecords'
    };
  }

  var isUngatedForBatchMutations = withGateOverride('CRM:Datasets:BatchMutations', hasAllGates('CRM:Datasets:BatchMutations'));

  if (isSelectingEntireQuery && !isUngatedForBatchMutations) {
    return {
      disabled: true,
      disabledTooltipMessage: 'index.bulkActions.permissions.currentPage.edit'
    };
  }

  return {
    disabled: false
  };
};