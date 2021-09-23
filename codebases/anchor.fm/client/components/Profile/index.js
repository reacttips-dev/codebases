import React, { Component, useEffect } from 'react';

import classNames from 'classnames';
import {
  appStoreLink,
  assignKey,
  playStoreLink,
  nextFrame,
} from '../../../helpers/serverRenderingUtils';
import AudioPlayerContainer from '../AudioPlayerContainer';
import EpisodeSegmentPlayerMobile from '../EpisodeSegmentPlayer/mobile';
import { Footer } from '../Footer';
import { Heading } from './Heading';
import EpisodesListMobile from './EpisodesListMobile';
import { EpisodesListDesktop } from './EpisodesListDesktop';
import MobileThirdPartyListeningAppsModal from './MobileThirdPartyListeningAppsModal';
import EpisodeFeedItemMobile from './EpisodeFeedItemMobile';
import CurrentEpisodeFeedItemMobile from './CurrentEpisodeFeedItemMobile';
import BecomeASupporterModal from './components/BecomeASupporterModal';

import styles from './styles.sass';
import { ListeningPlatforms } from './components/ListeningPlatforms/ListeningPlatforms';
import { ShareableEpisodeSegmentPlayer } from './ShareableEpisodeSegmentPlayer';
import { CreatorSocialLinks } from './components/CreatorSocialLinks';
import ButtonWithHoverAndPress from '../../shared/Button/ButtonWithHoverAndPress';
import { PlayTrailer } from './components/PlayTrailer';
import makeCaptionWithLinks from '../../makeCaptionWithLinks';
import { SupportButton } from './components/SupportButton';
import { VoiceMessageButton } from './components/VoiceMessageButton';
import { ListenOnSpotifyButton } from './components/ListenOnSpotifyButton';
import { getRandomizedVolumeData } from '../../utils';
import { PaywallsSubscribeButton } from './components/PaywallsSubscribeButton';
import { ProfilePaywallsModal } from '../ProfilePaywalls/components/ProfilePaywallsModal';

const ActiveAudio = ({
  audios,
  activeIndex,
  isPlaying,
  onPlayOrPause,
  onEnded,
  onPlaybackStarted,
  onError,
  episodeEnclosureUrl,
}) => {
  const activeAudioWithReuse = {
    ...(audios[activeIndex] || {}),
    // ensures a key change in props does
    // not cause a remount
    key: 'activeAudio',
  };
  return (
    <AudioPlayerContainer
      {...activeAudioWithReuse}
      episodeEnclosureUrl={episodeEnclosureUrl}
      isActive
      doPreload={false}
      onEnded={onEnded}
      onPlayOrPause={onPlayOrPause}
      onPlaybackStarted={onPlaybackStarted}
      isPlaying={isPlaying}
      onError={onError}
    />
  );
};

class ProfileClassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPodcastLinksModal: false,
      isClient: false,
      supportButtonText: 'Support',
      isShowingSelfVoicemailModalError: false,
      trailerDuration: null,
      trailerPlaybackPosition: null,
    };
  }

  componentDidMount() {
    const {
      actions: { fetchStatus, fetchSocialUrls, receiveVolumeData },
      user,
      station: { stationId },
    } = this.props;
    assignKey('space', this.playOrPauseWithDelay);
    if (user.user) {
      fetchStatus();
    }
    if (stationId && fetchSocialUrls) {
      fetchSocialUrls(stationId);
    }
    this.setState(prev => ({ isClient: true }));
    receiveVolumeData(getRandomizedVolumeData(8, 0.2));
  }

  componentWillUnmount() {
    const {
      actions: { setProfileColor },
    } = this.props;
    // set the nav back to the original nav color when leaving profile
    setProfileColor('24203F');
    assignKey.unbind('space', this.playOrPauseWithDelay);
  }

  handleClickEpisode = episode => evt => {
    if (this.props.station.episodeId === episode.episodeId) {
      // prevent link, play/pause audio
      evt.preventDefault();
      evt.stopPropagation();
      if (!episode.isMT && !episode.isPW) {
        this.props.actions.playOrPause();
      }
    }
  };

  handleClickEpisodeWithEpisodeMobile = episode => evt => {
    const { isPlaying } = this.props.station;
    if (this.props.station.episodeId === episode.episodeId) {
      // prevent link, play/pause audio
      evt.preventDefault();
      evt.stopPropagation();
    }
    if (isPlaying && !episode.isMT && !episode.isPW) {
      this.props.actions.pause();
    }
  };

  showPodcastLinksModal = () => {
    const params = {
      eventCategory: 'Page',
      eventAction: 'Click',
      eventLabel: 'Podcast Links Modal Button',
    };
    ga('send', 'event', params);
    this.setState(prev => ({ showPodcastLinksModal: true }));
  };

  hidePodcastLinksModal = () => {
    const params = {
      eventCategory: 'Page',
      eventAction: 'Click',
      eventLabel: 'Dismiss Podcast Links Modal',
    };
    ga('send', 'event', params);
    this.setState(prev => ({ showPodcastLinksModal: false }));
  };

  handleAudioEnded = (e, target) => {
    e.preventDefault();
    const { actions, isEmbedded } = this.props;
    actions.endAudio(target);
    if (isEmbedded) {
      actions.replayEpisodeAndPause();
      return;
    }
    actions.playNextEpisodeOrReplayAndPause();
    nextFrame(() => {
      actions.playOrPause(target);
    });
  };

  handleSetTrailerDuration = audioElement => {
    this.setState({
      trailerDuration: audioElement.duration,
    });
  };

  handleSetTrailerPlaybackPosition = playbackPosition => {
    this.setState({
      trailerPlaybackPosition: playbackPosition,
    });
  };

  toggleSelfVoicemailModal = () =>
    this.setState({
      isShowingSelfVoicemailModalError: !this.state
        .isShowingSelfVoicemailModalError,
    });

  playOrPauseWithDelay() {
    const { playOrPause } = this.props.actions;
    nextFrame(() => {
      playOrPause();
    });
  }

  render() {
    const { trailerDuration, trailerPlaybackPosition } = this.state;
    const {
      actions,
      doShowPlayer,
      episodePlayIconSize,
      maxEpisodeDescriptionLines,
      maxEpisodeNameLines,
      shareUrl,
      isEmbedded,
      isIOS,
      isAndroidChrome,
      openInAppUrl,
      playingPosition,
      mediaType,
      becomeASupporterScene,
      isShowingSupportersModal,
      isShowingProfilePaywallsModal,
      isPaymentProcessing,
      orderConfirmation,
      referringPlatform,
      user,
      profileColor,
      episodePreview,
      station,
      episodePreview: { creator, episodes, episodeEnclosureUrl },
      playbackSpeed,
      episodeShareUrl,
      shareEmbedHtml,
      onClickShare,
      onClickCopyUrl,
      trailerUrl,
      userSocialUrls,
      browserWidth,
      chosenProductId,
    } = this.props;
    const { referralCode, stationId: userStationId } = user;
    const {
      isPlaying,
      audios,
      activeIndex,
      activeAudioDuration,
      playedDuration,
      podcastMetadata,
      stationDuration,
      podcastUrlDictionary,
      stationId,
      episodeId,
      podcastMetadata: { isPublicCallinHiddenFromWeb },
    } = station;
    const currentEpisode = episodes.find(e => episodeId === e.episodeId);
    const stationName = podcastMetadata.podcastName || creator.name;
    const stationDescription =
      podcastMetadata.podcastDescription || creator.bio;
    const listenOnAnchorUrl = isIOS
      ? appStoreLink()
      : isAndroidChrome
      ? playStoreLink()
      : 'https://anch.co/get_anchor';
    const isMobile = this.state.isClient ? browserWidth <= 768 : false;
    const isIOSAndroidChrome = isIOS || isAndroidChrome;
    const isTabletLandscape = isIOSAndroidChrome && !isMobile;
    const hasEpisodes = (episodes && episodes.length > 0) || trailerUrl;
    const stationPaywall = podcastMetadata.stationPaywall || {};
    const isShowPaywalls =
      stationPaywall.isSubscriptionEnabled && !stationPaywall.disableOn;

    if (isEmbedded) {
      return (
        <React.Fragment>
          <ActiveAudio
            audios={audios}
            episodeEnclosureUrl={episodeEnclosureUrl}
            activeIndex={activeIndex}
            isPlaying={isPlaying}
            onPlayOrPause={actions.playOrPause}
            onEnded={this.handleAudioEnded}
            onPlaybackStarted={actions.playbackStarted}
            onError={actions.pause}
          />
          <ShareableEpisodeSegmentPlayer
            handleAudioEnded={this.handleAudioEnded}
            station={station}
            episodePreview={episodePreview}
            actions={actions}
            playbackSpeed={playbackSpeed}
            episodeShareUrl={episodeShareUrl}
            shareUrl={shareUrl}
            shareEmbedHtml={shareEmbedHtml}
            isEmbedded={isEmbedded}
            onClickShare={onClickShare}
            onClickCopyUrl={onClickCopyUrl}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {isShowingProfilePaywallsModal && isShowPaywalls && (
          <ProfilePaywallsModal
            onClose={() => actions.hideProfilePaywallsModal()}
            webStationId={stationId}
            podcastMetadata={podcastMetadata}
          />
        )}
        <ActiveAudio
          audios={audios}
          activeIndex={activeIndex}
          episodeEnclosureUrl={episodeEnclosureUrl}
          isPlaying={isPlaying}
          onPlayOrPause={actions.playOrPause}
          onEnded={this.handleAudioEnded}
          onPlaybackStarted={actions.playbackStarted}
          onError={actions.pause}
        />
        <div
          className={classNames(styles.profileContainer, {
            [styles.profileContainerNoUser]: !user || !user.user,
          })}
          style={isMobile ? { backgroundColor: profileColor } : {}}
        >
          <div
            className={styles.headingWrapper}
            style={{
              backgroundColor: profileColor,
              paddingTop: isTabletLandscape ? '32px' : '',
            }}
          >
            <div className={styles.headingContainer}>
              <Heading
                isMobile={isMobile}
                profileColor={profileColor}
                isOwnPodcast={userStationId === stationId}
                onPressSendVoiceMessage={actions.onPressSendVoiceMessage}
                podcastMetadata={podcastMetadata}
                creator={creator}
                stationName={stationName}
                stationDescription={stationDescription}
                podcastUrlDictionary={podcastUrlDictionary}
                isClient={this.state.isClient}
                doShowSupportButton={podcastMetadata.hasSupportersEnabled}
                onClickShowSupportersButton={actions.showSupportersModal}
                supportButtonText={this.state.supportButtonText}
                trackListenerSupportEvent={actions.trackListenerSupportEvent}
                isShowingVoiceMessageButton={!isPublicCallinHiddenFromWeb}
                hasEpisodes={hasEpisodes}
                onPressListenOnSpotify={
                  this.props.actions.onPressListenOnSpotify
                }
                trailerDuration={trailerDuration}
                trailerPlaybackPosition={trailerPlaybackPosition}
                trailerUrl={trailerUrl}
                handleSetTrailerDuration={this.handleSetTrailerDuration}
                handleSetTrailerPlaybackPosition={
                  this.handleSetTrailerPlaybackPosition
                }
                toggleSelfVoicemailModal={this.toggleSelfVoicemailModal}
                isShowPaywallsSubscribeButton={isShowPaywalls}
              />
              {!isMobile && (
                <div className={styles.socialWrapper}>
                  <div
                    className={styles.trailerSocialConnections}
                    data-cy="trailerContainer"
                  >
                    <PlayTrailer
                      isMobile={isMobile}
                      trailerUrl={trailerUrl}
                      onLoadedData={this.handleSetTrailerDuration}
                      onPlayback={this.handleSetTrailerPlaybackPosition}
                      profileColor={profileColor}
                    />
                    <CreatorSocialLinks
                      creatorUrl={creator.url}
                      socialUrls={userSocialUrls}
                    />
                  </div>
                  {Object.keys(podcastUrlDictionary).length > 1 && (
                    <ListeningPlatforms
                      className={styles.podcastLinksModal}
                      isMobile={isMobile}
                      podcastUrlDictionary={podcastUrlDictionary}
                      stationId={stationId}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          {isMobile && hasEpisodes && (
            <React.Fragment>
              <div className={styles.mobileMetadata}>
                <div className={styles.buttonsSection}>
                  {podcastUrlDictionary.spotify && (
                    <ListenOnSpotifyButton
                      spotifyUrl={podcastUrlDictionary.spotify}
                      onPressListenOnSpotify={
                        this.props.actions.onPressListenOnSpotify
                      }
                    />
                  )}
                  <div className={styles.mobileExternalPlatformsContainer}>
                    <ButtonWithHoverAndPress
                      isDisabled={false}
                      shape="rounded"
                      type="outlined"
                      colorTheme="white"
                      text={
                        podcastUrlDictionary.spotify
                          ? 'More platforms'
                          : 'Where to listen'
                      }
                      size="xs"
                      height={46}
                      isFullWidth
                      onPress={this.showPodcastLinksModal}
                    />
                  </div>
                </div>
              </div>
              <div
                className={classNames(
                  styles.mobileMetadata,
                  styles.description
                )}
              >
                {hasEpisodes &&
                  stationDescription &&
                  makeCaptionWithLinks(stationDescription)}
              </div>
              <div className={styles.socialLinksContainer}>
                <CreatorSocialLinks
                  creatorUrl={creator.url}
                  socialUrls={userSocialUrls}
                />
              </div>
              <div className={styles.mobileMetadata}>
                <div
                  className={classNames(
                    styles.buttonsSection,
                    styles.bottomButtons
                  )}
                >
                  {podcastMetadata.hasSupportersEnabled && (
                    <SupportButton
                      showSupportersModal={actions.showSupportersModal}
                      supportButtonText={this.state.supportButtonText}
                    />
                  )}
                  {isShowPaywalls && <PaywallsSubscribeButton />}
                  {!isPublicCallinHiddenFromWeb && (
                    <VoiceMessageButton
                      isPublicCallinHiddenFromWeb={isPublicCallinHiddenFromWeb}
                      isOwnPodcast={stationId === userStationId}
                      onPressSendVoiceMessage={actions.onPressSendVoiceMessage}
                      toggleSelfVoicemailModal={this.toggleSelfVoicemailModal}
                    />
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
          {!isMobile && !hasEpisodes && (
            <div className={styles.episodeListEmptyStateContainer}>
              <div className={styles.episodeListEmptyState}>
                The podcast you're looking for doesn't have any content yet.
              </div>
            </div>
          )}
          {isMobile && (
            <div className={styles.mobileWaveContainer}>
              {episodes && episodes.length > 0 ? (
                <div className={styles.playerAndEpisodesContainer}>
                  {this.state.isClient && (
                    <div className={styles.episodesListMobileContainer}>
                      <EpisodesListMobile
                        episodes={episodes}
                        currentEpisode={currentEpisode}
                        shouldShowPlayer={doShowPlayer}
                        episodeId={episodeId}
                        renderItem={episode => (
                          <EpisodeFeedItemMobile
                            key={episode.episodeId}
                            episode={episode}
                            isActiveEpisode={episode.episodeId === episodeId}
                            onClick={this.handleClickEpisodeWithEpisodeMobile(
                              episode
                            ).bind(this)}
                          />
                        )}
                        renderCurrentItem={episode => (
                          <div className={styles.episodeSegmentPlayerMobile}>
                            <EpisodeSegmentPlayerMobile
                              isPlaying={isPlaying}
                              onPlayOrPause={actions.playOrPause}
                              playerRender={handlePlayOrPause => (
                                <CurrentEpisodeFeedItemMobile
                                  episode={episode}
                                  profileColor={profileColor}
                                  onClickPlayButton={handlePlayOrPause}
                                  isPlaying={isPlaying}
                                  playingPosition={playingPosition}
                                  stationDuration={stationDuration}
                                  playedPosition={playedDuration}
                                  remainingPosition={activeAudioDuration}
                                />
                              )}
                            />
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.episodeListEmptyStateContainer}>
                  <div className={styles.episodeListEmptyState}>
                    The podcast you're looking for doesn't have any content yet.
                  </div>
                </div>
              )}
            </div>
          )}
          {!isMobile && (
            <div className={styles.playerAndEpisodesContainer}>
              {currentEpisode && doShowPlayer && (
                <div className={styles.segmentContainer}>
                  <ShareableEpisodeSegmentPlayer
                    handleAudioEnded={this.handleAudioEnded}
                    station={station}
                    episodePreview={episodePreview}
                    actions={actions}
                    playbackSpeed={playbackSpeed}
                    episodeShareUrl={episodeShareUrl}
                    shareUrl={shareUrl}
                    shareEmbedHtml={shareEmbedHtml}
                    isEmbedded={isEmbedded}
                    onClickShare={onClickShare}
                    onClickCopyUrl={onClickCopyUrl}
                    profileColor={profileColor}
                  />
                </div>
              )}
              <EpisodesListDesktop
                episodes={episodes}
                activeEpisodeId={episodeId}
                isPlaying={isPlaying}
                playIconSize={episodePlayIconSize}
                maxEpisodeDescriptionLines={maxEpisodeDescriptionLines}
                maxEpisodeNameLines={maxEpisodeNameLines}
                podcastMetadata={podcastMetadata}
                handleClickEpisode={this.handleClickEpisode}
              />
            </div>
          )}
        </div>

        <Footer key="profileFooter" />

        <MobileThirdPartyListeningAppsModal
          isShowing={this.state.showPodcastLinksModal}
          onHide={this.hidePodcastLinksModal}
          className={styles.podcastLinksModal}
          podcastUrlDictionary={podcastUrlDictionary}
          listenOnAnchorUrl={listenOnAnchorUrl}
          isIOS={isIOS}
          isAndroidChrome={isAndroidChrome}
          referralCode={referralCode}
          openInAppUrl={openInAppUrl}
          stationId={stationId}
        />
        <BecomeASupporterModal
          chosenProductId={chosenProductId}
          isPaymentProcessing={isPaymentProcessing}
          hasMobileStyling={mediaType === 'extraSmall' || mediaType === 'small'}
          onHideModal={actions.onHideSupportersModal}
          isShowing={isShowingSupportersModal}
          scene={becomeASupporterScene}
          podcastName={podcastMetadata.podcastName || creator.name}
          podcastImageUrl={podcastMetadata.podcastImage}
          orderConfirmation={orderConfirmation}
          podcastAuthor={creator.name}
          isPreCheckoutMessageFromCreator={
            !!podcastMetadata.listenerSupportCustomMessage
          }
          preCheckoutMessage={
            podcastMetadata.listenerSupportCustomMessage || (
              <div>
                Support this podcast with a small monthly donation&nbsp;to help
                sustain future episodes.
              </div>
            )
          }
          onSubmitSupport={(
            {
              email,
              methodName = null, // options
              name,
              perMonthSupportOption,
              token, // optional
            },
            metadata
          ) =>
            actions
              .onSubmitSupport(
                {
                  email,
                  methodName, // optional
                  name,
                  perMonthSupportOptionId: perMonthSupportOption.id,
                  referringPlatform,
                  stationId,
                  token,
                },
                metadata
              )
              .then(() => {
                // UI tweaks
                window.scrollTo(0, 0);
                this.setState(() => ({
                  supportButtonText: 'You’re a supporter!',
                }));
              })
          }
          onSelectPerMonthSupportOptionsChoice={
            actions.onSelectPerMonthSupportOptionsChoice
          }
          shareUrl={`${shareUrl}/support`}
          trackListenerSupportEvent={actions.trackListenerSupportEvent}
          isAndroidChrome={isAndroidChrome}
          isIOS={isIOS}
        />
      </React.Fragment>
    );
  }
}

function Profile(props) {
  const {
    actions: { setProfileColor },
    station: { podcastMetadata, trailerUrl },
    episodePreview: { episodes },
  } = props;

  useEffect(() => {
    if ((!episodes || episodes.length === 0) && !trailerUrl) {
      setProfileColor('24203F');
    } else if (Object.keys(podcastMetadata).length) {
      setProfileColor(
        podcastMetadata.profileHeaderColor ||
          podcastMetadata.defaultProfileHeaderColor ||
          '24203F'
      );
    }
  }, [setProfileColor, podcastMetadata, episodes, trailerUrl]);
  return <ProfileClassComponent {...props} />;
}

export { Profile };
