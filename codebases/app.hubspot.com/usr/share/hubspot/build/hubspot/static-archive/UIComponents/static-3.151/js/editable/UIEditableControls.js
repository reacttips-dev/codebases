'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import Controllable from '../decorators/Controllable';
import I18n from 'I18n';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import SyntheticEvent from '../core/SyntheticEvent';
import UIButton from '../button/UIButton';
import UISlideoutDrawer from '../slideout/UISlideoutDrawer';
import lazyEval from '../utils/lazyEval';
import { hidden } from '../utils/propTypes/decorators';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import IMEAware from '../decorators/IMEAware';

var UIEditableControls = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIEditableControls, _PureComponent);

  function UIEditableControls() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIEditableControls);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIEditableControls)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleFocus = function (evt) {
      var _this$props = _this.props,
          onFocus = _this$props.onFocus,
          onOpenChange = _this$props.onOpenChange;
      onOpenChange(SyntheticEvent(true));
      if (onFocus) onFocus(evt);
    };

    _this.handleKeyDown = function (evt) {
      var _this$props2 = _this.props,
          saveDisabled = _this$props2.saveDisabled,
          saveOnEnter = _this$props2.saveOnEnter,
          composing = _this$props2.composing;
      if (composing) return;
      var key = evt.key;

      if (key === 'Enter' && !saveDisabled && (saveOnEnter || evt.metaKey || evt.ctrlKey)) {
        _this.handleSave();
      }

      if (key === 'Escape') {
        _this.handleCancel();
      }
    };

    _this.handleChange = function () {
      var onOpenChange = _this.props.onOpenChange;
      onOpenChange(SyntheticEvent(true));
    };

    _this.handleSave = function () {
      var _this$props3 = _this.props,
          onOpenChange = _this$props3.onOpenChange,
          onSave = _this$props3.onSave;

      _this._el.focus();

      onOpenChange(SyntheticEvent(false));
      if (onSave) onSave();
    };

    _this.handleCancel = function () {
      var _this$props4 = _this.props,
          onCancel = _this$props4.onCancel,
          onOpenChange = _this$props4.onOpenChange;

      _this._el.focus();

      onOpenChange(SyntheticEvent(false));
      if (onCancel) onCancel();
    };

    return _this;
  }

  _createClass(UIEditableControls, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props5 = this.props,
          __composing = _this$props5.composing,
          cancelButtonUse = _this$props5.cancelButtonUse,
          cancelLabel = _this$props5.cancelLabel,
          children = _this$props5.children,
          className = _this$props5.className,
          okButtonUse = _this$props5.okButtonUse,
          __onCancel = _this$props5.onCancel,
          __onOpenChange = _this$props5.onOpenChange,
          __onSave = _this$props5.onSave,
          open = _this$props5.open,
          responsive = _this$props5.responsive,
          __saveDisabled = _this$props5.saveDisabled,
          __saveOnEnter = _this$props5.saveOnEnter,
          saveLabel = _this$props5.saveLabel,
          use = _this$props5.use,
          rest = _objectWithoutProperties(_this$props5, ["composing", "cancelButtonUse", "cancelLabel", "children", "className", "okButtonUse", "onCancel", "onOpenChange", "onSave", "open", "responsive", "saveDisabled", "saveOnEnter", "saveLabel", "use"]);

      var classes = classNames("uiEditableControls private-editable-control", className, use === 'flush' && 'private-editable-control--flush');
      return (
        /*#__PURE__*/

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        _jsxs("div", Object.assign({
          className: classes,
          onChange: this.handleChange,
          onFocus: this.handleFocus,
          onKeyDown: this.handleKeyDown,
          ref: function ref(_ref) {
            _this2._el = _ref;
          }
        }, rest, {
          children: [children, /*#__PURE__*/_jsx(UISlideoutDrawer, {
            open: open,
            children: /*#__PURE__*/_jsxs("div", {
              className: "private-editable-control__controls",
              children: [/*#__PURE__*/_jsx(UIButton, {
                className: "private-editable-control__save",
                disabled: this.props.saveDisabled,
                onClick: this.handleSave,
                responsive: responsive,
                size: "extra-small",
                use: okButtonUse,
                children: lazyEval(saveLabel)
              }), /*#__PURE__*/_jsx(UIButton, {
                className: "private-editable-control__cancel",
                onClick: this.handleCancel,
                responsive: responsive,
                size: "extra-small",
                use: cancelButtonUse,
                children: lazyEval(cancelLabel)
              })]
            }, "controls")
          })]
        }))
        /* eslint-enable jsx-a11y/no-static-element-interactions */

      );
    }
  }]);

  return UIEditableControls;
}(PureComponent);

UIEditableControls.propTypes = {
  composing: hidden(PropTypes.bool),
  cancelButtonUse: PropTypes.string,
  cancelLabel: createLazyPropType(PropTypes.node).isRequired,
  children: PropTypes.node,
  okButtonUse: PropTypes.string,
  onCancel: PropTypes.func,
  onFocus: PropTypes.func,
  onOpenChange: PropTypes.func,
  onSave: PropTypes.func,
  open: PropTypes.bool,
  responsive: PropTypes.bool,
  saveDisabled: PropTypes.bool,
  saveLabel: createLazyPropType(PropTypes.node).isRequired,
  saveOnEnter: PropTypes.bool,
  use: PropTypes.oneOf(['inset', 'flush'])
};
UIEditableControls.defaultProps = {
  cancelButtonUse: 'tertiary-light',
  cancelLabel: function cancelLabel() {
    return I18n.text('salesUI.UIEditableControls.cancel');
  },
  okButtonUse: 'tertiary',
  open: false,
  responsive: true,
  saveDisabled: false,
  saveLabel: function saveLabel() {
    return I18n.text('salesUI.UIEditableControls.save');
  },
  saveOnEnter: true,
  use: 'inset'
};
UIEditableControls.displayName = 'UIEditableControls';
export default IMEAware(Controllable(UIEditableControls, ['open']));