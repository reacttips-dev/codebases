'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * ClearButton
 *
 * http://getbootstrap.com/css/#helper-classes-close
 */
var ClearButton = function ClearButton(_ref) {
  var bsSize = _ref.bsSize,
      className = _ref.className,
      label = _ref.label,
      _onClick = _ref.onClick,
      props = _objectWithoutProperties(_ref, ['bsSize', 'className', 'label', 'onClick']);

  return _react2.default.createElement(
    'button',
    _extends({}, props, {
      'aria-label': label,
      className: (0, _classnames2.default)('close', 'rbt-close', {
        'rbt-close-lg': bsSize === 'large' || bsSize === 'lg'
      }, className),
      onClick: function onClick(e) {
        e.stopPropagation();
        _onClick(e);
      },
      type: 'button' }),
    _react2.default.createElement(
      'span',
      { 'aria-hidden': 'true' },
      '\xD7'
    ),
    _react2.default.createElement(
      'span',
      { className: 'sr-only' },
      label
    )
  );
};

ClearButton.propTypes = {
  bsSize: _propTypes2.default.oneOf(['large', 'lg', 'small', 'sm']),
  label: _propTypes2.default.string,
  onClick: _propTypes2.default.func.isRequired
};

ClearButton.defaultProps = {
  label: 'Clear'
};

exports.default = ClearButton;