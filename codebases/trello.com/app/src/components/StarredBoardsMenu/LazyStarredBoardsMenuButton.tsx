import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';

export const LazyStarredBoardsMenuButton: React.FunctionComponent<object> = () => {
  const StarredBoardsMenuButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "starred-boards-menu-button" */ './StarredBoardsMenuButton'
      ),
    { namedImport: 'StarredBoardsMenuButton' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.StarredBoardsMenuButton,
      }}
    >
      <Suspense fallback={null}>
        <StarredBoardsMenuButton />
      </Suspense>
    </ErrorBoundary>
  );
};
