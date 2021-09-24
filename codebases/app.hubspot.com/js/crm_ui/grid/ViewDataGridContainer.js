'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { List, Map as ImmutableMap, Record, Set as ImmutableSet, is } from 'immutable';
import { useStoreDependency } from 'general-store';
import { getLastAccessedPage, setLastAccessedPage, deleteLastAccessedPage } from './utils/gridStateLocalStorage';
import { isOfMinSearchLength } from 'customer-data-objects/search/ElasticSearchQuery';
import * as ViewToElasticSearchQuery from '../utils/ViewToElasticSearchQuery';
import EmptyStateMessage from '../emptyState/EmptyStateMessage';
import { selectAll, clearSelected } from '../flux/grid/GridUIActions';
import GridUIStore from '../flux/grid/GridUIStore';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import QueryDataGridContainerAsync from './QueryDataGridContainerAsync';
import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import ViewsActions from '../flux/views/ViewsActions';
import ViewsStore from '../flux/views/ViewsStore';
import always from 'transmute/always';
import localSettings from '../legacy/utils/localSettings';
import memoize from 'transmute/memoize';
import notFoundMessages from '../emptyState/messages/notFoundMessages';
import emptyFunction from 'react-utils/emptyFunction';
import { shallowEqualImmutable } from 'react-immutable-render-mixin';

var _getPageSize = function _getPageSize() {
  var pageSize = parseInt(localSettings.get('gridPageSize'), 10);

  if (!isNaN(pageSize)) {
    return pageSize;
  }

  return undefined;
};

var _getProperties = memoize(function (properties, columns) {
  return columns.reduce(function (acc, column) {
    var columnPropertyName = column.get('name');
    return properties.has(columnPropertyName) ? acc.set(columnPropertyName, properties.get(columnPropertyName)) : acc;
  }, ImmutableMap());
});

var resolvePageNumber = function resolvePageNumber(_ref) {
  var objectType = _ref.objectType,
      viewId = _ref.viewId,
      isEstimate = _ref.isEstimate;
  var cachedPage = getLastAccessedPage({
    objectType: objectType,
    viewId: viewId
  });
  var isPageNumberCached = cachedPage && objectType === cachedPage.objectType && viewId === cachedPage.viewId && cachedPage.currentPage;
  var currentPage = 0;

  if (!isEstimate && isPageNumberCached) {
    currentPage = cachedPage.currentPage;
  } else {
    deleteLastAccessedPage(objectType);
  }

  return currentPage;
};

export var dependencies = {
  allSelected: {
    stores: [GridUIStore],
    deref: function deref() {
      return GridUIStore.get('allSelected');
    }
  },
  numSelected: {
    stores: [GridUIStore],
    deref: function deref() {
      return GridUIStore.get('checked') ? GridUIStore.get('checked').size : 0;
    }
  },
  properties: {
    stores: [PropertiesStore, ViewsStore],
    deref: function deref(_ref2) {
      var objectType = _ref2.objectType,
          viewId = _ref2.viewId;
      var properties = PropertiesStore.get(objectType) || ImmutableMap();
      var view = ViewsStore.get(ViewsStore.getViewKey({
        objectType: objectType,
        viewId: viewId
      })) || ViewRecord();
      return _getProperties(properties, view.columns);
    }
  },
  query: {
    stores: [GridUIStore],
    deref: function deref() {
      return GridUIStore.get('query');
    }
  },
  temporaryIds: {
    stores: [GridUIStore],
    deref: function deref() {
      return GridUIStore.get('temporaryIds');
    }
  },
  view: {
    stores: [ViewsStore],
    deref: function deref(_ref3) {
      var objectType = _ref3.objectType,
          viewId = _ref3.viewId;
      var viewKey = ViewsStore.getViewKey({
        objectType: objectType,
        viewId: viewId
      });
      return ViewsStore.get(viewKey);
    }
  }
};
var PageState = Record({
  currentPage: 0,
  pageSize: undefined,
  previousSearchQuery: ImmutableMap()
}, 'PageStateRecord');

function usePrevious(value) {
  var ref = useRef();
  useEffect(function () {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function ViewDataGridContainer(props) {
  var actions = props.actions,
      children = props.children,
      className = props.className,
      disableIncludeTemporaryIds = props.disableIncludeTemporaryIds,
      draggableRowType = props.draggableRowType,
      extraEmptyCtaProps = props.extraEmptyCtaProps,
      filterFieldsToIgnoreForPageChange = props.filterFieldsToIgnoreForPageChange,
      fixedHeight = props.fixedHeight,
      fixedWidth = props.fixedWidth,
      getBulkActions = props.getBulkActions,
      getTableBulkActions = props.getTableBulkActions,
      getCellComponent = props.getCellComponent,
      gridIsStatic = props.gridIsStatic,
      isCrmObject = props.isCrmObject,
      isEstimate = props.isEstimate,
      ignoreViewPipeline = props.ignoreViewPipeline,
      maxHeight = props.maxHeight,
      objectType = props.objectType,
      onLoadingFinish = props.onLoadingFinish,
      _onPageChange = props.onPageChange,
      onRowDrop = props.onRowDrop,
      onRowMove = props.onRowMove,
      pipelineId = props.pipelineId,
      queryParams = props.queryParams,
      RhumbMarkerEmpty = props.RhumbMarkerEmpty,
      RhumbMarkerError = props.RhumbMarkerError,
      RhumbMarkerSuccess = props.RhumbMarkerSuccess,
      showLoadingOverlay = props.showLoadingOverlay,
      totalResults = props.totalResults,
      viewId = props.viewId;
  var prevProps = usePrevious(props) || props;
  var allSelected = useStoreDependency(dependencies.allSelected);
  var numSelected = useStoreDependency(dependencies.numSelected) || 0;
  var properties = useStoreDependency(dependencies.properties, {
    objectType: objectType,
    viewId: viewId
  });
  var query = useStoreDependency(dependencies.query) || '';
  var temporaryIds = useStoreDependency(dependencies.temporaryIds) || ImmutableMap({
    exclude: ImmutableSet(),
    include: ImmutableSet()
  });
  var view = useStoreDependency(dependencies.view, {
    objectType: objectType,
    viewId: viewId
  });
  var dependencyValues = {
    allSelected: allSelected,
    numSelected: numSelected,
    properties: properties,
    query: query,
    temporaryIds: temporaryIds,
    view: view
  };
  var prevDeps = usePrevious(dependencyValues) || dependencyValues;

  var _useState = useState(function () {
    var currentPage = resolvePageNumber({
      objectType: objectType,
      viewId: viewId,
      isEstimate: isEstimate
    });

    var pageSize = _getPageSize();

    _onPageChange(currentPage);

    return PageState({
      pageSize: pageSize,
      currentPage: currentPage
    });
  }),
      _useState2 = _slicedToArray(_useState, 2),
      pageState = _useState2[0],
      setPageState = _useState2[1];

  var getSearchQuery = useCallback(function (args) {
    return ViewToElasticSearchQuery.transform(args.view, args.objectType, ImmutableMap({
      currentPage: args.currentPage,
      ignoreViewPipeline: args.ignoreViewPipeline,
      isCrmObject: args.isCrmObject,
      pageSize: args.pageSize,
      pipelineId: args.pipelineId,
      query: args.query
    }));
  }, []);
  useEffect(function () {
    // short circuit without doing all of the comparisons
    if (shallowEqualImmutable(prevProps, props) && shallowEqualImmutable(dependencyValues, prevDeps)) {
      return;
    }

    var removeIgnoredFilterFields = function removeIgnoredFilterFields() {
      var viewFilters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
      var propertyNameBlacklist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : List();
      return viewFilters.filter(function (filter) {
        return !propertyNameBlacklist.includes(filter.get('property'));
      }) // remove the possible "default: true" from filters, this should not make them fail an equality test
      .map(function (filter) {
        return filter.delete('default');
      });
    };

    var filtersUpdated = !is(prevDeps.view && removeIgnoredFilterFields(prevDeps.view.filters, prevProps.filterFieldsToIgnoreForPageChange), view && removeIgnoredFilterFields(view.filters, filterFieldsToIgnoreForPageChange));
    var queryHasChanged = prevDeps.query !== query && (isOfMinSearchLength(query) || isOfMinSearchLength(prevDeps.query));
    var columnSortUpdated = (prevDeps.view && prevDeps.view.getIn(['state', 'sortColumnName'])) !== (view && view.getIn(['state', 'sortColumnName']));
    var columnSortOrderUpdated = (prevDeps.view && prevDeps.view.getIn(['state', 'order'])) !== (view && view.getIn(['state', 'order']));
    var sortsUpdated = columnSortUpdated || columnSortOrderUpdated;
    var pipelineIdChanged = pipelineId !== prevProps.pipelineId;

    if (filtersUpdated || queryHasChanged || sortsUpdated || pipelineIdChanged) {
      setPageState(function (prevState) {
        return prevState.set('currentPage', 0);
      });

      _onPageChange(0);

      setPageState(function (prevState) {
        return prevState.set('previousSearchQuery', getSearchQuery({
          isCrmObject: isCrmObject,
          view: view,
          objectType: objectType,
          pageSize: prevState.pageSize,
          currentPage: prevState.currentPage,
          query: query
        }));
      });
    }
  }, [_onPageChange, dependencyValues, filterFieldsToIgnoreForPageChange, getSearchQuery, isCrmObject, objectType, pipelineId, prevDeps, prevProps, prevProps.filterFieldsToIgnoreForPageChange, prevProps.query, prevProps.view, props, query, view]);
  var handleSelectAllChange = useCallback(function (_allSelected) {
    if (_allSelected && view) {
      selectAll(null, view.filters);
    } else {
      clearSelected();
    }
  }, [view]);
  var onChangeRows = useCallback(function (value) {
    var pageSize = parseInt(value, 10);
    localSettings.set('gridPageSize', pageSize);
    setPageState(function (prevState) {
      return prevState.merge({
        currentPage: 0,
        pageSize: pageSize,
        previousSearchQuery: getSearchQuery({
          currentPage: prevState.currentPage,
          isCrmObject: isCrmObject,
          objectType: objectType,
          pageSize: prevState.pageSize,
          query: query,
          view: view
        })
      });
    });

    _onPageChange(0);
  }, [_onPageChange, getSearchQuery, isCrmObject, objectType, query, view]);
  var onResize = useCallback(function (options) {
    var viewKey = ViewsStore.getViewKey({
      objectType: objectType,
      viewId: viewId
    });
    return ViewsActions.resize(viewKey.merge(options));
  }, [objectType, viewId]);
  var onPageChange = useCallback(function (_ref4) {
    var value = _ref4.target.value;
    var currentPage = pageState.currentPage,
        pageSize = pageState.pageSize;
    var newPage = value - 1;

    _onPageChange(newPage);

    setPageState(function (prevState) {
      return prevState.merge({
        currentPage: newPage,
        previousSearchQuery: getSearchQuery({
          view: view,
          isCrmObject: isCrmObject,
          objectType: objectType,
          pageSize: pageSize,
          currentPage: currentPage,
          query: query
        })
      });
    });
    clearSelected();
    var nextPage = {
      objectType: objectType,
      viewId: viewId,
      currentPage: newPage
    };
    setLastAccessedPage({
      objectType: objectType,
      value: nextPage
    });
    return nextPage;
  }, [_onPageChange, getSearchQuery, isCrmObject, objectType, pageState, query, view, viewId]);
  var onChangeSort = useCallback(function (options) {
    var _onChangeSort = actions.get('onChangeSort');

    var viewKey = ViewsStore.getViewKey({
      objectType: objectType,
      viewId: viewId
    });
    ViewsActions.sort(viewKey.merge(options));

    if (typeof _onChangeSort === 'function') {
      _onChangeSort(options);
    }
  }, [actions, objectType, viewId]);
  var notFoundMessage = useMemo(function () {
    var langConfig = Object.prototype.hasOwnProperty.call(notFoundMessages, objectType) ? notFoundMessages[objectType] : notFoundMessages.generic;
    return /*#__PURE__*/_jsx(EmptyStateMessage, {
      illustration: langConfig.illustration,
      objectType: objectType,
      subText: langConfig.subtext,
      titleText: langConfig.titleText,
      children: RhumbMarkerError
    }, viewId + "-notFound");
  }, [RhumbMarkerError, objectType, viewId]);

  if (!view) {
    return notFoundMessage;
  }

  return /*#__PURE__*/_jsx(QueryDataGridContainerAsync, {
    actions: actions,
    allSelected: allSelected,
    className: className,
    currentPage: pageState.currentPage,
    draggableRowType: draggableRowType,
    extraEmptyCtaProps: extraEmptyCtaProps,
    fixedHeight: fixedHeight,
    fixedWidth: fixedWidth,
    getBulkActions: getBulkActions,
    getTableBulkActions: getTableBulkActions,
    getCellComponent: getCellComponent,
    gridIsStatic: gridIsStatic,
    hasPipelineId: !!pipelineId,
    isCrmObject: isCrmObject,
    isEstimate: isEstimate,
    maxHeight: maxHeight,
    numSelected: numSelected,
    objectType: objectType,
    onChangeRows: onChangeRows,
    onChangeSort: onChangeSort,
    onLoadingFinish: onLoadingFinish,
    onPageChange: onPageChange,
    onResize: onResize,
    onRowDrop: onRowDrop,
    onRowMove: onRowMove,
    onSelectAllChange: handleSelectAllChange,
    pageSize: pageState.pageSize,
    previousSearchQuery: pageState.previousSearchQuery,
    properties: properties,
    queryParams: queryParams,
    RhumbMarkerEmpty: RhumbMarkerEmpty,
    RhumbMarkerSuccess: RhumbMarkerSuccess,
    searchQuery: getSearchQuery({
      currentPage: pageState.currentPage,
      ignoreViewPipeline: ignoreViewPipeline,
      isCrmObject: isCrmObject,
      objectType: objectType,
      pageSize: pageState.pageSize,
      pipelineId: pipelineId,
      query: query,
      view: view
    }),
    showLoadingOverlay: showLoadingOverlay,
    temporaryIds: disableIncludeTemporaryIds ? temporaryIds.set('include', ImmutableSet()) : temporaryIds,
    totalResults: totalResults,
    view: view,
    viewId: viewId,
    children: children
  }, viewId);
}

ViewDataGridContainer.displayName = 'ViewDataGridContainer';
ViewDataGridContainer.propTypes = {
  actions: ImmutablePropTypes.mapOf(PropTypes.func, PropTypes.string).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  disableIncludeTemporaryIds: PropTypes.bool,
  draggableRowType: PropTypes.string,
  extraEmptyCtaProps: PropTypes.object,
  filterFieldsToIgnoreForPageChange: ImmutablePropTypes.listOf(PropTypes.string),
  fixedHeight: PropTypes.number,
  fixedWidth: PropTypes.number,
  getBulkActions: PropTypes.func,
  getTableBulkActions: PropTypes.func,
  getCellComponent: PropTypes.func,
  gridIsStatic: PropTypes.bool,
  ignoreViewPipeline: PropTypes.bool.isRequired,
  isCrmObject: PropTypes.bool.isRequired,
  isEstimate: PropTypes.bool,
  maxHeight: PropTypes.string,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onPageChange: PropTypes.func,
  onLoadingFinish: PropTypes.func,
  onRowDrop: PropTypes.func,
  onRowMove: PropTypes.func,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  queryParams: PropTypes.object,
  RhumbMarkerEmpty: PropTypes.node,
  RhumbMarkerError: PropTypes.node,
  RhumbMarkerSuccess: PropTypes.node,
  showLoadingOverlay: PropTypes.bool,
  totalResults: PropTypes.number,
  viewId: PropTypes.string.isRequired
};
ViewDataGridContainer.defaultProps = {
  actions: ImmutableMap(),
  getBulkActions: always(undefined),
  ignoreViewPipeline: false,
  isCrmObject: false,
  numSelected: 0,
  onPageChange: emptyFunction,
  query: '',
  showLoadingOverlay: true,
  temporaryIds: ImmutableMap({
    exclude: ImmutableSet(),
    include: ImmutableSet()
  })
};
export { ViewDataGridContainer as UnwrappedViewDataGridContainer };
export default /*#__PURE__*/memo(ViewDataGridContainer, shallowEqualImmutable);