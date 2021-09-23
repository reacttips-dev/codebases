'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { KOALA } from 'HubStyleTokens/colors';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { hidden } from '../../utils/propTypes/decorators';
import UIAbstractDropdown from './UIAbstractDropdown';
/**
 * Keeps track of the effective placement and sets arrowColor accordingly.
 */

var UIAbstractDropdownWithSearchbox = /*#__PURE__*/function (_Component) {
  _inherits(UIAbstractDropdownWithSearchbox, _Component);

  function UIAbstractDropdownWithSearchbox() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIAbstractDropdownWithSearchbox);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIAbstractDropdownWithSearchbox)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      placement: null
    };

    _this.handleChangePlacement = function (evt) {
      var onChangePlacement = _this.props.onChangePlacement;
      var newPlacement = evt.newPlacement;

      if (_this.state.placement !== newPlacement) {
        _this.setState({
          placement: newPlacement
        });
      }

      if (onChangePlacement) onChangePlacement(evt);
    };

    return _this;
  }

  _createClass(UIAbstractDropdownWithSearchbox, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      // If the placement prop is reset, clear our internal override.
      if (nextProps.placement !== this.props.placement) {
        this.setState({
          placement: null
        });
      }

      if (nextProps.open && !this.props.open) {
        this.setState({
          placement: null
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          buttonUse = _this$props.buttonUse,
          dropdownClassName = _this$props.dropdownClassName,
          hasSearchbox = _this$props.hasSearchbox,
          placement = _this$props.placement,
          rest = _objectWithoutProperties(_this$props, ["buttonUse", "dropdownClassName", "hasSearchbox", "placement"]);

      var placementState = this.state.placement;
      var defaultPlacement = buttonUse.match(/link|transparent/) ? 'bottom' : 'bottom right';
      var computedPlacement = placementState || placement || defaultPlacement;
      var arrowAtBottom = computedPlacement.includes('bottom');
      var arrowAtTop = computedPlacement.includes('top');
      var computedArrowColor = hasSearchbox && arrowAtBottom ? KOALA : null;
      var computedDropdownClassName = classNames(dropdownClassName, hasSearchbox && [arrowAtBottom && 'p-y-0', arrowAtTop && 'p-top-0']);
      return /*#__PURE__*/_jsx(UIAbstractDropdown, Object.assign({}, rest, {
        arrowColor: computedArrowColor,
        buttonUse: buttonUse,
        dropdownClassName: computedDropdownClassName,
        onChangePlacement: this.handleChangePlacement,
        placement: computedPlacement
      }));
    }
  }]);

  return UIAbstractDropdownWithSearchbox;
}(Component);

export { UIAbstractDropdownWithSearchbox as default };
UIAbstractDropdownWithSearchbox.propTypes = Object.assign({}, UIAbstractDropdown.propTypes, {
  arrowColor: hidden(UIAbstractDropdown.propTypes.arrowColor),
  hasSearchbox: PropTypes.bool.isRequired
});
UIAbstractDropdownWithSearchbox.defaultProps = UIAbstractDropdown.defaultProps;
UIAbstractDropdownWithSearchbox.displayName = 'UIAbstractDropdownWithSearchbox';