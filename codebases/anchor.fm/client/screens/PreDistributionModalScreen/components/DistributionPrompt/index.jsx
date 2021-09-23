import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Button } from '../../../../shared/Button/NewButton';
import Img from '../../../../components/Img';
import styles from './styles.sass';
import { events } from '../../events';
import { AnchorAPI } from '../../../../modules/AnchorAPI';
import { getIsOptedOutOfDistribution } from '../../../DistributionScreen/utils';
import { poll } from '../../../../modules/Poll';

const ErrorMessage = styled.span`
  color: red;
  font-size: 1.4rem;
  display: block;
  max-width: 320px;
  margin: auto;
  margin-top: 16px;
`;

// eslint-disable-next-line consistent-return
function getAcceptButtonText(optInStatus, isSpotifyExclusive) {
  switch (optInStatus) {
    case 'idle':
    case 'loading':
    case 'success':
      return isSpotifyExclusive
        ? 'Publish my show'
        : 'Yes, distribute my podcast';
    case 'error':
      return 'Retry';
  }
}

const DistributionPrompt = ({
  podcastImageFull,
  onAcceptDistribution,
  onDeclineDistribution,
  setDismissedDistributionMilestone,
  webStationId,
  userId,
  isSpotifyExclusive,
  isWordPressPublishedEpisode,
  isEPEnabled,
}) => {
  const [isOptedOut, setIsOptedOut] = useState(false);
  const [optInStatus, setOptInStatus] = useState('idle');
  const podcastStatusStopPollingRef = useRef(null);

  /**
   * if we're polling the podcast status, cancel the polling function if the
   * component unmounts
   */
  useEffect(() => {
    events.trackDistributionOptInPromptView();
    return () => {
      if (podcastStatusStopPollingRef.current) {
        podcastStatusStopPollingRef.current();
      }
    };
  }, []);

  useEffect(() => {
    if (isOptedOut) events.optedOutUserViewsDistributionModal();
  }, [isOptedOut]);

  useEffect(() => {
    if (userId) {
      AnchorAPI.fetchDistributionData({ currentUserId: userId }).then(res => {
        const { podcastCreationRequest } = res;
        setIsOptedOut(getIsOptedOutOfDistribution(podcastCreationRequest));
      });
    }
  }, [userId]);

  /**
   * if the episode is a WP episode that is being published, we want to wait
   * till distribution is active before showing them the confirmation. this is
   * to support the ability to show the user another modal that will allow them
   * to add a spotify link to their wordpress blog post
   *
   * otherwise, we can just continue to show the confirmation before distribution
   * is complete and active
   */
  async function handleOptInDistribution() {
    setOptInStatus('loading');
    try {
      if (isEPEnabled) {
        await AnchorAPI.requestSpotifyOnlyDistribution({
          stationId: webStationId,
        });
      } else {
        await AnchorAPI.publishPodcast();
      }
      if (isOptedOut) events.optsBackIntoDistribution();
      if (isWordPressPublishedEpisode) {
        const [responsePromise, stopPolling] = poll({
          fn: AnchorAPI.fetchPodcastStatus,
          validate: res => res.podcastStatus === 'active',
        });
        podcastStatusStopPollingRef.current = stopPolling;
        responsePromise.then(handleSuccess).catch(handleError);
      } else {
        handleSuccess();
      }
    } catch (err) {
      handleError();
    }
    function handleSuccess() {
      setOptInStatus('success');
      setDismissedDistributionMilestone();
      onAcceptDistribution();
    }
    function handleError() {
      setOptInStatus('error');
    }
  }

  return (
    <div
      className={css`
        text-align: center;
      `}
    >
      <div className={styles.distributeScreenTitle}>
        {isSpotifyExclusive
          ? 'Finish your show setup'
          : `Ready to distribute your podcast?`}
      </div>
      <div className={styles.distributeScreenSubTitle}>
        {isSpotifyExclusive
          ? 'This will publish your show to Spotify.'
          : `If you’d like, we can automatically submit your podcast for
        distribution to all major listening platforms (including Spotify and
        Apple Podcasts).`}
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
          margin-top: 10px;
          max-width: 320px;
          width: 100%;
        `}
        color="purple"
        type="button"
        isDisabled={optInStatus === 'loading'}
        onClick={handleOptInDistribution}
      >
        {getAcceptButtonText(optInStatus, isSpotifyExclusive)}
      </Button>
      {optInStatus === 'error' && (
        <ErrorMessage>
          Hm, something went wrong. Please try again or if the issue persists,
          reach out to us at{' '}
          <a
            href="https://help.anchor.fm"
            target="_blank"
            rel="noopener noreferrer"
          >
            help.anchor.fm
          </a>
          .
        </ErrorMessage>
      )}
      {!isSpotifyExclusive && (
        <button
          className={styles.declineDistributionLink}
          onClick={() => onDeclineDistribution({ webStationId })}
        >
          I&#39;ll do this myself (advanced)
        </button>
      )}
    </div>
  );
};

DistributionPrompt.propTypes = {
  podcastImageFull: PropTypes.string.isRequired,
  onAcceptDistribution: PropTypes.func.isRequired,
  onDeclineDistribution: PropTypes.func.isRequired,
};

export { DistributionPrompt };
