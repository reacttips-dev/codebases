import React, { Fragment, useEffect } from 'react';
import { Footer } from '../../components/Footer';
import styles from './styles.sass';
import HermanNotFoundSVG from '../../components/svgs/HermanNotFound';
import trackEvent from '../../modules/analytics/trackEvent';
import { Button } from '../../shared/Button/NewButton';

const NotFoundScreen = ({ isLoggedIn, path, handleNotFound = () => {} }) => {
  useEffect(() => {
    handleNotFound(path);
  }, [handleNotFound, path]);
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <div className={styles.herman}>
          <HermanNotFoundSVG />
        </div>
        <div className={styles.textContainer}>
          {isLoggedIn ? (
            <Fragment>
              <h4 className={styles.header}>
                Sorry, we couldn't find the page you were looking for. Head back
                to your dashboard instead?
              </h4>
              <Button kind="link" href="/dashboard" color="yellow">
                Go to dashboard
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <h4 className={styles.header}>
                Well, this is embarrassing!
                <br />
                We couldn't find the page you were looking for&hellip;
              </h4>
              <p className={styles.copy}>
                But if you're looking to make a podcast of your own, that's
                something we can help you with.
              </p>
              <Button
                kind="link"
                href="/"
                color="yellow"
                onClick={() => navigateToHomepage()}
              >
                Learn more about Anchor
              </Button>
            </Fragment>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );

  function navigateToHomepage() {
    trackEvent(
      null,
      {
        eventCategory: '404',
        eventAction: 'Click',
        eventLabel: 'Learn more about Anchor',
      },
      { providers: [ga] }
    );
  }
};

export default NotFoundScreen;
