/**
 * waitFor
 *
 * Higher-order component that blocks rendering the component until a
 * condition is satisfied. It takes `props` as an argument.
 */
import React from 'react';
import PropTypes from 'prop-types';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

export default function waitFor<Props = any>(
  // TypeScript does not have a "truthy" type
  conditionFn: (props: Props) => any,
  loadingComponent: React.ReactNode | React.FC = null
) {
  return function (Component: React.ComponentType<Props>): React.ComponentClass<Props> {
    const componentName = Component.displayName || Component.name;

    class WaitForWrapper extends React.Component<Props> {
      static displayName = componentName + 'WaitForWrapper';

      static contextTypes = {
        router: PropTypes.object,
      };

      render() {
        if (!conditionFn(this.props)) {
          if (typeof loadingComponent === 'function') {
            return loadingComponent(this.props, this.context);
          } else {
            return loadingComponent;
          }
        }

        return React.createElement(Component, Object.assign({}, this.props));
      }
    }

    hoistNonReactStatics(WaitForWrapper, Component);

    return WaitForWrapper;
  };
}
