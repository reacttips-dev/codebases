'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISelect from 'UIComponents/input/UISelect';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import { trackInteraction } from 'FileManagerCore/actions/tracking';
import { selectImageOptimizationSetting } from '../../actions/ImageOptimizationSettings';
import { getImageOptimizationSetting } from '../../selectors/ImageOptimizationSettings';
import * as ImageOptimizationSettings from '../../enums/ImageOptimizationSettings';

function getI18nKey(suffix) {
  return "FileManagerLib.imageOptimizationSettings." + suffix;
}

var imageOptimizationSettingsValues = Object.keys(ImageOptimizationSettings).map(function (setting) {
  return ImageOptimizationSettings[setting];
});

var ImageOptimizationControl = /*#__PURE__*/function (_PureComponent) {
  _inherits(ImageOptimizationControl, _PureComponent);

  function ImageOptimizationControl() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ImageOptimizationControl);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ImageOptimizationControl)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.options = imageOptimizationSettingsValues.map(function (value) {
      return {
        text: I18n.text(getI18nKey("text." + value)),
        help: I18n.text(getI18nKey("help." + value)),
        value: value
      };
    });
    return _this;
  }

  _createClass(ImageOptimizationControl, [{
    key: "renderLabel",
    value: function renderLabel() {
      return /*#__PURE__*/_jsx("span", {
        className: "m-right-2",
        children: /*#__PURE__*/_jsx(UIHelpIcon, {
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('description')
          }),
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('label')
          })
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onSelectImageOptimizationSetting = _this$props.onSelectImageOptimizationSetting,
          imageOptimizationSetting = _this$props.imageOptimizationSetting;
      return /*#__PURE__*/_jsxs("div", {
        className: "m-top-2",
        children: [this.renderLabel(), /*#__PURE__*/_jsx(UISelect, {
          buttonUse: "link",
          menuWidth: "auto",
          onChange: onSelectImageOptimizationSetting,
          value: imageOptimizationSetting,
          options: this.options
        })]
      });
    }
  }]);

  return ImageOptimizationControl;
}(PureComponent);

ImageOptimizationControl.propTypes = {
  onSelectImageOptimizationSetting: PropTypes.func.isRequired,
  imageOptimizationSetting: PropTypes.oneOf(imageOptimizationSettingsValues).isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    imageOptimizationSetting: getImageOptimizationSetting(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onSelectImageOptimizationSetting: function onSelectImageOptimizationSetting(_ref) {
      var value = _ref.target.value;
      dispatch(trackInteraction('fileManagerImageOptimization', 'Change image optimization setting', {
        setting: value
      }));
      dispatch(selectImageOptimizationSetting(value));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageOptimizationControl);