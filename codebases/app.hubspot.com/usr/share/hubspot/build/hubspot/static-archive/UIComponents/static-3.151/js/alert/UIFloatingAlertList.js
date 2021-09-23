'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import memoizeOne from 'react-utils/memoizeOne';
import partial from 'react-utils/partial';
import { callIfPossible } from '../core/Functions';
import UILayer from '../layer/UILayer';
import AlertListTransition from './AlertListTransition';
import FloatingAlertStore from './FloatingAlertStore';
import UIFloatingAlert from './UIFloatingAlert';
var DEFAULT_TOP_OFFSET = 20;
var NAV_BAR_ELEMENT_ID_V4 = 'hs-nav-v4';
var FLOATING_ALERT_SUBSCRIPTION_KEY = 'UIFloatingAlertList';
var subscriptionKeyId = 0;

var sortAlerts = function sortAlerts(alertsFromProps, alertsFromStore) {
  return [].concat(_toConsumableArray(alertsFromProps), _toConsumableArray(alertsFromStore)).sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });
};

var subscribeToAlertStore = function subscribeToAlertStore(instance, alertStore) {
  alertStore.subscribe(instance.storeSubscriptionKey, function (alertsFromStore) {
    instance.setState({
      alertsFromStore: alertsFromStore
    });
  });
};

var unsubscribeFromAlertStore = function unsubscribeFromAlertStore(instance, alertStore) {
  alertStore.unsubscribe(instance.storeSubscriptionKey);
};

var getStyle = function getStyle(style, topOffset) {
  return Object.assign({}, style, {
    top: topOffset
  });
};

var UIFloatingAlertList = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIFloatingAlertList, _PureComponent);

  function UIFloatingAlertList(props) {
    var _this;

    _classCallCheck(this, UIFloatingAlertList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIFloatingAlertList).call(this, props));

    _this.updateContainerOffset = function () {
      var scrollTop = document.documentElement.scrollTop;
      var navElement = document.getElementById(NAV_BAR_ELEMENT_ID_V4);
      var navHeight = 0;

      if (navElement) {
        navHeight = navElement.clientHeight;
      }

      var maxTopOffset = DEFAULT_TOP_OFFSET + navHeight;

      if (scrollTop > navHeight) {
        _this.setState({
          topOffset: DEFAULT_TOP_OFFSET
        });
      } else {
        _this.setState({
          topOffset: maxTopOffset - scrollTop
        });
      }
    };

    _this.handleAlertClose = function (alert, evt) {
      var onAlertClose = _this.props.onAlertClose;
      callIfPossible(alert.onClose, evt, alert);
      callIfPossible(onAlertClose, evt, alert);
    };

    _this.state = {
      alertsFromStore: [],
      topOffset: null
    };
    _this._getStyle = memoizeOne(getStyle);
    _this.storeSubscriptionKey = FLOATING_ALERT_SUBSCRIPTION_KEY + "-" + subscriptionKeyId++;
    return _this;
  }

  _createClass(UIFloatingAlertList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          alertStore = _this$props.alertStore,
          use = _this$props.use;

      if (use !== 'contextual') {
        addEventListener('scroll', this.updateContainerOffset);
        this.updateContainerOffset();
      }

      subscribeToAlertStore(this, alertStore);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var alertStore = this.props.alertStore;

      if (prevProps.alertStore !== alertStore) {
        unsubscribeFromAlertStore(this, prevProps.alertStore);
        subscribeToAlertStore(this, alertStore);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props2 = this.props,
          alertStore = _this$props2.alertStore,
          use = _this$props2.use;

      if (use !== 'contextual') {
        removeEventListener('scroll', this.updateContainerOffset);
      }

      unsubscribeFromAlertStore(this, alertStore);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          alerts = _this$props3.alerts,
          __alertStore = _this$props3.alertStore,
          className = _this$props3.className,
          __onAlertClose = _this$props3.onAlertClose,
          style = _this$props3.style,
          use = _this$props3.use,
          rest = _objectWithoutProperties(_this$props3, ["alerts", "alertStore", "className", "onAlertClose", "style", "use"]);

      var _this$state = this.state,
          alertsFromStore = _this$state.alertsFromStore,
          topOffset = _this$state.topOffset;
      var renderedAlerts = sortAlerts(alerts, alertsFromStore).map(function (alert) {
        var id = alert.id,
            message = alert.message,
            __onClose = alert.onClose,
            __timestamp = alert.timestamp,
            titleText = alert.titleText,
            type = alert.type,
            alertRest = _objectWithoutProperties(alert, ["id", "message", "onClose", "timestamp", "titleText", "type"]);

        return /*#__PURE__*/_jsx(UIFloatingAlert, Object.assign({
          onClose: partial(_this2.handleAlertClose, alert),
          titleText: titleText,
          type: type
        }, alertRest, {
          children: message
        }), id);
      });
      var computedClassName = classNames('private-floating-alert-list', className, use === 'contextual' && 'private-floating-alert-list--contextual');

      var computedStyle = this._getStyle(style, topOffset);

      var renderedAlertList = /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
        className: computedClassName,
        style: computedStyle,
        children: /*#__PURE__*/_jsx("div", {
          className: "private-floating-alert-list__child-wrapper",
          children: /*#__PURE__*/_jsx(AlertListTransition, {
            children: renderedAlerts
          })
        })
      }));

      if (use === 'contextual') {
        return renderedAlertList;
      }

      return /*#__PURE__*/_jsx(UILayer, {
        "data-layer-for": "UIFloatingAlertList",
        children: renderedAlertList
      });
    }
  }]);

  return UIFloatingAlertList;
}(PureComponent);

UIFloatingAlertList.propTypes = {
  alerts: PropTypes.array.isRequired,
  alertStore: PropTypes.object.isRequired,
  onAlertClose: PropTypes.func,
  use: PropTypes.oneOf(['fullscreen', 'contextual'])
};
UIFloatingAlertList.defaultProps = {
  alerts: [],
  alertStore: FloatingAlertStore,
  use: 'fullscreen'
};
UIFloatingAlertList.displayName = 'UIFloatingAlertList';
export default UIFloatingAlertList;