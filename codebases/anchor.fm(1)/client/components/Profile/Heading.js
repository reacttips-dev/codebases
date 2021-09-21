import React, { useEffect, useState, useRef } from 'react';
import TextTruncate from 'react-text-truncate';

import makeCaptionWithLinks from '../../makeCaptionWithLinks';

import styles from './styles.sass';
import { PlayTrailer } from './components/PlayTrailer/index.tsx';
import { SupportButton } from './components/SupportButton/index.tsx';
import { VoiceMessageButton } from './components/VoiceMessageButton/index.tsx';
import { ListenOnSpotifyButton } from './components/ListenOnSpotifyButton/index.tsx';
import { SelfVoicemailModalError } from './components/SelfVoicemailModalError/index.tsx';
import { Box } from '../../shared/Box/index.tsx';
import { hexToRgba } from '../../modules/ColorUtils';
import { useElementBoundingRect } from '../../hooks/useElementBoundingRect.ts';
import { PaywallsSubscribeButton } from './components/PaywallsSubscribeButton';

const dynamicFontSizeInRem = (str, isMobile) => {
  if (str.length <= 25) {
    return isMobile ? 3.6 : 4.5;
  }
  if (str.length > 25 && str.length <= 50) {
    return isMobile ? 3.2 : 4.0;
  }
  return isMobile ? 2.4 : 3.6;
};

export function Heading({
  creator,
  podcastMetadata,
  stationName,
  stationDescription,
  doShowSupportButton,
  supportButtonText,
  onPressSendVoiceMessage,
  isShowingVoiceMessageButton,
  isOwnPodcast,
  hasEpisodes,
  podcastUrlDictionary,
  onPressListenOnSpotify,
  profileColor,
  onClickShowSupportersButton,
  trailerDuration,
  trailerPlaybackPosition,
  trailerUrl,
  handleSetTrailerDuration,
  handleSetTrailerPlaybackPosition,
  isMobile,
  isShowPaywallsSubscribeButton,
}) {
  const descriptionWrapperRef = useRef(null);
  const descriptionWrapperRect = useElementBoundingRect(
    descriptionWrapperRef.current
  );
  const descriptionHeight = descriptionWrapperRect
    ? descriptionWrapperRect.height
    : 0;
  const [
    isShowingSelfVoicemailModalError,
    setIsShowingSelfVoicemailModalError,
  ] = useState(false);
  const [isMobileMediaQuery, setIsMobileMediaQuery] = useState(false);

  const toggleSelfVoicemailModalError = () => {
    setIsShowingSelfVoicemailModalError(!isShowingSelfVoicemailModalError);
  };

  useEffect(() => {
    const setMediaQuery = () => {
      setIsMobileMediaQuery(window.matchMedia('(max-width: 990px)').matches);
    };
    setMediaQuery();
    window.addEventListener('resize', setMediaQuery);
    return () => window.removeEventListener('resize', setMediaQuery);
  }, []);

  const progressBarPercents = getProgressBarPercents({
    trailerPlaybackPosition,
    trailerDuration,
  });
  const { progressColor, remainingColor } = getProgressBarColors(
    isMobile,
    profileColor
  );
  const fontSizeRem = dynamicFontSizeInRem(
    stationName || '',
    isMobileMediaQuery
  );
  const fontWeight = fontSizeRem >= 3.6 ? 800 : 'bold';
  return (
    <div className={styles.podcastHeading} data-cy="profileHeader">
      <div className={styles.podcastImageWrapper}>
        {hasEpisodes && podcastMetadata.podcastImage ? (
          <img
            onDragStart={evt => {
              evt.preventDefault();
            }}
            alt={podcastMetadata.podcastName}
            className={styles.podcastImage}
            src={podcastMetadata.podcastImage}
          />
        ) : (
          <div className={styles.placeholderPodcastArt}>
            <img
              className={styles.podcastImage}
              alt="Podcast unavailable placeholder"
              src="https://d12xoj7p9moygp.cloudfront.net/images/profile/cover_placeholder.png"
            />
          </div>
        )}
        <div className={styles.progressBarWrapper}>
          {progressBarPercents && (
            <svg width="100%" height="6">
              <rect
                x="0"
                y="0"
                height="100%"
                width="100%"
                fill={remainingColor}
              />
              <rect
                x="0"
                y="0"
                height="100%"
                width={`${progressBarPercents.playedPercent}%`}
                fill={progressColor}
              />
            </svg>
          )}
        </div>
      </div>

      <div className={styles.headerContentContainer}>
        {stationName && (
          <div className={styles.podcastNameContainer}>
            <h1
              className={styles.stationName}
              style={{
                fontWeight,
                fontSize: `${fontSizeRem}rem`,
              }}
            >
              {hasEpisodes ? stationName : 'Podcast Unavailable'}
            </h1>
          </div>
        )}
        {podcastMetadata.podcastName && (
          <div className={styles.podcastCreatorContainer}>
            <div className={styles.podcastCreator}>
              <div className={styles.stationCreator}>
                <div className={styles.stationCreatorName}>
                  <TextTruncate
                    line={1}
                    truncateText="…"
                    text={`By ${creator.name}`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.podcastInfoContainer}>
          {isMobile && hasEpisodes && (
            <PlayTrailer
              isMobile
              trailerUrl={trailerUrl}
              onLoadedData={handleSetTrailerDuration}
              onPlayback={handleSetTrailerPlaybackPosition}
              profileColor={profileColor}
            />
          )}
          {!isMobile && (
            <React.Fragment>
              {hasEpisodes && stationDescription && (
                <Box position="relative">
                  <div ref={descriptionWrapperRef}>
                    <div className={styles.scrollableDescription}>
                      {makeCaptionWithLinks(stationDescription)}
                    </div>
                    {descriptionHeight >= 128 && (
                      <React.Fragment>
                        <Box
                          position="absolute"
                          top
                          left
                          width="calc(100% - 4px)"
                          height={20}
                          dangerouslySetInlineStyle={{
                            background: `linear-gradient(to bottom, ${profileColor}, ${hexToRgba(
                              profileColor,
                              0.2
                            )})`,
                          }}
                        />
                        <Box
                          position="absolute"
                          bottom
                          left
                          width="calc(100% - 4px)"
                          height={20}
                          dangerouslySetInlineStyle={{
                            background: `linear-gradient(to top, ${profileColor}, ${hexToRgba(
                              profileColor,
                              0.2
                            )})`,
                          }}
                        />
                      </React.Fragment>
                    )}
                  </div>
                </Box>
              )}
              {hasEpisodes && (
                <div className={styles.buttonsSection}>
                  {podcastUrlDictionary.spotify && (
                    <ListenOnSpotifyButton
                      spotifyUrl={podcastUrlDictionary.spotify}
                      onPressListenOnSpotify={onPressListenOnSpotify}
                    />
                  )}
                  {doShowSupportButton && (
                    <SupportButton
                      showSupportersModal={onClickShowSupportersButton}
                      supportButtonText={supportButtonText}
                    />
                  )}
                  {isShowPaywallsSubscribeButton && <PaywallsSubscribeButton />}
                  {isShowingVoiceMessageButton && (
                    <VoiceMessageButton
                      isPublicCallinHiddenFromWeb={!isShowingVoiceMessageButton}
                      isOwnPodcast={isOwnPodcast}
                      onPressSendVoiceMessage={onPressSendVoiceMessage}
                      toggleSelfVoicemailModal={toggleSelfVoicemailModalError}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      {isShowingSelfVoicemailModalError && (
        <SelfVoicemailModalError
          toggleSelfVoicemailModalError={toggleSelfVoicemailModalError}
        />
      )}
    </div>
  );
}

function getProgressBarColors(isMobile, profileColor) {
  return isMobile
    ? {
        progressColor: 'rgba(255, 255, 255, 0.8)',
        remainingColor: 'rgba(255, 255, 255, 0.2)',
      }
    : { progressColor: profileColor, remainingColor: '#C9CBCD' };
}

function getProgressBarPercents({ trailerPlaybackPosition, trailerDuration }) {
  if (trailerPlaybackPosition && trailerDuration) {
    const playedPercent = (trailerPlaybackPosition / trailerDuration) * 100;
    const remainingPercent = 100 - playedPercent;
    return {
      playedPercent,
      remainingPercent,
    };
  }
  return null;
}
