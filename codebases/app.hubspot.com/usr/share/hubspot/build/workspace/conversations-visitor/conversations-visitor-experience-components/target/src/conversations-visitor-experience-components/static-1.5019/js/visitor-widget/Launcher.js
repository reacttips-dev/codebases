'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import I18n from 'I18n';
import { getBrandStyle } from '../visitor-widget/util/color';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { SQUARE, CIRCLE, PILL } from './constants/launcherShapes';
import PillLauncher from './PillLauncher';
import IconLauncher from './IconLauncher';
import ImageLauncher from './ImageLauncher';

var Launcher = /*#__PURE__*/function (_Component) {
  _inherits(Launcher, _Component);

  function Launcher() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Launcher);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Launcher)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleLaunch = function () {
      var _this$props = _this.props,
          onOpen = _this$props.onOpen,
          onClose = _this$props.onClose,
          open = _this$props.open;

      if (open) {
        onClose();
      } else {
        onOpen();
      }
    };

    return _this;
  }

  _createClass(Launcher, [{
    key: "getAltText",
    value: function getAltText(open) {
      return open ? I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.close') : I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.open');
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          badgeNumber = _this$props2.badgeNumber,
          _this$props2$coloring = _this$props2.coloring,
          accentColor = _this$props2$coloring.accentColor,
          useDefaultColor = _this$props2$coloring.useDefaultColor,
          className = _this$props2.className,
          customImage = _this$props2.customImage,
          open = _this$props2.open,
          shape = _this$props2.shape,
          text = _this$props2.text,
          showBadge = _this$props2.showBadge,
          disableDropShadow = _this$props2.disableDropShadow,
          overrideBorderColor = _this$props2.overrideBorderColor,
          overrideIconColor = _this$props2.overrideIconColor;

      if (this.props.customImage && shape !== PILL) {
        return /*#__PURE__*/_jsx(ImageLauncher, {
          className: "reagan--widget-loaded " + className,
          badgeNumber: badgeNumber,
          shape: shape,
          open: open,
          onClick: this.handleLaunch,
          tabIndex: "0",
          role: "button",
          type: "button",
          showBadge: showBadge,
          ariaLabel: this.getAltText(open),
          ariaHaspopup: open,
          disableDropShadow: disableDropShadow,
          overrideBorderColor: overrideBorderColor,
          customImage: customImage
        });
      }

      if (shape === PILL && this.props.text) {
        return /*#__PURE__*/_jsx(PillLauncher, {
          className: "reagan--widget-loaded " + className,
          style: getBrandStyle(accentColor),
          badgeNumber: badgeNumber,
          useDefaultColor: useDefaultColor,
          onClick: this.handleLaunch,
          tabIndex: "0",
          role: "button",
          type: "button",
          text: text,
          overrideBorderColor: overrideBorderColor,
          overrideTextColor: overrideIconColor,
          showBadge: showBadge,
          ariaLabel: this.getAltText(open),
          ariaHaspopup: open,
          disableDropShadow: disableDropShadow
        });
      }

      return /*#__PURE__*/_jsx(IconLauncher, {
        className: "reagan--widget-loaded " + className,
        style: getBrandStyle(accentColor),
        altText: this.getAltText(open),
        badgeNumber: badgeNumber,
        useDefaultColor: useDefaultColor,
        shape: shape,
        open: open,
        onClick: this.handleLaunch,
        tabIndex: "0",
        role: "button",
        type: "button",
        showBadge: showBadge,
        ariaLabel: this.getAltText(open),
        ariaHaspopup: open,
        disableDropShadow: disableDropShadow,
        overrideBorderColor: overrideBorderColor,
        overrideIconColor: overrideIconColor
      });
    }
  }]);

  return Launcher;
}(Component);

Launcher.defaultProps = {
  customImage: null,
  shape: CIRCLE,
  text: null,
  onOpen: emptyFunction,
  onClose: emptyFunction,
  open: false
};
Launcher.propTypes = {
  badgeNumber: PropTypes.number,
  className: PropTypes.string,
  coloring: RecordPropType('ColoringRecord').isRequired,
  customImage: PropTypes.string,
  disableDropShadow: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  //optional color overrides
  overrideBorderColor: PropTypes.string,
  overrideIconColor: PropTypes.string,
  shape: PropTypes.oneOf([SQUARE, CIRCLE, PILL]),
  showBadge: PropTypes.bool,
  text: PropTypes.string
};
Launcher.displayName = 'Launcher';
export default Launcher;