'use es6';

import withGateOverride from 'crm_data/gates/withGateOverride';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes'; // This is a conversion of https://git.hubteam.com/HubSpot/CRM/blob/4f24c97c93072c8edecbcf1c1ce569bd46037bc2/crm_ui/static/js/grid/permissions/bulkActionPermissions.js#L39-L71

export var useIsDeleteDisabledAndTooltip = function useIsDeleteDisabledAndTooltip(_ref) {
  var canEditSelection = _ref.canEditSelection,
      isSelectingEntireQuery = _ref.isSelectingEntireQuery;
  var hasAllGates = useHasAllGates();
  var hasAllScopes = useHasAllScopes();

  if (hasAllScopes('bet-has-delete-restriction') && !hasAllScopes('bet-single-delete-access') || hasAllScopes('crm-access') && !hasAllScopes('crm-bulk-delete')) {
    return {
      disabled: true,
      disabledTooltipMessage: 'index.bulkActions.permissions.disabled.delete'
    };
  }

  if (!canEditSelection) {
    return {
      disabled: true,
      disabledTooltipMessage: 'index.bulkActions.permissions.disabled.deleteRecords'
    };
  }

  var isUngatedForBatchMutations = withGateOverride('CRM:Datasets:BatchMutations', hasAllGates('CRM:Datasets:BatchMutations'));

  if (isSelectingEntireQuery && !isUngatedForBatchMutations) {
    return {
      disabled: true,
      disabledTooltipMessage: 'index.bulkActions.permissions.currentPage.delete'
    };
  }

  return {
    disabled: false
  };
};