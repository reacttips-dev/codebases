/**
 * Used in conjunction with js/lib/setupFluxibleApp
 *
 * First, setup a javascript module that uses setupFluxibleApp.js
 * Then to provide the fluxible app context to your React component tree:
 *
 * const provideFluxibleAppContext = require('js/lib/provideFluxibleAppContext');
 * const app = require('path/to/some/app');
 *
 * class SomeComponent extends React.Component {
 *  ...
 * }
 *
 * module.exports = provideFluxibleAppContext(app)(SomeComponent);
 */
import React from 'react';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';

export default function provideFluxibleAppContext(setupAppFn) {
  // Handle case where a Fluxible `app` instance is passed in
  if (typeof setupAppFn === 'object' && setupAppFn.constructor.name === 'Fluxible') {
    const tmp = setupAppFn;
    setupAppFn = () => {
      // eslint-disable-line
      return tmp.createContext();
    };
  }

  return function (Component) {
    const componentName = Component.displayName || Component.name;
    class FluxibleAppContextProvider extends React.Component {
      static displayName = componentName + 'FluxibleAppContextProvider';

      static contextTypes = {
        fluxibleContext: React.PropTypes.object,
      };

      constructor(props, context) {
        super(props, context);

        // If a setupAppFn isn't passed in, use the existing fluxibleContext
        if (setupAppFn) {
          this.fluxibleContext = setupAppFn(context.fluxibleContext);
        } else {
          if (!context.fluxibleContext) {
            throw new Error(
              'provideFluxibleAppContext tried to wrap ' +
                componentName +
                ' but did not receive a `setupAppFn`, FluxibleContext, or find one' +
                'in context.'
            );
          }
          this.fluxibleContext = context.fluxibleContext;
        }
      }

      render() {
        return (
          <FluxibleComponent context={this.fluxibleContext.getComponentContext()}>
            <Component {...this.props} />
          </FluxibleComponent>
        );
      }
    }
    hoistNonReactStatics(FluxibleAppContextProvider, Component);

    return FluxibleAppContextProvider;
  };
}
