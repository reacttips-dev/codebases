import { Button, Icon, UnstyledButton } from '@glitchdotcom/shared-components';
import React from 'react';
import styled from 'styled-components';

import Row from '../../components/primitives/Row';
import useObservable from '../../hooks/useObservable';
import useApplication from '../../hooks/useApplication';
import { useCurrentUser } from '../../machines/User';
import ProjectDownloadButton from '../ProjectDownloadButton';
import { BASE_URL } from '../../env';

const LinkButton = styled(UnstyledButton)`
  text-decoration: underline;
`;

const RightAlignedAction = styled.div`
  margin-left: auto;
`;

/**
 * Container for the parts of the overlay common between all variants.
 */
function OverlayWrapper({ title, children, actions }) {
  return (
    <div className="overlay-background">
      <dialog className="overlay">
        <section>
          <h1>{title}</h1>
        </section>
        <section>{children}</section>
        <section className="info">
          <Row>
            {actions}
            <RightAlignedAction>
              <a href="/">Back to Glitch</a>
            </RightAlignedAction>
          </Row>
        </section>
      </dialog>
    </div>
  );
}

/**
 * Overlay shown when a project can't run due to a user's Glitch subscription no longer being valid.
 * Points the owner to fix their subscription settings, or allows them to make the project public so that it can run again.
 */
export default function GlitchSubscriptionRequiredOverlay() {
  const application = useApplication();
  const visible = useObservable(application.glitchSubscriptionRequiredOverlayVisible);
  const isAdmin = useObservable(application.projectIsAdminForCurrentUser);
  const currentUser = useCurrentUser();
  const allowRemixes = currentUser?.isProUser;

  if (!visible) {
    return null;
  }

  if (isAdmin) {
    return (
      <OverlayWrapper
        title={<>Glitch Membership Required</>}
        actions={
          <>
            <Button size="small" as="a" href={`//${BASE_URL}/settings/subscription`}>
              Subscription settings
            </Button>
          </>
        }
      >
        <p>You need to be a Glitch Member in order for Private Code or Private Projects to run.</p>
        <p>
          Head over to your Subscription Settings page to resolve this. You can alternatively choose to{' '}
          <LinkButton
            as="a"
            href={application.projectDownloadUrl()}
            onClick={() => application.analytics.track('Project Downloaded', { clickLocation: 'Uptime Limits Exceeded Overlay' })}
          >
            download your project
          </LinkButton>{' '}
          or{' '}
          <LinkButton
            onClick={async () => {
              await application.changeProjectPrivacy('public');
              location.reload();
            }}
          >
            make it public
          </LinkButton>{' '}
          (it'll take a few minutes for this to take effect).
        </p>
      </OverlayWrapper>
    );
  }

  // If they're a member but not an admin, we'll let them download, or remix if they're a pro user
  if (!isAdmin) {
    return (
      <OverlayWrapper
        title={<>We can't run this project for you at the moment</>}
        actions={
          <>
            {allowRemixes && (
              <Button
                variant="secondary"
                size="small"
                as="a"
                href={application.remixURL()}
                onClick={() => application.closeAllPopOvers() || true}
                data-testid="glitch-subscription-required-remix"
              >
                Remix this project <Icon icon="microphone" />
              </Button>
            )}
            <ProjectDownloadButton application={application} location="Glitch Subscription Required Overlay" />
          </>
        }
      >
        <p>This project's owner no longer has an active Glitch membership, so we can't run their private projects</p>
        <p>You can ask them to make it public for you, or take one of the other actions below.</p>
      </OverlayWrapper>
    );
  }
}
