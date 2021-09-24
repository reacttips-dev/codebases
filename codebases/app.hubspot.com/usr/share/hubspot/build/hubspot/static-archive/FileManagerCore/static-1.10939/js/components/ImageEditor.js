'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
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
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import keyMirror from 'react-utils/keyMirror';
import CropperJS from 'cropperjs';
import Small from 'UIComponents/elements/Small';
import UIButton from 'UIComponents/button/UIButton';
import UILightbox from 'UIComponents/lightbox/UILightbox';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UIInputStaticLabel from 'UIComponents/input/UIInputStaticLabel';
import { RequestStatus } from '../Constants';
import * as AspectRatioRoundingModes from '../constants/AspectRatioRoundingModes';
import * as AspectRatios from '../constants/AspectRatios';
import { getCropBoxDataObjWithSmallerWidth, getCropBoxDataObjWithSmallerHeight, getRectangularAdjustCropBoxParams, getCanvasBlobAndSaveFileForUnsupportedBrowsers, getIsCanvasToBlobSupported, getNewCanvasAndBoxDataAfterRotation, getCropBoxDataForDimensionAndPositionReset, getCropBoxDataObjForSquareImage } from '../utils/ImageEditor';
import { getImageSrc, getFileToEditId, getFolderId, getFileToEditName, getImageHeight, getImageWidth, getImageAspectRatio, getEditImageRequestStatus, getImageEncoding } from '../selectors/EditAndCreateImage';
import { dimensionValueToString } from '../utils/stringUtils';
import getIsImageEditorSaveButtonDisabled from '../utils/getIsImageEditorSaveButtonDisabled';
import { getIsReadOnly } from '../selectors/Permissions';
import ImageEditorCropControls from './ImageEditorCropControls';
import SaveEditsButton from './ImageEditorSaveButton';
import ImageEditorImage from './ImageEditorImage';

function getI18nKey(suffix) {
  return "FileManagerCore.imageEditor." + suffix;
}

var PRESET_ASPECT_RATIOS = keyMirror({
  CUSTOM: null,
  SQUARE: null,
  TWO_ONE: null,
  FOUR_FIVE: null,
  FB_LANDSCAPE: null,
  // facebook
  IG_LANDSCAPE: null,
  // instagram
  LINKEDIN: null
});
var COMMON_ICON_PROPS = {
  size: 'xs',
  style: {
    verticalAlign: 'inherit'
  }
};
var BACK_AND_CANCEL_BUTTON_COMMON_PROPS = {
  className: 'm-right-4',
  use: 'link-on-dark'
};
var DEFAULT_ROTATION_DEGREES = 45;

var ImageEditor = /*#__PURE__*/function (_Component) {
  _inherits(ImageEditor, _Component);

  function ImageEditor(props) {
    var _this;

    _classCallCheck(this, ImageEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageEditor).call(this, props));

    _this.handleZoomIn = function () {
      _this.cropper.zoom(0.1);
    };

    _this.handleZoomOut = function () {
      _this.cropper.zoom(-0.1);
    };

    _this.state = {
      cropperReady: false,
      cropperMode: '',
      cropperWidth: '0',
      cropperHeight: '0',
      unsavedImgWidth: null,
      unsavedImgHeight: null,
      aspectRatio: PRESET_ASPECT_RATIOS.CUSTOM
    };
    _this.imageContainer = null;

    _this.ImageComponent = function (imageProps) {
      return /*#__PURE__*/_jsx(ImageEditorImage, Object.assign({
        containerStyles: {
          width: '100%',
          height: 'calc(100% - 5rem)'
        },
        setImageContainer: _this.setImageContainer
      }, imageProps));
    };

    _this.setImageContainer = function (element) {
      _this.imageContainer = ReactDOM.findDOMNode(element); // eslint-disable-line react/no-find-dom-node
    };

    _this.initializeCropper = _this.initializeCropper.bind(_assertThisInitialized(_this));
    _this.getImageDimInputVal = _this.getImageDimInputVal.bind(_assertThisInitialized(_this));
    _this.onRotate = _this.onRotate.bind(_assertThisInitialized(_this));
    _this.adjustCropBox = _this.adjustCropBox.bind(_assertThisInitialized(_this));
    _this.resetCropper = _this.resetCropper.bind(_assertThisInitialized(_this));
    _this.resetCropperDimensionsAndPosition = _this.resetCropperDimensionsAndPosition.bind(_assertThisInitialized(_this));
    _this.onAspectRatioChange = _this.onAspectRatioChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ImageEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initializeCropper();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.updateRequestStatus === RequestStatus.PENDING && this.props.updateRequestStatus === RequestStatus.SUCCEEDED) {
        this.props.onClose();
      }

      if (!prevState.cropperReady && this.state.cropperReady && (this.props.fixedAspectRatio || this.props.cropperMode === 'crop')) {
        this.cropper.crop();
        this.setState({
          cropperMode: 'crop'
        });
      }
    }
  }, {
    key: "hasFixedAspectRatio",
    value: function hasFixedAspectRatio() {
      return typeof this.props.fixedAspectRatio === 'number';
    }
  }, {
    key: "resetCropper",
    value: function resetCropper() {
      if (this.cropper) {
        this.cropper.reset();
      }
    }
  }, {
    key: "adjustCropBoxToSquare",
    value: function adjustCropBoxToSquare(imgWidth, imgHeight) {
      this.cropper.setCropBoxData(getCropBoxDataObjForSquareImage(this.cropper.getCropBoxData(), this.cropper.getContainerData(), this.cropper.getCanvasData(), imgHeight, imgWidth));

      if (imgWidth > imgHeight) {
        this.setState({
          cropperWidth: imgHeight.toString()
        });
      } else {
        this.setState({
          cropperHeight: imgWidth.toString()
        });
      }
    }
  }, {
    key: "adjustWidthOrHeightToMakeCropBoxVertical",
    value: function adjustWidthOrHeightToMakeCropBoxVertical(_ref) {
      var imgWidth = _ref.imgWidth,
          potentialNewWidth = _ref.potentialNewWidth,
          potentialNewHeight = _ref.potentialNewHeight;

      if (potentialNewWidth < imgWidth) {
        this.adjustCropBoxWidth(potentialNewWidth);
      } else {
        this.adjustCropBoxHeight(potentialNewHeight);
      }
    }
  }, {
    key: "adjustWidthOrHeightToMakeCropBoxHorizontal",
    value: function adjustWidthOrHeightToMakeCropBoxHorizontal(_ref2) {
      var imgHeight = _ref2.imgHeight,
          potentialNewWidth = _ref2.potentialNewWidth,
          potentialNewHeight = _ref2.potentialNewHeight;

      if (potentialNewHeight < imgHeight) {
        this.adjustCropBoxHeight(potentialNewHeight);
      } else {
        this.adjustCropBoxWidth(potentialNewWidth);
      }
    }
  }, {
    key: "adjustCropBoxHeight",
    value: function adjustCropBoxHeight(newHeight) {
      var canvasData = this.cropper.getCanvasData();
      this.cropper.setCropBoxData(getCropBoxDataObjWithSmallerHeight(this.cropper.getCropBoxData(), this.cropper.getContainerData(), newHeight, canvasData.height / canvasData.naturalHeight));
      this.setState({
        cropperHeight: newHeight.toString()
      });
    }
  }, {
    key: "adjustCropBoxWidth",
    value: function adjustCropBoxWidth(newWidth) {
      var canvasData = this.cropper.getCanvasData();
      this.cropper.setCropBoxData(getCropBoxDataObjWithSmallerWidth(this.cropper.getCropBoxData(), this.cropper.getContainerData(), newWidth, canvasData.width / canvasData.naturalWidth));
      this.setState({
        cropperWidth: newWidth.toString()
      });
    }
  }, {
    key: "resetCropperDimensionsAndPosition",
    value: function resetCropperDimensionsAndPosition() {
      this.cropper.setCropBoxData(getCropBoxDataForDimensionAndPositionReset(this.cropper.getContainerData(), this.cropper.getCanvasData()));
    }
  }, {
    key: "onAspectRatioChange",
    value: function onAspectRatioChange(_ref3) {
      var aspectRatio = _ref3.target.value;

      var _this$cropper$getCanv = this.cropper.getCanvasData(),
          _this$cropper$getCanv2 = _this$cropper$getCanv.naturalHeight,
          imgHeight = _this$cropper$getCanv2 === void 0 ? this.props.imgHeight : _this$cropper$getCanv2,
          _this$cropper$getCanv3 = _this$cropper$getCanv.naturalWidth,
          imgWidth = _this$cropper$getCanv3 === void 0 ? this.props.imgWidth : _this$cropper$getCanv3;

      this.resetCropperDimensionsAndPosition();
      this.adjustCropBox(aspectRatio, imgWidth, imgHeight);
      this.setState({
        aspectRatio: aspectRatio
      });
    }
  }, {
    key: "adjustCropBox",
    value: function adjustCropBox(aspectRatio, imgWidth, imgHeight) {
      switch (aspectRatio) {
        case PRESET_ASPECT_RATIOS.CUSTOM:
          break;

        case PRESET_ASPECT_RATIOS.SQUARE:
          this.adjustCropBoxToSquare(imgWidth, imgHeight);
          break;

        case PRESET_ASPECT_RATIOS.TWO_ONE:
          this.adjustWidthOrHeightToMakeCropBoxHorizontal(getRectangularAdjustCropBoxParams.apply(void 0, [imgWidth, imgHeight].concat(_toConsumableArray(AspectRatios.TWO_ONE))));
          break;

        case PRESET_ASPECT_RATIOS.FOUR_FIVE:
          this.adjustWidthOrHeightToMakeCropBoxVertical(getRectangularAdjustCropBoxParams.apply(void 0, [imgWidth, imgHeight].concat(_toConsumableArray(AspectRatios.FOUR_FIVE), [AspectRatioRoundingModes.ABOVE])));
          break;

        case PRESET_ASPECT_RATIOS.FB_LANDSCAPE:
          this.adjustWidthOrHeightToMakeCropBoxHorizontal(getRectangularAdjustCropBoxParams.apply(void 0, [imgWidth, imgHeight].concat(_toConsumableArray(AspectRatios.FB_LANDSCAPE))));
          break;

        case PRESET_ASPECT_RATIOS.IG_LANDSCAPE:
          this.adjustWidthOrHeightToMakeCropBoxHorizontal(getRectangularAdjustCropBoxParams.apply(void 0, [imgWidth, imgHeight].concat(_toConsumableArray(AspectRatios.IG_LANDSCAPE), [AspectRatioRoundingModes.BELOW])));
          break;

        case PRESET_ASPECT_RATIOS.LINKEDIN:
          this.adjustWidthOrHeightToMakeCropBoxHorizontal(getRectangularAdjustCropBoxParams.apply(void 0, [imgWidth, imgHeight].concat(_toConsumableArray(AspectRatios.LINKEDIN))));
          break;

        default:
          break;
      }
    }
  }, {
    key: "getAspectRatioOpts",
    value: function getAspectRatioOpts() {
      return [{
        text: I18n.text(getI18nKey("aspectRatios." + PRESET_ASPECT_RATIOS.CUSTOM)),
        value: PRESET_ASPECT_RATIOS.CUSTOM,
        avatar: /*#__PURE__*/_jsx("div", {
          style: {
            border: '3px solid #cbd6e2',
            borderRadius: '5px'
          }
        })
      }, {
        text: I18n.text(getI18nKey("aspectRatios." + PRESET_ASPECT_RATIOS.FB_LANDSCAPE)),
        value: PRESET_ASPECT_RATIOS.FB_LANDSCAPE,
        avatar: /*#__PURE__*/_jsx("div", {
          style: {
            top: 0
          },
          children: /*#__PURE__*/_jsx(UIIcon, Object.assign({
            name: "socialBlockFacebook"
          }, COMMON_ICON_PROPS))
        })
      }, {
        text: I18n.text(getI18nKey("aspectRatios." + PRESET_ASPECT_RATIOS.SQUARE)),
        value: PRESET_ASPECT_RATIOS.SQUARE,
        avatar: /*#__PURE__*/_jsx("div", {
          style: {
            top: 0
          },
          children: /*#__PURE__*/_jsx(UIIcon, Object.assign({
            name: "socialBlockInstagram"
          }, COMMON_ICON_PROPS))
        })
      }, {
        text: I18n.text(getI18nKey("aspectRatios." + PRESET_ASPECT_RATIOS.FOUR_FIVE)),
        value: PRESET_ASPECT_RATIOS.FOUR_FIVE,
        avatar: /*#__PURE__*/_jsx("div", {
          style: {
            top: 0
          },
          children: /*#__PURE__*/_jsx(UIIcon, Object.assign({
            name: "socialBlockInstagram"
          }, COMMON_ICON_PROPS))
        })
      }, {
        text: I18n.text(getI18nKey("aspectRatios." + PRESET_ASPECT_RATIOS.IG_LANDSCAPE)),
        value: PRESET_ASPECT_RATIOS.IG_LANDSCAPE,
        avatar: /*#__PURE__*/_jsx("div", {
          style: {
            top: 0
          },
          children: /*#__PURE__*/_jsx(UIIcon, Object.assign({
            name: "socialBlockInstagram"
          }, COMMON_ICON_PROPS))
        })
      }, {
        text: I18n.text(getI18nKey("aspectRatios." + PRESET_ASPECT_RATIOS.LINKEDIN)),
        value: PRESET_ASPECT_RATIOS.LINKEDIN,
        avatar: /*#__PURE__*/_jsx("div", {
          style: {
            top: 0
          },
          children: /*#__PURE__*/_jsx(UIIcon, Object.assign({
            name: "socialBlockLinkedin"
          }, COMMON_ICON_PROPS))
        })
      }, {
        text: I18n.text(getI18nKey("aspectRatios." + PRESET_ASPECT_RATIOS.TWO_ONE)),
        value: PRESET_ASPECT_RATIOS.TWO_ONE,
        avatar: /*#__PURE__*/_jsx("div", {
          style: {
            top: 0
          },
          children: /*#__PURE__*/_jsx(UIIcon, Object.assign({
            name: "socialBlockTwitter"
          }, COMMON_ICON_PROPS))
        })
      }];
    }
  }, {
    key: "getImageDimInputVal",
    value: function getImageDimInputVal(unsavedDim, savedDim) {
      if (unsavedDim === null) {
        return Math.round(savedDim).toString();
      }

      if (isNaN(unsavedDim)) {
        return '';
      }

      return Math.round(unsavedDim).toString();
    }
  }, {
    key: "initializeCropper",
    value: function initializeCropper() {
      var _this2 = this;

      this.cropper = new CropperJS(this.imageContainer, {
        autoCrop: false,
        autoCropArea: 1,
        responsive: false,
        guides: false,
        center: false,
        zoomOnWheel: this.hasFixedAspectRatio(),
        viewMode: this.hasFixedAspectRatio() ? 0 : 2,
        aspectRatio: this.hasFixedAspectRatio() ? this.props.fixedAspectRatio : undefined,
        crop: function crop(evt) {
          _this2.setState({
            cropperWidth: Math.round(evt.detail.width).toString(),
            cropperHeight: Math.round(evt.detail.height).toString()
          });
        },
        cropstart: function cropstart() {
          var newState = {
            aspectRatio: PRESET_ASPECT_RATIOS.CUSTOM
          };

          if (_this2.state.cropperMode !== 'crop') {
            newState.cropperMode = 'crop';
          }

          _this2.setState(newState);
        },
        ready: function ready() {
          _this2.setState({
            cropperReady: true
          });
        }
      });
    }
  }, {
    key: "onRotate",
    value: function onRotate() {
      this.cropper.rotate(DEFAULT_ROTATION_DEGREES);

      var _getNewCanvasAndBoxDa = getNewCanvasAndBoxDataAfterRotation(this.cropper.getContainerData(), this.cropper.getCropBoxData(), this.cropper.getCanvasData()),
          canvasData = _getNewCanvasAndBoxDa.canvasData,
          cropBoxData = _getNewCanvasAndBoxDa.cropBoxData;

      this.cropper.setCanvasData(canvasData);
      this.cropper.setCropBoxData(cropBoxData);
      this.setState({
        aspectRatio: PRESET_ASPECT_RATIOS.CUSTOM
      });
    }
  }, {
    key: "renderResizeInputs",
    value: function renderResizeInputs() {
      var _this3 = this;

      var _this$props = this.props,
          imgWidth = _this$props.imgWidth,
          imgHeight = _this$props.imgHeight,
          imgAspectRatio = _this$props.imgAspectRatio;
      var _this$state = this.state,
          unsavedImgWidth = _this$state.unsavedImgWidth,
          unsavedImgHeight = _this$state.unsavedImgHeight;
      return /*#__PURE__*/_jsxs("div", {
        className: "align-center",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "text-left",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('sizeLabel')
            }), /*#__PURE__*/_jsx("span", {
              className: "display-inline-block m-left-1",
              children: "("
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('widthLabel')
            }), /*#__PURE__*/_jsx("span", {
              className: "display-inline-block m-x-1",
              children: "x"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('heightLabel')
            }), /*#__PURE__*/_jsx("span", {
              children: ")"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "text-right",
            children: /*#__PURE__*/_jsx(UIButton, {
              className: "m-left-2",
              size: "xs",
              use: "unstyled",
              onClick: function onClick() {
                _this3.setState({
                  unsavedImgWidth: null,
                  unsavedImgHeight: null
                });
              },
              children: /*#__PURE__*/_jsx(Small, {
                className: "reset-button",
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: getI18nKey('resetButton')
                })
              })
            })
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "m-left-4",
          style: {
            maxWidth: 100
          },
          children: /*#__PURE__*/_jsx(UIInputStaticLabel, {
            text: "px",
            position: "end",
            children: /*#__PURE__*/_jsx(UINumberInput, {
              min: 0,
              formatter: dimensionValueToString,
              "data-test-selector": "width-resize-input",
              onChange: function onChange(evt) {
                var newWidth = parseInt(evt.target.value, 10);

                _this3.setState({
                  unsavedImgWidth: newWidth,
                  unsavedImgHeight: Math.round(newWidth / imgAspectRatio)
                });
              },
              value: parseInt(this.getImageDimInputVal(unsavedImgWidth, imgWidth), 10),
              error: parseInt(this.getImageDimInputVal(unsavedImgWidth, imgWidth), 10) <= 0
            })
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "m-left-2",
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "link",
            size: "xs"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "m-left-2",
          style: {
            maxWidth: 100
          },
          children: /*#__PURE__*/_jsx(UIInputStaticLabel, {
            text: "px",
            position: "end",
            children: /*#__PURE__*/_jsx(UINumberInput, {
              min: 0,
              formatter: dimensionValueToString,
              "data-test-selector": "height-resize-input",
              onChange: function onChange(evt) {
                var newHeight = parseInt(evt.target.value, 10);

                _this3.setState({
                  unsavedImgWidth: Math.round(newHeight * imgAspectRatio),
                  unsavedImgHeight: newHeight
                });
              },
              value: parseInt(this.getImageDimInputVal(unsavedImgHeight, imgHeight), 10),
              error: parseInt(this.getImageDimInputVal(unsavedImgHeight, imgHeight), 10) <= 0
            })
          })
        })]
      });
    }
  }, {
    key: "renderCropAndRotateControls",
    value: function renderCropAndRotateControls() {
      var _this$state2 = this.state,
          cropperWidth = _this$state2.cropperWidth,
          cropperHeight = _this$state2.cropperHeight,
          aspectRatio = _this$state2.aspectRatio;

      if (this.hasFixedAspectRatio()) {
        return /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(UIIconButton, {
            tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('zoomOut')
            }),
            onClick: this.handleZoomOut,
            children: /*#__PURE__*/_jsx(UIIcon, {
              name: "zoomOut"
            })
          }), /*#__PURE__*/_jsx(UIIconButton, {
            tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('zoomIn')
            }),
            onClick: this.handleZoomIn,
            children: /*#__PURE__*/_jsx(UIIcon, {
              name: "zoomIn"
            })
          })]
        });
      }

      return /*#__PURE__*/_jsx(ImageEditorCropControls, {
        cropper: this.cropper,
        cropperHeight: cropperHeight,
        cropperWidth: cropperWidth,
        aspectRatio: aspectRatio,
        onAspectRatioChange: this.onAspectRatioChange,
        onRotate: this.onRotate
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props2 = this.props,
          imgSrc = _this$props2.imgSrc,
          fileId = _this$props2.fileId,
          fileFolderId = _this$props2.fileFolderId,
          fileName = _this$props2.fileName,
          onClose = _this$props2.onClose,
          onCropSave = _this$props2.onCropSave,
          onResizeSave = _this$props2.onResizeSave,
          updateRequestStatus = _this$props2.updateRequestStatus,
          isReadOnly = _this$props2.isReadOnly;
      var _this$state3 = this.state,
          cropperReady = _this$state3.cropperReady,
          cropperMode = _this$state3.cropperMode,
          unsavedImgWidth = _this$state3.unsavedImgWidth,
          cropperWidth = _this$state3.cropperWidth,
          cropperHeight = _this$state3.cropperHeight;
      var encoding = this.props.saveEncoding || this.props.encoding;
      return /*#__PURE__*/_jsxs(UILightbox, {
        className: "image-editor-modal",
        onClose: onClose,
        onCloseComplete: function onCloseComplete() {
          if (_this4.cropper) {
            _this4.cropper.destroy();
          }
        },
        imageAlt: "Editing image: " + fileName,
        imageSrc: imgSrc,
        ImageComponent: this.ImageComponent,
        children: [!cropperMode && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(UIButton, {
            use: "tertiary-light",
            "data-test-selector": "crop-mode-button",
            disabled: !cropperReady,
            onClick: function onClick() {
              _this4.cropper.crop();

              _this4.setState({
                cropperMode: 'crop'
              });
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('cropButton')
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "tertiary-light",
            "data-test-selector": "resize-mode-button",
            onClick: function onClick() {
              _this4.setState({
                cropperMode: 'resize'
              });
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('resizeButton')
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "tertiary-light",
            disabled: !cropperReady,
            onClick: this.resetCropper,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('resetButton')
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "justify-left",
          children: [cropperMode === 'resize' && this.renderResizeInputs(), cropperMode === 'crop' && this.renderCropAndRotateControls()]
        }), /*#__PURE__*/_jsxs("div", {
          children: [!cropperMode && /*#__PURE__*/_jsx(UIButton, Object.assign({}, BACK_AND_CANCEL_BUTTON_COMMON_PROPS, {
            onClick: function onClick() {
              return _this4.props.onClose();
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('cancelButton')
            })
          })), cropperMode && !this.hasFixedAspectRatio() && /*#__PURE__*/_jsx(UIButton, Object.assign({}, BACK_AND_CANCEL_BUTTON_COMMON_PROPS, {
            "data-test-selector": "back-button",
            onClick: function onClick() {
              _this4.cropper.clear();

              _this4.setState({
                cropperMode: ''
              });
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('backButton')
            })
          })), /*#__PURE__*/_jsx(SaveEditsButton, {
            disabled: getIsImageEditorSaveButtonDisabled({
              cropperMode: cropperMode,
              unsavedImgWidth: unsavedImgWidth,
              cropperWidth: cropperWidth,
              cropperHeight: cropperHeight
            }) || isReadOnly,
            onClick: function onClick() {
              if (cropperMode === 'crop') {
                if (getIsCanvasToBlobSupported()) {
                  _this4.cropper.getCroppedCanvas().toBlob(function (blob) {
                    onCropSave(blob, fileName, fileFolderId);
                  }, "image/" + encoding);
                } else {
                  getCanvasBlobAndSaveFileForUnsupportedBrowsers(_this4.cropper, fileName, encoding, fileFolderId, onCropSave);
                }
              } else {
                onResizeSave(fileId, unsavedImgWidth);
              }
            },
            updateRequestStatus: updateRequestStatus
          })]
        })]
      });
    }
  }]);

  return ImageEditor;
}(Component);

ImageEditor.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  fileId: PropTypes.number,
  fileFolderId: PropTypes.number,
  fileName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onCropSave: PropTypes.func.isRequired,
  onResizeSave: PropTypes.func.isRequired,
  imgHeight: PropTypes.number.isRequired,
  imgWidth: PropTypes.number.isRequired,
  fixedAspectRatio: PropTypes.number,
  imgAspectRatio: PropTypes.number.isRequired,
  updateRequestStatus: PropTypes.oneOf(Object.keys(RequestStatus)),
  encoding: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  cropperMode: PropTypes.oneOf(['crop', 'resize']),
  saveEncoding: PropTypes.string
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    imgSrc: getImageSrc(state),
    fileId: getFileToEditId(state),
    fileFolderId: getFolderId(state),
    fileName: getFileToEditName(state),
    imgHeight: getImageHeight(state),
    imgWidth: getImageWidth(state),
    imgAspectRatio: getImageAspectRatio(state),
    updateRequestStatus: getEditImageRequestStatus(state),
    encoding: getImageEncoding(state),
    isReadOnly: getIsReadOnly(state)
  };
};

export default connect(mapStateToProps, null)(ImageEditor);