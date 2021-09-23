'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
var propTypes = {
  loadingContent: PropTypes.node,
  props: PropTypes.object.isRequired,
  requirement: PropTypes.func.isRequired
};
var defaultProps = {
  loadingContent: null,
  props: {}
};
var initialState = {
  Result: null
};

var AsyncComponent = /*#__PURE__*/function (_Component) {
  _inherits(AsyncComponent, _Component);

  function AsyncComponent() {
    var _this;

    _classCallCheck(this, AsyncComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsyncComponent).call(this));
    _this.state = initialState;
    return _this;
  }

  _createClass(AsyncComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this._isMounted = true;
      this.props.requirement(function (Result) {
        // eslint-disable-next-line react/no-did-mount-set-state
        if (_this2._isMounted) {
          _this2.setState({
            Result: Result
          });
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loadingContent = _this$props.loadingContent,
          props = _this$props.props;
      var Result = this.state.Result;

      if (!Result) {
        return loadingContent;
      }

      return /*#__PURE__*/_jsx(Result, Object.assign({}, props));
    }
  }]);

  return AsyncComponent;
}(Component);

export { AsyncComponent as default };
AsyncComponent.propTypes = propTypes;
AsyncComponent.defaultProps = defaultProps;