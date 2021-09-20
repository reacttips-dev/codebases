import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { defaultRouter } from 'app/src/router';
import { BoardTableViewFilter, UrlParams } from './filters';
import { navigate } from 'app/scripts/controller/navigate';
import isEqual from 'react-fast-compare';
import {
  ViewFiltersContext,
  ViewFiltersContextValue,
  ViewFiltersSourceEditable,
} from './ViewFiltersContext';
import { ViewFilters } from './ViewFilters';

export const UrlParamsProvider: React.FunctionComponent = ({ children }) => {
  const urlParamsFromRouteContext = useCallback((): UrlParams => {
    const routeContext = defaultRouter.getRoute();
    const searchParams = routeContext.url?.searchParams;

    return searchParams ? Object.fromEntries(searchParams.entries()) : {};
  }, []);

  const [urlParams, setUrlParams] = useState(urlParamsFromRouteContext());
  const viewFilters: ViewFilters = useMemo(
    () => ViewFilters.fromQueryParams(urlParams),
    [urlParams],
  );

  const navigateWithUrlParams = useCallback((filter: BoardTableViewFilter) => {
    const routeContext = defaultRouter.getRoute();
    if (!routeContext?.url) {
      return;
    }

    const newUrlParams = filter?.toUrlParams?.() || {};
    const newUrl = new URL(routeContext.url.toString());

    for (const [key, value] of Object.entries(newUrlParams)) {
      if (!value) {
        newUrl.searchParams.delete(key);
      } else {
        newUrl.searchParams.set(key, value);
      }
    }

    if (routeContext.url.toString() === newUrl.toString()) {
      return;
    }

    // Hack: The URL api auto-encodes commas and colons, but we want to use "invalid" urls
    // with `,` and `:` characters in them.
    const search = newUrl.search.replace(/%2C/g, ',').replace(/%3A/g, ':');

    navigate(`${newUrl.pathname}${search}`, { replace: true });
    defaultRouter.updateSubscribers();
  }, []);

  useEffect(() => {
    return defaultRouter.subscribe((routeContext) => {
      setUrlParams((prevUrlParams) => {
        const newUrlParams = urlParamsFromRouteContext();

        if (isEqual(prevUrlParams, newUrlParams)) {
          return prevUrlParams; // Optimization: maintain reference equality to reduce re-renders
        }

        return newUrlParams;
      });
    });
  }, [urlParamsFromRouteContext]);

  const clearNonBoardFilters = useCallback(() => {
    const emptyFilters = new ViewFilters();
    for (const [name, filter] of Object.entries(emptyFilters)) {
      if (name !== 'boards') {
        navigateWithUrlParams(filter);
      }
    }
  }, [navigateWithUrlParams]);

  const providerValue: ViewFiltersContextValue<ViewFiltersSourceEditable> = useMemo(() => {
    return {
      viewFilters: {
        filters: viewFilters,
        editable: true,
        setFilter: navigateWithUrlParams,
        clearNonBoardFilters,
      },
    };
  }, [viewFilters, navigateWithUrlParams, clearNonBoardFilters]);

  return (
    <ViewFiltersContext.Provider value={providerValue}>
      {children}
    </ViewFiltersContext.Provider>
  );
};
