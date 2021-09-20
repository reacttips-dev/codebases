import React, { useCallback, Suspense } from 'react';

import { forTemplate } from '@trello/i18n';
import { Spinner } from '@trello/nachos/spinner';
import { useLazyComponent } from '@trello/use-lazy-component';
import { useWorkspace } from '@trello/workspaces';

import { Feature } from 'app/scripts/debug/constants';
import { MultiBoardViewProvider } from 'app/src/components/BoardViewContext/MultiBoardViewProvider';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Error } from 'app/src/components/Error';
import { ViewsErrorMessage } from 'app/src/components/ViewsErrorMessage';
import { UrlParamsProvider } from 'app/src/components/ViewFilters';
import { usePreviousWhileFalsey } from 'app/src/components/WorkspaceView/usePreviousWhileFalsey';
import { WorkspaceViewHeader } from 'app/src/components/WorkspaceView/WorkspaceViewHeader';

import styles from './MultiBoardCalendarView.less';

const format = forTemplate('workspace_navigation');

export const MultiBoardCalendarView: React.FunctionComponent = () => {
  const CalendarView = useLazyComponent(
    () => import(/* webpackChunkName: "calendar-view" */ './CalendarView'),
    { namedImport: 'CalendarView' },
  );

  const workspace = useWorkspace();
  const idWorkspace = usePreviousWhileFalsey(
    workspace.idWorkspace,
    workspace.isLoading,
    null,
  );

  const handleError = useCallback(() => {
    return (
      <>
        <ViewsErrorMessage
          screenEventName="multiBoardTableViewErrorScreen"
          analyticsContainers={{ organization: { id: idWorkspace } }}
        />
      </>
    );
  }, [idWorkspace]);

  if (workspace.isLoading) {
    return <Spinner centered />;
  }

  if (!idWorkspace) {
    return <Error errorType="notFound" />;
  }

  return (
    <div className={styles.container}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-ecosystem',
          feature: Feature.CalendarView,
        }}
        errorHandlerComponent={handleError}
      >
        <Suspense fallback={null}>
          <UrlParamsProvider>
            <MultiBoardViewProvider idOrg={idWorkspace}>
              <div className={styles.headerContainer}>
                <WorkspaceViewHeader
                  title={format('workspace-calendar')}
                  orgId={idWorkspace}
                />
              </div>
              <div className={styles.bodyContainer}>
                <CalendarView shouldRenderBoardEmptyState={true} />
              </div>
            </MultiBoardViewProvider>
          </UrlParamsProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
