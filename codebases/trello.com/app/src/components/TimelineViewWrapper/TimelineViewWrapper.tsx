import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { PermissionsContextProvider } from 'app/src/components/BoardDashboardView/PermissionsContext';
import { SingleBoardViewProvider } from 'app/src/components/BoardViewContext/SingleBoardViewProvider';
import { SingleBoardViewFiltersProvider } from 'app/src/components/ViewFilters/SingleBoardViewFiltersProvider';

interface TimelineViewWrapperProps {
  idBoard: string;
  navigateToCard: (id: string) => void;
  closeView: () => void;
}

export const TimelineViewWrapper: React.FunctionComponent<TimelineViewWrapperProps> = ({
  idBoard,
  navigateToCard,
  closeView,
}: TimelineViewWrapperProps) => {
  const TimelineView = useLazyComponent(
    () => import(/* webpackChunkName: "timeline-view" */ './TimelineView'),
    { namedImport: 'TimelineView' },
  );
  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-ecosystem',
        feature: Feature.TimelineView,
      }}
    >
      <Suspense fallback={null}>
        <PermissionsContextProvider idBoard={idBoard}>
          <SingleBoardViewFiltersProvider idBoard={idBoard}>
            <SingleBoardViewProvider idBoard={idBoard}>
              <TimelineView
                idBoard={idBoard}
                navigateToCard={navigateToCard}
                closeView={closeView}
              />
            </SingleBoardViewProvider>
          </SingleBoardViewFiltersProvider>
        </PermissionsContextProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
