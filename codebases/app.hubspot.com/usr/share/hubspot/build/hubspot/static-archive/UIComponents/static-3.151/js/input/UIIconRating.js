'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIAbstractRatingInput from './abstract/UIAbstractRatingInput';
import { allSizes } from '../utils/propTypes/tshirtSize';
import pick from '../utils/underscore/pick';
var pickedPropTypes = ['readOnly', 'disabled', 'iconCount', 'value', 'onChange', 'showPercentage', 'defaultValue'];

var UIIconRating = /*#__PURE__*/function (_Component) {
  _inherits(UIIconRating, _Component);

  function UIIconRating() {
    _classCallCheck(this, UIIconRating);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIIconRating).apply(this, arguments));
  }

  _createClass(UIIconRating, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIAbstractRatingInput, Object.assign({}, this.props));
    }
  }]);

  return UIIconRating;
}(Component);

UIIconRating.propTypes = Object.assign({}, pick(UIAbstractRatingInput.propTypes, pickedPropTypes), {
  size: PropTypes.oneOfType([allSizes, PropTypes.oneOf(['xxs', 'xxl'])])
});
UIIconRating.defaultProps = Object.assign({}, pick(UIAbstractRatingInput.defaultProps, pickedPropTypes), {
  size: 'xs'
});
UIIconRating.displayName = 'UIIconRating';
export default UIIconRating;