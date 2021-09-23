'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import devLogger from 'react-utils/devLogger';
import getComponentName from 'react-utils/getComponentName';
import { attachWrappedComponent, getCoreComponent } from './utils';
export default function (reason, url) {
  return function (Component) {
    var componentName = getComponentName(Component); // Remove HoC wrappers from the logged displayname (ex. "MyComponent" instead of "Controllable(MyComponent)")

    var coreComponentName = getComponentName(getCoreComponent(Component));
    var message = "`" + coreComponentName + "` is deprecated and will be removed in a future version. " + reason;
    var DeprecatedComponent = /*#__PURE__*/forwardRef(function (props, ref) {
      devLogger.warn({
        message: message,
        key: "deprecated-" + componentName,
        url: url
      });
      return /*#__PURE__*/_jsx(Component, Object.assign({}, props, {
        ref: ref
      }));
    });
    DeprecatedComponent.isDeprecated = true;
    DeprecatedComponent.deprecated = {
      reason: reason,
      url: url
    };
    DeprecatedComponent.displayName = "Deprecated(" + componentName + ")";
    DeprecatedComponent.propTypes = Component.propTypes;
    DeprecatedComponent.defaultProps = Component.defaultProps;
    attachWrappedComponent(DeprecatedComponent, Component);
    return DeprecatedComponent;
  };
}