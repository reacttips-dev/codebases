'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";

var _this = this;

import PropTypes from 'prop-types';
import * as React from 'react';
import partial from 'react-utils/partial';
import getComponentName from 'react-utils/getComponentName';
import omit from '../../utils/underscore/omit';
import { attachWrappedComponent } from '../../decorators/utils';
import * as SimpleDate from '../../core/SimpleDate';
var instancesForTz = {};
var todayForTz = {};
var intervalHandleForTz = {};

var updateToday = function updateToday(tz) {
  var oldToday = todayForTz[tz];
  var newToday = SimpleDate.now(tz);

  if (!oldToday || !SimpleDate.equals(oldToday, newToday)) {
    todayForTz[tz] = newToday;
    instancesForTz[tz].forEach(function (instance) {
      return instance.forceUpdate();
    });
  }
};

var registerInstance = function registerInstance(instance, tz) {
  if (!instancesForTz[tz]) instancesForTz[tz] = [];
  var instances = instancesForTz[tz];

  if (instances.length === 0) {
    updateToday(tz);
    intervalHandleForTz[tz] = setInterval(partial(updateToday, tz), 60e3);
  }

  instances.push(instance);
};

var unregisterInstance = function unregisterInstance(instance, tz) {
  var instances = instancesForTz[tz].splice(instancesForTz[tz].indexOf(_this), 1);
  if (instances.length === 0) clearInterval(intervalHandleForTz[tz]);
};

export default function UsesToday(Component) {
  var UsesTodayComponent = /*#__PURE__*/function (_React$Component) {
    _inherits(UsesTodayComponent, _React$Component);

    function UsesTodayComponent(props) {
      var _this2;

      _classCallCheck(this, UsesTodayComponent);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(UsesTodayComponent).call(this, props));
      registerInstance(_assertThisInitialized(_this2), props.tz);
      return _this2;
    }

    _createClass(UsesTodayComponent, [{
      key: "UNSAFE_componentWillReceiveProps",
      value: function UNSAFE_componentWillReceiveProps(nextProps) {
        var oldTz = this.props.tz;
        var newTz = nextProps.tz;

        if (newTz !== oldTz) {
          unregisterInstance(this, oldTz);
          registerInstance(this, newTz);
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        unregisterInstance(this, this.props.tz);
      }
    }, {
      key: "render",
      value: function render() {
        var tz = this.props.tz;
        return /*#__PURE__*/_jsx(Component, Object.assign({
          today: todayForTz[tz]
        }, this.props));
      }
    }]);

    return UsesTodayComponent;
  }(React.Component);

  attachWrappedComponent(UsesTodayComponent, Component);
  UsesTodayComponent.displayName = "UsesToday(" + getComponentName(Component) + ")";
  UsesTodayComponent.propTypes = Object.assign({}, omit(Component.propTypes, 'today'), {
    tz: PropTypes.oneOf(['userTz', 'portalTz', 'utc']).isRequired
  });
  UsesTodayComponent.defaultProps = Object.assign({}, omit(Component.defaultProps, 'today'), {
    tz: 'userTz'
  });
  return UsesTodayComponent;
} // Export hook for test reset

UsesToday.instancesForTz = instancesForTz;