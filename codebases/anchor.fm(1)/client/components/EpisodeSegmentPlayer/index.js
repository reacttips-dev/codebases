import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { PLAYBACK_SPEEDS } from '../../localStorage';
import {
  appStoreLink,
  getEpisodeImage,
  playStoreLink,
} from '../../../helpers/serverRenderingUtils';
import StationProgressBarContainer from '../StationProgressBarContainer';
import PlayButton from '../PlayButton';
import AnchorPayLogo from '../svgs/AnchorPayLogo';
import SoundIndicator from '../SoundIndicator';
import WaitIndicator from '../WaitIndicator';
import EpisodeWaveAnimationContainer from '../EpisodeWaveAnimationContainer';
import OutboundLink from '../OutboundLink';
import ProgressIndicatorContainer from '../ProgressIndicatorContainer';
import {
  getSpotifyUrlFromAudio,
  getAppleMusicUrlFromAudio,
} from '../../station';
import {
  PODCAST_COLORS,
  formatDateSinceCreated,
  msToDigital,
} from '../../utils';
import styles from './styles.sass';
import { hexToRgba } from '../../modules/ColorUtils';
import { ShareIconWithHover } from './ShareIconWithHover';
import { TruncatedEpisodeTitle, TruncatedPodcastName } from './styles';
import { AnchorLogoWithWordmark } from '../svgs/AnchorLogoWithWordmark';
import { AnchorLogoWithoutWordmark } from '../svgs/AnchorLogoWithoutWordmark';

const IMG_PREFIX = 'https://d12xoj7p9moygp.cloudfront.net/images/';

const AUDIO_TYPES = {
  AD: 'ad',
  MUSIC: 'music',
  RECORDING: 'default',
  INTERLUDE: 'interlude',
};

const AnchorPayLogoWithHover = HoverWrappedComponent(
  AnchorPayLogo,
  { color: '#7F8287' },
  { color: '#292F36' }
);

class EpisodeSegmentPlayer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handlePlayOrPauseButtonClick = this.handlePlayOrPauseButtonClick.bind(
      this
    );
    this.handleAudioIndicatorButtonClick = this.handleAudioIndicatorButtonClick.bind(
      this
    );
    this.handlePlaybackSpeedButtonClick = this.handlePlaybackSpeedButtonClick.bind(
      this
    );
  }

  handleShareClick() {
    const { pause, startShare } = this.props;
    pause();
    startShare();
  }

  handlePlayOrPauseButtonClick(e) {
    e.preventDefault();
    const { isPlaying, playOrPause } = this.props;
    playOrPause(isPlaying ? 'Pause Button' : 'Play Button');
  }

  handleAudioIndicatorButtonClick(e) {
    e.preventDefault();
    const { playOrPause } = this.props;
    playOrPause('Volume Indicator');
  }

  handlePlaybackSpeedButtonClick(e) {
    e.preventDefault();
    const { setPlaybackSpeed, playbackSpeed } = this.props;
    setPlaybackSpeed(cyclePlaybackSpeed(playbackSpeed));
  }

  // 'anchored' elements are for the tablet and larger display
  // classes with the same name minus 'anchored' are for mobile-first
  render() {
    const {
      children,
      activeIndex,
      audios,
      countdown = 0,
      episode,
      episodeDuration,
      isEmbedded,
      isPlaying,
      playbackSpeed,
      playedDuration,
      podcastMetadata,
      shareUrl,
      stationDuration,
      stationId,
      stationName, // or podcast name
      supportUrl,
      episodeTitle,
      volumeData,
      profileColor,
      vanitySlug,
    } = this.props;
    const { podcastAuthorName } = podcastMetadata;
    return (
      <div className={getContainerClassName({ isEmbedded, isPlaying })}>
        <div className={styles.episodeImage}>
          <img
            alt="Currently playing episode"
            src={getEpisodeImage({ episode, podcastMetadata })}
          />
        </div>

        <PlayButton
          className={styles.playButton}
          colors={PODCAST_COLORS.WHITE}
          iconColors={PODCAST_COLORS.BLACK}
          isPlaying={isPlaying}
          onClick={this.handlePlayOrPauseButtonClick}
          shadow
          size={52}
          iconSize={23}
          ariaLabel="Play or pause audio"
          style={{
            visibility: playedDuration < stationDuration ? 'visible' : 'hidden',
          }}
        />
        <div className={styles.episodeContainerInner}>
          {audios[activeIndex] && (
            <EpisodeWaveAnimationContainer
              isEmbedded={isEmbedded}
              fgColor="rgba(125,125,125,0.1)"
              className={styles.waveform}
              volumeData={volumeData}
              isPlaying={isPlaying}
            />
          )}
          {audios.map((audio, index) => {
            // only render current, previous, next for transition purposes
            if (activeIndex !== -1) {
              if (index < activeIndex - 1) return '';
              if (index > activeIndex + 1) return '';
            }
            const { key } = audio;

            return (
              <div key={key} className={styles.segmentInfo}>
                <TruncatedEpisodeTitle>
                  {episodeTitle || 'Untitled'}
                </TruncatedEpisodeTitle>
                <TruncatedPodcastName>
                  {stationName}
                  <span className={styles.byLineStation}>
                    <span> &bull; </span>
                    <EmbeddableLink
                      className={styles.stationLink}
                      to={shareUrl}
                      isEmbedded={isEmbedded}
                    >
                      By {podcastAuthorName}
                    </EmbeddableLink>
                  </span>
                  <span className={styles.byLinePublishOn}>
                    <span> &bull; </span>
                    {formatDateSinceCreated(episode.publishOn, true)}
                  </span>
                </TruncatedPodcastName>
                <div className={styles.anchoredActions}>
                  {isEmbedded && supportUrl && (
                    <OutboundLink to={supportUrl} newWindow>
                      <Button
                        className={`${styles.shareAudioButton} ${styles.supportButton}`}
                        bsSize="sm"
                      >
                        <AnchorPayLogoWithHover height={12} width={14} />
                        <span>Support</span>
                      </Button>
                    </OutboundLink>
                  )}
                  {shareAudioButton(audio, this.handleShareClick)}
                </div>
              </div>
            );
          })}
          <div
            className={`${styles.segmentInfo} ${styles.segmentLoading}`}
            style={{
              left: activeIndex !== -1 ? '100%' : 0,
              display: activeIndex > 0 ? 'table' : 'none',
            }}
          >
            <div className={styles.segmentLoadingCentered}>
              {children ||
                (stationId !== null && audios.length === 0
                  ? emptyStationElement()
                  : playbackFinishedCountDownElement())}
            </div>
          </div>
          <div className={styles.episodeMetadata}>
            <div className={styles.episodePlaybackPosition}>
              <ProgressIndicatorContainer playedPosition={playedDuration} />
            </div>
            <div className={styles.episodeDuration}>
              {msToDigital(episodeDuration || 0)}
            </div>
          </div>
          <div className={styles.controls} data-cy="playerControls">
            <div className={styles.controlsWhilePlaying}>
              <PlayButton
                className={styles.playButton}
                iconColors={PODCAST_COLORS.WHITE}
                colors={PODCAST_COLORS.GRAY}
                isPlaying={isPlaying}
                onClick={this.handlePlayOrPauseButtonClick}
                shadow
                size={35}
                iconSize={15}
                ariaLabel="Play or pause"
                style={{
                  visibility:
                    playedDuration < stationDuration ? 'visible' : 'hidden',
                }}
              />
            </div>
          </div>
          <div
            style={{
              visibility:
                playedDuration < stationDuration ? 'visible' : 'hidden',
            }}
            className={styles.playbackSpeedIndicator}
            onClick={this.handlePlaybackSpeedButtonClick}
          >
            {playbackSpeed}x
          </div>
          {isEmbedded ? (
            <AnchorLogo vanitySlug={vanitySlug} />
          ) : (
            <SoundIndicator
              fgColor="#7F8287"
              style={{
                visibility:
                  playedDuration < stationDuration ? 'visible' : 'hidden',
              }}
              className={styles.soundIndicator}
              isPlaying={isPlaying}
              onClick={this.handleAudioIndicatorButtonClick}
              barHeight={3.5}
              barWidth={2}
            />
          )}
          <StationProgressBarContainer
            className={styles.progressBar}
            min={0}
            max={stationDuration}
            playedPosition={playedDuration}
            remainingPosition={episodeDuration}
            remainingColor={hexToRgba(profileColor, 0.2)}
            bgColor={hexToRgba(profileColor, 0.2)}
            playingColor={profileColor}
            playedColor={profileColor}
            size={7}
          />
        </div>
      </div>
    );

    function emptyStationElement() {
      return (
        <div className={styles.emptyStation}>
          <p>This station is currently off-air.</p>
          {!isEmbedded && (
            <p
              style={{
                visibility: countdown !== 0 ? 'visible' : 'hidden',
              }}
            >
              {countdown !== null && countdown !== 0
                ? `Playing you a similar station in ${countdown}…`
                : 'Loading…'}
            </p>
          )}
          {isEmbedded && (
            <p>
              If you’d like to be notified the next time it updates, download
              the Anchor app for{' '}
              <OutboundLink to={appStoreLink()} newWindow>
                iOS
              </OutboundLink>{' '}
              or{' '}
              <OutboundLink to={playStoreLink()} newWindow>
                Android
              </OutboundLink>
              .
            </p>
          )}
        </div>
      );
    }

    function playbackFinishedCountDownElement() {
      return (
        <span>
          <WaitIndicator className={styles.segmentLoadingSpinner} />
          {countdown !== null && countdown !== 0
            ? `Starting in ${countdown}…`
            : 'Loading…'}
        </span>
      );
    }

    function shareAudioButton(audio = {}, handleShareClick) {
      const { audioType, audioUrl } = audio;
      const isSpotify = AUDIO_TYPES.MUSIC === audioType;
      const isApplePreview = audioUrl.indexOf('apple.com') !== -1;
      if (isSpotify) {
        return isApplePreview ? (
          <OutboundLink
            className={`${styles.shareAudioButton} ${styles.appleLink}`}
            newWindow
            to={getAppleMusicUrlFromAudio(audio)}
          >
            <Button bsSize="sm">
              <img
                alt="Apple Music"
                src={`${IMG_PREFIX}apple-logo-white-mobile.png`}
                srcSet={`${IMG_PREFIX}apple-logo-white-mobile.png 1x, ${IMG_PREFIX}apple-logo-white-mobile@2x.png 2x`}
                width={6.4}
                height={8}
              />
              <span>Listen on Apple Music</span>
            </Button>
          </OutboundLink>
        ) : (
          <OutboundLink
            className={`${styles.shareAudioButton} ${styles.spotifyLink}`}
            newWindow
            to={getSpotifyUrlFromAudio(audio)}
          >
            <Button bsSize="sm">
              <img
                alt="Spotify logo"
                src={`${IMG_PREFIX}Spotify_Logo_CMYK_White.png`}
                srcSet={`${IMG_PREFIX}Spotify_Logo_CMYK_White.png 1x, ${IMG_PREFIX}Spotify_Logo_CMYK_White@2x.png 2x`}
                width={8}
                height={8}
              />
              <span>Listen on Spotify</span>
            </Button>
          </OutboundLink>
        );
      }
      return (
        <Button
          className={styles.shareAudioButton}
          bsSize="sm"
          onClick={handleShareClick}
        >
          <ShareIconWithHover height={12} width={11} />
          <span>Share</span>
        </Button>
      );
    }
  }
}

EpisodeSegmentPlayer.defaultProps = {
  profileColor: '#5000b9',
};

export default EpisodeSegmentPlayer;

function cyclePlaybackSpeed(currentSpeed) {
  const speedKeys = Object.keys(PLAYBACK_SPEEDS);
  for (let i = 0; i < speedKeys.length; i++) {
    if (PLAYBACK_SPEEDS[speedKeys[i]] === currentSpeed) {
      return PLAYBACK_SPEEDS[speedKeys[i + 1]] || PLAYBACK_SPEEDS[speedKeys[0]];
    }
  }
  return PLAYBACK_SPEEDS.NORMAL;
}

export function AnchorLogo({ vanitySlug }) {
  const url = `https://anchor.fm/${vanitySlug || ''}`;
  return (
    <OutboundLink className={styles.anchorLogo} to={url} newWindow>
      <span className={styles.anchorLogoMobile}>
        <AnchorLogoWithoutWordmark fillColor="#7f8287" width="15" />
      </span>
      <span className={styles.anchorLogoDesktop}>
        <AnchorLogoWithWordmark fillColor="#7f8287" width="70" />
      </span>
    </OutboundLink>
  );
}

function EmbeddableLink(props) {
  const { children, isEmbedded } = props;
  const linkProps = { ...props };
  if (isEmbedded) {
    linkProps.newWindow = true;
  }
  return <OutboundLink {...linkProps}>{children}</OutboundLink>;
}

function HoverWrappedComponent(
  RenderComponent,
  defaultOverrideProps = {},
  hoverOverrideProps = {}
) {
  return props => {
    const defaultProps = { ...props, ...defaultOverrideProps };
    const hoverProps = { ...props, ...hoverOverrideProps };
    const { className } = props;
    return (
      <div className={`${className || ''} ${styles.hoverWrappedComponent}`}>
        <RenderComponent
          {...defaultProps}
          className={styles.hoverWrappedComponentDefault}
        />
        <RenderComponent
          {...hoverProps}
          className={styles.hoverWrappedComponentHover}
        />
      </div>
    );
  };
}

function getContainerClassName({ isEmbedded, isPlaying }) {
  let className = styles.episodeContainer;
  if (isEmbedded) {
    className = `${className} ${styles.episodeContainerIsEmbedded}`;
  }
  if (isPlaying) {
    className = `${className} ${styles.episodeContainerIsPlaying}`;
  }
  return className;
}
