import React, { useEffect, useState } from 'react';
import { Badge, Loader, Notification } from '@glitchdotcom/shared-components';
import styled from 'styled-components';
import useApplication from '../../../hooks/useApplication';
import useObservable from '../../../hooks/useObservable';
import useUserPref from '../../../hooks/useUserPref';
import Row from '../../../components/primitives/Row';
import Stack from '../../../components/primitives/Stack';
import whenKeyIsEnter from '../../../utils/whenKeyIsEnter';
import {
  AlwaysOnContainerStatusItem,
  CPUContainerStatusItem,
  DiskContainerStatusItem,
  MemoryContainerStatusItem,
  RateLimitContainerStatusItem,
} from './ContainerStatusItem';
import { BoostProjectButton, STATE_BOOST_DISABLED, STATE_BOOSTED_COLLECTION_FULL, useCurrentProjectBoostInfo } from '../../BoostControls';
import { useCurrentUser } from '../../../machines/User';
import BoostedIcon from '../../../components/icons/BoostedIcon';

const ContainerStatsButtonBoostedIcon = styled(BoostedIcon)`
  margin-right: 4px;
  position: relative;
  top: -1px;
`;

export default function ContainerStatsPanel() {
  const application = useApplication();
  const projectIsBoosted = useObservable(application.currentProjectIsBoosted);
  const [dismissedBoostedNotification, setDismissedBoostedNotification] = useUserPref('dismissedBoostedNotificationStatusPanel');
  const visible = useObservable(application.containerStatsPanelVisible);
  const dataLoaded = useObservable(application.projectContainerResourcesDataLoaded);
  const projectContainerResourcesStatus = useObservable(application.projectContainerResourcesStatus);
  const currentUserIsAdmin = useObservable(application.projectIsAdminForCurrentUser);
  const { quotaUsagePercent, memoryUsagePercent, diskUsagePercent, memoryUsage, memoryLimit, diskUsage, diskSize } = useObservable(
    application.projectContainerResourcesData,
  );
  const [resizing, setResizing] = useState(false);
  const defaultHeight = Math.min(390, Math.floor(window.innerHeight / 2));
  const [height, setHeight] = useState(defaultHeight);
  const currentUser = useCurrentUser();
  const boostInfo = useCurrentProjectBoostInfo();

  useEffect(() => {
    if (resizing) {
      let onMouseMoveAnimationFrame = null;
      const onMouseMove = (e) => {
        cancelAnimationFrame(onMouseMoveAnimationFrame);
        onMouseMoveAnimationFrame = requestAnimationFrame(() => {
          e.preventDefault();
          window.getSelection().removeAllRanges();
          setHeight(Math.floor(window.innerHeight - e.pageY));
        });
      };
      document.addEventListener('mousemove', onMouseMove);

      const onMouseUp = () => {
        setResizing(false);
      };
      document.addEventListener('mouseup', onMouseUp);

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }
    return undefined;
  }, [resizing]);

  /**
   * If the height changes, `application.refreshEditor()`. We use rAF here because if we do it too
   * quick, we get a `Cannot read property 'getBoundingClientRect' of null` Error.
   */
  useEffect(() => {
    const frame = window.requestAnimationFrame(application.refreshEditor);
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [application, height]);

  const startResize = () => {
    setResizing(true);
  };

  const autoResize = () => {
    setHeight(defaultHeight);
  };

  const hidePanel = (e) => {
    e.preventDefault();
    application.containerStatsPanelVisible(false);
  };

  if (!visible) {
    return null;
  }

  const showBoostedAppsPromo =
    !projectIsBoosted && // Hide if project is already boosted
    !dismissedBoostedNotification && // Hide if user dismissed already
    !currentUser?.isProUser && // Hide if user is already pro
    dataLoaded; // Hide until panel contents are visible

  const proButtonText = 'Learn More About Boosted Apps';
  const proLinkHref = '/pricing';

  return (
    <footer id="container-stats-panel" className="container-stats-panel panel" style={{ height: `${height}px` }}>
      {/* Existing accessibility issue ported to React.  */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="resizer" onMouseDown={startResize} onDoubleClick={autoResize} />
      <header className="header">
        <Row>
          <h1>{projectIsBoosted ? 'Boosted App Status' : 'App Status'}</h1>
          {dataLoaded ? (
            <div className="controls">
              <Badge variant={projectContainerResourcesStatus === 'ok' ? 'success' : projectContainerResourcesStatus}>
                {projectContainerResourcesStatus === 'ok' ? 'Ok' : 'Warn'}
              </Badge>
            </div>
          ) : (
            <Loader />
          )}
        </Row>
        <div className="close icon" onClick={hidePanel} onKeyPress={whenKeyIsEnter(hidePanel)} role="button" tabIndex="0" />
      </header>
      {showBoostedAppsPromo && (
        <section>
          <Notification
            persistent
            variant="onboarding"
            message="Boost your memory, disk space, and more with Boosted Apps"
            data-testid="boosted-status-panel-notification"
          >
            <Stack>
              <span>
                <strong>Boost your memory, disk space, and more with Boosted Apps.</strong> Turn off app sleeping and remove your app's rate limit.
              </span>
              <Row>
                {/* TODO: Use Shared Components here once we've fixed the CTA button and the onboarding notifications for Dark Mode */}
                <a
                  href={`//glitch.com${proLinkHref}`}
                  className="sign-in-button button button-cta button-small"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    application.analytics.track('Subscription CTA Clicked', {
                      targetText: proButtonText,
                      url: window.location.pathname,
                      href: proLinkHref,
                    });
                  }}
                >
                  {proButtonText}
                </a>
                <button
                  className="button button-small button-secondary"
                  onClick={() => {
                    setDismissedBoostedNotification(true);
                  }}
                  data-testid="boosted-status-panel-notification-hide"
                >
                  Hide
                </button>
              </Row>
            </Stack>
          </Notification>
        </section>
      )}
      <section>
        {dataLoaded ? (
          <>
            <MemoryContainerStatusItem
              memoryUsagePercent={memoryUsagePercent}
              memoryUsage={memoryUsage}
              memoryLimit={memoryLimit}
              itemIsBoosted={projectIsBoosted}
            />
            <DiskContainerStatusItem diskUsagePercent={diskUsagePercent} diskUsage={diskUsage} diskSize={diskSize} itemIsBoosted={projectIsBoosted} />
            <CPUContainerStatusItem quotaUsagePercent={quotaUsagePercent} />
            <AlwaysOnContainerStatusItem itemIsBoosted={projectIsBoosted} />
            {currentUserIsAdmin && currentUser?.isProUser && <RateLimitContainerStatusItem itemIsBoosted />}
          </>
        ) : (
          <Loader />
        )}
      </section>
      {boostInfo.projectBoostState !== STATE_BOOST_DISABLED && (
        <section>
          <Row>
            <BoostProjectButton {...boostInfo}>
              {(buttonText) => (
                <>
                  <ContainerStatsButtonBoostedIcon variant="default" size="small" />
                  <span>{buttonText}</span>
                </>
              )}
            </BoostProjectButton>
            {boostInfo.projectBoostState === STATE_BOOSTED_COLLECTION_FULL && currentUser && (
              <a href={`/@${currentUser.login}/boosted-apps`} className="button button-small">
                Manage Boosted Apps
              </a>
            )}
          </Row>
        </section>
      )}
    </footer>
  );
}
