import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';

export const LazyWorkspaceNavigation: React.FunctionComponent<object> = () => {
  const WorkspaceNavigation = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "workspace-navigation" */ './WorkspaceNavigation'
      ),
    { namedImport: 'WorkspaceNavigation' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.WorkspaceNavigation,
      }}
    >
      <Suspense fallback={null}>
        <WorkspaceNavigation />
      </Suspense>
    </ErrorBoundary>
  );
};
