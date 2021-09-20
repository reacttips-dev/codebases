import React from 'react';
import { RouteContext } from 'app/src/router';
import { BoardTableViewFilter } from './filters/BoardTableViewFilter';
import { ViewFilters } from './ViewFilters';

export interface ViewFiltersSourceBase {
  filters: ViewFilters;
  editable: boolean;
}

export interface ViewFiltersSourceEditable extends ViewFiltersSourceBase {
  editable: true;
  setFilter: (filter: BoardTableViewFilter) => void;
  clearNonBoardFilters: () => void;
}

export interface ViewFiltersSourceReadOnly extends ViewFiltersSourceBase {
  editable: false;
}

export type ViewFiltersSource =
  | ViewFiltersSourceEditable
  | ViewFiltersSourceReadOnly;
export interface ViewFiltersContextValue<T extends ViewFiltersSourceBase> {
  viewFilters: T;
}

export const ViewFiltersContext = React.createContext<
  ViewFiltersContextValue<ViewFiltersSource>
>({
  viewFilters: {
    // eslint-disable-next-line @trello/no-module-logic
    filters: new ViewFilters(),
    editable: false,
  },
});

export const constructNewUrl = function (
  routeContext: RouteContext,
): ((viewFilters: ViewFilters) => URL) | undefined {
  if (!routeContext.url) {
    return undefined;
  }
  const newUrl = new URL(routeContext.url.origin + routeContext.url.pathname);

  return function constructUrlFilterParams(viewFilters: ViewFilters) {
    const newUrlParams = {
      ...viewFilters.toQueryParams(),
    };

    for (const [key, value] of Object.entries(newUrlParams)) {
      if (value) {
        newUrl.searchParams.set(key, value);
      }
    }

    newUrl.search = newUrl.search.replace(/%2C/g, ',').replace(/%3A/g, ':');
    return newUrl;
  };
};
