import React from 'react';
import { css } from 'emotion';
import { Button } from '../../../../shared/Button/NewButton';
import Img from '../../../../components/Img';
import styles from '../DistributionPrompt/styles.sass';

export function DistributionConfirmation({
  onAcceptDistributionConfirmation,
  stationType,
  isSpotifyExclusive,
  podcastImageFull,
  isWordPressPublishedEpisode,
}) {
  return (
    <div
      className={css`
        text-align: center;
      `}
    >
      <div className={styles.distributeScreenTitle}>
        We’ve submitted your {stationType} for distribution 🎉
      </div>
      <div className={styles.distributeScreenSubTitle}>
        {isSpotifyExclusive
          ? 'We’ll let you know as soon as it gets approved by Spotify.'
          : 'We’ll let you know when it becomes available on supported listening platforms.'}
      </div>
      <div className={styles.distributeScreenGraphic}>
        <div
          className={styles.distributeCoverArt}
          style={{
            backgroundImage: `url(${podcastImageFull})`,
            ...(isSpotifyExclusive
              ? {
                  width: 202,
                  height: 202,
                  position: 'static',
                  backgroundSize: 'contain',
                  margin: '80px auto',
                }
              : {}),
          }}
        />
        {!isSpotifyExclusive && (
          <Img
            src="https://d12xoj7p9moygp.cloudfront.net/images/episode-page/distribution_graphic_1.png"
            alt="Podcast distribution platforms: Apple Podcasts, Pocket Casts, Spotify, Google Podcasts, Overcast"
            width={202}
            withRetina
          />
        )}
      </div>
      <Button
        className={css`
          max-width: 220px;
          width: 100%;
          margin-top: 20px;
        `}
        color="purple"
        onClick={onAcceptDistributionConfirmation}
        type="button"
      >
        {isWordPressPublishedEpisode ? 'Continue' : 'Ok, thanks'}
      </Button>
    </div>
  );
}
