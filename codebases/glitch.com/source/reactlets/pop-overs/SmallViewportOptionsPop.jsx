import React, { useRef, useCallback } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import { access } from '../../const';

export default function SmallViewportOptionsPop() {
  const application = useApplication();
  const visible = useObservable(application.smallViewportOptionsPopVisible);
  const avatarUrl = useObservable(application.currentUserAvatarUrl);
  const accessLevel = useObservable(application.projectAccessLevelForCurrentUser);
  const currentUser = useObservable(application.currentUser);
  const name = useObservable(useCallback(() => (currentUser ? currentUser.name() : null), [currentUser]));
  const isLoggedIn = useObservable(useCallback(() => !!currentUser && currentUser.loggedIn(), [currentUser]));
  const dialogRef = useRef();

  if (!visible) {
    return null;
  }

  return (
    <dialog className="pop-over small-viewport-options-pop" ref={dialogRef}>
      <section className="info">
        <h1>Hello {name}</h1>
      </section>
      <section className="actions">
        {isLoggedIn ? (
          <button
            className="button"
            onClick={() => {
              application.accountPopVisible(true);
              application.smallViewportOptionsPopVisible(false);
            }}
          >
            Your Account <span className="emoji avatar" style={{ backgroundImage: `url(${avatarUrl})` }} />
          </button>
        ) : (
          <a href="//glitch.com/signin" className="onboarding-tip-link" onClick={application.setDestinationAfterAuth}>
            <div className="onboarding-tip onboarding-tip-wholly-clickable">
              <div>
                <strong>Create an account</strong>{' '}
                {accessLevel >= access.MEMBER ? 'to keep this project, and edit it from anywhere.' : 'to save your favorite apps.'}
              </div>
              <div className="button-wrap">
                <button className="button button-cta button-small">Create an Account</button>
              </div>
            </div>
          </a>
        )}
      </section>

      <section className="actions">
        <button
          className="button"
          onClick={() => {
            application.aboutPopVisible(true);
            application.smallViewportOptionsPopVisible(false);
          }}
        >
          Glitch <Icon icon="glitchLogo" />
        </button>
      </section>
    </dialog>
  );
}
