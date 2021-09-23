import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Link from 'react-router-dom/Link';
import {
  appStoreLink,
  playStoreLink,
} from '../../../helpers/serverRenderingUtils';
import OutboundLink from '../OutboundLink';
import { Footer } from '../Footer';
import styles from './styles.sass';

export default function CallJoin({ isIOS, isAndroidChrome, openInAppUrl }) {
  return (
    <div className={`${styles.recordOnMobile} isV2LegacyPage`}>
      <h2>Record with Anchor</h2>
      {isIOS && (
        <p>
          <OutboundLink to={appStoreLink()} newWindow>
            <img
              alt="App Store"
              src="https://d12xoj7p9moygp.cloudfront.net/images/appstore-logo.png"
              srcSet="https://d12xoj7p9moygp.cloudfront.net/images/appstore-logo.png 1x, https://d12xoj7p9moygp.cloudfront.net/images/appstore-logo@2x.png 2x"
              width={180}
              height={53}
            />
          </OutboundLink>
        </p>
      )}
      {isAndroidChrome && (
        <p>
          <OutboundLink to={playStoreLink()} newWindow>
            <img
              alt="Google Play Store"
              src="https://d12xoj7p9moygp.cloudfront.net/images/playstore-logo.png"
              srcSet="https://d12xoj7p9moygp.cloudfront.net/images/playstore-logo.png 1x, https://d12xoj7p9moygp.cloudfront.net/images/playstore-logo@2x.png 2x"
              width={180}
              height={54}
            />
          </OutboundLink>
        </p>
      )}
      {!isIOS && !isAndroidChrome && openInAppCallToAction()}
      {(isIOS || isAndroidChrome) && openInAppCallToAction(openInAppUrl)}
      <p className={styles.learnAboutAnchor}>
        <Link to="/">
          <strong>Learn more about Anchor &gt;</strong>
        </Link>
      </p>
      <Footer />
    </div>
  );
}

function openInAppCallToAction(url = 'https://anch.co/get_anchor') {
  return (
    <div>
      <p>
        <small className={styles.openInAppText}>Already have the app?</small>
      </p>
      <OutboundLink to={url} className="visible-xs-inline visible-sm-inline">
        <Button className={styles.openInApp}>Open in App</Button>
      </OutboundLink>
    </div>
  );
}
