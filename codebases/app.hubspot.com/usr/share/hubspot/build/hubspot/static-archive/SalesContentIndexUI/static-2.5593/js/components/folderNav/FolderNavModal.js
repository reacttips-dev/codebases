'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { cloneElement } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { OrderedMap, List, Map as ImmutableMap } from 'immutable';
import partial from 'transmute/partial';
import debounce from 'transmute/debounce';
import { CONTENT_TYPE_FIELD } from 'SalesContentIndexUI/data/constants/SearchFields';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import IndexUIActions from 'SalesContentIndexUI/data/actions/IndexUIActions';
import filter from 'SalesContentIndexUI/data/utils/filter';
import DefaultSort from 'SalesContentIndexUI/data/lib/DefaultSort';
import UIModal from 'UIComponents/dialog/UIModal';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIFolderNav from 'UIComponents/nav/UIFolderNav';
import UIFolderNavItem from 'UIComponents/nav/UIFolderNavItem';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIAlert from 'UIComponents/alert/UIAlert';
import FolderIcon from './FolderIcon';
import FolderNavSelectedCopy from './FolderNavSelectedCopy';
import FolderNavNoFolderItem from './FolderNavNoFolderItem';
import FolderNavFooter from './FolderNavFooter';
import FolderNavCreateFolder from './FolderNavCreateFolder';
import H2 from 'UIComponents/elements/headings/H2';
var CREATION_ERROR = 'creation';
var MOVE_ERROR = 'move';

var searchResultsToMap = function searchResultsToMap(results) {
  return results.reduce(function (searchResultsMap, result) {
    var searchResult = SearchResultRecord.init(result);
    return searchResultsMap.set(searchResult.id, searchResult);
  }, OrderedMap());
};

export default createReactClass({
  displayName: "FolderNavModal",
  propTypes: {
    searchResult: PropTypes.instanceOf(SearchResultRecord),
    searchResults: PropTypes.instanceOf(ImmutableMap),
    folderContentType: PropTypes.string.isRequired,
    searchFetch: PropTypes.func.isRequired,
    saveFolder: PropTypes.func.isRequired,
    moveSearchResults: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    alert: PropTypes.element
  },
  getInitialState: function getInitialState() {
    this.debouncedFetchFolders = debounce(300, this.fetchFolders);
    return {
      folderName: '',
      isSavingFolder: false,
      createFolderOpen: false,
      createFolderError: false,
      selectedFolder: null,
      folderSearchResults: OrderedMap(),
      folderSearchQuery: new SearchQueryRecord({
        offset: 0,
        limit: 20,
        filters: List([filter(CONTENT_TYPE_FIELD, this.props.folderContentType)]),
        sorts: List([DefaultSort])
      }),
      hasMore: true,
      folderSearchStatus: SearchStatus.LOADING
    };
  },
  componentDidMount: function componentDidMount() {
    this.fetchFolders();
    this._folderNav = document.getElementsByClassName('move-data-item-modal-folder-nav')[0];

    this._folderNav.addEventListener('scroll', this.fetchMoreFolders);
  },
  componentWillUnmount: function componentWillUnmount() {
    this._folderNav.removeEventListener('scroll', this.fetchMoreFolders);
  },
  fetchFolders: function fetchFolders() {
    var _this = this;

    this.setState({
      folderSearchStatus: SearchStatus.LOADING
    });
    this.props.searchFetch(this.state.folderSearchQuery).then(function (resultsData) {
      var hasMore = resultsData.get('hasMore');
      var results = searchResultsToMap(resultsData.get('results'));

      _this.setState(function (_ref) {
        var folderSearchResults = _ref.folderSearchResults;
        return {
          hasMore: hasMore,
          folderSearchResults: folderSearchResults.merge(results),
          folderSearchStatus: SearchStatus.SUCCEEDED
        };
      });
    });
  },
  fetchMoreFolders: function fetchMoreFolders() {
    var hasMore = this.state.hasMore;
    var _this$_folderNav = this._folderNav,
        scrollTop = _this$_folderNav.scrollTop,
        scrollHeight = _this$_folderNav.scrollHeight,
        clientHeight = _this$_folderNav.clientHeight;
    var isCloseToBottom = scrollTop + clientHeight + 50 >= scrollHeight;

    if (hasMore && isCloseToBottom) {
      this.setState(function (_ref2) {
        var folderSearchQuery = _ref2.folderSearchQuery;
        return {
          folderSearchQuery: folderSearchQuery.set('offset', folderSearchQuery.offset + folderSearchQuery.limit)
        };
      }, this.fetchFolders);
    }
  },
  setSelectedFolder: function setSelectedFolder(selectedFolder) {
    this.setState({
      selectedFolder: selectedFolder
    });
  },
  isInitialFetchLoading: function isInitialFetchLoading() {
    var _this$state = this.state,
        hasMore = _this$state.hasMore,
        folderSearchStatus = _this$state.folderSearchStatus,
        folderSearchResults = _this$state.folderSearchResults;
    return folderSearchStatus === SearchStatus.LOADING && hasMore && folderSearchResults.isEmpty();
  },
  handleMoveClick: function handleMoveClick() {
    var _this2 = this;

    var _this$props = this.props,
        searchResults = _this$props.searchResults,
        moveSearchResults = _this$props.moveSearchResults;
    var _this$state$selectedF = this.state.selectedFolder,
        name = _this$state$selectedF.name,
        contentId = _this$state$selectedF.contentId;
    var contentIds = searchResults.map(function (searchResult) {
      return searchResult.contentId;
    });
    var ids = searchResults.map(function (searchResult) {
      return searchResult.id;
    });
    var count = contentIds.size;
    var newFolderId = contentId === 0 ? null : contentId;
    var folderWillNotChange = searchResults.every(function (searchResult) {
      return searchResult.folderId === newFolderId;
    });

    if (folderWillNotChange) {
      this.props.onReject();
      return;
    }

    this.setState({
      alertType: null
    });
    moveSearchResults(contentIds, newFolderId).then(function () {
      IndexUIActions.removeResults(ids);

      _this2.props.onConfirm({
        name: name,
        count: count
      });
    }, function () {
      _this2.setState({
        alertType: MOVE_ERROR
      });
    });
  },
  handleSaveFolder: function handleSaveFolder() {
    var _this3 = this;

    var saveFolder = this.props.saveFolder;
    var folderName = this.state.folderName;
    this.setState({
      createFolderOpen: false,
      alertType: null,
      isSavingFolder: true
    });
    saveFolder({
      name: folderName
    }).then(function (folderSearchResult) {
      _this3.setState(function (_ref3) {
        var folderSearchResults = _ref3.folderSearchResults;
        return {
          folderName: '',
          isSavingFolder: false,
          folderSearchResults: OrderedMap(_defineProperty({}, folderSearchResult.id, folderSearchResult)).merge(folderSearchResults)
        };
      });
    }, function () {
      _this3.setState({
        alertType: CREATION_ERROR,
        isSavingFolder: false
      });
    });
  },
  setFolderSearchQuery: function setFolderSearchQuery(_ref4) {
    var value = _ref4.target.value;
    this.setState(function (_ref5) {
      var folderSearchQuery = _ref5.folderSearchQuery;
      return {
        hasMore: true,
        folderSearchResults: OrderedMap(),
        folderSearchQuery: folderSearchQuery.merge({
          query: value,
          offset: 0
        }),
        folderSearchStatus: SearchStatus.LOADING
      };
    }, this.debouncedFetchFolders);
  },
  renderAlert: function renderAlert() {
    var alert = this.props.alert;

    if (!alert) {
      return null;
    }

    return /*#__PURE__*/cloneElement(alert, {
      className: 'm-bottom-4',
      use: 'inline'
    });
  },
  renderError: function renderError() {
    var alertType = this.state.alertType;

    if (!alertType) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIAlert, {
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.folderModal.error." + alertType + ".title"
      }),
      type: "danger",
      use: "inline",
      className: "m-bottom-4",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.folderModal.error." + alertType + ".message"
      })
    });
  },
  renderFolderLoading: function renderFolderLoading() {
    if (!this.state.hasMore && !this.state.isSavingFolder) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIFlex, {
      align: "center",
      children: /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true,
        minHeight: 50
      })
    });
  },
  renderFolders: function renderFolders() {
    var _this4 = this;

    if (this.isInitialFetchLoading() || this.state.isSavingFolder) {
      return null;
    }

    return this.state.folderSearchResults.map(function (folderSearchResult) {
      return /*#__PURE__*/_jsx(UIFolderNavItem, {
        open: false,
        value: folderSearchResult.contentId,
        title: folderSearchResult.name,
        onClick: partial(_this4.setSelectedFolder, folderSearchResult),
        iconLeft: FolderIcon
      }, "folder-nav-item-" + folderSearchResult.contentId);
    }).toList();
  },
  render: function render() {
    var _this5 = this;

    var _this$state2 = this.state,
        selectedFolder = _this$state2.selectedFolder,
        folderSearchQuery = _this$state2.folderSearchQuery;
    var _this$props2 = this.props,
        searchResult = _this$props2.searchResult,
        searchResults = _this$props2.searchResults,
        saveFolder = _this$props2.saveFolder,
        onReject = _this$props2.onReject;
    return /*#__PURE__*/_jsxs(UIModal, {
      dialogClassName: "folder-nav-modal",
      size: "auto",
      onEsc: onReject,
      children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: onReject
        }), /*#__PURE__*/_jsx(H2, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "salesContentIndexUI.tableRowHoverButtons.moveFolders"
          })
        })]
      }), /*#__PURE__*/_jsxs(UIDialogBody, {
        children: [this.renderAlert(), this.renderError(), /*#__PURE__*/_jsx(UISearchInput, {
          value: folderSearchQuery.query,
          className: "m-bottom-3",
          onChange: this.setFolderSearchQuery
        }), /*#__PURE__*/_jsx(FolderNavSelectedCopy, {
          searchResult: searchResult,
          searchResults: searchResults,
          selectedFolder: selectedFolder
        }), /*#__PURE__*/_jsxs(UIFolderNav, {
          value: selectedFolder && selectedFolder.contentId,
          style: {
            width: 300
          },
          className: "move-data-item-modal-folder-nav",
          children: [/*#__PURE__*/_jsx(FolderNavNoFolderItem, {
            isInitialFetchLoading: this.isInitialFetchLoading(),
            setSelectedFolder: this.setSelectedFolder
          }), this.renderFolders(), this.renderFolderLoading()]
        })]
      }), /*#__PURE__*/_jsxs(UIDialogFooter, {
        className: "p-top-0",
        children: [/*#__PURE__*/_jsx(FolderNavCreateFolder, {
          folderName: this.state.folderName,
          createFolderOpen: this.state.createFolderOpen,
          saveFolder: saveFolder,
          onSaveFolder: this.handleSaveFolder,
          onFolderOpenChange: function onFolderOpenChange(createFolderOpen) {
            return _this5.setState({
              createFolderOpen: createFolderOpen
            });
          },
          onFolderNameChange: function onFolderNameChange(folderName) {
            return _this5.setState({
              folderName: folderName
            });
          }
        }), /*#__PURE__*/_jsx(FolderNavFooter, {
          onConfirm: this.handleMoveClick,
          onClose: onReject,
          selectedFolder: selectedFolder
        })]
      })]
    });
  }
});