'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { OrderedMap } from 'immutable';
import identity from 'transmute/identity';
import createViewFilters from 'SalesContentIndexUI/data/utils/createViewFilters';
import getDefaultViewFilter from 'SalesContentIndexUI/data/utils/getDefaultViewFilter';
import configureStore from 'SalesContentIndexUI/data/redux/configureStore';
import SearchReducer from 'SalesContentIndexUI/data/redux/reducers/SearchReducer';
import ViewFiltersReducer from 'SalesContentIndexUI/data/redux/reducers/ViewFiltersReducer';
import IndexUIActionsMiddleware from 'SalesContentIndexUI/data/redux/middleware/IndexUIActionsMiddleware';
import SalesContentIndexUIReduxContext from 'SalesContentIndexUI/data/redux/SalesContentIndexUIReduxContext';
import DefaultSort from 'SalesContentIndexUI/data/lib/DefaultSort';
import TableRowLimit from 'SalesContentIndexUI/constants/TableRowLimit';
import SearchActions from 'SalesContentIndexUI/data/actions/SearchActions';
import FolderActions from 'SalesContentIndexUI/data/actions/FolderActions';
import IndexUIActions from 'SalesContentIndexUI/data/actions/IndexUIActions';
import ModalDecorator from 'SalesContentIndexUI/decorators/ModalDecorator';
import QueryParamDecorator from 'SalesContentIndexUI/decorators/QueryParamDecorator';
import createIndexTableContainer from './createIndexTableContainer';
export default (function (_ref) {
  var looseItemContentType = _ref.looseItemContentType,
      folderContentType = _ref.folderContentType,
      _ref$additionalViewFi = _ref.additionalViewFilters,
      additionalViewFilters = _ref$additionalViewFi === void 0 ? OrderedMap() : _ref$additionalViewFi,
      allContentFilterList = _ref.allContentFilterList,
      getUserId = _ref.getUserId,
      getTeamIds = _ref.getTeamIds,
      tableColumns = _ref.tableColumns,
      searchFetch = _ref.searchFetch,
      TableRow = _ref.TableRow,
      FolderRow = _ref.FolderRow,
      _ref$EmptyState = _ref.EmptyState,
      EmptyState = _ref$EmptyState === void 0 ? function () {
    return /*#__PURE__*/_jsx("div", {});
  } : _ref$EmptyState,
      _ref$isModal = _ref.isModal,
      isModal = _ref$isModal === void 0 ? false : _ref$isModal,
      _ref$searchOptions = _ref.searchOptions,
      searchOptions = _ref$searchOptions === void 0 ? {
    currentSort: DefaultSort,
    currentViewFilterName: null,
    onSetSort: identity,
    onSetViewFilter: identity,
    onSetFolder: identity,
    onSearch: identity,
    searchLimit: TableRowLimit.INDEX
  } : _ref$searchOptions,
      _ref$useOwnerViewFilt = _ref.useOwnerViewFilters,
      useOwnerViewFilters = _ref$useOwnerViewFilt === void 0 ? false : _ref$useOwnerViewFilt;
  var viewFilters = createViewFilters({
    looseItemContentType: looseItemContentType,
    folderContentType: folderContentType,
    getUserId: getUserId,
    getTeamIds: getTeamIds,
    additionalViewFilters: additionalViewFilters,
    useOwnerViewFilters: useOwnerViewFilters
  });
  var defaultViewFilter = getDefaultViewFilter({
    viewFilters: viewFilters,
    currentViewFilterName: searchOptions.currentViewFilterName,
    isModal: isModal,
    looseItemContentType: looseItemContentType
  });
  SearchActions.init({
    searchFetch: searchFetch,
    looseItemContentType: looseItemContentType,
    folderContentType: folderContentType,
    defaultViewFilter: defaultViewFilter,
    searchOptions: searchOptions
  });
  var store = configureStore({
    search: SearchReducer({
      defaultViewFilter: defaultViewFilter,
      // TODO: Eventually remove this fallback to defaultViewFilter
      allContentFilterList: allContentFilterList || defaultViewFilter.getFilters(),
      looseItemContentType: looseItemContentType,
      folderContentType: folderContentType,
      isModal: isModal,
      options: searchOptions
    }),
    viewFilters: ViewFiltersReducer({
      viewFilters: viewFilters
    })
  }, IndexUIActionsMiddleware);
  FolderActions.init(searchFetch);
  IndexUIActions.init(store.dispatch);
  var IndexTableContainer = createIndexTableContainer({
    folderContentType: folderContentType,
    tableColumns: tableColumns,
    searchFetch: searchFetch,
    TableRow: TableRow,
    FolderRow: FolderRow,
    EmptyState: EmptyState,
    isModal: isModal,
    looseItemContentType: looseItemContentType,
    useOwnerViewFilters: useOwnerViewFilters
  });
  var DecoratedIndexTableContainer = isModal ? ModalDecorator(IndexTableContainer) : QueryParamDecorator(IndexTableContainer);

  var ConnectedIndexTableContainer = function ConnectedIndexTableContainer(props) {
    return /*#__PURE__*/_jsx(Provider, {
      store: store,
      context: SalesContentIndexUIReduxContext,
      children: /*#__PURE__*/_jsx(DecoratedIndexTableContainer, Object.assign({}, props))
    });
  };

  ConnectedIndexTableContainer.propTypes = {
    children: PropTypes.any
  };
  return ConnectedIndexTableContainer;
});