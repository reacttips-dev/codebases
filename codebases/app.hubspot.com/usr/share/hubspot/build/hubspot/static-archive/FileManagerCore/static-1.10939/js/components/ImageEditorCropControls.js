'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import CropperJS from 'cropperjs';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import keyMirror from 'react-utils/keyMirror';
import UIIconButton from 'UIComponents/button/UIIconButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIInputStaticLabel from 'UIComponents/input/UIInputStaticLabel';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UISelect from 'UIComponents/input/UISelect';
import { dimensionValueToString } from '../utils/stringUtils';
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

var getAspectRatioOpts = function getAspectRatioOpts() {
  return [{
    text: I18n.text("FileManagerCore.imageEditor.aspectRatios.CUSTOM"),
    value: PRESET_ASPECT_RATIOS.CUSTOM,
    avatar: /*#__PURE__*/_jsx("div", {
      style: {
        border: '3px solid #cbd6e2',
        borderRadius: '5px'
      }
    })
  }, {
    text: I18n.text("FileManagerCore.imageEditor.aspectRatios.FB_LANDSCAPE"),
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
    text: I18n.text("FileManagerCore.imageEditor.aspectRatios.SQUARE"),
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
    text: I18n.text("FileManagerCore.imageEditor.aspectRatios.FOUR_FIVE"),
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
    text: I18n.text("FileManagerCore.imageEditor.aspectRatios.IG_LANDSCAPE"),
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
    text: I18n.text("FileManagerCore.imageEditor.aspectRatios.LINKEDIN"),
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
    text: I18n.text("FileManagerCore.imageEditor.aspectRatios.TWO_ONE"),
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
};

var AspectRatioPresetSelect = function AspectRatioPresetSelect(_ref) {
  var aspectRatio = _ref.aspectRatio,
      onAspectRatioChange = _ref.onAspectRatioChange;
  return /*#__PURE__*/_jsx("div", {
    className: "m-right-4",
    children: /*#__PURE__*/_jsx(UISelect, {
      "data-test-selector": "preset-aspect-ratios-selector",
      value: aspectRatio,
      menuWidth: "auto",
      onChange: onAspectRatioChange,
      options: getAspectRatioOpts()
    })
  });
};

var ImageEditorCropControls = function ImageEditorCropControls(_ref2) {
  var cropper = _ref2.cropper,
      cropperWidth = _ref2.cropperWidth,
      cropperHeight = _ref2.cropperHeight,
      aspectRatio = _ref2.aspectRatio,
      onAspectRatioChange = _ref2.onAspectRatioChange,
      onRotate = _ref2.onRotate,
      _ref2$includeAspectRa = _ref2.includeAspectRatioPresets,
      includeAspectRatioPresets = _ref2$includeAspectRa === void 0 ? true : _ref2$includeAspectRa,
      _ref2$includeRotate = _ref2.includeRotate,
      includeRotate = _ref2$includeRotate === void 0 ? true : _ref2$includeRotate,
      maxHeight = _ref2.maxHeight,
      maxWidth = _ref2.maxWidth;
  return /*#__PURE__*/_jsxs("div", {
    className: "align-center",
    children: [includeAspectRatioPresets && aspectRatio && /*#__PURE__*/_jsx(AspectRatioPresetSelect, {
      aspectRatio: aspectRatio,
      onAspectRatioChange: onAspectRatioChange
    }), /*#__PURE__*/_jsxs("div", {
      className: "crop-size-label",
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: "FileManagerCore.imageEditor.cropSizeLabel"
      }), /*#__PURE__*/_jsx("span", {
        className: "display-inline-block m-left-1",
        children: "("
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "FileManagerCore.imageEditor.widthLabel"
      }), /*#__PURE__*/_jsx("span", {
        className: "display-inline-block m-x-1",
        children: "x"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "FileManagerCore.imageEditor.heightLabel"
      }), /*#__PURE__*/_jsx("span", {
        children: ")"
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
          "data-test-selector": "width-crop-input",
          formatter: dimensionValueToString,
          min: 0,
          max: maxWidth || cropper.imageData.naturalWidth,
          onChange: function onChange(evt) {
            var newWidth = parseInt(evt.target.value, 10);

            if (isNaN(newWidth)) {
              newWidth = '';
            }

            var originalImageToScreenFitScaleX = cropper.imageData.naturalWidth / cropper.imageData.width;
            cropper.setCropBoxData(Object.assign(cropper.getCropBoxData(), {
              width: newWidth / originalImageToScreenFitScaleX
            }));
          },
          value: parseInt(cropperWidth, 10),
          error: parseInt(cropperWidth, 10) <= 0
        })
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "m-left-4",
      style: {
        maxWidth: 100
      },
      children: /*#__PURE__*/_jsx(UIInputStaticLabel, {
        text: "px",
        position: "end",
        children: /*#__PURE__*/_jsx(UINumberInput, {
          "data-test-selector": "height-crop-input",
          formatter: dimensionValueToString,
          min: 0,
          max: maxHeight || cropper.imageData.naturalHeight,
          onChange: function onChange(evt) {
            var newHeight = parseInt(evt.target.value, 10);

            if (isNaN(newHeight)) {
              newHeight = '';
            }

            var originalImageToScreenFitScaleY = cropper.imageData.naturalHeight / cropper.imageData.height;
            cropper.setCropBoxData(Object.assign(cropper.getCropBoxData(), {
              height: newHeight / originalImageToScreenFitScaleY
            }));
          },
          value: parseInt(cropperHeight, 10),
          error: parseInt(cropperHeight, 10) <= 0
        })
      })
    }), includeRotate && /*#__PURE__*/_jsx(UIIconButton, {
      className: "m-left-4",
      "data-test-selector": "rotate-button",
      onClick: onRotate,
      children: /*#__PURE__*/_jsx(UIIcon, {
        name: "rotate"
      })
    })]
  });
};

var validateAspectRatioProps = function validateAspectRatioProps(props, propName) {
  var includeAspectRatioPresets = props.includeAspectRatioPresets;

  for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  if (propName === 'aspectRatio') {
    var expectedType = PropTypes.oneOf(Object.keys(PRESET_ASPECT_RATIOS));
    return includeAspectRatioPresets ? expectedType.isRequired.apply(expectedType, [props, propName].concat(rest)) : expectedType.apply(void 0, [props, propName].concat(rest));
  } else if (propName === 'onAspectRatioChange') {
    var _PropTypes$func;

    return includeAspectRatioPresets ? (_PropTypes$func = PropTypes.func).isRequired.apply(_PropTypes$func, [props, propName].concat(rest)) : PropTypes.func.apply(PropTypes, [props, propName].concat(rest));
  } else {
    return null;
  }
};

ImageEditorCropControls.defaultProps = {
  includeAspectRatioPresets: true,
  includeRotate: true
};
ImageEditorCropControls.propTypes = {
  cropper: PropTypes.instanceOf(CropperJS).isRequired,
  cropperHeight: PropTypes.string.isRequired,
  cropperWidth: PropTypes.string.isRequired,
  includeAspectRatioPresets: PropTypes.bool,
  includeRotate: PropTypes.bool,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  aspectRatio: validateAspectRatioProps,
  onAspectRatioChange: validateAspectRatioProps,
  onRotate: function onRotate(props) {
    var _PropTypes$func2;

    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    return props.includeRotate && !props.onRotate ? (_PropTypes$func2 = PropTypes.func).isRequired.apply(_PropTypes$func2, [props].concat(rest)) : PropTypes.func.apply(PropTypes, [props].concat(rest));
  }
};
export default ImageEditorCropControls;