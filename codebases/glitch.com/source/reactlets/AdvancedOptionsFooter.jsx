import React, { useCallback } from 'react';
import classnames from 'classnames';
import { Loader } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import ToolsPop from './pop-overs/ToolsPop';
import GitImportExportPop from './pop-overs/GitImportExportPop';
import CustomDomainPop from './pop-overs/CustomDomainPop';
import ReportAbusePopButton from './pop-overs/ReportAbusePop';

const RESOURCE_STATUS_OK = 'ok';

function Badge({ status, collapsed, children }) {
  const className = classnames({
    status: !collapsed,
    'status-standalone': collapsed,
    [status]: true,
  });
  return (
    <div>
      <div className="status-badge icon">
        <div className={className}>{!collapsed && children}</div>
      </div>
    </div>
  );
}

export default function AdvancedOptionsFooter() {
  const application = useApplication();

  const projectContainerStatus = useObservable(application.projectContainerStatus);
  const projectContainerResourcesStatus = useObservable(application.projectContainerResourcesStatus);
  const resourceStatusLoaded = useObservable(application.projectContainerResourcesDataLoaded);
  const showResourceStatus = resourceStatusLoaded && projectContainerStatus !== 'building';
  const projectIsLoaded = useObservable(application.projectIsLoaded);

  const debuggerReady = useObservable(application.debuggerReady);

  const toolsPopVisible = useObservable(application.toolsPopVisible);
  const customDomainPopVisible = useObservable(application.customDomainPopVisible);
  const gitImportExportPopVisible = useObservable(application.gitImportExportPopVisible);
  const containerStatusPanelVisible = useObservable(application.containerStatsPanelVisible);

  const wideSidebar = useObservable(useCallback(() => application.sidebarWidth() >= 225, [application]));
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);
  const projectIsBoosted = useObservable(application.currentProjectIsBoosted);
  const projectBackend = useObservable(application.currentProjectBackend);
  // 🦓 🐠 is the internal name for Project Hosting V2
  // We want to display a warning if the project is using the new V2 backend
  const isZebraFish = projectBackend === 'project-hosting-v2';

  const toggleToolsPopVisible = (event) => {
    const previousState = application.toolsPopVisible();
    event.preventDefault();
    application.closeAllPopOvers();
    application.toolsPopVisible(!previousState);
    application.analytics.track('Tools Viewed');
  };

  const toolsClassNames = classnames('button', {
    active: toolsPopVisible || customDomainPopVisible || gitImportExportPopVisible,
    'has-status': projectContainerStatus !== RESOURCE_STATUS_OK,
    'opens-pop-over': true,
  });

  if (projectIsReadOnlyForCurrentUser || !projectIsLoaded) {
    return <ReportAbusePopButton reportedType="Editor - Project" />;
  }

  return (
    <section className="advanced-options">
      <div className={classnames('button-wrap', { boosted: projectIsBoosted })}>
        <button
          className={classnames('button button-small button-secondary', {
            active: containerStatusPanelVisible,
            disabled: projectIsReadOnlyForCurrentUser,
          })}
          onClick={() => {
            application.closeAllPopOvers();
            application.containerStatsPanelVisible.toggle();
            application.analytics.track('App Status Viewed');
          }}
          disabled={projectIsReadOnlyForCurrentUser}
          data-testid="container-status-button"
        >
          {wideSidebar ? `${projectIsBoosted ? 'Boosted' : 'App'} Status` : 'Status'}
          {isMember && (
            <>
              {showResourceStatus ? (
                <Badge className="status-badge status" status={projectContainerResourcesStatus} collapsed={!wideSidebar}>
                  {projectContainerResourcesStatus}
                </Badge>
              ) : (
                <Loader />
              )}
            </>
          )}
        </button>
      </div>
      <div className="button-wrap">
        <button
          data-testid="tools-pop-button"
          id="tools-pop-button"
          className={toolsClassNames}
          onClick={toggleToolsPopVisible}
          aria-label="Open tools popover menu"
        >
          Tools
          {projectContainerStatus === 'building' ? (
            <Loader />
          ) : (
            projectContainerStatus !== RESOURCE_STATUS_OK && (
              <Badge className="status-badge status" status={projectContainerStatus} collapsed={!wideSidebar}>
                {projectContainerStatus}
              </Badge>
            )
          )}
          {debuggerReady && (
            <Badge collapsed={!wideSidebar} status="warning">
              Debug
            </Badge>
          )}
          <span className="up-arrow icon" />
        </button>
        <ToolsPop application={application} />
        <GitImportExportPop application={application} />
        <CustomDomainPop application={application} />
      </div>
      {isZebraFish && (
        <div className="zebrafish">
          This is a <strong>zebrafish</strong> project 🦓 🐟
        </div>
      )}
    </section>
  );
}
