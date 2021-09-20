import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';

interface LazyRecentlyViewedBoardsMenuProps {}

export const LazyRecentlyViewedBoardsMenu: React.FunctionComponent<LazyRecentlyViewedBoardsMenuProps> = () => {
  const RecentlyViewedBoardsMenu = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "recently-viewed-boards-menu-button" */ './RecentlyViewedBoardsMenu'
      ),
    { namedImport: 'RecentlyViewedBoardsMenu' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.RecentlyViewedBoardsMenu,
      }}
    >
      <Suspense fallback={null}>
        <RecentlyViewedBoardsMenu />
      </Suspense>
    </ErrorBoundary>
  );
};
