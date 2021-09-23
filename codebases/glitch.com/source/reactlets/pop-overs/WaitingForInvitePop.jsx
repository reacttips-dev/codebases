import React, { useCallback } from 'react';
import { Icon, Loader } from '@glitchdotcom/shared-components';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import PopPortal from '../../components/PopPortal';

export default function WaitingForInvitePop({ user, style }) {
  const application = useApplication();
  const isCurrentUser = useObservable(useCallback(() => user === application.currentUser(), [application, user]));

  const cancelJoinRequest = () => {
    application.closeAllPopOvers();
    user.awaitingInvite(false);
    application.broadcast({
      user: user.broadcastData(),
    });
  };

  return (
    <PopPortal>
      {/* Existing accessibility issue ported to React. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <dialog className="pop-over waiting-for-invite-pop" style={style}>
        <section className="info">
          <h1>
            Request Sent <Icon icon="thumbsUp" />
          </h1>
        </section>
        <section className="actions">
          <p>Check back soon</p>
          <Loader />
        </section>
        {isCurrentUser && (
          <section className="info">
            <button className="button" onClick={cancelJoinRequest}>
              Cancel Request
            </button>
          </section>
        )}
      </dialog>
    </PopPortal>
  );
}
