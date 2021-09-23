import React, { useCallback } from 'react';
import { Button } from '@glitchdotcom/shared-components';
import styled from 'styled-components';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import Row from '../../components/primitives/Row';

const SpaceBetweenRow = styled(Row)`
  justify-content: space-between;
`;

export default function ProjectSuspended() {
  const application = useApplication();
  const visible = useObservable(application.projectIsSuspendedOverlayVisible);
  const currentProject = useObservable(application.currentProject);
  const projectName = useObservable(useCallback(() => currentProject && currentProject.name(), [currentProject])) || 'Your project';
  const suspendedReason =
    useObservable(useCallback(() => currentProject && currentProject.suspendedReason(), [currentProject])) || 'Violating Terms of Service';
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);
  const projectDownloadUrl = useObservable(application.projectDownloadUrl);

  let contactText;
  if (
    suspendedReason === 'Disk space full: This project has exceeded the disk space limit.' ||
    suspendedReason === 'Preparing error: The project cannot open.'
  ) {
    contactText = 'Support can help! Please contact support@glitch.com to regain access.';
  } else {
    contactText = 'If you think this was done in error, email support@glitch.com.';
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="overlay-background">
      <dialog className="overlay project-is-suspended-overlay overlay-narrow">
        <section className="danger-zone">
          <h1>This project has been suspended</h1>
        </section>

        <section className="actions">
          <p>Reason for suspension: {suspendedReason}</p>
          <p>{contactText}</p>
        </section>

        <section className="info">
          <SpaceBetweenRow>
            <Row>
              <Button
                as="a"
                href={`mailto:support@glitch.com?subject=Suspended%20project:%20${projectName}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="small"
              >
                Email Support
              </Button>
              {isMember && (
                <Button
                  variant="secondary"
                  size="small"
                  as="a"
                  href={projectDownloadUrl}
                  onClick={() => application.analytics.track('Project Downloaded', { clickLocation: 'Suspended Overlay' })}
                >
                  Download Project
                </Button>
              )}
            </Row>
            <a href="//glitch.com">Back to Glitch</a>
          </SpaceBetweenRow>
        </section>
      </dialog>
    </div>
  );
}
