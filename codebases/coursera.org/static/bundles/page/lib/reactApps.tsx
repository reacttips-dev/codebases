import type ApolloClient from 'apollo-client';

import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { provideApolloContext } from 'bundles/page/lib/network/Apollo';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import provideContext from 'vendor/cnpm/fluxible.v0-4/addons/provideContext';
import ErrorBoundaryWithLogging from 'bundles/page/components/ErrorBoundaryWithLogging';
import InternetExplorerBanner, {
  InternetExplorerBannerWithErrorBoundary,
} from 'bundles/page/components/InternetExplorerBanner';

type ComposableHOC = (type: React.ComponentClass<any>) => () => JSX.Element;

// TODO replace with IntlProvider from react-intl v2
// note: [FLEX-19325] temporary fix uses custom component to set context and will be replaced by IntlProvider
//       during react-intl v2 migration refactor
class CustomIntlProvider extends React.Component<{
  locale: string;
  children: JSX.Element;
}> {
  static childContextTypes = {
    locales: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  getChildContext() {
    const { locale } = this.props;
    return { locales: [locale] };
  }

  render() {
    return this.props.children;
  }
}

const composables = {
  /**
   * Fluxible's provideContext is a higher order component that takes in a `context`
   * prop. This is a higher order component that provides the context object.
   */
  provideFluxibleContextObject: (customContext: any): ComposableHOC => {
    return (type: React.ComponentClass<any>) =>
      function FluxibleContextObjectProvider() {
        return React.createElement(type, { context: customContext });
      };
  },
  /**
   * Defer to Fluxible's provideContext, but provide a function signature that is
   * compatible with composition.
   */
  provideFluxibleContextTypes: (customContextTypes: any): ComposableHOC => {
    return (type: React.ComponentType<any>) => {
      return provideContext(type, customContextTypes);
    };
  },
  /**
   * Defer to provideApolloContext, but provide a function signature that is
   * compatible with composition.
   */
  provideApolloContext: (apolloClient: ApolloClient<any>): ComposableHOC => {
    return (type: React.ComponentClass<any>) => {
      return provideApolloContext(apolloClient, type);
    };
  },
  /**
   * This component is used to setup the i18n context for a tree.  This HOC will
   * wrap the root component such that the entire app will be within the configured
   * i18n context.
   *
   * [Next.js I18n] If you are updating this wrapper, please also update the React Intl wrapper located at bundles/next/lib/i18n/ReactIntlWrapper.tsx
   */
  provideReactIntlContext: (reactIntlContext: any): ComposableHOC => {
    return (type: React.ComponentClass<any>) =>
      function ReactIntlProvider() {
        // note: [FLEX-19325] temporary fix uses custom component to set context and will be replaced by IntlProvider
        //       during react-intl v2 migration refactor
        // return React.createElement(IntlProvider, reactIntlContext, React.createElement(type));
        return React.createElement(CustomIntlProvider, reactIntlContext, React.createElement(type));
      };
  },
  /**
   * Add a global Error Boundary to catch React errors on the client and report them.
   * https://reactjs.org/docs/error-boundaries.html
   */
  addErrorBoundary: (): ComposableHOC => {
    return (Component: React.ComponentClass<any>) => () =>
      (
        <ErrorBoundaryWithLogging>
          <Component />
        </ErrorBoundaryWithLogging>
      );
  },
  addInternetExplorerDeprecationBanner: (): ComposableHOC => {
    return (Component: React.ComponentClass<any>) => () =>
      (
        <InternetExplorerBanner Component={InternetExplorerBannerWithErrorBoundary}>
          <Component />
        </InternetExplorerBanner>
      );
  },
};

/**
 * Wraps the app to make sure all the necessary things are provided. In short:
 * <ErrorBoundaryWithLogging>
 *   <FluxibleContextObjectProvider>
 *     <ContextProvider>
 *       <ApolloClientProvider>
 *         <ApolloProvider>
 *           <Application />
 *         </ApolloProvider>
 *       </ApolloClientProvider>
 *     </ContextProvider>
 *   </FluxibleContextObjectProvider>
 * </ErrorBoundaryWithLogging>
 */
function provideAppWithContext({
  // routing is generally () => <Router ... /> or () => <RouterContext ... /> when used in conjunction
  // with React Router.
  routing,
  fluxibleContext,
  apolloClient,
  reactIntlContext,
}: {
  routing: typeof React.Component | (() => JSX.Element);
  fluxibleContext: any;
  apolloClient: ApolloClient<any>;
  reactIntlContext: { locale: string };
}): React.ComponentType<any> {
  return _.flowRight(
    composables.addErrorBoundary(),
    composables.provideFluxibleContextObject({
      fluxibleContext,
      ...fluxibleContext.getComponentContext(),
    }),
    composables.provideFluxibleContextTypes({
      fluxibleContext: PropTypes.object,
    }), // Apollo Client is not supported in our RequireJS stack. Handle this case
    // by using the identity if apolloClient is not available.
    apolloClient != null ? composables.provideApolloContext(apolloClient) : (x) => x,
    composables.provideReactIntlContext(reactIntlContext),
    composables.addInternetExplorerDeprecationBanner()
  )(routing);
}

const exported = {
  provideAppWithContext,
};

export default exported;
export { provideAppWithContext };
