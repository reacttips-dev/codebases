'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import SimpleStyledClickable from './internal/SimpleStyledClickable';
import { callIfPossible } from '../core/Functions';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';

var UITextToolbarButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITextToolbarButton, _PureComponent);

  function UITextToolbarButton() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UITextToolbarButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UITextToolbarButton)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleClick = function (evt) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          onSelectedChange = _this$props.onSelectedChange,
          selected = _this$props.selected;
      onSelectedChange(SyntheticEvent(!selected));
      callIfPossible(onClick, evt);
    };

    return _this;
  }

  _createClass(UITextToolbarButton, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          __onSelectedChange = _this$props2.onSelectedChange,
          selected = _this$props2.selected,
          rest = _objectWithoutProperties(_this$props2, ["onSelectedChange", "selected"]);

      return /*#__PURE__*/_jsx(SimpleStyledClickable, Object.assign({}, rest, {
        "aria-pressed": selected,
        onClick: this.handleClick
      }));
    }
  }]);

  return UITextToolbarButton;
}(PureComponent);

UITextToolbarButton.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onSelectedChange: PropTypes.func,
  selected: PropTypes.bool
};
UITextToolbarButton.defaultProps = {
  selected: false
};
UITextToolbarButton.displayName = 'UITextToolbarButton';
export default Controllable(UITextToolbarButton, ['selected']);