import React, { useState } from 'react';
import classNames from 'classnames';
import Img from '../Img';
import OutboundLink from '../OutboundLink';
import { PODCAST_URL_HOSTS } from '../../screens/DistributionScreen/constants.ts';
import styles from './styles.sass';
import { copyTextToClipboard } from '../../utils';
import { getFeedUrl } from '../../../helpers/serverRenderingUtils';
import RSS from '../svgs/RSS';

const {
  APPLE_PODCASTS,
  GOOGLE_PODCASTS,
  GOOGLE_PLAY_MUSIC,
  OVERCAST,
  POCKETCASTS,
  RADIO_PUBLIC,
  STITCHER,
  SPOTIFY,
  TUNE_IN,
  BREAKER,
  CASTBOX,
  POD_BEAN,
} = PODCAST_URL_HOSTS;
const ANCHOR = 'anchor';

const attributesByHost = new Map([
  [
    ANCHOR,
    {
      displayName: 'Anchor',
      src: 'anchor-wave.png',
    },
  ],
  [
    APPLE_PODCASTS,
    {
      displayName: 'Apple Podcasts',
      src: 'apple_podcasts.png',
    },
  ],
  [
    GOOGLE_PODCASTS,
    {
      displayName: 'Google Podcasts',
      src: 'google_podcasts_outline.png',
    },
  ],
  [
    GOOGLE_PLAY_MUSIC,
    {
      displayName: 'Google Play Music',
      src: 'google_play.png',
    },
  ],
  [
    OVERCAST,
    {
      displayName: 'Overcast',
      src: 'overcast.png',
    },
  ],
  [
    POCKETCASTS,
    {
      displayName: 'Pocket Casts',
      src: 'pocket_casts.png',
    },
  ],
  [
    RADIO_PUBLIC,
    {
      displayName: 'RadioPublic',
      src: 'radiopublic.png',
    },
  ],
  [
    STITCHER,
    {
      displayName: 'Stitcher',
      src: 'stitcher_dark.png',
    },
  ],
  [
    SPOTIFY,
    {
      displayName: 'Spotify',
      src: 'spotify.png',
    },
  ],
  [
    BREAKER,
    {
      displayName: 'Breaker',
      src: 'breaker.png',
    },
  ],
  [
    TUNE_IN,
    {
      displayName: 'TuneIn',
      src: 'tune_in.png',
    },
  ],
  [
    CASTBOX,
    {
      displayName: 'Castbox',
      src: 'castbox.png',
    },
  ],
  [
    POD_BEAN,
    {
      displayName: 'PodBean',
      src: 'podbean.png',
    },
  ],
]);

export default ({
  anchorPodcastsUrl,
  podcastUrlDictionary,
  isIOS,
  isAndroidChrome,
  openInAppUrl,
  stationId,
}) => {
  const [isCopied, setisCopied] = useState(false);
  const priorityHost = (() => {
    if (isIOS) {
      return APPLE_PODCASTS;
    }
    if (isAndroidChrome) {
      return GOOGLE_PODCASTS;
    }
    return null;
  })();
  const platforms = Object.keys(PODCAST_URL_HOSTS)
    .filter(key => key !== 'stationId')
    .map(key => PODCAST_URL_HOSTS[key])
    .filter(host => podcastUrlDictionary[host])
    .map(host => {
      const priority = host === priorityHost ? 0 : 2;
      const link = podcastUrlDictionary[host];
      const attributes = attributesByHost.get(host);
      return { host, priority, link, attributes };
    });
  const anchorLink =
    isIOS || isAndroidChrome ? openInAppUrl : anchorPodcastsUrl;
  if (anchorPodcastsUrl) {
    platforms.push({
      host: ANCHOR,
      priority: 1,
      link: anchorLink,
      attributes: attributesByHost.get(ANCHOR),
    });
  }
  platforms.sort((a, b) => {
    if (a.priority === b.priority) {
      return a.attributes.displayName.localeCompare(b.attributes.displayName);
    }
    return a.priority - b.priority;
  });
  let containerNode = null;
  return (
    <div className={styles.stationExternalLinkList}>
      {platforms.map(({ host, link, attributes }) => (
        <div className={styles.stationExternalLinkContainer}>
          <OutboundLink
            className={styles.stationExternalLink}
            key={`${host}-${link}`}
            to={link}
            newWindow
          >
            <Img
              alt={`${attributes.displayName} Logo`}
              src={`https://d12xoj7p9moygp.cloudfront.net/images/podcast/logo-square/004/${attributes.src}`}
              withRetina
              width={22}
              height={22}
              className={styles.stationExternalLinkImage}
            />
            <span className={styles.stationExternalLinkText}>
              {attributes.displayName}
            </span>
          </OutboundLink>
        </div>
      ))}
      <div
        className={styles.stationExternalLinkContainer}
        ref={el => (containerNode = el)}
      >
        <OutboundLink
          to="#"
          className={styles.stationExternalLink}
          onClick={e => {
            e.preventDefault();
            setisCopied(true);
            copyTextToClipboard(getFeedUrl(stationId));
            setTimeout(() => setisCopied(false), 1000);
          }}
        >
          <RSS
            size={22}
            className={classNames(
              styles.stationExternalLinkImage,
              styles.rssIcon
            )}
          />
          <span className={styles.stationExternalLinkText}>
            {isCopied ? 'Copied!' : 'Copy RSS'}
          </span>
        </OutboundLink>
      </div>
    </div>
  );
};
