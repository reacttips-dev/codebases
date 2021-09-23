'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RequestAsyncData from './RequestAsyncData';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
/**
 * Connected HOC to create a Component with an http dependency
 *
 * example:
 * const RequireData = fetchAsyncDataHOC= ({
 *  name: "RequireData",
 *  requestor: fetchDataAction, // Redux thunk action to set Async data in store.
 *  selector: getDataSelector,  // Selector pointing to AsyncData in store.
 *  shouldAutoRetry: false,
 *  resolveRequestParams: ({id}) => ({id}) // Must be an object, passed through to the requestor function.
 * })
 *
 * export default withRequire(RequireData)
 *
 * @param {Object} param0
 * @param {String} param0.name - unique name for display in devtools
 * @param {Function} param0.requestor - redux action to get request data
 * @param {Function} param0.selector - reselect function to get AsyncData from reducer
 * @param {Boolean} param0.shouldAutoRetry - Auto retries endpoint 2 times
 * @param {Function} param0.resolveRequestParams - Resolve props to pass through to requestor
 */

export default function fetchAsyncDataHOC(_ref) {
  var name = _ref.name,
      requestor = _ref.requestor,
      selector = _ref.selector,
      _ref$shouldAutoRetry = _ref.shouldAutoRetry,
      shouldAutoRetry = _ref$shouldAutoRetry === void 0 ? false : _ref$shouldAutoRetry,
      _ref$resolveRequestPa = _ref.resolveRequestParams,
      resolveRequestParams = _ref$resolveRequestPa === void 0 ? function () {
    return undefined;
  } : _ref$resolveRequestPa;

  var FetchAsyncData = /*#__PURE__*/function (_Component) {
    _inherits(FetchAsyncData, _Component);

    function FetchAsyncData() {
      _classCallCheck(this, FetchAsyncData);

      return _possibleConstructorReturn(this, _getPrototypeOf(FetchAsyncData).apply(this, arguments));
    }

    _createClass(FetchAsyncData, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            asyncData = _this$props.asyncData,
            children = _this$props.children,
            restProps = _objectWithoutProperties(_this$props, ["asyncData", "children"]);

        return /*#__PURE__*/_jsx(RequestAsyncData, {
          asyncData: asyncData,
          requestor: this.props.requestor,
          requestParams: resolveRequestParams(restProps),
          shouldAutoRetry: shouldAutoRetry,
          children: children
        });
      }
    }]);

    return FetchAsyncData;
  }(Component);

  FetchAsyncData.displayName = "FetchAsyncData(" + name + ")";
  FetchAsyncData.propTypes = {
    asyncData: RecordPropType('AsyncData').isRequired,
    children: PropTypes.func.isRequired,
    requestor: PropTypes.func.isRequired
  };

  var mapStateToProps = function mapStateToProps(state, props) {
    return {
      asyncData: selector(state, props)
    };
  };

  return connect(mapStateToProps, {
    requestor: requestor
  })(FetchAsyncData);
}