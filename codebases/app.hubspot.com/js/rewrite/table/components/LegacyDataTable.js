'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { fromJS, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import styled from 'styled-components';
import PropTypes from 'prop-types'; // HACK: We are using the named export to avoid using the general-store enhanced component.
// Please do not change this import!

import { DataTable } from '../../../crm_ui/grid/DataTable';
import { usePaginationState } from '../../pagination/hooks/usePaginationState';
import { usePaginationActions } from '../../pagination/hooks/usePaginationActions';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { useProperties } from '../../properties/hooks/useProperties';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import { useViewActions } from '../../views/hooks/useViewActions';
import { Provider } from 'react-redux';
import { store } from '../../../App';
import AsyncBulkActionsContainer, { loadBulkActionsContainer } from './AsyncBulkActionsContainer';
import { MAX_TABLE_HEIGHT } from '../../../table/Table';
import { useGetPropertyPermission } from '../../fieldLevelPermissions/hooks/useGetPropertyPermission';
import { usePanelActions } from '../../overlay/hooks/usePanelActions';
import { NavMarker } from 'react-rhumb';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { mapCrmSearchResultsToObjectRecords } from '../utils/mapCrmSearchResultsToObjectRecords';
import BulkActionPropsRecord from '../../../crm_ui/grid/utils/BulkActionPropsRecord';
import BulkAssignToPrompt from '../../../crm_ui/prompts/grid/BulkAssignToPrompt';
import { useCrmObjectsActions } from '../../crmObjects/hooks/useCrmObjectsActions';
import { useHydrateAssociationColumns } from '../../associations/hooks/useHydrateAssociationColumns';
import emptyFunction from 'react-utils/emptyFunction';
import { useSearchQuery } from '../../searchQuery/hooks/useSearchQuery';
import { delayUntilIdle } from '../../../crm_ui/utils/delayUntilIdle';
import { getPluralForm } from '../../../crmObjects/methods/getPluralForm';
import { useIsQueryFiltering } from '../../searchQuery/hooks/useIsQueryFiltering';
var TableContainer = styled.div.withConfig({
  displayName: "LegacyDataTable__TableContainer",
  componentId: "n97rpp-0"
})(["position:relative;"]);

var LegacyDataTable = function LegacyDataTable(_ref) {
  var _ref$data = _ref.data,
      results = _ref$data.results,
      total = _ref$data.total,
      __error = _ref.error,
      loading = _ref.loading;
  var typeDef = useSelectedObjectTypeDef();
  var objectTypeId = typeDef.objectTypeId; // HACK: In the old codebase, the table would clear its selection on changes by fully
  // remounting. In the rewrite we don't want to remount that often as it is detrimental
  // to perf, so instead we'll just clear the selection whenever the query changes.

  var clearSelectionRef = useRef(emptyFunction);
  var query = useSearchQuery();
  useEffect(function () {
    clearSelectionRef.current();
  }, [query]);
  var records = useMemo(function () {
    return mapCrmSearchResultsToObjectRecords(objectTypeId, results);
  }, [objectTypeId, results]);
  var properties = useProperties();
  var view = useCurrentView();
  var viewId = String(view.id);
  var getPropertyPermission = useGetPropertyPermission();
  var hasFilters = useIsQueryFiltering();
  var columns = useMemo(function () {
    return view.columns.map(function (col, index) {
      return col.set('order', index);
    });
  }, [view.columns]);
  var hydratedColumns = useHydrateAssociationColumns(columns);
  var sortKey = view.state.get('sortKey');
  var sortOrder = view.state.get('order');

  var _usePaginationState = usePaginationState(),
      page = _usePaginationState.page,
      pageSize = _usePaginationState.pageSize;

  var _usePaginationActions = usePaginationActions(),
      onPageChange = _usePaginationActions.onPageChange,
      onPageSizeChange = _usePaginationActions.onPageSizeChange;

  var hasAllGates = useHasAllGates();
  var handlePageChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    // I don't know why, I don't want to know why, but the grid adds 1 to the page index:
    // https://git.hubteam.com/HubSpot/CRM/blob/723f48b836ef78d44c3455eb6e21e29b8b159c97/crm_ui/static/js/grid/DataTable.js#L151
    onPageChange(value - 1);
  }, [onPageChange]);

  var _useViewActions = useViewActions(),
      onColumnsChanged = _useViewActions.onColumnsChanged,
      onSortChanged = _useViewActions.onSortChanged;

  var handleReorder = useCallback(function (cols) {
    onColumnsChanged(cols.map(function (col) {
      return fromJS({
        name: col
      });
    }));
  }, [onColumnsChanged]); // TODO: When rewriting the bulk assign action, make sure to pop that modal here as well!
  // For now, we're HACKing by using the same promptable as the old code.

  var _useCrmObjectsActions = useCrmObjectsActions(),
      crmObjectsUpdated = _useCrmObjectsActions.crmObjectsUpdated;

  var handleAssignObject = useCallback(function (objectType, subjectId) {
    var checked = ImmutableSet([subjectId]);
    return BulkAssignToPrompt({
      bulkActionProps: new BulkActionPropsRecord({
        objectType: objectType,
        checked: checked,
        allSelected: false,
        selectionCount: 1,
        objectTypeLabel: getPluralForm(typeDef)
      }),
      onSuccess: function onSuccess(propertyValues) {
        return crmObjectsUpdated({
          objectIds: checked.toArray(),
          propertyValues: propertyValues
        });
      },
      isIKEA: true
    });
  }, [crmObjectsUpdated, typeDef]);
  useEffect(function () {
    delayUntilIdle(loadBulkActionsContainer);
  }, []);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      areAllSelected = _useState2[0],
      setAreAllSelected = _useState2[1];

  var getBulkActions = useCallback(function (_ref3) {
    var allSelected = _ref3.allSelected,
        selection = _ref3.selection,
        totalResults = _ref3.totalResults,
        clearSelection = _ref3.clearSelection;

    if (clearSelection !== clearSelectionRef.current) {
      clearSelectionRef.current = clearSelection;
    }

    return (
      /*#__PURE__*/
      // HACK: Table v2 has its own redux store and this component gets rendered under that provider,
      // so we need to override it with our own in order to use our redux store in the bulk actions
      _jsx(Provider, {
        store: store,
        children: /*#__PURE__*/_jsx(AsyncBulkActionsContainer, {
          isSelectingEntireQuery: allSelected,
          selection: selection,
          total: totalResults,
          clearSelection: clearSelection
        })
      })
    );
  }, []);

  var _usePanelActions = usePanelActions(),
      openPreviewPanel = _usePanelActions.openPreviewPanel; // HACK: The table takes an extra render cycle to reflect column changes. This results in a "jumpy"
  // transition. Since this is technically an issue in the table that can be resolved in the new version,
  // we're just going to throw this loading state to make the transition seem less jarring until we can retire this table.


  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      fakeLoading = _useState4[0],
      setFakeLoading = _useState4[1];

  useEffect(function () {
    setFakeLoading(true); // Using a timeout of 0 also works, but using an actual value makes sure that the spinner exists
    // long enough to not appear broken on faster machines.

    var timeout = setTimeout(function () {
      return setFakeLoading(false);
    }, 250);
    return function () {
      return clearTimeout(timeout);
    };
  }, [viewId]);
  var actions = useMemo(function () {
    return ImmutableMap({
      onReorder: handleReorder,
      onAssignContact: handleAssignObject,
      onToggleSidebar: openPreviewPanel
    });
  }, [handleAssignObject, handleReorder, openPreviewPanel]);
  return /*#__PURE__*/_jsx(TableContainer, {
    className: "width-100",
    children: /*#__PURE__*/_jsx(DataTable, {
      objectType: denormalizeTypeId(objectTypeId),
      properties: properties,
      totalResults: total,
      data: records,
      viewColumns: hydratedColumns,
      viewSortKey: sortKey,
      viewSortDirection: sortOrder,
      currentPage: page,
      pageSize: pageSize,
      hidePagination: false,
      isLoading: loading || fakeLoading,
      allSelected: areAllSelected,
      onSelectAllChange: setAreAllSelected,
      getTableBulkActions: getBulkActions,
      viewId: viewId,
      getPropertyPermission: getPropertyPermission,
      getIsUngated: hasAllGates,
      onChangeSort: onSortChanged,
      onChangeRows: onPageSizeChange,
      onPageChange: handlePageChange,
      actions: actions,
      maxHeight: MAX_TABLE_HEIGHT,
      hasFilters: hasFilters,
      RhumbMarkerSuccess: /*#__PURE__*/_jsx(NavMarker, {
        name: "DATA_TABLE_LOADED"
      }),
      RhumbMarkerEmpty: /*#__PURE__*/_jsx(NavMarker, {
        name: "GRID_EMPTY_STATE"
      })
    })
  });
};

LegacyDataTable.propTypes = {
  data: PropTypes.shape({
    total: PropTypes.number.isRequired,
    results: PropTypes.array.isRequired
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    status: PropTypes.number.isRequired,
    responseJSON: PropTypes.object.isRequired
  })
};
export default LegacyDataTable;