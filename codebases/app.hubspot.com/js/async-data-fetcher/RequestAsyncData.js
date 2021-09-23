'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Component } from 'react';
import PropTypes from 'prop-types';
import { isUninitialized, isFailed } from 'conversations-async-data/async-data/operators/statusComparators';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';

var RequestAsyncData = /*#__PURE__*/function (_Component) {
  _inherits(RequestAsyncData, _Component);

  function RequestAsyncData(props, context) {
    var _this;

    _classCallCheck(this, RequestAsyncData);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RequestAsyncData).call(this, props, context));

    _this.retry = function () {
      var _this$props = _this.props,
          requestor = _this$props.requestor,
          requestParams = _this$props.requestParams;
      _this._requestCount = 1;
      requestor(requestParams);
    };

    _this.makeRequest = function () {
      var _this$props2 = _this.props,
          asyncData = _this$props2.asyncData,
          requestor = _this$props2.requestor,
          requestParams = _this$props2.requestParams;

      if (_this.shouldRequest(asyncData)) {
        _this._requestCount += 1;
        requestor(requestParams);
      }
    };

    _this._requestCount = 0;
    return _this;
  }

  _createClass(RequestAsyncData, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      setTimeout(this.makeRequest);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var prevRequestParams = prevProps.requestParams;
      var requestParams = this.props.requestParams;

      if (requestParams !== prevRequestParams) {
        this.makeRequest();
      }
    }
  }, {
    key: "shouldRequest",
    value: function shouldRequest() {
      var _this$props3 = this.props,
          asyncData = _this$props3.asyncData,
          shouldAutoRetry = _this$props3.shouldAutoRetry;
      return isUninitialized(asyncData) || isFailed(asyncData) && shouldAutoRetry && this._requestCount < 2;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          children = _this$props4.children,
          asyncData = _this$props4.asyncData;
      return children({
        asyncData: asyncData,
        retry: this.retry
      });
    }
  }]);

  return RequestAsyncData;
}(Component);

RequestAsyncData.propTypes = {
  asyncData: RecordPropType('AsyncData').isRequired,
  children: PropTypes.func.isRequired,
  requestParams: PropTypes.any,
  requestor: PropTypes.func.isRequired,
  shouldAutoRetry: PropTypes.bool
};
RequestAsyncData.defaultProps = {
  shouldAutoRetry: false
};
export { RequestAsyncData as default };