'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { initializeI18n } from '../../utils/initializeI18n';

var AsyncMessagesPreview = /*#__PURE__*/function (_React$Component) {
  _inherits(AsyncMessagesPreview, _React$Component);

  function AsyncMessagesPreview(props) {
    var _this;

    _classCallCheck(this, AsyncMessagesPreview);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsyncMessagesPreview).call(this, props));
    _this.state = {
      AsyncComponent: null,
      error: null
    };
    return _this;
  }

  _createClass(AsyncMessagesPreview, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      Promise.all([import(
      /* webpackChunkName: "messages-preview" */
      '../../message-preview/containers/MessagePreviewContainer'), initializeI18n()]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            AsyncModule = _ref2[0];

        _this2.setState({
          AsyncComponent: AsyncModule.default
        });
      }, function (error) {
        _this2.setState({
          error: error
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var Component = this.state.AsyncComponent;

      if (this.state.error) {
        window.parent.postMessage('error');
        return null;
      }

      if (!Component) {
        return null;
      }

      return /*#__PURE__*/_jsx(Component, Object.assign({}, this.props));
    }
  }]);

  return AsyncMessagesPreview;
}(React.Component);

AsyncMessagesPreview.displayName = 'AsyncMessagesPreview';
export default AsyncMessagesPreview;