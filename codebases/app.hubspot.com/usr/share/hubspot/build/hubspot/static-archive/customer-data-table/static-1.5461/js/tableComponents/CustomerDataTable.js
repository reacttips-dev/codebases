'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { List, is } from 'immutable';
import { Provider } from 'react-redux';
import { TABLE_ACTIONS, tableReducer } from '../Hooks/tableReducer';
import { clearSelection } from '../actions/selectionActions';
import { createStore } from 'redux';
import { readColumns, removeEmptyColumns, updateColumnWidth } from '../tableFunctions';
import { usePropertyColumns } from '../Hooks/usePropertyColumns';
import BulkActionThead from './BulkActionThead';
import ColumnRecord from '../columns/ColumnRecord';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Loading from '../tableComponents/Loading';
import Pagination from '../tableComponents/Pagination';
import PropTypes from 'prop-types';
import { memo, forwardRef, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import ReactTable from 'react-table';
import ResizeAffordance from '../tableComponents/ResizeAffordance';
import SharedDragDropContext from 'customer-data-ui-utilities/dnd/SharedDragDropContext';
import Table from '../tableComponents/Table';
import Tbody from './Tbody';
import Td from '../tableComponents/Td';
import Th from '../tableComponents/Th';
import Thead from './Thead';
import Tr from '../tableComponents/Tr';
import TrGroup from '../tableComponents/TrGroup';
import always from 'transmute/always';
import checkboxColumn from '../columns/checkboxColumn';
import count from 'transmute/count';
import debounce from 'transmute/debounce';
import devLogger from 'react-utils/devLogger';
import emptyFunction from 'react-utils/emptyFunction';
import filter from 'transmute/filter';
import get from 'transmute/get';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import selectionReducer from '../reducers/selectionReducer';
import styled from 'styled-components';
import { ALL_COLUMNS_MIN_RESIZABLE_WIDTH } from '../constants/ColumnConstants';
import BatchAssociationsContext from '../associations/context/BatchAssociationsContext';
import AssociationsBatchRequestClient from '../associations/api/AssociationsBatchRequestClient';
var TableWrapper = styled.div.withConfig({
  displayName: "CustomerDataTable__TableWrapper",
  componentId: "wan9nc-0"
})(["max-height:", ";height:100%;width:100%;"], function (_ref) {
  var height = _ref.height;
  return height;
});
var store = createStore(selectionReducer);

var checkSetting = function checkSetting(settingName, tableSetting, column) {
  if (tableSetting === false) return false;
  var columnSetting = get(settingName, column);
  if (columnSetting === false) return false;
  return tableSetting || get(settingName, column);
};

var CustomerDataTable = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(function (props, ref) {
  var LoadingComponent = props.LoadingComponent,
      ObjectProperties = props.ObjectProperties,
      ObjectType = props.ObjectType,
      PaginationComponent = props.PaginationComponent,
      ResizerComponent = props.ResizerComponent,
      TableComponent = props.TableComponent,
      TdComponent = props.TdComponent,
      ThComponent = props.ThComponent,
      TheadComponent = props.TheadComponent,
      TrComponent = props.TrComponent,
      TrGroupComponent = props.TrGroupComponent,
      allSelected = props.allSelected,
      _columns = props.columns,
      data = props.data,
      draggable = props.draggable,
      getBulkActions = props.getBulkActions,
      getColumnProps = props.getColumnProps,
      getResizerProps = props.getResizerProps,
      getTableProps = props.getTableProps,
      getTbodyProps = props.getTbodyProps,
      getTheadThPropsForColumn = props.getTheadThPropsForColumn,
      getTheadTrProps = props.getTheadTrProps,
      getTrProps = props.getTrProps,
      headerActions = props.headerActions,
      height = props.height,
      id = props.id,
      getIsUngated = props.getIsUngated,
      labelColumn = props.labelColumn,
      loading = props.loading,
      maxItemsToBeSelected = props.maxItemsToBeSelected,
      minColumnWidth = props.minColumnWidth,
      _objectProperties = props.objectProperties,
      _objectType = props.objectType,
      onFetchData = props.onFetchData,
      onReorder = props.onReorder,
      onResize = props.onResize,
      onSelectAllChange = props.onSelectAllChange,
      onSelectChange = props.onSelectChange,
      page = props.page,
      pageSize = props.pageSize,
      propertyColumns = props.propertyColumns,
      query = props.query,
      renderEmptyState = props.renderEmptyState,
      resizable = props.resizable,
      restrictedProperties = props.restrictedProperties,
      sortDirection = props.sortDirection,
      sortKey = props.sortKey,
      sortable = props.sortable,
      totalResults = props.totalResults,
      useSelection = props.useSelection,
      width = props.width,
      rest = _objectWithoutProperties(props, ["LoadingComponent", "ObjectProperties", "ObjectType", "PaginationComponent", "ResizerComponent", "TableComponent", "TdComponent", "ThComponent", "TheadComponent", "TrComponent", "TrGroupComponent", "allSelected", "columns", "data", "draggable", "getBulkActions", "getColumnProps", "getResizerProps", "getTableProps", "getTbodyProps", "getTheadThPropsForColumn", "getTheadTrProps", "getTrProps", "headerActions", "height", "id", "getIsUngated", "labelColumn", "loading", "maxItemsToBeSelected", "minColumnWidth", "objectProperties", "objectType", "onFetchData", "onReorder", "onResize", "onSelectAllChange", "onSelectChange", "page", "pageSize", "propertyColumns", "query", "renderEmptyState", "resizable", "restrictedProperties", "sortDirection", "sortKey", "sortable", "totalResults", "useSelection", "width"]);

  if (ObjectType) {
    devLogger.warn({
      message: 'CustomerDataTable has replaced the prop ObjectType with objectType (no capital O). Please update your app.'
    });
  }

  if (ObjectProperties) {
    devLogger.warn({
      message: 'CustomerDataTable has replaced the prop ObjectProperties with objectProperties (no capital O). Please update your app.'
    });
  }

  var objectType = _objectType || ObjectType;
  var objectProperties = _objectProperties || ObjectProperties; // TEMPORARY: This is to help us switch to the new UIStickyHeaderTable without breaking things in the CRM
  // This allows me to update the library, then update the CRM
  // REMOVE THIS AFTER MERGING https://git.hubteam.com/HubSpot/CRM/pull/18167

  var tableProps = getTableProps ? getTableProps() : {};

  var _getTableProps = always(Object.assign({}, tableProps, {
    maxHeight: tableProps.maxHeight ? tableProps.maxHeight : height
  }));

  var columnWidths = useMemo(function () {
    return resizable ? readColumns(id) : undefined;
  }, [id, resizable]);

  var _useReducer = useReducer(tableReducer, _columns),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      columns = _useReducer2[0],
      dispatcher = _useReducer2[1];

  var _useState = useState(propertyColumns),
      _useState2 = _slicedToArray(_useState, 2),
      propertyColumnsState = _useState2[0],
      setPropertyColumnsState = _useState2[1];

  var _useState3 = useState(objectProperties),
      _useState4 = _slicedToArray(_useState3, 2),
      objectPropertiesState = _useState4[0],
      setObjectPropertiesState = _useState4[1];

  useEffect(function () {
    if (!is(objectProperties, objectPropertiesState)) {
      setObjectPropertiesState(objectProperties);
    }
  }, [objectProperties, objectPropertiesState]);
  useEffect(function () {
    if (!is(propertyColumns, propertyColumnsState)) {
      setPropertyColumnsState(propertyColumns);
    }
  }, [propertyColumnsState, propertyColumns]);

  var _useState5 = useState(data),
      _useState6 = _slicedToArray(_useState5, 2),
      dataState = _useState6[0],
      setDataState = _useState6[1];

  useEffect(function () {
    if (!is(data, dataState)) {
      setDataState(data);
    }
  }, [data, dataState]);
  var renderedData = useMemo(function () {
    return dataState.filter(function (x) {
      return x;
    }).toArray();
  }, [dataState]);
  usePropertyColumns({
    objectProperties: objectPropertiesState,
    objectType: objectType,
    dispatcher: dispatcher,
    columns: columns,
    getColumnProps: getColumnProps,
    columnWidths: columnWidths,
    minColumnWidth: minColumnWidth,
    labelColumn: labelColumn,
    columnsProp: _columns,
    propertyColumns: propertyColumnsState,
    restrictedProperties: restrictedProperties,
    getIsUngated: getIsUngated
  });
  useEffect(function () {
    if (useSelection) dispatcher({
      type: TABLE_ACTIONS.PREPEND,
      value: checkboxColumn
    });
  }, [useSelection]);
  var isColumnDataLoading = count(columns) === 0 && count(propertyColumns) > 0;
  var isEmpty = useMemo(function () {
    if (loading || isColumnDataLoading) {
      return false;
    }

    return !data || !columns || count(data) === 0 || count(columns) === 0;
  }, [columns, data, loading, isColumnDataLoading]);
  var onResizedChange = useCallback(debounce(3000, function (newWidths, evt) {
    evt.preventDefault();
    updateColumnWidth(id, newWidths);
    onResize(newWidths);
  }), [id, onResize]); // NOTE: users expect all selection state (including 'Select all')
  // to clear upon page change (see #200).

  var _useState7 = useState(-1),
      _useState8 = _slicedToArray(_useState7, 2),
      currentPageState = _useState8[0],
      setCurrentPageState = _useState8[1];

  useEffect(function () {
    if (!isEmpty && currentPageState !== page) {
      setCurrentPageState(page);
      store.dispatch(clearSelection());
      onSelectAllChange(false);
    }
  }, [currentPageState, data, isEmpty, loading, onSelectAllChange, page, pageSize]);
  useEffect(function () {
    // clear selection if the search query changes
    store.dispatch(clearSelection());
  }, [query]);
  var handleFetchData = useCallback(function (tableState) {
    store.dispatch(clearSelection());
    onSelectAllChange(false);
    if (onFetchData) onFetchData(tableState);
  }, [onFetchData, onSelectAllChange]);
  var displayColumns = useCallback(removeEmptyColumns(columns).toJS(), [columns]);
  var getTheadPropsForColumn = useCallback(function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return useSelection ? {
      getBulkActionProps: always({
        allSelected: allSelected,
        getBulkActions: getBulkActions,
        maxItemsToBeSelected: maxItemsToBeSelected,
        objectType: objectType,
        onSelectAllChange: onSelectAllChange,
        onSelectChange: onSelectChange,
        pageSize: pageSize,
        query: query,
        totalResults: totalResults
      }),
      pageRows: state.pageRows
    } : emptyFunction;
  }, [objectType, allSelected, getBulkActions, maxItemsToBeSelected, onSelectAllChange, onSelectChange, pageSize, query, totalResults, useSelection]);
  var getTheadThProps = useCallback(function (_, __, column) {
    return Object.assign({}, getTheadThPropsForColumn(column), {
      dispatcher: dispatcher,
      draggable: checkSetting('draggable', draggable, column),
      id: get('id', column),
      onColumnReorder: function onColumnReorder(source, target) {
        var onReorderDebounced = debounce(1000, onReorder);

        var getColumnIndex = function getColumnIndex(columnId) {
          return columns.findIndex(function (entry) {
            return get('id', entry) === columnId;
          });
        };

        dispatcher({
          type: TABLE_ACTIONS.REORDER,
          value: {
            callback: pipe(map(get('id')), filter(function (entry) {
              return entry !== '_selector';
            }), onReorderDebounced),
            sourceIndex: getColumnIndex(source),
            targetIndex: getColumnIndex(target)
          }
        });
      },
      onSelectAllChange: onSelectAllChange,
      resizable: checkSetting('resizable', resizable, column),
      sortable: checkSetting('sortable', sortable, column),
      sortDirection: sortDirection,
      sortKey: sortKey
    });
  }, [columns, draggable, getTheadThPropsForColumn, onReorder, onSelectAllChange, resizable, sortable, sortDirection, sortKey]);

  if (isEmpty) {
    return renderEmptyState();
  }

  return /*#__PURE__*/_jsx(Provider, {
    store: store,
    children: /*#__PURE__*/_jsx(BatchAssociationsContext.Provider, {
      value: AssociationsBatchRequestClient,
      children: /*#__PURE__*/_jsx(TableWrapper, {
        children: /*#__PURE__*/_jsx(ReactTable, Object.assign({}, rest, {
          allSelected: allSelected,
          columns: displayColumns,
          data: renderedData,
          draggable: draggable,
          getBulkActions: getBulkActions,
          getResizerProps: getResizerProps,
          getTableProps: _getTableProps,
          getTbodyProps: getTbodyProps,
          getTheadProps: getTheadPropsForColumn,
          getTheadThProps: getTheadThProps,
          getTheadTrProps: getTheadTrProps,
          getTrProps: getTrProps,
          headerActions: headerActions,
          height: height,
          id: id,
          loading: loading || isColumnDataLoading,
          LoadingComponent: LoadingComponent,
          noDataText: "",
          objectType: objectType,
          onFetchData: handleFetchData,
          onResizedChange: onResizedChange,
          onSelectAllChange: onSelectAllChange,
          page: page,
          pageSize: pageSize,
          PaginationComponent: PaginationComponent,
          ref: ref,
          renderEmptyState: renderEmptyState,
          resizable: resizable,
          ResizerComponent: ResizerComponent,
          TableComponent: TableComponent,
          TdComponent: TdComponent,
          ThComponent: ThComponent,
          TheadComponent: useSelection ? BulkActionThead : headerActions || TheadComponent,
          totalResults: totalResults,
          TrComponent: TrComponent,
          TrGroupComponent: TrGroupComponent,
          width: width
        }))
      })
    })
  });
}));
CustomerDataTable.displayName = 'CustomerDataTable';
CustomerDataTable.propTypes = {
  EmptyState: PropTypes.elementType,
  LoadingComponent: PropTypes.elementType,
  ObjectProperties: ImmutablePropTypes.map,
  ObjectType: PropTypes.string,
  PaginationComponent: PropTypes.elementType,
  ResizerComponent: PropTypes.elementType,
  TableComponent: PropTypes.elementType,
  TbodyComponent: PropTypes.elementType,
  TdComponent: PropTypes.elementType,
  ThComponent: PropTypes.elementType,
  TheadComponent: PropTypes.elementType,
  TrComponent: PropTypes.elementType,
  TrGroupComponent: PropTypes.elementType,
  allSelected: PropTypes.bool,
  columns: ImmutablePropTypes.list,
  condensed: PropTypes.bool,
  condensedFooter: PropTypes.bool,
  data: ImmutablePropTypes.list,
  dataUrl: PropTypes.string,
  defaultPageSize: PropTypes.number,
  draggable: PropTypes.bool,
  getBulkActions: PropTypes.func,
  getColumnProps: PropTypes.func,
  getIsUngated: PropTypes.func,
  getResizerProps: PropTypes.func,
  getTableProps: PropTypes.func,
  getTbodyProps: PropTypes.func,
  getTdProps: PropTypes.func,
  getTheadThPropsForColumn: PropTypes.func,
  getTheadTrProps: PropTypes.func,
  getTrProps: PropTypes.func,
  headerActions: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  id: PropTypes.string.isRequired,
  labelColumn: PropTypes.instanceOf(ColumnRecord),
  loading: PropTypes.bool,
  maxItemsToBeSelected: PropTypes.number,
  minColumnWidth: PropTypes.number,
  minRows: PropTypes.number,
  moreCondensed: PropTypes.bool,
  multiSort: PropTypes.bool,
  objectProperties: ImmutablePropTypes.map,
  objectType: PropTypes.string,
  onFetchData: PropTypes.func,
  onReorder: PropTypes.func,
  onResize: PropTypes.func,
  onSelectAllChange: PropTypes.func,
  onSelectChange: PropTypes.func,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  pages: PropTypes.number,
  propertyColumns: ImmutablePropTypes.list,
  query: PropTypes.string,
  renderEmptyState: PropTypes.func.isRequired,
  resizable: PropTypes.bool,
  restrictedProperties: ImmutablePropTypes.list,
  showFirstLastButton: PropTypes.bool,
  sortDirection: PropTypes.number,
  sortKey: PropTypes.string,
  sortable: PropTypes.bool,
  totalResults: PropTypes.number,
  useSelection: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
CustomerDataTable.defaultProps = {
  LoadingComponent: Loading,
  PaginationComponent: Pagination,
  ResizerComponent: ResizeAffordance,
  TableComponent: Table,
  TbodyComponent: Tbody,
  TdComponent: Td,
  ThComponent: Th,
  TheadComponent: Thead,
  TrComponent: Tr,
  TrGroupComponent: TrGroup,
  columns: List(),
  data: List(),
  defaultPageSize: 25,
  draggable: false,
  getIsUngated: function getIsUngated() {
    return false;
  },
  getTheadThPropsForColumn: emptyFunction,
  minColumnWidth: ALL_COLUMNS_MIN_RESIZABLE_WIDTH,
  minRows: 0,
  multiSort: false,
  onReorder: emptyFunction,
  onResize: emptyFunction,
  onSelectAllChange: emptyFunction,
  onSelectChange: emptyFunction,
  propertyColumns: new List(),
  resizable: true,
  restrictedProperties: new List(),
  showFirstLastButton: false,
  sortable: true,
  width: '100%'
};
export default SharedDragDropContext()(CustomerDataTable);