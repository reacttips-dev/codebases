import React from 'react';
import { Button, Icon } from '@glitchdotcom/shared-components';

import useObservable from '../../hooks/useObservable';
import Row from '../../components/primitives/Row';

export default function OwnerNotInGoodStandingOverlay({ application }) {
  const visible = useObservable(application.ownerNotInGoodStandingOverlayVisible);
  const isAdmin = useObservable(application.projectIsAdminForCurrentUser);
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);

  if (!visible) {
    return null;
  }

  return (
    <div className="overlay-background">
      <dialog className="overlay owner-not-in-good-standing-overlay overlay-narrow">
        {isAdmin ? (
          <>
            <section className="danger-zone">
              <h1>Are you still using this project?</h1>
            </section>

            <section className="info">
              <p>In order to keep Glitch free for as many people as possible, we disable apps that appear to have been abandoned.</p>
              <p>You can download a copy of the project code by clicking the button below.</p>
              <p>
                If you would like this project to be restarted, please email us at support@glitch.com and be sure to include the name of the project.
              </p>
            </section>
            <section className="actions">
              <Row>
                <Button
                  as="a"
                  href="//glitch.com/help/kb/article/17-what-technical-restrictions-are-in-place/"
                  data-testid="owner-not-in-good-standing-restrictions"
                >
                  View Restrictions
                </Button>
                <Button
                  as="a"
                  href={application.projectDownloadUrl()}
                  onClick={() => application.analytics.track('Project Downloaded', { clickLocation: 'Owner Not in Good Standing Overlay' })}
                  data-testid="owner-not-in-good-standing-download"
                >
                  Download Your Code
                </Button>
              </Row>
            </section>
          </>
        ) : (
          <>
            <section className="danger-zone">
              <h1>We can't run this project for you at the moment</h1>
            </section>

            <section className="info">
              {isMember ? (
                <p>While this project isn’t running, you can still download it by clicking the button below.</p>
              ) : (
                <p>While this project isn’t running, you can still remix it by clicking the button below.</p>
              )}
            </section>
            <section className="actions">
              <Row>
                {isMember ? (
                  <>
                    <Button
                      as="a"
                      href="//glitch.com/help/kb/article/17-what-technical-restrictions-are-in-place/"
                      data-testid="owner-not-in-good-standing-restrictions"
                    >
                      View Restrictions
                    </Button>
                    <Button
                      as="a"
                      href={application.projectDownloadUrl()}
                      onClick={() => application.analytics.track('Project Downloaded', { clickLocation: 'Owner Not In Good Standing Overlay' })}
                      data-testid="owner-not-in-good-standing-download"
                    >
                      Download Your Code
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      as="a"
                      href={application.remixURL()}
                      onClick={() => application.closeAllPopOvers() || true}
                      data-testid="owner-not-in-good-standing-remix"
                    >
                      Remix this project <Icon icon="microphone" />
                    </Button>
                    <Button as="a" href="/" data-testid="owner-not-in-good-standing-backtoglitch">
                      Back to Glitch <Icon icon="carpStreamer" />
                    </Button>
                  </>
                )}
              </Row>
            </section>
          </>
        )}
      </dialog>
    </div>
  );
}
