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
import Immutable from 'immutable';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UIImage from 'UIComponents/image/UIImage';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIBackButton from 'UIComponents/nav/UIBackButton';
import Small from 'UIComponents/elements/Small';
import { ImageEditorLocations, FileTypes, PICKER_CHANGE_VISIBILITY_SOURCE } from 'FileManagerCore/Constants';
import { scaleToFit, isShutterstock, isEditableImage } from 'FileManagerCore/utils/image';
import { getShouldRenderFileUrl, getResizedFilePreviewUrl } from 'FileManagerCore/utils/file';
import { fileSize } from 'FileManagerCore/utils/fileSize';
import { VideoPlayer } from 'FileManagerCore/components/VideoPlayer';
import FileTypeIcon from 'FileManagerCore/components/FileTypeIcon';
import { getHasThumbnail, getFileDetailsFileManagerAppLink } from 'FileManagerCore/utils/file';
import DeleteFileContainer from '../containers/DeleteFileContainer';
import MoveButton from './MoveButton';
import EditButton from '../EditButton';
import Filename from './Filename';
import ImageOptimizationControl from '../controls/ImageOptimizationControl';
import getIsFileOptimizableImage from '../../utils/getIsFileOptimizableImage';
import CanvaButton from 'FileManagerCore/components/CanvaButton';
import { getIsFileExternal, getIsFilePrivate, getVisibilityOptionForFile } from 'FileManagerCore/utils/fileAccessibility';
import { DrawerFileAccess } from '../../enums/FileAccess';
import { getSignedUrlRedirectViewUrl } from 'FileManagerCore/api/Files';
import FilePathBreadcrumbs from 'FileManagerCore/components/FilePathBreadcrumbs';
var WIDTH = 380;

var FileDetail = /*#__PURE__*/function (_Component) {
  _inherits(FileDetail, _Component);

  function FileDetail(props) {
    var _this;

    _classCallCheck(this, FileDetail);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FileDetail).call(this, props));

    _this.trackFileUrlClick = function () {
      var tile = _this.props.tile;
      var file = tile.get('file');

      _this.props.trackInteraction('fileManagerExploreFiles', 'click-file-url-link', {
        fileType: file.get('type')
      });
    };

    _this.handleCanvaImport = _this.handleCanvaImport.bind(_assertThisInitialized(_this));
    _this.handleInsert = _this.handleInsert.bind(_assertThisInitialized(_this));
    _this.handleMove = _this.handleMove.bind(_assertThisInitialized(_this));
    _this.handleRename = _this.handleRename.bind(_assertThisInitialized(_this));
    _this.handleCloseButtonClick = _this.handleCloseButtonClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FileDetail, [{
    key: "handleCanvaImport",
    value: function handleCanvaImport(_ref) {
      var canvaDesignId = _ref.canvaDesignId,
          fileUrl = _ref.fileUrl,
          originalFileId = _ref.originalFileId,
          fileName = _ref.fileName;
      var uploadedFileAccess = this.props.uploadedFileAccess;
      this.props.onAcquireFromCanva({
        canvaDesignId: canvaDesignId,
        fileUrl: fileUrl,
        originalFileId: originalFileId,
        fileName: fileName,
        uploadedFileAccess: uploadedFileAccess
      });
    }
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      var tile = this.props.tile;
      var file = tile.get('file');

      if (!file.get('width') || !file.get('height')) {
        return null;
      }

      return file.get('width') + " x " + file.get('height') + " px";
    }
  }, {
    key: "getSize",
    value: function getSize() {
      var tile = this.props.tile;
      var file = tile.get('file');
      return fileSize(file.get('size'));
    }
  }, {
    key: "handleCloseButtonClick",
    value: function handleCloseButtonClick() {
      var onClose = this.props.onClose;
      onClose({
        target: 'close-button'
      });
    }
  }, {
    key: "handleInsert",
    value: function handleInsert() {
      var _this$props = this.props,
          tile = _this$props.tile,
          onClose = _this$props.onClose,
          onInsert = _this$props.onInsert;
      var file = tile.get('file');
      onClose({
        target: 'insert-file'
      });
      var target = 'file-detail-insert-button';

      if (this.renamePromise) {
        this.renamePromise.then(function (renamedFile) {
          return onInsert(renamedFile, {
            target: target
          });
        });
      } else {
        onInsert(file, {
          target: target
        });
      }
    }
  }, {
    key: "handleMove",
    value: function handleMove(folder) {
      var _this$props2 = this.props,
          tile = _this$props2.tile,
          onMove = _this$props2.onMove;
      var file = tile.get('file');
      onMove(file, folder);
    }
  }, {
    key: "handleRename",
    value: function handleRename(newName) {
      var _this2 = this;

      var _this$props3 = this.props,
          tile = _this$props3.tile,
          onRename = _this$props3.onRename;
      var file = tile.get('file');
      this.renamePromise = onRename(file, newName);
      this.renamePromise.finally(function () {
        _this2.renamePromise = null;
      });
    }
  }, {
    key: "renderVideoPlayer",
    value: function renderVideoPlayer(file) {
      return /*#__PURE__*/_jsx(VideoPlayer, {
        className: "m-bottom-4",
        video: file,
        width: WIDTH
      });
    }
  }, {
    key: "renderImage",
    value: function renderImage(file) {
      var dimensions = {};

      if (file.get('height')) {
        dimensions = scaleToFit(file, WIDTH);
      }

      return /*#__PURE__*/_jsx("div", {
        className: "justify-center",
        children: /*#__PURE__*/_jsxs("div", {
          className: 'file-detail__image-wrapper image__transparency-checkboard m-bottom-4' + (!file.get('height') ? " square-wrapper-fix" : ""),
          children: [isShutterstock(file) && /*#__PURE__*/_jsx("div", {
            className: "file-detail__image-overlay"
          }), /*#__PURE__*/_jsx(UIImage, Object.assign({
            className: "file-detail__image",
            src: getResizedFilePreviewUrl(file, WIDTH),
            responsive: !file.get('height'),
            draggable: false
          }, dimensions))]
        })
      });
    }
  }, {
    key: "renderEditButtons",
    value: function renderEditButtons() {
      var _this$props4 = this.props,
          isCanvaFile = _this$props4.isCanvaFile,
          tile = _this$props4.tile;
      var file = tile.get('file');

      if (isCanvaFile) {
        return /*#__PURE__*/_jsx(UIDropdown, {
          buttonClassName: "m-left-3",
          buttonSize: "xs",
          buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerCore.actions.cloneAndEdit"
          }),
          menuWidth: "auto",
          children: /*#__PURE__*/_jsxs(UIList, {
            children: [/*#__PURE__*/_jsxs(EditButton, {
              file: file,
              openedFrom: ImageEditorLocations.DRAWER,
              children: [/*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerCore.actions.cropAndResize"
              }), /*#__PURE__*/_jsx(Small, {
                className: "display-block m-all-0",
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "FileManagerCore.actions.cropAndResizeDescription"
                })
              })]
            }), /*#__PURE__*/_jsx(CanvaButton, {
              file: file,
              handleCanvaImport: this.handleCanvaImport
            })]
          })
        });
      } else {
        return /*#__PURE__*/_jsx(EditButton, {
          openedFrom: ImageEditorLocations.DRAWER,
          size: "extra-small",
          file: file
        });
      }
    }
  }, {
    key: "renderFile",
    value: function renderFile(file) {
      switch (file.get('type')) {
        case FileTypes.MOVIE:
          return this.renderVideoPlayer(file);

        case FileTypes.IMG:
          if (getHasThumbnail(file)) {
            return this.renderImage(file);
          }

          return this.renderFileTypeIcon(file);

        default:
          return null;
      }
    }
  }, {
    key: "renderFileUrl",
    value: function renderFileUrl(file) {
      var isHostAppContextPrivate = this.props.isHostAppContextPrivate;
      var isFilePrivate = getIsFilePrivate(file);
      var disableFileUrlLink = getIsFilePrivate(file) && !isHostAppContextPrivate || getIsFileExternal(file);

      var fileUrl = /*#__PURE__*/_jsx(UILink, {
        href: isFilePrivate ? getSignedUrlRedirectViewUrl(file.get('id')) : file.get('url'),
        external: true,
        disabled: disableFileUrlLink,
        "data-test-id": "file-detail-file-url",
        onClick: this.trackFileUrlClick,
        children: I18n.text('FileManagerCore.actions.openLink')
      });

      if (disableFileUrlLink) {
        return /*#__PURE__*/_jsx(UITooltip, {
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerLib.privateFileExternalViewTooltip"
          }),
          children: fileUrl
        });
      }

      return /*#__PURE__*/_jsx(Small, {
        tagName: "p",
        children: fileUrl
      });
    }
  }, {
    key: "renderFileTypeIcon",
    value: function renderFileTypeIcon(image) {
      return /*#__PURE__*/_jsx(FileTypeIcon, {
        size: 64,
        file: image,
        draggable: false
      });
    }
  }, {
    key: "renderImageOptimizationControl",
    value: function renderImageOptimizationControl() {
      return /*#__PURE__*/_jsx(Small, {
        use: "help",
        children: /*#__PURE__*/_jsx(ImageOptimizationControl, {})
      });
    }
  }, {
    key: "renderVisibility",
    value: function renderVisibility(file) {
      var visibilityOption = getVisibilityOptionForFile(file);

      var visibilityText = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "FileManagerCore.fileVisibility." + visibilityOption + ".text"
      });

      var href = getFileDetailsFileManagerAppLink(file, {
        source: PICKER_CHANGE_VISIBILITY_SOURCE
      });
      return /*#__PURE__*/_jsxs(Small, {
        use: "help",
        className: "display-block m-top-2",
        children: [/*#__PURE__*/_jsx(UIHelpIcon, {
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerCore.fileVisibility." + visibilityOption + ".help"
          }),
          children: /*#__PURE__*/_jsx(FormattedReactMessage, {
            message: "FileManagerLib.fileDetail.visibility",
            options: {
              visibilityText: visibilityText
            }
          })
        }), /*#__PURE__*/_jsx(UILink, {
          className: "m-left-2",
          external: true,
          href: href,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerLib.fileDetail.visibilityChangeLink"
          })
        })]
      });
    }
  }, {
    key: "renderActions",
    value: function renderActions(file) {
      var _this$props5 = this.props,
          onDelete = _this$props5.onDelete,
          parentFolder = _this$props5.parentFolder,
          folderCount = _this$props5.folderCount,
          isReadOnly = _this$props5.isReadOnly,
          isSingleFileFetched = _this$props5.isSingleFileFetched,
          isUngatedForRecycleBin = _this$props5.isUngatedForRecycleBin;

      if (!isSingleFileFetched) {
        return /*#__PURE__*/_jsx("div", {
          className: "m-bottom-4",
          children: /*#__PURE__*/_jsx(UILoadingSpinner, {})
        });
      }

      return /*#__PURE__*/_jsxs(Fragment, {
        children: [getShouldRenderFileUrl({
          file: file
        }) && this.renderFileUrl(file), /*#__PURE__*/_jsxs("div", {
          className: "m-bottom-4",
          children: [folderCount > 0 && /*#__PURE__*/_jsx(MoveButton, {
            size: "extra-small",
            folder: parentFolder,
            onMove: this.handleMove,
            isReadOnly: isReadOnly
          }), file.get('type') === FileTypes.IMG && isEditableImage(file) && this.renderEditButtons(), /*#__PURE__*/_jsx(DeleteFileContainer, {
            file: file,
            onDelete: onDelete,
            isReadOnly: isReadOnly,
            isUngatedForRecycleBin: isUngatedForRecycleBin
          })]
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props6 = this.props,
          tile = _this$props6.tile,
          isCanvaFile = _this$props6.isCanvaFile,
          isReadOnly = _this$props6.isReadOnly,
          isSingleFileFetched = _this$props6.isSingleFileFetched,
          deselectFile = _this$props6.deselectFile;
      var file = tile.get('file');
      var dimensions = this.getDimensions();
      return /*#__PURE__*/_jsx("div", {
        ref: function ref(c) {
          _this3.wrapper = c;
        },
        className: "file-detail with-panel-navigator",
        children: /*#__PURE__*/_jsxs("div", {
          className: "file-detail__wrapper",
          children: [this.props.isWithinPanel && /*#__PURE__*/_jsx(UIBackButton, {
            children: /*#__PURE__*/_jsx(UILink, {
              onClick: deselectFile,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerLib.fileDetail.withinPanelBack"
              })
            })
          }), /*#__PURE__*/_jsx(FilePathBreadcrumbs, {
            object: file,
            fullPath: file.get('full_path')
          }), /*#__PURE__*/_jsx(Filename, {
            file: file,
            onUpdate: this.handleRename,
            isReadOnly: isReadOnly
          }), this.renderFile(file), /*#__PURE__*/_jsxs(UIList, {
            className: "file-detail__meta m-bottom-2",
            children: [dimensions && /*#__PURE__*/_jsx(Small, {
              use: "help",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerLib.fileDetail.dimensions",
                options: {
                  dimensions: dimensions
                }
              })
            }), /*#__PURE__*/_jsx(Small, {
              use: "help",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerLib.fileDetail.type",
                options: {
                  type: file.get('extension')
                }
              })
            }), /*#__PURE__*/_jsx(Small, {
              use: "help",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerLib.fileDetail.size",
                options: {
                  size: this.getSize()
                }
              })
            }), isCanvaFile && /*#__PURE__*/_jsx(Small, {
              use: "help",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerLib.fileDetail.source",
                options: {
                  source: 'Canva'
                }
              })
            }), getIsFileOptimizableImage(file) && this.renderImageOptimizationControl(), isSingleFileFetched && this.renderVisibility(file)]
          }), this.renderActions(file)]
        })
      });
    }
  }]);

  return FileDetail;
}(Component);

FileDetail.propTypes = {
  tile: PropTypes.instanceOf(Immutable.Map).isRequired,
  isCanvaFile: PropTypes.bool,
  folderCount: PropTypes.number.isRequired,
  parentFolder: PropTypes.instanceOf(Immutable.Map).isRequired,
  onAcquireFromCanva: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  deselectFile: PropTypes.func.isRequired,
  trackInteraction: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isHostAppContextPrivate: PropTypes.bool.isRequired,
  uploadedFileAccess: PropTypes.oneOf(Object.keys(DrawerFileAccess)),
  isSingleFileFetched: PropTypes.bool.isRequired,
  isUngatedForRecycleBin: PropTypes.bool.isRequired,
  isWithinPanel: PropTypes.bool
};
export default FileDetail;