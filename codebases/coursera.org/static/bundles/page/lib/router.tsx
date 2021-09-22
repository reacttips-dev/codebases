import React from 'react';

import { RouterContext, match, useRouterHistory, createMemoryHistory } from 'react-router';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import useNamedRoutes from 'vendor/cnpm/use-named-routes.v0-3/index';
import { createHistory, useBeforeUnload } from 'history';
import { recordPageView } from 'bundles/page/lib/eventing';
import { MatchState, MatchArgs } from 'react-router/lib/match';

import type { Location } from 'history';

const extendRenderProps = (renderProps: $TSFixMe) => {
  if (renderProps) {
    const { params, location, router, routes } = renderProps;

    // While params, location, and route will still be available as `props` on the Route component,
    // we're also going to house them on the RouterContext to make it easier to just specify
    // one contextType (router, which is an object) instead of separate ones for each prop.
    // This is a future improvement in [RR v3.0](https://github.com/reactjs/react-router/issues/3325)
    Object.assign(router, {
      params,
      location,
      routes,
    });
  }

  return renderProps;
};

type LocationStub = {
  hostname: string | undefined;
  protocol: string;
};

const addHostnameAndProtocol = (renderProps: $TSFixMe, { hostname, protocol }: LocationStub) => {
  if (!renderProps) return renderProps;
  const { location } = renderProps;
  location.hostname = hostname;
  location.protocol = protocol;
  return Object.assign({}, renderProps, { location });
};

const getRouterContext = (renderProps: $TSFixMe) => (
  <RouterContext {...extendRenderProps(addHostnameAndProtocol(renderProps, window.location))} />
);

export const setupClient = (matchOptions: MatchArgs) => {
  const history: $TSFixMe = useNamedRoutes(useBeforeUnload(useRouterHistory(createHistory)))({
    routes: matchOptions.routes,
  });

  let previousLocation: { pathname?: string; search?: string } = {};
  history.listen((location: Location) => {
    const currentLocation = location;
    if (previousLocation.pathname !== currentLocation.pathname || previousLocation.search !== currentLocation.search) {
      // If `previousLocation` is a non-empty object, then this is a single page app navigation.
      // We need to track this in addition to `location.action` because `POP` is the `location.action`
      // for both back button presses and the first page load.
      const isSinglePageAppNavigation = Object.keys(previousLocation).length !== 0;
      recordPageView({
        locationAction: location.action,
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ locationAction: string; isSing... Remove this comment to see the full error message
        isSinglePageAppNavigation,
      });
    }
    previousLocation = currentLocation;
  });

  // We use `match` in order to resolve all asynchronous routes defined by React Router.
  // This is in order to ensure that we can mount CSR applications onto SSR pages properly.
  // See https://github.com/reactjs/react-router/blob/348947e/docs/guides/ServerRendering.md#async-routes

  return new Promise((resolve, reject) => {
    match(
      {
        ...matchOptions,
        history,
      },
      (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          return resolve(
            setupClient({
              ...matchOptions,
              location: redirectLocation,
            })
          );
        } else {
          if (error) {
            return reject(error);
          }
          return resolve(
            Object.assign({}, renderProps, {
              render: getRouterContext,
            })
          );
        }
      }
    );
  });
};

type MatchOptions = {
  routes: React.Component<unknown, unknown>;
  location?: string;
  hostname?: string;
  protocol?: string;
};

export function setupServer(
  matchOptions: MatchOptions
): Promise<{ redirectLocation: Omit<Location, 'hash'>; renderProps: MatchState }>;
export function setupServer(
  matchOptions: MatchOptions,
  matchCb: (error: Error | undefined, redirectLocation: Omit<Location, 'hash'>, renderProps: MatchState) => void
): void;
export function setupServer(
  matchOptions: MatchOptions,
  matchCb?: (error: Error | undefined, redirectLocation: Omit<Location, 'hash'>, renderProps: MatchState) => void
): void | Promise<{ redirectLocation: Omit<Location, 'hash'>; renderProps: MatchState }> {
  const history: $TSFixMe = useNamedRoutes(createMemoryHistory)({
    routes: matchOptions.routes,
  });
  const urlInfo = {
    hostname: matchOptions.hostname,
    protocol: `${matchOptions.protocol || 'https'}`,
  };

  if (matchCb) {
    return match(
      {
        ...matchOptions,
        history,
      },
      (error, redirectLocation, renderProps) => {
        matchCb(error, redirectLocation, extendRenderProps(addHostnameAndProtocol(renderProps, urlInfo)));
      }
    );
  } else {
    return new Promise((resolve, reject) => {
      match(
        {
          ...matchOptions,
          history,
        },
        (error, redirectLocation, renderProps) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              redirectLocation,
              renderProps: extendRenderProps(addHostnameAndProtocol(renderProps, urlInfo)),
            });
          }
        }
      );
    });
  }
}
