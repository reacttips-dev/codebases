import React from 'react';
import { Loader } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';
import useMediaQuery from '../hooks/useMediaQuery';
import useObservable from '../hooks/useObservable';

export default function Footer() {
  const application = useApplication();
  const isLoggedIn = useObservable(application.currentUserIsLoggedIn);
  const isLoggingIn = useObservable(application.userIsLoggingIn);
  const isEmbedded = useObservable(application.editorIsEmbedded);
  const newStuffVisible = useObservable(application.newStuffNotificationVisible) && !isEmbedded;
  const isMobile = useMediaQuery('(max-width: 580px)');

  const showNewStuffOverlay = (e) => {
    application.analytics.track('Pupdate Viewed', { clickLocation: 'Editor' });
    application.newStuffNotificationVisible(false);
    application.newStuffOverlayVisible(true);
    e.stopPropagation();
  };

  return (
    <footer className="footer-options">
      {isMobile && isLoggingIn && <Loader />}
      {isMobile && !isEmbedded && !isLoggedIn && (
        <a href="//glitch.com/signin" className="sign-in-button button" onClick={application.setDestinationAfterAuth}>
          Sign In
        </a>
      )}
      {newStuffVisible && (
        /* ESLINT-CLEAN-UP */
        /* eslint-disable-next-line */
        <div className="button-wrap new-stuff opens-pop-over" role="button" onClick={showNewStuffOverlay}>
          <figure className="new-stuff-doggo" data-tooltip="New" data-tooltip-top data-tooltip-notification data-tooltip-persistent />
        </div>
      )}
    </footer>
  );
}
