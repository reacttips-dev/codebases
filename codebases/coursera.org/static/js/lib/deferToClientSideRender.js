/**
 * deferToClientSideRender
 *
 * Wrap your component with this higher-order component if it does not support
 * server-side rendering. This will skip rendering the component's tree and only
 * render it on the client-side.
 *
 * Example usage:
 *
 * class ClientSideOnlyComponent extends React.Component {
 *   ...
 * }
 *
 * module.exports = deferToClientSideRender(ClientSideOnlyComponent)
 */
import React from 'react';
import PropTypes from 'prop-types';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

function deferToClientSideRenderImpl(Component) {
  const componentName = Component.displayName || Component.name;

  class ClientSideRenderConnector extends React.Component {
    static displayName = componentName + 'ClientSideRenderConnector';

    static contextTypes = {
      router: PropTypes.object,
    };

    state = {
      componentDidMount: false,
    };

    componentDidMount() {
      this.setState(() => ({ componentDidMount: true }));
    }

    render() {
      const { componentDidMount } = this.state;
      if (!componentDidMount) {
        return false;
      }

      return React.createElement(Component, Object.assign({}, this.props, this.state));
    }
  }

  hoistNonReactStatics(ClientSideRenderConnector, Component);
  return ClientSideRenderConnector;
}

export default function deferToClientSideRender() {
  // If this is called with no arguments (usually inside _.compose),
  // we will return a closure to be called later.
  if (arguments.length === 0) {
    return function (Component) {
      return deferToClientSideRenderImpl(Component);
    };
  }

  return deferToClientSideRenderImpl.apply(this, arguments);
}
