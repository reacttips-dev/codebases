import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

import type { ActionContext } from 'js/lib/ActionContext';

/** @deprecated */
function connectToFluxibleContext<Props = {}>(
  connectorFn: (context: ActionContext, props: Props) => any,
  shouldRefetch: (prevProps: Props, newProps: Props) => any = () => false
) {
  return function (Component: React.ComponentType<Props>): React.ComponentClass<Props> {
    const componentName = Component.displayName || Component.name;

    class FluxibleContextConnector extends React.Component<Props> {
      displayName = componentName + 'FluxibleContextConnector';

      static contextTypes = {
        executeAction: PropTypes.func,
        getStore: PropTypes.func,
      };

      constructor(props: Props, context: $TSFixMe) {
        super(props, context);
        connectorFn(context, props);
      }

      componentDidUpdate(prevProps: Props) {
        if (shouldRefetch(prevProps, this.props)) {
          connectorFn(this.context, this.props);
        }
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    hoistNonReactStatics(FluxibleContextConnector, Component);

    return FluxibleContextConnector;
  };
}

export default connectToFluxibleContext;
