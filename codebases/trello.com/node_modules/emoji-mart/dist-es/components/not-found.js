import _extends from '../polyfills/extends';
import _Object$getPrototypeOf from '../polyfills/objectGetPrototypeOf';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from '../polyfills/createClass';
import _possibleConstructorReturn from '../polyfills/possibleConstructorReturn';
import _inherits from '../polyfills/inherits';
import React from 'react';
import PropTypes from 'prop-types';

import NimbleEmoji from './emoji/nimble-emoji';

var NotFound = function (_React$PureComponent) {
  _inherits(NotFound, _React$PureComponent);

  function NotFound() {
    _classCallCheck(this, NotFound);

    return _possibleConstructorReturn(this, (NotFound.__proto__ || _Object$getPrototypeOf(NotFound)).apply(this, arguments));
  }

  _createClass(NotFound, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var data = _props.data;
      var emojiProps = _props.emojiProps;
      var i18n = _props.i18n;
      var notFound = _props.notFound;
      var notFoundEmoji = _props.notFoundEmoji;


      var component = notFound && notFound() || React.createElement(
        'div',
        { className: 'emoji-mart-no-results' },
        NimbleEmoji(_extends({
          data: data
        }, emojiProps, {
          size: 38,
          emoji: notFoundEmoji,
          onOver: null,
          onLeave: null,
          onClick: null
        })),
        React.createElement(
          'div',
          { className: 'emoji-mart-no-results-label' },
          i18n.notfound
        )
      );

      return component;
    }
  }]);

  return NotFound;
}(React.PureComponent);

export default NotFound;