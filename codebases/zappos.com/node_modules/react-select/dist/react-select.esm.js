import { S as Select } from './Select-dbb12e54.esm.js';
export { c as createFilter, d as defaultTheme, m as mergeStyles } from './Select-dbb12e54.esm.js';
import { m as manageState } from './stateManager-845a3300.esm.js';
import _classCallCheck from '@babel/runtime/helpers/esm/classCallCheck';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _inherits from '@babel/runtime/helpers/esm/inherits';
import { _ as _createSuper } from './index-4bd03571.esm.js';
export { c as components } from './index-4bd03571.esm.js';
import React, { Component } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import memoizeOne from 'memoize-one';
import '@babel/runtime/helpers/extends';
import '@babel/runtime/helpers/toConsumableArray';
import '@babel/runtime/helpers/objectWithoutProperties';
import '@babel/runtime/helpers/taggedTemplateLiteral';
import '@babel/runtime/helpers/typeof';
import 'react-input-autosize';
import '@babel/runtime/helpers/defineProperty';
import 'react-dom';

var NonceProvider = /*#__PURE__*/function (_Component) {
  _inherits(NonceProvider, _Component);

  var _super = _createSuper(NonceProvider);

  function NonceProvider(props) {
    var _this;

    _classCallCheck(this, NonceProvider);

    _this = _super.call(this, props);

    _this.createEmotionCache = function (nonce, key) {
      return createCache({
        nonce: nonce,
        key: key
      });
    };

    _this.createEmotionCache = memoizeOne(_this.createEmotionCache);
    return _this;
  }

  _createClass(NonceProvider, [{
    key: "render",
    value: function render() {
      var emotionCache = this.createEmotionCache(this.props.nonce, this.props.cacheKey);
      return /*#__PURE__*/React.createElement(CacheProvider, {
        value: emotionCache
      }, this.props.children);
    }
  }]);

  return NonceProvider;
}(Component);

var index = manageState(Select);

export default index;
export { NonceProvider };
