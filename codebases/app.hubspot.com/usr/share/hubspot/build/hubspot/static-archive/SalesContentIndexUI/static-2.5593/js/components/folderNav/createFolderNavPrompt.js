'use es6';

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
import filter from 'SalesContentIndexUI/data/utils/filter';
import DefaultSort from 'SalesContentIndexUI/data/lib/DefaultSort';
import FolderActions from 'SalesContentIndexUI/data/actions/FolderActions';
import Promptable from 'UIComponents/decorators/Promptable';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
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
import FolderIcon from './FolderIcon';
import FolderNavSelectedCopy from './FolderNavSelectedCopy';
import FolderNavNoFolderItem from './FolderNavNoFolderItem';
import FolderNavFooter from './FolderNavFooter';
import H2 from 'UIComponents/elements/headings/H2';
var _pendingFolderFetch = null;
export default (function (searchFetch, folderContentType) {
  FolderActions.init(searchFetch);
  var folderSearch = FolderActions.get('search');
  var FolderNavModal = createReactClass({
    displayName: "FolderNavModal",
    propTypes: Object.assign({}, PromptablePropInterface, {
      searchResult: PropTypes.instanceOf(SearchResultRecord),
      searchResults: PropTypes.instanceOf(ImmutableMap),
      alert: PropTypes.element
    }),
    getInitialState: function getInitialState() {
      return {
        selectedFolder: null,
        folderSearchResults: OrderedMap(),
        folderSearchQuery: new SearchQueryRecord({
          offset: 0,
          limit: 20,
          filters: List([filter(CONTENT_TYPE_FIELD, folderContentType)]),
          sorts: List([DefaultSort])
        }),
        hasMore: true,
        folderSearchStatus: SearchStatus.LOADING
      };
    },
    UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
      this.fetchFolders();
      this.debouncedFetchFolders = debounce(300, this.fetchFolders);
    },
    componentDidMount: function componentDidMount() {
      this._folderNav = document.getElementsByClassName('move-data-item-modal-folder-nav')[0];

      this._folderNav.addEventListener('scroll', this.fetchMoreFolders);

      this._folderNav.addEventListener('resize', this.fetchMoreFolders);
    },
    componentWillUnmount: function componentWillUnmount() {
      this._folderNav.removeEventListener('scroll', this.fetchMoreFolders);

      this._folderNav.removeEventListener('resize', this.fetchMoreFolders);
    },
    fetchFolders: function fetchFolders() {
      var _this = this;

      if (_pendingFolderFetch) {
        return;
      }

      this.setState({
        folderSearchStatus: SearchStatus.LOADING
      });
      _pendingFolderFetch = folderSearch(this.state.folderSearchQuery).then(function (_ref) {
        var hasMore = _ref.hasMore,
            results = _ref.results;

        _this.setState(function (_ref2) {
          var folderSearchResults = _ref2.folderSearchResults;
          return {
            hasMore: hasMore,
            folderSearchResults: folderSearchResults.merge(results),
            folderSearchStatus: SearchStatus.SUCCEEDED
          };
        });
      }).finally(function () {
        _pendingFolderFetch = null;
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
        this.setState(function (_ref3) {
          var folderSearchQuery = _ref3.folderSearchQuery;
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
      var selectedFolder = this.state.selectedFolder;
      this.props.onConfirm(selectedFolder);
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
    renderFolderLoading: function renderFolderLoading() {
      if (!this.state.hasMore) {
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
    renderAlert: function renderAlert() {
      return this.props.alert ? /*#__PURE__*/cloneElement(this.props.alert) : null;
    },
    renderFolders: function renderFolders() {
      var _this2 = this;

      if (this.isInitialFetchLoading()) {
        return null;
      }

      return this.state.folderSearchResults.map(function (folderSearchResult) {
        return /*#__PURE__*/_jsx(UIFolderNavItem, {
          open: false,
          value: folderSearchResult.contentId,
          title: folderSearchResult.name,
          onClick: partial(_this2.setSelectedFolder, folderSearchResult),
          iconLeft: FolderIcon
        }, "folder-nav-item-" + folderSearchResult.contentId);
      }).toList();
    },
    render: function render() {
      var _this$state2 = this.state,
          selectedFolder = _this$state2.selectedFolder,
          folderSearchQuery = _this$state2.folderSearchQuery;
      var _this$props = this.props,
          searchResult = _this$props.searchResult,
          searchResults = _this$props.searchResults,
          onReject = _this$props.onReject;
      return /*#__PURE__*/_jsxs(UIModal, {
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
          children: [this.renderAlert(), /*#__PURE__*/_jsx(UISearchInput, {
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
        }), /*#__PURE__*/_jsx(UIDialogFooter, {
          children: /*#__PURE__*/_jsx(FolderNavFooter, {
            onConfirm: this.handleMoveClick,
            onClose: onReject,
            selectedFolder: selectedFolder
          })
        })]
      });
    }
  });
  return Promptable(FolderNavModal);
});