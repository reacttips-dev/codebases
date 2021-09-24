'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import { isClientEnding } from 'calling-internal-common/widget-status/operators/getClientState';
import { getShouldShowEndCallState, getShouldShowPreCallState } from 'calling-internal-common/widget-status/operators/getCallState';
import ErrorBoundary from './FooterErrorBoundary';
import PreCallFooterContainer from '../containers/PreCallFooterContainer';
import PostCallActions from '../../post-call-actions/components/PostCallActions';

var CallWidgetFooter = /*#__PURE__*/function (_PureComponent) {
  _inherits(CallWidgetFooter, _PureComponent);

  function CallWidgetFooter() {
    _classCallCheck(this, CallWidgetFooter);

    return _possibleConstructorReturn(this, _getPrototypeOf(CallWidgetFooter).apply(this, arguments));
  }

  _createClass(CallWidgetFooter, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          clientStatus = _this$props.clientStatus,
          isReady = _this$props.isReady;
      var footer;
      var showPreCallFooter = getShouldShowPreCallState(clientStatus);
      var isEnding = isClientEnding(clientStatus);
      var showPostCallFooter = getShouldShowEndCallState(clientStatus);

      if (showPostCallFooter) {
        footer = /*#__PURE__*/_jsx(PostCallActions, {
          disabled: isEnding
        });
      } else if (showPreCallFooter) {
        footer = /*#__PURE__*/_jsx(PreCallFooterContainer, {
          isReady: isReady
        });
      }

      if (!footer) {
        return null;
      }

      return /*#__PURE__*/_jsx(ErrorBoundary, {
        children: footer
      });
    }
  }]);

  return CallWidgetFooter;
}(PureComponent);

CallWidgetFooter.propTypes = {
  clientStatus: ClientStatusPropType.isRequired,
  isReady: PropTypes.bool.isRequired
};
export { CallWidgetFooter as default };