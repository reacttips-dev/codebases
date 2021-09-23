'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import debounce from 'react-utils/debounce';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIBox from 'UIComponents/layout/UIBox';
import UITabs from 'UIComponents/nav/UITabs';
import UITab from 'UIComponents/nav/UITab';
import { MAX_SEARCH_QUERY_LENGTH, RequestStatus, SEARCH_QUERY_WARN_LENGTH } from 'FileManagerCore/Constants';
import { readOnlyReasonProp } from 'FileManagerCore/constants/propTypes';
import { DrawerTypes, IMAGE_COLUMN_COUNT, DEFAULT_ROWS_TO_FETCH, PAGE_SIZE } from '../../Constants';
import * as Actions from '../../actions/Actions';
import FoldersAndFilesContainer from '../../containers/browser/FoldersAndFilesContainer';
import EmptySearchResults from './EmptySearchResults';
import { getIsShutterstockEnabled } from '../../selectors/Configuration';
import { getSearchTiles, getStockTiles } from '../../selectors/Tiles';
import { searchShutterstock } from '../../actions/Shutterstock';
import Shutterstock from './Shutterstock';
import ShutterstockTOS from './ShutterstockTOS';
import { SEARCH_SHUTTERSTOCK_RESET } from 'FileManagerCore/actions/ActionTypes';
import { getFiles, getFilesTotal, getFetchFilesRequestStatus } from 'FileManagerCore/selectors/Files';
import { getReadOnlyReason } from 'FileManagerCore/selectors/Permissions';
import { searchFolders as _searchFolders } from 'FileManagerCore/actions/FolderFetch';
import StockImagesNoAccess from 'FileManagerCore/components/permissions/StockImagesNoAccess';
import { getTotalFilteredTiles } from '../../utils/Tiles';
import { getProviderParam } from '../../utils/network';
var SEARCH_DEBOUNCE_MS = 500;
var trackedSearchLengthLimit = false;

var SearchPanel = /*#__PURE__*/function (_Component) {
  _inherits(SearchPanel, _Component);

  function SearchPanel(props) {
    var _this;

    _classCallCheck(this, SearchPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchPanel).call(this, props));
    _this.debouncedSearch = debounce(function (searchQuery) {
      _this.props.searchFolders(searchQuery);

      _this.props.onSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    _this.handleSearchChange = function (event) {
      var searchQuery = event.target.value;

      _this.setState({
        searchQuery: searchQuery
      });

      _this.debouncedSearch(searchQuery);
    };

    _this.getValidationMessage = function (value) {
      if (value && value.length > SEARCH_QUERY_WARN_LENGTH) {
        if (!trackedSearchLengthLimit) {
          _this.props.onTrackInteraction('fileManagerExploreFiles', 'search-over-length-limit');

          trackedSearchLengthLimit = true;
        }

        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.search.overMaxLength",
          options: {
            maxLength: MAX_SEARCH_QUERY_LENGTH
          }
        });
      }

      return null;
    };

    _this.state = {
      searchQuery: props.searchQuery
    };
    _this.handleLoadMoreRows = _this.handleLoadMoreRows.bind(_assertThisInitialized(_this));
    _this.handleLoadMoreStockImages = _this.handleLoadMoreStockImages.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SearchPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          searchQuery = _this$props.searchQuery,
          onTrackInteraction = _this$props.onTrackInteraction;
      onTrackInteraction('Browse Shutterstock', 'started-search');
      this.props.searchFolders(searchQuery);
    }
  }, {
    key: "handleLoadMoreRows",
    value: function handleLoadMoreRows() {
      var _this$props2 = this.props,
          status = _this$props2.status,
          files = _this$props2.files,
          fetchFiles = _this$props2.fetchFiles,
          type = _this$props2.type;
      var searchQuery = this.state.searchQuery;

      if (status === RequestStatus.PENDING) {
        return;
      }

      fetchFiles({
        offset: files.count(),
        type: type,
        searchQuery: searchQuery
      });
    }
  }, {
    key: "handleLoadMoreStockImages",
    value: function handleLoadMoreStockImages() {
      var _this$props3 = this.props,
          stockImages = _this$props3.stockImages,
          fetchStockFiles = _this$props3.fetchStockFiles,
          type = _this$props3.type,
          stockStatus = _this$props3.stockStatus;
      var searchQuery = this.state.searchQuery;

      if (stockStatus === RequestStatus.PENDING) {
        return;
      }

      var page = Math.ceil(stockImages.size / PAGE_SIZE) + 1;
      fetchStockFiles({
        searchQuery: searchQuery,
        page: page,
        pageSize: PAGE_SIZE,
        type: type
      });
    }
  }, {
    key: "renderTiles",
    value: function renderTiles() {
      var _this$props4 = this.props,
          type = _this$props4.type,
          total = _this$props4.total,
          tiles = _this$props4.tiles,
          status = _this$props4.status,
          disableUpload = _this$props4.disableUpload,
          onInsert = _this$props4.onInsert,
          previousSelectedFileId = _this$props4.previousSelectedFileId;

      if (status === RequestStatus.SUCCEEDED && total === 0) {
        return /*#__PURE__*/_jsx(EmptySearchResults, {});
      }

      return /*#__PURE__*/_jsx(FoldersAndFilesContainer, {
        type: type,
        tiles: tiles,
        total: total,
        onInsert: onInsert,
        onLoadMoreFiles: this.handleLoadMoreRows,
        disableUpload: disableUpload,
        previousSelectedFileId: previousSelectedFileId
      });
    }
  }, {
    key: "renderShutterstockTiles",
    value: function renderShutterstockTiles() {
      var _this$props5 = this.props,
          stockStatus = _this$props5.stockStatus,
          stockTiles = _this$props5.stockTiles,
          stockTotal = _this$props5.stockTotal,
          onInsert = _this$props5.onInsert;

      if (stockStatus === RequestStatus.SUCCEEDED && stockTotal === 0) {
        return /*#__PURE__*/_jsx(EmptySearchResults, {});
      }

      return /*#__PURE__*/_jsx(Shutterstock, {
        tiles: stockTiles,
        total: stockTotal,
        onInsert: onInsert,
        onLoadMoreImages: this.handleLoadMoreStockImages
      });
    }
  }, {
    key: "renderShutterstockTabContent",
    value: function renderShutterstockTabContent() {
      if (this.props.readOnlyReason) {
        return /*#__PURE__*/_jsx(StockImagesNoAccess, {
          readOnlyReason: this.props.readOnlyReason,
          showIllustration: false
        });
      }

      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(ShutterstockTOS, {
          use: "light"
        }), this.renderShutterstockTiles()]
      });
    }
  }, {
    key: "renderTabs",
    value: function renderTabs() {
      return /*#__PURE__*/_jsxs(UITabs, {
        defaultSelected: "files",
        className: "search-panel__tab-growth-fix",
        panelClassName: "search-panel__tab-growth-fix p-x-0 flex",
        children: [/*#__PURE__*/_jsx(UITab, {
          tabId: "files",
          title: I18n.text('FileManagerLib.panels.tabs.files'),
          children: this.renderTiles()
        }), /*#__PURE__*/_jsx(UITab, {
          tabId: "shutterstock",
          title: I18n.text('FileManagerLib.panels.tabs.shutterstock.heading'),
          children: this.renderShutterstockTabContent()
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          isShutterstockEnabled = _this$props6.isShutterstockEnabled,
          type = _this$props6.type;
      var searchQuery = this.state.searchQuery;
      return /*#__PURE__*/_jsxs(UIFlex, {
        direction: "column",
        children: [/*#__PURE__*/_jsx(UISearchInput, {
          className: "m-top-3",
          value: searchQuery,
          onChange: this.handleSearchChange,
          getValidationMessage: this.getValidationMessage,
          maxLength: MAX_SEARCH_QUERY_LENGTH,
          "data-test-id": "drawer-search-input"
        }), /*#__PURE__*/_jsx(UIBox, {
          className: "flex-column m-top-4",
          grow: 1,
          alignSelf: "stretch",
          children: isShutterstockEnabled && type === DrawerTypes.IMAGE ? this.renderTabs() : this.renderTiles()
        })]
      });
    }
  }]);

  return SearchPanel;
}(Component);

SearchPanel.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  files: PropTypes.instanceOf(Immutable.List).isRequired,
  tiles: PropTypes.instanceOf(Immutable.List).isRequired,
  stockTiles: PropTypes.instanceOf(Immutable.List).isRequired,
  status: PropTypes.oneOf(Object.keys(RequestStatus)),
  stockStatus: PropTypes.oneOf(Object.keys(RequestStatus)),
  total: PropTypes.number.isRequired,
  stockTotal: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  stockImages: PropTypes.instanceOf(Immutable.List).isRequired,
  fetchFiles: PropTypes.func.isRequired,
  searchFolders: PropTypes.func.isRequired,
  fetchStockFiles: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  isShutterstockEnabled: PropTypes.bool.isRequired,
  readOnlyReason: readOnlyReasonProp,
  onTrackInteraction: PropTypes.func.isRequired,
  disableUpload: PropTypes.bool.isRequired,
  previousSelectedFileId: PropTypes.number
};

var mapStateToProps = function mapStateToProps(state, props) {
  var shutterstock = state.shutterstock,
      panel = state.panel;
  var stockTiles = getStockTiles(state, props);
  var files = getFiles(state);
  var tiles = getSearchTiles(state, props);
  return {
    files: files,
    total: getTotalFilteredTiles({
      savedFilesCount: getFilesTotal(state),
      files: files,
      tiles: tiles
    }),
    stockTiles: stockTiles,
    tiles: tiles,
    stockTotal: shutterstock.get('total'),
    stockImages: shutterstock.get('results'),
    stockStatus: shutterstock.get('searchStatus'),
    status: getFetchFilesRequestStatus(state),
    searchQuery: panel.getIn(['present', 'searchQuery']),
    isShutterstockEnabled: getIsShutterstockEnabled(state),
    readOnlyReason: getReadOnlyReason(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    onBack: function onBack() {
      dispatch(Actions.goBack());
    },
    onSearch: function onSearch(searchQuery) {
      dispatch(Actions.setSearchQuery(searchQuery));
    },
    onTrackInteraction: function onTrackInteraction(name, action, meta) {
      dispatch(Actions.trackInteraction(name, action, meta));
    },
    fetchFiles: function fetchFiles(_ref) {
      var initial = _ref.initial,
          searchQuery = _ref.searchQuery,
          _ref$offset = _ref.offset,
          offset = _ref$offset === void 0 ? 0 : _ref$offset,
          type = _ref.type;
      var query = Object.assign({
        limit: DEFAULT_ROWS_TO_FETCH * IMAGE_COLUMN_COUNT,
        search: searchQuery,
        offset: offset,
        type: type
      }, getProviderParam(ownProps.type));

      if (initial) {
        dispatch(Actions.fetchInitialFiles(query, ownProps.type));
      } else {
        dispatch(Actions.fetchMoreFiles(query, ownProps.type));
      }
    },
    fetchStockFiles: function fetchStockFiles(query) {
      var searchQuery = query.searchQuery,
          page = query.page,
          pageSize = query.pageSize,
          initial = query.initial;

      if (initial) {
        dispatch({
          type: SEARCH_SHUTTERSTOCK_RESET
        });
      }

      dispatch(searchShutterstock({
        searchQuery: searchQuery,
        page: page,
        pageSize: pageSize
      }));
    },
    searchFolders: function searchFolders() {
      dispatch(_searchFolders.apply(void 0, arguments));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);