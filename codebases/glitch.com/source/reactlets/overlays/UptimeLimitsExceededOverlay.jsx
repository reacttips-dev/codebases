import { Button, Icon } from '@glitchdotcom/shared-components';
import React from 'react';
import styled from 'styled-components';
import ProjectDownloadButton from '../ProjectDownloadButton';

import {
  STATE_BOOST_DISABLED,
  STATE_BOOSTED_COLLECTION_FULL,
  STATE_CAN_BOOST,
  useCurrentProjectBoostInfo,
  BoostProjectButton,
} from '../BoostControls';
import Row from '../../components/primitives/Row';
import useObservable from '../../hooks/useObservable';
import useApplication from '../../hooks/useApplication';

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

function UptimeSupportLink({ children }) {
  return (
    <a href="https://glitch.com/help/kb/articles/82" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/**
 * Overlay shown when a user has exceeded their allotted uptime hours for the month.
 * Allows to user to boost the project if possible, otherwise points them to subscribe
 * or un-boost other projects based on their subscription status.
 */
export default function UptimeLimitsExceededOverlay() {
  const application = useApplication();
  const visible = useObservable(application.uptimeLimitsExceededOverlayVisible);
  const isAdmin = useObservable(application.projectIsAdminForCurrentUser);
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);
  const boostInfo = useCurrentProjectBoostInfo();
  const { projectBoostState } = boostInfo;

  if (!visible) {
    return null;
  }

  if (!isMember) {
    return (
      <OverlayWrapper
        title={<>We can't run this project for you at the moment</>}
        actions={
          <Button
            variant="secondary"
            size="small"
            as="a"
            href={application.remixURL()}
            onClick={() => application.closeAllPopOvers() || true}
            data-testid="uptime-limits-exceeded-remix"
          >
            Remix this project <Icon icon="microphone" />
          </Button>
        }
      >
        <p>This project's owner has no remaining project hours, so you can't access it right now.</p>
        <p>You're welcome to remix this app to get your own version though.</p>
      </OverlayWrapper>
    );
  }

  // If they're a member but not an admin, we'll let them download but not boost
  if (!isAdmin) {
    return (
      <OverlayWrapper
        title={<>We can't run this project for you at the moment</>}
        actions={<ProjectDownloadButton application={application} location="Uptime Limits Exceeded" />}
      >
        <p>This project's owner has no remaining project hours, so you can't access it right now.</p>
        <p>As a member, you're welcome to download this app in the meantime.</p>
      </OverlayWrapper>
    );
  }

  switch (projectBoostState) {
    // User is not subscribed and cannot boost
    case STATE_BOOST_DISABLED:
      return (
        <OverlayWrapper
          title={
            <>
              Become a Glitch Member <Icon icon="boosted" />
            </>
          }
          actions={
            <>
              <Button variant="secondary" size="small" as="a" href="/pricing">
                Upgrade Account
              </Button>
              <ProjectDownloadButton application={application} location="Uptime Limits Exceeded Overlay" />
            </>
          }
        >
          <p>
            You've used all your project hours for this month! Your <UptimeSupportLink>project hours</UptimeSupportLink> will reset on the first of
            the next month.
          </p>
          <p>Upgrade your account to give your projects superpowers: Unlimited hours, no rate limits, and boosted specs for up to five projects.</p>
        </OverlayWrapper>
      );

    // User's boosted collection is full and they cannot boost this app
    case STATE_BOOSTED_COLLECTION_FULL:
      return (
        <OverlayWrapper
          title={
            <>
              You've used all your project hours for this month <Icon icon="rocket" />
            </>
          }
          actions={
            <>
              <Button variant="secondary" size="small" as="a" href="/dashboard">
                Manage Projects
              </Button>
              <ProjectDownloadButton application={application} location="Uptime Limits Exceeded Overlay" />
            </>
          }
        >
          <p>
            Your <UptimeSupportLink>project hours</UptimeSupportLink> will reset on the first of the next month.
          </p>
          <p>To make this project accessible 24/7, head over to your Project Dashboard to update which projects are boosted.</p>
        </OverlayWrapper>
      );

    // User can boost this app to bring it online
    case STATE_CAN_BOOST:
      return (
        <OverlayWrapper
          title={
            <>
              You've used all your project hours for this month <Icon icon="rocket" />
            </>
          }
          actions={
            <>
              <BoostProjectButton
                variant="secondary"
                size="small"
                onClick={() => application.uptimeLimitsExceededOverlayVisible(false)}
                {...boostInfo}
              >
                {() => (
                  <>
                    {/* This is only displayed when boosting is possible so we don't need to pull in the button text
                      since it will never show "Unboost" */}
                    Boost Project <Icon icon="boosted" />
                  </>
                )}
              </BoostProjectButton>
              <ProjectDownloadButton application={application} location="Uptime Limits Exceeded Overlay" />
            </>
          }
        >
          <p>
            Your <UptimeSupportLink>project hours</UptimeSupportLink> will reset on the first of the next month.
          </p>
          <p>As a Glitch Member, boost this project to make it accessible 24/7.</p>
        </OverlayWrapper>
      );

    // We might be loading boosted info, or something unexpected happened. Default to displaying nothing.
    default:
      return null;
  }
}
