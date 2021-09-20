import React, { Suspense } from 'react';
import cx from 'classnames';

import { useLazyComponent } from '@trello/use-lazy-component';

import { Feature } from 'app/scripts/debug/constants';
import { SingleBoardViewFiltersProvider } from 'app/src/components/ViewFilters/SingleBoardViewFiltersProvider';
import { SingleBoardViewProvider } from 'app/src/components/BoardViewContext/SingleBoardViewProvider';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import {
  useWorkspaceNavigation,
  useWorkspaceNavigationHidden,
} from 'app/src/components/WorkspaceNavigation';

import styles from './SingleBoardCalendarView.less';

interface SingleBoardCalendarViewProps {
  idBoard: string;
  navigateToCard: (id: string) => void;
  closeView: () => void;
}

export const SingleBoardCalendarView: React.FunctionComponent<SingleBoardCalendarViewProps> = ({
  idBoard,
  navigateToCard,
  closeView,
}: SingleBoardCalendarViewProps) => {
  const CalendarView = useLazyComponent(
    () => import(/* webpackChunkName: "calendar-view" */ './CalendarView'),
    { namedImport: 'CalendarView' },
  );

  const [
    {
      expanded: workspaceNavigationExpanded,
      enabled: workspaceNavigationEnabled,
    },
  ] = useWorkspaceNavigation();
  const [
    { hidden: workspaceNavigationHidden },
  ] = useWorkspaceNavigationHidden();

  return (
    <div
      className={cx(styles.container, {
        [styles.collapsedWorkspaceNavigation]:
          workspaceNavigationEnabled &&
          !workspaceNavigationHidden &&
          !workspaceNavigationExpanded,
      })}
    >
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-ecosystem',
          feature: Feature.CalendarView,
        }}
      >
        <Suspense fallback={null}>
          <SingleBoardViewFiltersProvider idBoard={idBoard}>
            <SingleBoardViewProvider
              idBoard={idBoard}
              navigateToCard={navigateToCard}
              closeView={closeView}
              includeChecklistItems={true}
            >
              <CalendarView />
            </SingleBoardViewProvider>
          </SingleBoardViewFiltersProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
