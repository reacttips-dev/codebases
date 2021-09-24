'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { PureComponent } from 'react';
import { getShouldShowPreCallState, getShouldShowActiveCallState, getShouldShowEndCallState } from 'calling-internal-common/widget-status/operators/getCallState';
import { UNINITIALIZED, LOADING } from 'calling-internal-common/widget-status/constants/CallWidgetStates';
import NumberValidationBannerContainer from '../../callee-number-validation/containers/NumberValidationBannerContainer';
import DeviceErrorBannerContainer from '../../device-errors/containers/DeviceErrorBannerContainer';
import NoMicrophoneAccessErrorContainer from '../../microphone-access/containers/NoMicrophoneAccessErrorContainer';
import MinutesAlertBannerContainer from '../../minutes-alert-banner/containers/MinutesAlertBannerContainer';
import RecordingErrorBannerContainer from '../../record/containers/RecordingErrorBannerContainer';
import CallExtensionsContext from '../../WidgetBase/context/CallingExtensionsContext';
import SuspendedAccountWarningBannerContainer from '../../device-errors/containers/SuspendedAccountWarningBannerContainer';
import CountryUnsupportedWarningBannerContainer from '../../registered-number-warnings/containers/CountryUnsupportedWarningBannerContainer';

var WidgetAlerts = /*#__PURE__*/function (_PureComponent) {
  _inherits(WidgetAlerts, _PureComponent);

  function WidgetAlerts() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, WidgetAlerts);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WidgetAlerts)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      height: 0
    };
    _this.queuedDimensionsUpdate = null;
    _this.callWidgetAlertsContainer = null;
    _this.resizeObserver = new ResizeObserver(function (entries) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entry = _step.value;

          var _entry$target$getBoun = entry.target.getBoundingClientRect(),
              height = _entry$target$getBoun.height;

          _this.updateMinimumDimensions({
            height: height
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });

    _this.setCallWidgetAlertsContainerRef = function (element) {
      if (_this.callWidgetAlertsContainer) {
        _this.resizeObserver.unobserve(_this.callWidgetAlertsContainer);
      }

      _this.callWidgetAlertsContainer = element;

      if (_this.callWidgetAlertsContainer) {
        _this.resizeObserver.observe(_this.callWidgetAlertsContainer);
      }
    };

    return _this;
  }

  _createClass(WidgetAlerts, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.callWidgetAlertsContainer) {
        return;
      }

      var _this$callWidgetAlert = this.callWidgetAlertsContainer.getBoundingClientRect(),
          height = _this$callWidgetAlert.height;

      this.updateMinimumDimensions({
        height: height
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_ref) {
      var prevThirdPartyStatus = _ref.thirdPartyStatus,
          prevClientStatus = _ref.clientStatus;
      var _this$props = this.props,
          thirdPartyStatus = _this$props.thirdPartyStatus,
          clientStatus = _this$props.clientStatus;

      if (this.queuedDimensionsUpdate && this.context.isLoaded) {
        this.updateMinimumDimensions({
          height: this.queuedDimensionsUpdate
        });
        this.queuedDimensionsUpdate = null;
        return;
      }

      var thirdPartyLoaded = prevThirdPartyStatus === UNINITIALIZED && thirdPartyStatus !== UNINITIALIZED;
      var twilioClientLoaded = prevClientStatus === LOADING && clientStatus !== LOADING;

      if (thirdPartyLoaded || twilioClientLoaded) {
        var _this$callWidgetAlert2 = this.callWidgetAlertsContainer.getBoundingClientRect(),
            height = _this$callWidgetAlert2.height;

        this.updateMinimumDimensions({
          height: height,
          prevHeight: 0
        });
      }
    }
  }, {
    key: "updateMinimumDimensions",
    value: function updateMinimumDimensions(_ref2) {
      var height = _ref2.height,
          _ref2$prevHeight = _ref2.prevHeight,
          prevHeight = _ref2$prevHeight === void 0 ? this.state.height : _ref2$prevHeight;
      var roundedHeight = Math.round(height);

      if (prevHeight === roundedHeight) {
        return;
      }

      this.setState({
        height: roundedHeight
      });
      this.context.updateMinimumDimensions({
        identifier: 'widgetAlertMessage',
        height: roundedHeight
      });
    }
  }, {
    key: "render",
    value: function render() {
      var clientStatus = this.props.clientStatus;
      var showPreCallState = getShouldShowPreCallState(clientStatus);
      var showActiveState = getShouldShowActiveCallState(clientStatus);
      var showEndState = getShouldShowEndCallState(clientStatus);
      var showCallErrorBanners = showActiveState || showEndState;
      var showPreOrEndCallBanners = showPreCallState || showEndState;
      return /*#__PURE__*/_jsxs("div", {
        ref: this.setCallWidgetAlertsContainerRef,
        children: [showPreOrEndCallBanners && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(MinutesAlertBannerContainer, {}), /*#__PURE__*/_jsx(CountryUnsupportedWarningBannerContainer, {})]
        }), showCallErrorBanners && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(DeviceErrorBannerContainer, {
            clientStatus: clientStatus
          }), /*#__PURE__*/_jsx(RecordingErrorBannerContainer, {
            clientStatus: clientStatus
          })]
        }), showPreCallState && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(NumberValidationBannerContainer, {}), /*#__PURE__*/_jsx(NoMicrophoneAccessErrorContainer, {}), /*#__PURE__*/_jsx(SuspendedAccountWarningBannerContainer, {})]
        })]
      });
    }
  }]);

  return WidgetAlerts;
}(PureComponent);

WidgetAlerts.contextType = CallExtensionsContext;
export { WidgetAlerts as default };