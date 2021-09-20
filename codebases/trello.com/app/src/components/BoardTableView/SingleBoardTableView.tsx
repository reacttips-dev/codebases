import React, { Suspense } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

import { Feature } from 'app/scripts/debug/constants';
import { PermissionsContextProvider } from 'app/src/components/BoardDashboardView/PermissionsContext';
import { SingleBoardViewProvider } from 'app/src/components/BoardViewContext/SingleBoardViewProvider';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { SingleBoardViewFiltersProvider } from 'app/src/components/ViewFilters/SingleBoardViewFiltersProvider';

import styles from './SingleBoardTableView.less';

interface SingleBoardTableViewProps {
  idOrg: string;
  idBoard: string;
  navigateToCard: (id: string) => void;
  closeView: () => void;
}

export const SingleBoardTableView: React.FC<SingleBoardTableViewProps> = ({
  idOrg,
  idBoard,
  navigateToCard,
  closeView,
}: SingleBoardTableViewProps) => {
  const BoardTableView = useLazyComponent(
    () => import(/* webpackChunkName: "table-view" */ './BoardTableView'),
    { namedImport: 'BoardTableView' },
  );
  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-panorama',
        feature: Feature.TableView,
      }}
    >
      <Suspense fallback={null}>
        <PermissionsContextProvider idBoard={idBoard}>
          <SingleBoardViewFiltersProvider idBoard={idBoard}>
            <SingleBoardViewProvider
              idBoard={idBoard}
              navigateToCard={navigateToCard}
              closeView={closeView}
            >
              <div className={styles.sbtvWrapper}>
                <div className={styles.sbtvMargin}>
                  <BoardTableView idOrg={idOrg} />
                </div>
              </div>
            </SingleBoardViewProvider>
          </SingleBoardViewFiltersProvider>
        </PermissionsContextProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
