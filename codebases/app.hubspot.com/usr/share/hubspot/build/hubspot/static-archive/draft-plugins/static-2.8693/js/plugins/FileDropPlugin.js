'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { EditorState } from 'draft-js';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { findDOMNode } from 'react-dom';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { uploadFile } from '../api/FileManagerApi';
import { getSignedSrc, isPrivateFile } from '../lib/Images';
import { getImageDimensions } from '../lib/utils';
import { HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE } from '../lib/FileAccess';
import changeBlockData from '../utils/changeBlockData';
import createImageMetadata from '../utils/createImageMetadata';
import insertAtomicBlockWithData from '../utils/insertAtomicBlockWithData';
import removeBlock from '../utils/removeBlock';
import { getUnpaddedElementWidth } from '../utils/domUtils';

var isImageFile = function isImageFile(file) {
  return /image\//.test(file.type);
};

var blockExists = function blockExists(block, editorState) {
  return !!editorState.getCurrentContent().getBlockForKey(block.getKey());
};

var createFileTypeRegexps = function createFileTypeRegexps(fileTypes) {
  return fileTypes && fileTypes.map(function (type) {
    return new RegExp(type);
  });
};

var getBlockByImageSrc = function getBlockByImageSrc(url, editorState) {
  return editorState.getCurrentContent().getBlockMap().find(function (block) {
    return block.getData().getIn(['image', 'src']) === url;
  });
};

var emptyFunction = function emptyFunction() {};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$onNonImageUpload = _ref.onNonImageUploadStarted,
      onNonImageUploadStarted = _ref$onNonImageUpload === void 0 ? emptyFunction : _ref$onNonImageUpload,
      _ref$onDropNonImage = _ref.onDropNonImage,
      onDropNonImage = _ref$onDropNonImage === void 0 ? emptyFunction : _ref$onDropNonImage,
      _ref$onNonImageUpload2 = _ref.onNonImageUploadFailed,
      onNonImageUploadFailed = _ref$onNonImageUpload2 === void 0 ? emptyFunction : _ref$onNonImageUpload2,
      _ref$fileOptions = _ref.fileOptions,
      fileOptions = _ref$fileOptions === void 0 ? {} : _ref$fileOptions,
      _ref$imageOptions = _ref.imageOptions,
      imageOptions = _ref$imageOptions === void 0 ? {} : _ref$imageOptions,
      _ref$skipNonImageUplo = _ref.skipNonImageUpload,
      skipNonImageUpload = _ref$skipNonImageUplo === void 0 ? false : _ref$skipNonImageUplo,
      allowedFileTypes = _ref.allowedFileTypes,
      _ref$onUnsupportedFil = _ref.onUnsupportedFileDropped,
      onUnsupportedFileDropped = _ref$onUnsupportedFil === void 0 ? emptyFunction : _ref$onUnsupportedFil,
      _ref$uploadDroppedFil = _ref.uploadDroppedFile,
      uploadDroppedFile = _ref$uploadDroppedFil === void 0 ? uploadFile : _ref$uploadDroppedFil,
      _ref$getSignedFileSrc = _ref.getSignedFileSrc,
      getSignedFileSrc = _ref$getSignedFileSrc === void 0 ? getSignedSrc : _ref$getSignedFileSrc;

  return function (WrappingComponent) {
    var acceptedFileChecks = createFileTypeRegexps(allowedFileTypes);

    var fileTypeValidator = function fileTypeValidator(type) {
      return acceptedFileChecks && acceptedFileChecks.some(function (check) {
        return check.test(type);
      });
    };

    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      return createReactClass({
        propTypes: {
          editorState: PropTypes.instanceOf(EditorState).isRequired,
          handleDroppedFiles: PropTypes.func,
          onChange: PropTypes.func.isRequired
        },
        childContextTypes: {
          blur: PropTypes.func,
          focus: PropTypes.func
        },
        getChildContext: function getChildContext() {
          return {
            blur: this.blur,
            focus: this.focus
          };
        },
        getUploadProgressHandler: function getUploadProgressHandler(blockToUpdate) {
          var _this = this;

          return function (progress) {
            var _this$props = _this.props,
                editorState = _this$props.editorState,
                onChange = _this$props.onChange;

            if (!progress.lengthComputable) {
              return;
            }

            if (!blockExists(blockToUpdate, editorState)) {
              // block deleted by user before upload completed
              return;
            }

            var percentComplete = parseInt(progress.loaded / progress.total, 10) * 100;
            var updatedBlockData = blockToUpdate.getData().mergeDeep({
              image: {
                uploadPercent: percentComplete
              }
            });
            onChange(changeBlockData({
              editorState: editorState,
              block: blockToUpdate,
              updatedBlockData: updatedBlockData,
              preserveSelection: true
            }));
          };
        },
        uploadImageToFileManager: function uploadImageToFileManager(tempUrl, file, editorState) {
          var blockToUpdate = getBlockByImageSrc(tempUrl, editorState);
          return uploadDroppedFile(file, {
            access: imageOptions.access || HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE,
            onProgress: this.getUploadProgressHandler(blockToUpdate)
          }).then(function (data) {
            var fileId = data.objects[0].id;
            var fileSize = data.objects[0].size;
            var fileUrl = isPrivateFile(data.objects[0]) ? getSignedFileSrc(fileId) : data.objects[0].url;
            var updatedBlockData = blockToUpdate.getData().mergeDeep({
              image: {
                isTemporary: false,
                uploadPercent: 100,
                src: fileUrl,
                size: fileSize
              }
            });
            var newestEditorState = editorState;

            if (!blockExists(blockToUpdate, newestEditorState)) {
              // block deleted by user before upload complete
              return null;
            }

            return changeBlockData({
              editorState: newestEditorState,
              block: blockToUpdate,
              updatedBlockData: updatedBlockData,
              preserveSelection: true
            });
          });
        },
        uploadAndInsertImages: function uploadAndInsertImages(images, editorState) {
          var _this2 = this;

          if (images.length < 1) {
            return;
          }

          var _images$ = images[0],
              tempUrl = _images$.tempUrl,
              file = _images$.file;
          this.uploadImageToFileManager(tempUrl, file, editorState).then(function (newEditorState) {
            if (newEditorState) {
              _this2.props.onChange(newEditorState);
            }

            _this2.uploadAndInsertImages(images.slice(1), newEditorState);
          }).catch(function () {
            FloatingAlertStore.addAlert({
              type: 'danger',
              message: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "draftPlugins.imagePlugin.uploadFailedBody",
                options: {
                  fileName: file.name
                }
              }),
              titleText: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "draftPlugins.imagePlugin.uploadFailedTitle"
              })
            });

            _this2.removeTempImage(tempUrl);

            _this2.uploadAndInsertImages(images.slice(1));
          });
        },
        removeTempImage: function removeTempImage(tempUrl) {
          var _this$props2 = this.props,
              editorState = _this$props2.editorState,
              onChange = _this$props2.onChange;
          var blockToRemove = getBlockByImageSrc(tempUrl, editorState);

          if (!blockToRemove) {
            return;
          }

          onChange(removeBlock(blockToRemove.getKey(), editorState));
        },
        insertTempImages: function insertTempImages(images) {
          var _this3 = this;

          var editorWidth = this.getEditorWidth();
          var imagesWithSizes = images.map(function (_ref2) {
            var tempUrl = _ref2.tempUrl;
            return getImageDimensions(tempUrl).then(function (dimensions) {
              var height = dimensions.height,
                  width = dimensions.width;
              var imageData = Object.assign({}, dimensions, {
                tempUrl: tempUrl
              });

              if (width > editorWidth) {
                var originalRatio = width / height;
                imageData.originalDimensions = dimensions;
                imageData.width = editorWidth;
                imageData.height = Math.round(editorWidth / originalRatio);
              }

              return imageData;
            });
          });
          return Promise.all(imagesWithSizes).then(function (imagesMeta) {
            var editorStateWithImages = imagesMeta.reduce(function (editorStateAcc, _ref3) {
              var height = _ref3.height,
                  width = _ref3.width,
                  tempUrl = _ref3.tempUrl,
                  originalDimensions = _ref3.originalDimensions;
              var data = createImageMetadata({
                height: height,
                isTemporary: true,
                src: tempUrl,
                uploadPercent: 10,
                // show a little bit of progress to start
                width: width,
                originalDimensions: originalDimensions
              });
              var newContentState = insertAtomicBlockWithData(editorStateAcc, data).getCurrentContent();
              return EditorState.set(editorStateAcc, {
                currentContent: newContentState
              });
            }, _this3.props.editorState); // add to undo stack

            var finalEditorState = EditorState.push(_this3.props.editorState, editorStateWithImages.getCurrentContent(), 'insert-fragment');

            _this3.props.onChange(finalEditorState);

            return finalEditorState;
          });
        },
        handleNonImageDrop: function handleNonImageDrop(file) {
          var fileToUpload = {
            name: file.name,
            size: file.size,
            type: file.type
          };
          onNonImageUploadStarted(ImmutableMap(fileToUpload));

          if (!skipNonImageUpload) {
            uploadDroppedFile(file, fileOptions).then(function (data) {
              // use a Map because most consumers (namely CRM) wrap
              // API responses in Immutable Records
              var fileData = ImmutableMap(data.objects[0]);

              if (fileData && onDropNonImage) {
                fileData = fileData.merge({
                  originalName: fileToUpload.name
                });
                onDropNonImage(fileData, file);
              }
            }).catch(function (error) {
              return onNonImageUploadFailed(error, fileToUpload);
            });
          } else {
            onDropNonImage(null, file);
          }
        },
        handleDroppedFiles: function handleDroppedFiles(selectionState, files) {
          var _this4 = this;

          if (!files || files.length === 0) {
            return;
          }

          var imagesToUpload = [];
          files.forEach(function (file) {
            if (allowedFileTypes && !fileTypeValidator(file.type)) {
              onUnsupportedFileDropped(file);
              return;
            }

            if (isImageFile(file)) {
              var tempUrl = URL.createObjectURL(file);
              imagesToUpload.push({
                tempUrl: tempUrl,
                file: file
              });
            } else {
              _this4.handleNonImageDrop(file);
            }
          });
          this.insertTempImages(imagesToUpload).then(function (editorState) {
            _this4.uploadAndInsertImages(imagesToUpload, editorState);
          });

          if (this.props.handleDroppedFiles) {
            this.props.handleDroppedFiles(selectionState, files);
          }
        },
        getEditorWidth: function getEditorWidth() {
          if (!this._child) {
            return null;
          }

          var editorNode = findDOMNode(this._child).querySelector('.DraftEditor-root');
          return getUnpaddedElementWidth(editorNode);
        },
        blur: function blur() {
          if (this._child.blur) {
            this._child.blur();
          }
        },
        focus: function focus() {
          if (this._child.focus) {
            this._child.focus();
          }
        },
        render: function render() {
          var _this5 = this;

          return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({}, this.props, {
            handleDroppedFiles: this.handleDroppedFiles,
            ref: function ref(c) {
              return _this5._child = c;
            }
          }));
        }
      });
    }

    return WrappingComponent;
  };
});