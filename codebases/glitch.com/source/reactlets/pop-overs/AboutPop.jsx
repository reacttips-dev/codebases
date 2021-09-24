import React from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import { useCurrentUser } from '../../machines/User';

export default function AboutPop() {
  const application = useApplication();
  const visible = useObservable(application.aboutPopVisible);
  const currentUser = useCurrentUser();

  const showNewStuffOverlay = (e) => {
    e.preventDefault();
    application.aboutPopVisible(false);
    application.newStuffOverlayVisible(true);
    application.analytics.track('Pupdate Viewed', { clickLocation: 'Options Menu' });
  };

  if (!visible) {
    return null;
  }

  return (
    <dialog className="pop-over about-pop">
      <section className="actions">
        <div className="button-wrap">
          <a href="/" className="button">
            Back to Glitch <Icon icon="carpStreamer" />
          </a>
        </div>
        {currentUser?.login && (
          <div className="button-wrap">
            <a href="/dashboard" className="button">
              Your Projects <Icon icon="rocket" />
            </a>
          </div>
        )}
      </section>
      <section className="actions">
        <div className="button-wrap">
          <a href="/help" className="button button-small button-secondary">
            Docs and Help <Icon icon="umbrella" />
          </a>
        </div>
        <div className="button-wrap">
          <a href="https://support.glitch.com" className="button button-small button-secondary">
            Forum <Icon icon="ambulance" />
          </a>
        </div>
        <div className="button-wrap">
          <a href="/about" className="button button-small button-secondary">
            About Glitch <Icon icon="carpStreamer" />
          </a>
        </div>
        <div className="button-wrap">
          <button className="button button-small button-secondary" onClick={showNewStuffOverlay}>
            New Stuff <Icon icon="dogFace" />
          </button>
        </div>
        <div className="button-wrap">
          <a href="https://status.glitch.com" className="button button-small button-secondary">
            System Status <Icon icon="trafficLight" />
          </a>
        </div>
      </section>
    </dialog>
  );
}
