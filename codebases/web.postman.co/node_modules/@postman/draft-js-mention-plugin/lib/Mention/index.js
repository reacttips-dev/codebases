'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _unionClassNames = require('union-class-names');

var _unionClassNames2 = _interopRequireDefault(_unionClassNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MentionLink = function MentionLink(_ref) {
  var mention = _ref.mention,
      children = _ref.children,
      className = _ref.className;
  return _react2.default.createElement(
    'a',
    {
      href: mention.get('link'),
      className: className,
      spellCheck: false
    },
    children
  );
};

var MentionText = function MentionText(_ref2) {
  var children = _ref2.children,
      className = _ref2.className;
  return _react2.default.createElement(
    'span',
    {
      className: className,
      spellCheck: false
    },
    children
  );
};

var Mention = function Mention(props) {
  var entityKey = props.entityKey,
      _props$theme = props.theme,
      theme = _props$theme === undefined ? {} : _props$theme,
      mentionComponent = props.mentionComponent,
      children = props.children,
      decoratedText = props.decoratedText,
      className = props.className,
      contentState = props.contentState;


  var combinedClassName = (0, _unionClassNames2.default)(theme.mention, className);
  var mention = (0, _immutable.fromJS)(contentState.getEntity(entityKey).getData().mention);

  var Component = mentionComponent || (mention.has('link') ? MentionLink : MentionText);

  return _react2.default.createElement(
    Component,
    {
      entityKey: entityKey,
      mention: mention,
      theme: theme,
      className: combinedClassName,
      decoratedText: decoratedText
    },
    children
  );
};

exports.default = Mention;