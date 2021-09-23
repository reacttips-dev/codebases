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
import { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import I18n from 'I18n';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIBox from 'UIComponents/layout/UIBox';
import UIIcon from 'UIComponents/icon/UIIcon';
import Small from 'UIComponents/elements/Small';
import { RequestStatus } from 'FileManagerCore/Constants';
import { addFolder } from 'FileManagerCore/actions/Folders';
import { DrawerTypes, IMAGE_COLUMN_COUNT, DEFAULT_ROWS_TO_FETCH } from '../../Constants';
import { getChildFolders } from '../../selectors/Folders';
import { getTiles } from '../../selectors/Tiles';
import { getTotalFilteredTiles } from '../../utils/Tiles';
import { fetchInitialFiles, fetchMoreFiles, trackInteraction, browseToFolder } from '../../actions/Actions';
import BrowseFolders from './BrowseFolders';
import FoldersAndFilesContainer from '../../containers/browser/FoldersAndFilesContainer';
import SearchWithSuggestions from './SearchWithSuggestions';
import AddFolderButton from './AddFolderButton';
import EmptyFolder from './EmptyFolder';
import { getFiles, getFilesTotal, getFetchFilesRequestStatus } from 'FileManagerCore/selectors/Files';
import { getIsReadOnly } from 'FileManagerCore/selectors/Permissions';
import { getSelectedFolderInPanel, getSelectedFolderWithAncestors } from '../../selectors/Panel';
import { getProviderParam } from '../../utils/network';
import { getFilterType } from '../../selectors/Filter';
import FileExtensionFilters from '../../enums/FileExtensionFilters';
import FilterHintMessage from './FilterHintMessage';
import FolderBreadcrumbs from './FolderBreadcrumbs';

var FolderPanel = /*#__PURE__*/function (_Component) {
  _inherits(FolderPanel, _Component);

  function FolderPanel(props) {
    var _this;

    _classCallCheck(this, FolderPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FolderPanel).call(this, props));
    _this.handleLoadMoreRows = _this.handleLoadMoreRows.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FolderPanel, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          selectedFolder = _this$props.selectedFolder,
          fetchFiles = _this$props.fetchFiles,
          type = _this$props.type;

      if (prevProps.selectedFolder !== selectedFolder) {
        fetchFiles({
          folderId: selectedFolder.get('id'),
          initial: true,
          type: type
        });
      }
    }
  }, {
    key: "handleLoadMoreRows",
    value: function handleLoadMoreRows() {
      var _this$props2 = this.props,
          status = _this$props2.status,
          files = _this$props2.files,
          selectedFolder = _this$props2.selectedFolder,
          fetchFiles = _this$props2.fetchFiles,
          type = _this$props2.type;

      if (status === RequestStatus.PENDING) {
        return;
      }

      fetchFiles({
        offset: files.count(),
        folderId: selectedFolder.get('id'),
        type: type
      });
    }
  }, {
    key: "renderTiles",
    value: function renderTiles() {
      var _this$props3 = this.props,
          type = _this$props3.type,
          total = _this$props3.total,
          tiles = _this$props3.tiles,
          status = _this$props3.status,
          selectedFolder = _this$props3.selectedFolder,
          onAddFolder = _this$props3.onAddFolder,
          onInsert = _this$props3.onInsert,
          folders = _this$props3.folders,
          isReadOnly = _this$props3.isReadOnly,
          disableUpload = _this$props3.disableUpload,
          previousSelectedFileId = _this$props3.previousSelectedFileId;

      if (status === RequestStatus.SUCCEEDED && total === 0) {
        return /*#__PURE__*/_jsx(EmptyFolder, {
          selectedFolder: selectedFolder,
          folders: folders,
          onCreateFolder: onAddFolder,
          isReadOnly: isReadOnly || disableUpload,
          type: type
        });
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
    key: "renderFolderBreadcrumbs",
    value: function renderFolderBreadcrumbs() {
      var _this$props4 = this.props,
          onClickBreadcrumb = _this$props4.onClickBreadcrumb,
          selectedFolderWithAncestors = _this$props4.selectedFolderWithAncestors;
      return /*#__PURE__*/_jsx(FolderBreadcrumbs, {
        folderWithAncestors: selectedFolderWithAncestors,
        onSelectFolder: onClickBreadcrumb
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          selectedFolder = _this$props5.selectedFolder,
          onSelectFolder = _this$props5.onSelectFolder,
          folders = _this$props5.folders,
          onAddFolder = _this$props5.onAddFolder,
          type = _this$props5.type,
          filterType = _this$props5.filterType,
          isReadOnly = _this$props5.isReadOnly,
          onTrackInteraction = _this$props5.onTrackInteraction;
      return /*#__PURE__*/_jsxs(UIFlex, {
        className: "folder-panel",
        direction: "column",
        children: [filterType !== FileExtensionFilters.NONE && /*#__PURE__*/_jsx(FilterHintMessage, {
          drawerType: type
        }), /*#__PURE__*/_jsx(SearchWithSuggestions, {
          type: type
        }), /*#__PURE__*/_jsxs(UIFlex, {
          wrap: "wrap",
          className: "folder-panel__toolbar m-top-6 m-bottom-4",
          justify: "between",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex-grow-1"
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(BrowseFolders, {
              folder: selectedFolder,
              onChangeFolder: onSelectFolder,
              onTrackInteraction: onTrackInteraction
            }), /*#__PURE__*/_jsxs(AddFolderButton, {
              className: "p-y-0 p-right-0 p-left-6",
              folders: folders,
              selectedFolder: selectedFolder,
              onCreate: onAddFolder,
              isReadOnly: isReadOnly,
              children: [/*#__PURE__*/_jsx(UIIcon, {
                size: 10,
                name: "add"
              }), /*#__PURE__*/_jsx(Small, {
                children: I18n.text('FileManagerLib.addFolderButton')
              })]
            })]
          })]
        }), this.renderFolderBreadcrumbs(), /*#__PURE__*/_jsx(UIBox, {
          className: "flex-column",
          grow: 1,
          alignSelf: "stretch",
          children: this.renderTiles()
        })]
      });
    }
  }]);

  return FolderPanel;
}(Component);

FolderPanel.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  files: PropTypes.instanceOf(Immutable.List).isRequired,
  tiles: PropTypes.instanceOf(Immutable.List).isRequired,
  status: PropTypes.oneOf(Object.keys(RequestStatus)),
  total: PropTypes.number.isRequired,
  selectedFolder: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedFolderWithAncestors: PropTypes.instanceOf(Immutable.List).isRequired,
  folders: PropTypes.instanceOf(Immutable.List).isRequired,
  fetchFiles: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  onAddFolder: PropTypes.func.isRequired,
  onSelectFolder: PropTypes.func.isRequired,
  onClickBreadcrumb: PropTypes.func.isRequired,
  filterType: PropTypes.oneOf(Object.keys(FileExtensionFilters)).isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  disableUpload: PropTypes.bool.isRequired,
  previousSelectedFileId: PropTypes.number,
  onTrackInteraction: PropTypes.func.isRequired
};

var mapStateToProps = function mapStateToProps(state, props) {
  var folders = getChildFolders(state);
  var files = getFiles(state);
  var tiles = getTiles(state, props);
  return {
    files: files,
    status: getFetchFilesRequestStatus(state),
    selectedFolder: getSelectedFolderInPanel(state),
    selectedFolderWithAncestors: getSelectedFolderWithAncestors(state),
    total: getTotalFilteredTiles({
      savedFilesCount: getFilesTotal(state),
      files: files,
      tiles: tiles
    }),
    folders: folders,
    tiles: tiles,
    filterType: getFilterType(state),
    isReadOnly: getIsReadOnly(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSelectFolder: function onSelectFolder(folder) {
      dispatch(browseToFolder(folder.get('id')));
      dispatch(trackInteraction('fileManagerExploreFiles', 'click-folder', {
        target: 'browse-all-folders'
      }));
    },
    onClickBreadcrumb: function onClickBreadcrumb(folder) {
      dispatch(browseToFolder(folder.get('id')));
      dispatch(trackInteraction('fileManagerExploreFiles', 'click-folder', {
        target: 'folder-breadcrumbs'
      }));
    },
    onAddFolder: function onAddFolder(folderName, selectedFolder) {
      dispatch(addFolder({
        name: folderName,
        parentId: selectedFolder.get('id') || null
      }));
      dispatch(trackInteraction('Manage Files', 'created-new-folder'));
    },
    fetchFiles: function fetchFiles(_ref) {
      var folderId = _ref.folderId,
          initial = _ref.initial,
          type = _ref.type,
          _ref$offset = _ref.offset,
          offset = _ref$offset === void 0 ? 0 : _ref$offset;
      var query = Object.assign({
        limit: DEFAULT_ROWS_TO_FETCH * IMAGE_COLUMN_COUNT,
        folder_id: folderId || 'None',
        offset: offset,
        type: type
      }, getProviderParam(ownProps.type));

      if (initial) {
        dispatch(fetchInitialFiles(query, ownProps.type));
      } else {
        dispatch(fetchMoreFiles(query, ownProps.type));
      }
    },
    onTrackInteraction: function onTrackInteraction() {
      dispatch(trackInteraction.apply(void 0, arguments));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FolderPanel);