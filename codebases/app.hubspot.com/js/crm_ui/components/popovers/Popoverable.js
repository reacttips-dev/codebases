'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import { fromJS } from 'immutable';
import memoize from 'transmute/memoize';
export default (function (Component) {
  var propTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var __setPopoverTarget = propTypes.setPopoverTarget,
      __setPopoverTargetAsRef = propTypes.setPopoverTargetAsRef,
      __getPopoverTarget = propTypes.getPopoverTarget,
      filteredPropTypes = _objectWithoutProperties(propTypes, ["setPopoverTarget", "setPopoverTargetAsRef", "getPopoverTarget"]);

  var Popoverable = createReactClass({
    displayName: "Popoverable",
    propTypes: filteredPropTypes,
    getInitialState: function getInitialState() {
      return {
        popoverTargets: {},
        hasMounted: false
      };
    },
    UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
      this.setPopoverTargetAsRef = memoize(this._setPopoverTargetAsRef);
    },
    _setPopoverTargetAsRef: function _setPopoverTargetAsRef(name) {
      var _this = this;

      return function (el) {
        return _this.setPopoverTarget(el, name);
      };
    },
    setPopoverTarget: function setPopoverTarget(el, name) {
      var hasMounted = this.state.hasMounted;
      var targets = this.state.popoverTargets;

      if (el == null && !hasMounted) {
        // eslint-disable-next-line no-console
        console.error('You must pass in a node for the ref you are attempting to set');
        return undefined;
      }

      if (name == null) {
        // eslint-disable-next-line no-console
        console.error('You must pass in a key for the ref you are attempting to set');
        return undefined;
      }

      if (!(targets && targets[name])) {
        targets[name] = el;
        return this.setState({
          popoverTargets: targets,
          hasMounted: true
        });
      }

      return undefined;
    },
    getPopoverTarget: function getPopoverTarget(name) {
      var target = this.state.popoverTargets[name];

      if (!target) {
        return null;
      }

      return target;
    },
    render: function render() {
      var popoverTargets = this.state.popoverTargets;
      var newProps = {
        setPopoverTarget: this.setPopoverTarget,
        setPopoverTargetAsRef: this.setPopoverTargetAsRef,
        getPopoverTarget: this.getPopoverTarget,
        popoverTargets: fromJS(popoverTargets)
      };
      return /*#__PURE__*/_jsx(Component, Object.assign({}, this.props, {}, newProps));
    }
  });
  Popoverable.displayName = "Popoverable(" + Component.displayName + ")";
  Popoverable.WrappedComponent = Component;
  return Popoverable;
});