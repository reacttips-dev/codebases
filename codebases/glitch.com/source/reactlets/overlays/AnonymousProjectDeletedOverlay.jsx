import { Button } from '@glitchdotcom/shared-components';
import React from 'react';
import styled from 'styled-components';

import Row from '../../components/primitives/Row';
import useObservable from '../../hooks/useObservable';
import useApplication from '../../hooks/useApplication';

const RightAlignedAction = styled.div`
  margin-left: auto;
`;

/**
 * Overlay shown when an anonymous user's project has been deleted due to the
 * 5 day expiry.
 */
export default function AnonymousProjectDeletedOverlay() {
  const application = useApplication();
  const visible = useObservable(application.anonymousProjectDeletedOverlayVisible);

  if (!visible) {
    return null;
  }

  return (
    <div className="overlay-background">
      <dialog className="overlay">
        <section className="danger-zone">
          <h1>This project no longer exists</h1>
        </section>
        <section>
          <p>If you do not have a Glitch account, projects are deleted after 5 days. Save your work in the future by creating a free account!</p>
        </section>
        <section className="info">
          <Row>
            <Button variant="secondary" size="small" as="a" href="/signin">
              Create Account
            </Button>
            <RightAlignedAction>
              <a href="/">Back to Glitch</a>
            </RightAlignedAction>
          </Row>
        </section>
      </dialog>
    </div>
  );
}
