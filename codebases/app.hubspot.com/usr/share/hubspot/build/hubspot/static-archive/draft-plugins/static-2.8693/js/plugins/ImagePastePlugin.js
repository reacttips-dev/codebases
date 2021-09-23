'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { EditorState } from 'draft-js';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { findDOMNode } from 'react-dom';
import { uploadFile } from '../api/FileManagerApi';
import { getSignedSrc, isPrivateFile } from '../lib/Images';
import { getImageDimensions } from '../lib/utils';
import { HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE } from '../lib/FileAccess';
import changeBlockData from '../utils/changeBlockData';
import createImageMetadata from '../utils/createImageMetadata';
import { getUnpaddedElementWidth } from '../utils/domUtils';
import insertAtomicBlockWithData from '../utils/insertAtomicBlockWithData';

var isImageFile = function isImageFile(file) {
  return /image\//.test(file.type);
};

export default (function (_ref) {
  var _ref$imageOptions = _ref.imageOptions,
      imageOptions = _ref$imageOptions === void 0 ? {} : _ref$imageOptions,
      _ref$uploadImage = _ref.uploadImage,
      uploadImage = _ref$uploadImage === void 0 ? uploadFile : _ref$uploadImage,
      _ref$getSignedImageSr = _ref.getSignedImageSrc,
      getSignedImageSrc = _ref$getSignedImageSr === void 0 ? getSignedSrc : _ref$getSignedImageSr;
  return function (WrappingComponent) {
    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      return createReactClass({
        propTypes: {
          editorState: PropTypes.instanceOf(EditorState).isRequired,
          onChange: PropTypes.func.isRequired,
          handlePastedFiles: PropTypes.func
        },
        childContextTypes: {
          blur: PropTypes.func,
          focus: PropTypes.func
        },
        getInitialState: function getInitialState() {
          return {
            file: null
          };
        },
        getChildContext: function getChildContext() {
          return {
            blur: this.blur,
            focus: this.focus
          };
        },
        UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
          var _this = this;

          this.fileReader = new FileReader();
          this.fileReader.addEventListener('load', function () {
            var _this$props = _this.props,
                editorState = _this$props.editorState,
                onChange = _this$props.onChange;
            var tempFileUrl = _this.fileReader.result;
            getImageDimensions(tempFileUrl).then(function (_ref2) {
              var width = _ref2.width,
                  height = _ref2.height;
              var rawData = {
                height: height,
                isTemporary: true,
                src: tempFileUrl,
                uploadPercent: 10,
                // show a little bit of progress to start
                width: width
              };

              if (_this._child) {
                var editorNode = findDOMNode(_this._child).querySelector('.DraftEditor-root');
                var editorWidth = getUnpaddedElementWidth(editorNode);

                if (width > editorWidth) {
                  var originalRatio = width / height;
                  rawData.originalDimensions = {
                    width: width,
                    height: height
                  };
                  rawData.width = editorWidth;
                  rawData.height = Math.round(editorWidth / originalRatio);
                }
              }

              var data = createImageMetadata(rawData);
              onChange(insertAtomicBlockWithData(editorState, data));

              _this.uploadPastedFile(tempFileUrl);
            });
          }, false);
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
        getUploadProgressHandler: function getUploadProgressHandler(blockToUpdate) {
          var _this$props2 = this.props,
              editorState = _this$props2.editorState,
              onChange = _this$props2.onChange;
          return function (progress) {
            if (!progress.lengthComputable) {
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
        uploadPastedFile: function uploadPastedFile(dataUrl) {
          var _this2 = this;

          var _this$props3 = this.props,
              editorState = _this$props3.editorState,
              onChange = _this$props3.onChange;
          var file = this.state.file;

          if (!file) {
            return;
          }

          var blockToUpdate = editorState.getCurrentContent().getBlockMap().find(function (block) {
            return block.getData().getIn(['image', 'src']) === dataUrl;
          });
          uploadImage(file, {
            access: imageOptions.access || HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE,
            onProgress: this.getUploadProgressHandler(blockToUpdate)
          }).then(function (data) {
            var fileId = data.objects[0].id;
            var fileSize = data.objects[0].size;
            var fileUrl = isPrivateFile(data.objects[0]) ? getSignedImageSrc(fileId) : data.objects[0].url;
            var updatedBlockData = blockToUpdate.getData().mergeDeep({
              image: {
                fileManagerId: fileId,
                isTemporary: false,
                src: fileUrl,
                size: fileSize,
                uploadPercent: 100
              }
            });
            onChange(changeBlockData({
              editorState: _this2.props.editorState,
              block: blockToUpdate,
              updatedBlockData: updatedBlockData,
              preserveSelection: true
            }));
          });
        },
        handlePastedFiles: function handlePastedFiles(files) {
          var handlePastedFiles = this.props.handlePastedFiles;

          if (!files || files.length === 0) {
            return false;
          }

          var file = files[0];

          if (!isImageFile(file)) {
            return false;
          }

          this.setState({
            file: file
          });
          this.fileReader.readAsDataURL(file);

          if (handlePastedFiles) {
            return handlePastedFiles(files);
          }

          return true;
        },
        render: function render() {
          var _this3 = this;

          return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({}, this.props, {
            ref: function ref(c) {
              return _this3._child = c;
            },
            handlePastedFiles: this.handlePastedFiles
          }));
        }
      });
    }

    return WrappingComponent;
  };
});