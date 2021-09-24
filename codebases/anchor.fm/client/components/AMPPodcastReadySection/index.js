import React from 'react';
import { Link } from 'react-router-dom';
import AMPTrackedLink from '../AMPTrackedLink';
import styles from './styles.sass';

// HOC for AMP page rendering
const AMPPodcastReadySection = () => (
  <div className={styles.container}>
    <div className={styles.aligned}>
      <h2>Ready to make your podcast?</h2>
      <AMPTrackedLink
        eventCategory="Onboarding"
        eventLabel="Start"
        to="/onboarding/existingpodcast"
      >
        <button className={`cyanButton ${styles.linkButton}`}>
          Get started
        </button>
      </AMPTrackedLink>
      <p className={styles.lastLine}>
        Already have a podcast?&nbsp;
        <Link className="cyanLink" to="/onboarding/rss">
          Switch to Anchor and never pay for hosting again.
        </Link>
      </p>
    </div>
  </div>
);

export default AMPPodcastReadySection;
