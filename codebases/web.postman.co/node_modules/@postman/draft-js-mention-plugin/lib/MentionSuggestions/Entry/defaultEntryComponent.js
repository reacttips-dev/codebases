'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaultEntryComponent = function defaultEntryComponent(props) {
  var mention = props.mention,
      theme = props.theme,
      searchValue = props.searchValue,
      parentProps = _objectWithoutProperties(props, ['mention', 'theme', 'searchValue']);

  return _react2.default.createElement(
    'div',
    parentProps,
    _react2.default.createElement(_Avatar2.default, { mention: mention, theme: theme }),
    _react2.default.createElement(
      'span',
      { className: theme.mentionSuggestionsEntryText },
      mention.get('name')
    )
  );
};

exports.default = defaultEntryComponent;