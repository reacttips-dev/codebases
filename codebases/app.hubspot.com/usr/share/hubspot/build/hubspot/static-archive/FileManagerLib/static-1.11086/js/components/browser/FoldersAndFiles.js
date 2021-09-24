'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { DrawerTypes, CellTypes } from '../../Constants';
import FileRowTile from './FileRowTile';
import MediaThumbnailTile from './MediaThumbnailTile';
import FolderRowTile from './FolderRowTile';
import TileCollection from './TileCollection';

var noop = function noop() {
  return undefined;
};

var FoldersAndFiles = /*#__PURE__*/function (_Component) {
  _inherits(FoldersAndFiles, _Component);

  function FoldersAndFiles(props) {
    var _this;

    _classCallCheck(this, FoldersAndFiles);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FoldersAndFiles).call(this, props));
    _this.renderTile = _this.renderTile.bind(_assertThisInitialized(_this));
    _this.renderThumbnail = _this.renderThumbnail.bind(_assertThisInitialized(_this));
    _this.renderFolder = _this.renderFolder.bind(_assertThisInitialized(_this));
    _this.renderFile = _this.renderFile.bind(_assertThisInitialized(_this));
    _this.handleDrop = _this.handleDrop.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FoldersAndFiles, [{
    key: "getRenderer",
    value: function getRenderer(tile) {
      switch (tile.get('type')) {
        case CellTypes.FILE:
          return this.renderFile;

        case CellTypes.FOLDER:
          return this.renderFolder;

        case CellTypes.THUMBNAIL:
          return this.renderThumbnail;

        default:
          return noop;
      }
    }
  }, {
    key: "handleDrop",
    value: function handleDrop(files, folder) {
      var _this$props = this.props,
          type = _this$props.type,
          onDropFiles = _this$props.onDropFiles;
      onDropFiles(files, folder, type);
    }
  }, {
    key: "renderThumbnail",
    value: function renderThumbnail(tile) {
      var image = tile.get('image');
      var _this$props2 = this.props,
          onSelectFile = _this$props2.onSelectFile,
          onInsert = _this$props2.onInsert,
          selectedFileId = _this$props2.selectedFileId,
          isHostAppContextPrivate = _this$props2.isHostAppContextPrivate;
      var isSelected = Boolean(selectedFileId && selectedFileId === image.get('id'));
      return /*#__PURE__*/_jsx(MediaThumbnailTile, {
        file: image,
        width: 120,
        isSelected: isSelected,
        onSelect: onSelectFile,
        onInsert: onInsert,
        isHostAppContextPrivate: isHostAppContextPrivate
      });
    }
  }, {
    key: "renderFolder",
    value: function renderFolder(tile) {
      var folder = tile.get('folder');
      var _this$props3 = this.props,
          onSelectFolder = _this$props3.onSelectFolder,
          isReadOnly = _this$props3.isReadOnly,
          disableUpload = _this$props3.disableUpload;
      return /*#__PURE__*/_jsx(FolderRowTile, {
        folder: folder,
        isLast: tile.get('isLast'),
        onSelect: onSelectFolder,
        onDropFiles: this.handleDrop,
        disableUpload: Boolean(disableUpload || isReadOnly)
      });
    }
  }, {
    key: "renderFile",
    value: function renderFile(tile) {
      var _this$props4 = this.props,
          onSelectFile = _this$props4.onSelectFile,
          onInsert = _this$props4.onInsert,
          selectedFileId = _this$props4.selectedFileId,
          uploadingFiles = _this$props4.uploadingFiles,
          isHostAppContextPrivate = _this$props4.isHostAppContextPrivate;
      var file = tile.get('file');
      var fileId = file.get('id');
      var isFileUploading = uploadingFiles.has(fileId);
      var isSelected = Boolean(selectedFileId && selectedFileId === fileId);
      return /*#__PURE__*/_jsx(FileRowTile, {
        file: file,
        isSelected: isSelected,
        isLast: tile.get('isLast'),
        onSelect: onSelectFile,
        onInsert: onInsert,
        isUploading: isFileUploading,
        isHostAppContextPrivate: isHostAppContextPrivate
      });
    }
  }, {
    key: "renderTile",
    value: function renderTile(tile) {
      var renderer = this.getRenderer(tile);
      return renderer(tile);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          tiles = _this$props5.tiles,
          total = _this$props5.total,
          onLoadMoreFiles = _this$props5.onLoadMoreFiles,
          previousSelectedFileId = _this$props5.previousSelectedFileId;
      return /*#__PURE__*/_jsx(TileCollection, {
        onLoadMoreFiles: onLoadMoreFiles,
        tileRenderer: this.renderTile,
        tiles: tiles,
        total: total,
        previousSelectedFileId: previousSelectedFileId
      });
    }
  }]);

  return FoldersAndFiles;
}(Component);

FoldersAndFiles.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  tiles: PropTypes.instanceOf(Immutable.List),
  selectedFileId: PropTypes.number,
  total: PropTypes.number.isRequired,
  onDropFiles: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  onLoadMoreFiles: PropTypes.func.isRequired,
  onSelectFile: PropTypes.func.isRequired,
  onSelectFolder: PropTypes.func.isRequired,
  uploadingFiles: PropTypes.instanceOf(Immutable.Map).isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  disableUpload: PropTypes.bool.isRequired,
  isHostAppContextPrivate: PropTypes.bool.isRequired,
  previousSelectedFileId: PropTypes.number
};
export default FoldersAndFiles;