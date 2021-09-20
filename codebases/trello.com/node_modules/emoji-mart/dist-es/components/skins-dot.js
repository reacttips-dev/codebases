import _Object$getPrototypeOf from '../polyfills/objectGetPrototypeOf';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from '../polyfills/createClass';
import _possibleConstructorReturn from '../polyfills/possibleConstructorReturn';
import _inherits from '../polyfills/inherits';
import React from 'react';
import PropTypes from 'prop-types';

import Skins from './skins';

var SkinsDot = function (_Skins) {
  _inherits(SkinsDot, _Skins);

  function SkinsDot(props) {
    _classCallCheck(this, SkinsDot);

    var _this = _possibleConstructorReturn(this, (SkinsDot.__proto__ || _Object$getPrototypeOf(SkinsDot)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(SkinsDot, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var skin = _props.skin;
      var i18n = _props.i18n;
      var opened = this.state.opened;

      var skinToneNodes = [];

      for (var skinTone = 1; skinTone <= 6; skinTone++) {
        var selected = skinTone === skin;
        skinToneNodes.push(React.createElement(
          'span',
          {
            key: 'skin-tone-' + skinTone,
            className: 'emoji-mart-skin-swatch' + (selected ? ' selected' : '')
          },
          React.createElement('span', {
            onClick: this.handleClick,
            'data-skin': skinTone,
            className: 'emoji-mart-skin emoji-mart-skin-tone-' + skinTone
          })
        ));
      }

      return React.createElement(
        'div',
        { className: 'emoji-mart-skin-swatches' + (opened ? ' opened' : '') },
        skinToneNodes
      );
    }
  }]);

  return SkinsDot;
}(Skins);

export default SkinsDot;


SkinsDot.propTypes = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
  i18n: PropTypes.object
};

SkinsDot.defaultProps = {
  onChange: function onChange() {}
};