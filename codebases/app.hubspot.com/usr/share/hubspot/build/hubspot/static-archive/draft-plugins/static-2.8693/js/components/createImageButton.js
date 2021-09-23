'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import userInfo from 'hub-http/userInfo';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import UIButton from 'UIComponents/button/UIButton';
import UIFileButton from 'UIComponents/button/UIFileButton';
import { callIfPossible } from 'UIComponents/core/Functions';
import UIList from 'UIComponents/list/UIList';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import { uploadFile } from '../api/FileManagerApi';
import SmallToggleButton from '../components/SmallToggleButton';
import { IMAGE_ATOMIC_TYPE, IMAGE_BLOCK_TYPE } from '../lib/constants';
import { getSignedSrc } from '../lib/Images';
import { getImageDimensions } from '../lib/utils';
import { HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE } from '../lib/FileAccess';
import { createTracker } from '../tracking/usageTracker';
import changeBlockData from '../utils/changeBlockData';
import createImageMetadata from '../utils/createImageMetadata';
import insertAtomicBlockWithData from '../utils/insertAtomicBlockWithData';
import removeBlock from '../utils/removeBlock';
import { INSERT_IMAGE } from 'rich-text-lib/constants/usageTracking';
import * as PMImageActionTypes from '../lib/prosemirrorImageActionTypes';
var Tracker;
export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      FileManager = _ref.FileManager,
      FilePickerPanel = _ref.FilePickerPanel,
      Drawer = _ref.Drawer,
      drawerType = _ref.drawerType,
      _ref$onOpenPopover = _ref.onOpenPopover,
      onOpenPopover = _ref$onOpenPopover === void 0 ? function () {} : _ref$onOpenPopover,
      _ref$tooltipPlacement = _ref.tooltipPlacement,
      tooltipPlacement = _ref$tooltipPlacement === void 0 ? 'bottom' : _ref$tooltipPlacement,
      httpClient = _ref.httpClient,
      SharedDragDropContext = _ref.SharedDragDropContext,
      _ref$useOptionsPopove = _ref.useOptionsPopover,
      useOptionsPopover = _ref$useOptionsPopove === void 0 ? false : _ref$useOptionsPopove,
      _ref$shouldScaleInser = _ref.shouldScaleInserts,
      shouldScaleInserts = _ref$shouldScaleInser === void 0 ? false : _ref$shouldScaleInser,
      _ref$uploadImage = _ref.uploadImage,
      uploadImage = _ref$uploadImage === void 0 ? uploadFile : _ref$uploadImage,
      _ref$getSignedImageSr = _ref.getSignedImageSrc,
      getSignedImageSrc = _ref$getSignedImageSr === void 0 ? getSignedSrc : _ref$getSignedImageSr,
      _ref$getUserInfo = _ref.getUserInfo,
      getUserInfo = _ref$getUserInfo === void 0 ? function () {
    return userInfo();
  } : _ref$getUserInfo;

  if (!Tracker) {
    Tracker = createTracker();
  }

  var tooltip = /*#__PURE__*/_jsx(FormattedMessage, {
    message: "draftPlugins.imagePlugin.tooltip"
  });

  var FilePickerComponent = FilePickerPanel || Drawer;

  var scaleImageSize = function scaleImageSize(rawImageData) {
    if (!shouldScaleInserts) {
      return rawImageData;
    }

    if (rawImageData.width) {
      var scale = rawImageData.width < 400 ? 1 : 400 / rawImageData.width;
      return Object.assign({}, rawImageData, {
        width: rawImageData.width * scale,
        height: rawImageData.height ? rawImageData.height * scale : undefined
      });
    } else {
      return Object.assign({}, rawImageData, {
        width: 400,
        // height should default to auto, if an image doesn't have width it shouldnt have height
        height: undefined
      });
    }
  };

  var ImageButton = /*#__PURE__*/function (_Component) {
    _inherits(ImageButton, _Component);

    function ImageButton(props) {
      var _this;

      _classCallCheck(this, ImageButton);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageButton).call(this, props));

      _this.onCloseComplete = function () {
        _this.props.onPluginCloseModal();
      };

      _this.handleSetPickerStateToClosed = function () {
        _this.setState({
          pickerOpen: false
        });
      };

      _this.handleLocalFileUpload = function (evt) {
        _this.setState({
          popoverOpen: false
        }); // UIFileButton `multiple` prop set to `false`, so only ever one image


        var image = evt.target.files[0];

        _this.fileReader.readAsDataURL(image);

        _this.setState({
          fileToUpload: image
        });
      };

      _this.handlePopoverOpenChange = function (evt) {
        _this.setState({
          popoverOpen: evt.target.value
        });
      };

      _this.state = {
        auth: null,
        fileToUpload: null,
        pickerOpen: false,
        popoverOpen: false
      };
      _this.getIsActive = _this.getIsActive.bind(_assertThisInitialized(_this));
      _this.handleInsertImage = _this.handleInsertImage.bind(_assertThisInitialized(_this));
      _this.handlePickerClose = _this.handlePickerClose.bind(_assertThisInitialized(_this));
      _this.handlePickerOpen = _this.handlePickerOpen.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(ImageButton, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        getUserInfo().then(function (auth) {
          return _this2.setState({
            auth: auth
          });
        });
        this.fileReader = new FileReader();
        this.fileReader.addEventListener('load', function () {
          var _this2$props = _this2.props,
              editorState = _this2$props.editorState,
              onChange = _this2$props.onChange,
              useProsemirror = _this2$props.useProsemirror;
          var tempFileUrl = _this2.fileReader.result;
          getImageDimensions(tempFileUrl).then(function (_ref2) {
            var height = _ref2.height,
                width = _ref2.width;
            var rawData = {
              height: height,
              isTemporary: true,
              src: tempFileUrl,
              uploadPercent: 10,
              width: width
            };
            var scaledRawData = scaleImageSize(rawData);
            var data = createImageMetadata(scaledRawData);

            if (useProsemirror) {
              onChange({
                actionType: PMImageActionTypes.LOAD_IMAGE,
                data: Object.assign({}, scaledRawData, {
                  originalDimensions: {
                    width: width,
                    height: height
                  }
                })
              });
            } else {
              onChange(insertAtomicBlockWithData(editorState, data));
            }

            _this2.uploadImageToFileManager(tempFileUrl);
          });
        });
      }
    }, {
      key: "getUploadProgressHandler",
      value: function getUploadProgressHandler(blockToUpdate) {
        var _this$props = this.props,
            editorState = _this$props.editorState,
            onChange = _this$props.onChange,
            useProsemirror = _this$props.useProsemirror;
        return function (progress) {
          if (!progress.lengthComputable) {
            return;
          }

          var percentComplete = parseInt(progress.loaded / progress.total, 10) * 100;

          if (useProsemirror) {
            onChange({
              actionType: PMImageActionTypes.UPLOAD_PROGRESS,
              data: percentComplete
            });
          } else {
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
          }
        };
      }
    }, {
      key: "uploadImageToFileManager",
      value: function uploadImageToFileManager(url) {
        var _this3 = this;

        var _this$props2 = this.props,
            editorState = _this$props2.editorState,
            onChange = _this$props2.onChange,
            useProsemirror = _this$props2.useProsemirror;
        var fileToUpload = this.state.fileToUpload;

        if (!fileToUpload) {
          return;
        }

        var blockToUpdate = !useProsemirror ? editorState.getCurrentContent().getBlockMap().find(function (block) {
          return block.getData().getIn(['image', 'src']) === url;
        }) : null;
        uploadImage(fileToUpload, {
          access: HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE,
          onProgress: this.getUploadProgressHandler(blockToUpdate)
        }).then(function (data) {
          var _data$objects$ = data.objects[0],
              id = _data$objects$.id,
              size = _data$objects$.size;
          var signedUrl = getSignedImageSrc(id);
          var uploadData = {
            fileManagerId: id,
            isTemporary: false,
            src: signedUrl,
            size: size,
            uploadPercent: 100,
            tempUrl: url
          };

          if (useProsemirror) {
            onChange({
              actionType: PMImageActionTypes.UPLOAD_COMPLETE,
              data: uploadData
            });
          } else {
            var updatedBlockData = blockToUpdate.getData().mergeDeep({
              image: uploadData
            });
            onChange(changeBlockData({
              editorState: _this3.props.editorState,
              block: blockToUpdate,
              updatedBlockData: updatedBlockData,
              preserveSelection: true
            }));
          }
        }).catch(function () {
          if (useProsemirror) {
            onChange({
              actionType: PMImageActionTypes.UPLOAD_FAILED,
              data: {
                tempUrl: url
              }
            });
          } else {
            onChange(removeBlock(blockToUpdate.getKey(), _this3.props.editorState));
          }

          var fileName = fileToUpload.name || I18n.text('draftPlugins.imagePlugin.genericFileName');
          FloatingAlertStore.addAlert({
            type: 'danger',
            message: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.imagePlugin.uploadFailedBody",
              options: {
                fileName: fileName
              }
            }),
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.imagePlugin.uploadFailedTitle"
            })
          });
        });
      }
    }, {
      key: "getIsActive",
      value: function getIsActive() {
        var _this$props3 = this.props,
            editorState = _this$props3.editorState,
            useProsemirror = _this$props3.useProsemirror;

        if (useProsemirror) {
          return false;
        }

        var selectedBlockKey = editorState.getSelection().getStartKey();
        var selectedBlock = editorState.getCurrentContent().getBlockForKey(selectedBlockKey);

        if (!selectedBlock) {
          return false;
        }

        var type = selectedBlock.getType();
        return type === IMAGE_BLOCK_TYPE && selectedBlock.getData().get('atomicType') === IMAGE_ATOMIC_TYPE;
      }
    }, {
      key: "handleInsertImage",
      value: function handleInsertImage(imgData) {
        var _this$props4 = this.props,
            editorState = _this$props4.editorState,
            onChange = _this$props4.onChange,
            useProsemirror = _this$props4.useProsemirror;
        var src = imgData.get('url');

        if (!src) {
          return;
        }

        var rawData = {
          src: src
        };
        var scaledData = scaleImageSize(rawData);
        var data = createImageMetadata(scaledData);
        Tracker.track('draftImage', {
          action: INSERT_IMAGE,
          method: 'toolbar'
        });

        if (useProsemirror) {
          onChange({
            actionType: PMImageActionTypes.INSERT_IMAGE,
            data: scaledData
          });
        } else {
          onChange(insertAtomicBlockWithData(editorState, data));
        }

        this.setState({
          popoverOpen: false
        });
        this.handlePickerClose();
      }
    }, {
      key: "handlePickerClose",
      value: function handlePickerClose() {
        this.setState({
          pickerOpen: false
        });
      }
    }, {
      key: "handlePickerOpen",
      value: function handlePickerOpen() {
        callIfPossible(onOpenPopover);
        this.setState({
          pickerOpen: true
        });
        this.props.onPluginOpenModal();
      }
    }, {
      key: "renderFileManagerAndPicker",
      value: function renderFileManagerAndPicker() {
        var auth = this.state.auth;
        return /*#__PURE__*/_jsx(FileManager, {
          auth: auth,
          children: /*#__PURE__*/_jsx(FilePickerComponent, {
            disableUpload: useOptionsPopover,
            onClose: this.handlePickerClose,
            onSelect: this.handleInsertImage
          })
        });
      }
    }, {
      key: "renderFileManagerOnly",
      value: function renderFileManagerOnly() {
        return /*#__PURE__*/_jsx(FileManager, {
          auth: this.state.auth,
          httpClient: httpClient,
          SharedDragDropContext: SharedDragDropContext,
          type: drawerType,
          onClose: this.handleSetPickerStateToClosed,
          onSelect: this.handleInsertImage,
          onCloseComplete: this.onCloseComplete
        });
      }
    }, {
      key: "renderFileManager",
      value: function renderFileManager() {
        var _this$state = this.state,
            auth = _this$state.auth,
            pickerOpen = _this$state.pickerOpen;

        if (!(auth && pickerOpen)) {
          return null;
        }

        if (FileManager && FilePickerComponent) {
          return this.renderFileManagerAndPicker();
        }

        if (FileManager) {
          return this.renderFileManagerOnly();
        }

        return null;
      }
    }, {
      key: "renderOptions",
      value: function renderOptions() {
        return /*#__PURE__*/_jsxs(UIList, {
          className: "private-dropdown--list",
          children: [/*#__PURE__*/_jsx(UIButton, {
            onClick: this.handlePickerOpen,
            use: "secondary",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.imagePlugin.existing"
            })
          }), /*#__PURE__*/_jsx(UIFileButton, {
            "data-test-id": "image-file-input",
            accept: ['image/*'],
            onChange: this.handleLocalFileUpload,
            use: "secondary",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.imagePlugin.upload"
            })
          })]
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this4 = this;

        var popoverOpen = this.state.popoverOpen;
        var sharedButtonProps = {
          active: popoverOpen || this.getIsActive(),
          icon: 'insertImage',
          tooltip: tooltip,
          tooltipPlacement: tooltipPlacement
        };

        if (useOptionsPopover) {
          return /*#__PURE__*/_jsx(UIPopover, {
            closeOnOutsideClick: true,
            content: this.renderOptions(),
            onOpenChange: this.handlePopoverOpenChange,
            open: popoverOpen,
            children: /*#__PURE__*/_jsxs("span", {
              children: [/*#__PURE__*/_jsx(SmallToggleButton, Object.assign({}, sharedButtonProps, {
                "data-test-id": "image-upload-toggle",
                onClick: function onClick() {
                  return _this4.setState(function (_ref3) {
                    var currentlyOpen = _ref3.popoverOpen;
                    return {
                      popoverOpen: !currentlyOpen
                    };
                  });
                }
              })), this.renderFileManager()]
            })
          });
        }

        return /*#__PURE__*/_jsxs(Fragment, {
          children: [/*#__PURE__*/_jsx(SmallToggleButton, Object.assign({}, sharedButtonProps, {
            onClick: this.handlePickerOpen
          })), this.renderFileManager()]
        });
      }
    }]);

    return ImageButton;
  }(Component);

  ImageButton.contextTypes = {
    editorRef: PropTypes.object
  };
  ImageButton.propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onPluginOpenModal: PropTypes.func,
    onPluginCloseModal: PropTypes.func,
    useProsemirror: PropTypes.bool
  };
  ImageButton.defaultProps = {
    onPluginOpenModal: emptyFunction,
    onPluginCloseModal: emptyFunction,
    useProsemirror: false
  };
  return ImageButton;
});