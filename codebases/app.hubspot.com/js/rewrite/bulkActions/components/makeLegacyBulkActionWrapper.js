'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import BulkActionPropsRecord, { addCalculatedValues } from '../../../crm_ui/grid/utils/BulkActionPropsRecord';
import { useMemo } from 'react';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import { usePaginationState } from '../../pagination/hooks/usePaginationState';
import { usePortalSetting } from '../../portalSettings/hooks/usePortalSetting';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { Set as ImmutableSet } from 'immutable';
import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { useIsDoubleOptInEnabled } from '../../doubleOptIn/hooks/useIsDoubleOptInEnabled';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { getPluralForm } from '../../../crmObjects/methods/getPluralForm';
import { getPortalSettingsKeys } from '../../portalSettings/constants/PortalSettingsKeys';
export var makeLegacyBulkActionWrapper = function makeLegacyBulkActionWrapper(_ref) {
  var key = _ref.key,
      Component = _ref.Component,
      condition = _ref.condition;

  var Wrapper = function Wrapper(_ref2) {
    var query = _ref2.query,
        queryHydrationStatus = _ref2.queryHydrationStatus,
        canEditSelection = _ref2.canEditSelection,
        isSelectingEntireQuery = _ref2.isSelectingEntireQuery,
        total = _ref2.total,
        selection = _ref2.selection,
        onConfirmBulkAction = _ref2.onConfirmBulkAction,
        _ref2$inDropdown = _ref2.inDropdown,
        inDropdown = _ref2$inDropdown === void 0 ? false : _ref2$inDropdown,
        onSuccess = _ref2.onSuccess;
    var typeDef = useSelectedObjectTypeDef();
    var objectType = denormalizeTypeId(typeDef.objectTypeId);

    var _usePaginationState = usePaginationState(),
        pageSize = _usePaginationState.pageSize;

    var view = useCurrentView();
    var gdprEnabled = usePortalSetting(getPortalSettingsKeys().GDPR_COMPLIANCE_ENABLED);
    var doiEnabled = useIsDoubleOptInEnabled(); // We only care about the hydration status when selecting the entire query's worth of objects

    var mustWaitForQueryToHydrate = isSelectingEntireQuery && queryHydrationStatus !== SUCCEEDED;
    var canBulkEditAll = !mustWaitForQueryToHydrate && canEditSelection;
    var bulkActionProps = useMemo(function () {
      return addCalculatedValues(new BulkActionPropsRecord({
        objectType: objectType,
        allSelected: isSelectingEntireQuery,
        totalRecords: total,
        selectionCount: isSelectingEntireQuery ? total : selection.size,
        pageSize: pageSize,
        canBulkEditAll: canBulkEditAll,
        query: query,
        view: view,
        viewId: String(view.id),
        gdprEnabled: gdprEnabled,
        doiEnabled: doiEnabled,
        selection: selection.toList(),
        checked: selection,
        clearSelection: onConfirmBulkAction,
        objectTypeLabel: getPluralForm(typeDef)
      }));
    }, [canBulkEditAll, doiEnabled, gdprEnabled, isSelectingEntireQuery, objectType, onConfirmBulkAction, pageSize, query, selection, total, typeDef, view]);
    var hasAllGates = useHasAllGates();
    var shouldShowButton = !condition || condition({
      bulkActionProps: bulkActionProps,
      hasRestrictedSubscriptionsWrite: hasAllGates('Subscriptions:RestrictContactSubscriptionStatusUpdate')
    });

    if (!shouldShowButton) {
      return null;
    }

    return /*#__PURE__*/_jsx(Component, {
      bulkActionProps: bulkActionProps,
      onSuccess: onSuccess,
      options: {
        inDropdown: inDropdown,
        isIKEA: true
      }
    }, key);
  };

  Wrapper.propTypes = {
    query: PropTypes.object,
    queryHydrationStatus: PropTypes.oneOf([UNINITIALIZED, PENDING, SUCCEEDED, FAILED]).isRequired,
    canEditSelection: PropTypes.bool.isRequired,
    isSelectingEntireQuery: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    selection: PropTypes.instanceOf(ImmutableSet).isRequired,
    inDropdown: PropTypes.bool,
    onConfirmBulkAction: PropTypes.func,
    onSuccess: PropTypes.func
  };
  return Wrapper;
};