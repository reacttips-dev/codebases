import _Object$getPrototypeOf from '../polyfills/objectGetPrototypeOf';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from '../polyfills/createClass';
import _possibleConstructorReturn from '../polyfills/possibleConstructorReturn';
import _inherits from '../polyfills/inherits';
import React from 'react';
import PropTypes from 'prop-types';

import NimbleEmoji from './emoji/nimble-emoji';
import Skins from './skins';

var SkinsEmoji = function (_Skins) {
  _inherits(SkinsEmoji, _Skins);

  function SkinsEmoji(props) {
    _classCallCheck(this, SkinsEmoji);

    var _this = _possibleConstructorReturn(this, (SkinsEmoji.__proto__ || _Object$getPrototypeOf(SkinsEmoji)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(SkinsEmoji, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var skin = _props.skin;
      var emojiProps = _props.emojiProps;
      var data = _props.data;
      var skinEmoji = _props.skinEmoji;
      var i18n = _props.i18n;
      var opened = this.state.opened;

      var skinToneNodes = [];

      for (var skinTone = 1; skinTone <= 6; skinTone++) {
        var selected = skinTone === skin;
        skinToneNodes.push(React.createElement(
          'span',
          {
            key: 'skin-tone-' + skinTone,
            className: 'emoji-mart-skin-swatch custom' + (selected ? ' selected' : '')
          },
          React.createElement(
            'span',
            {
              onClick: this.handleClick,
              'data-skin': skinTone,
              className: 'emoji-mart-skin-tone-' + skinTone
            },
            NimbleEmoji({
              emoji: skinEmoji,
              data: data,
              skin: skinTone,
              backgroundImageFn: emojiProps.backgroundImageFn,
              native: emojiProps.native,
              set: emojiProps.set,
              sheetSize: emojiProps.sheetSize,
              size: 23
            })
          )
        ));
      }

      return React.createElement(
        'div',
        {
          className: 'emoji-mart-skin-swatches custom' + (opened ? ' opened' : '')
        },
        React.createElement(
          'div',
          { className: 'emoji-mart-skin-text' + (opened ? ' opened' : '') },
          i18n.skintext
        ),
        skinToneNodes
      );
    }
  }]);

  return SkinsEmoji;
}(Skins);

export default SkinsEmoji;


SkinsEmoji.propTypes = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
  emojiProps: PropTypes.object.isRequired,
  skinTone: PropTypes.number,
  skinEmoji: PropTypes.string.isRequired,
  i18n: PropTypes.object
};

SkinsEmoji.defaultProps = {
  onChange: function onChange() {},
  skinTone: null
};