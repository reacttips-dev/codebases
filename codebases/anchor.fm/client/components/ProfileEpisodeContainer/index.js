import Promise from 'bluebird';
import { push } from 'react-router-redux';
import queryString from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { VoiceMessageCreationModalScreenContainer } from '../../screens/VoiceMessageCreationModalScreen';
import { trackEvent } from '../../modules/analytics';
import {
  isIOS,
  isAndroidChrome,
  getOpenInAppUrl,
} from '../../../helpers/serverRenderingUtils';
import {
  getMetadataFromParams,
  getV3ShareUrl,
  getV3ShareEmbedHtml,
} from '../../utils';
import { fetchV3Episode } from '../../episodePreview';
import {
  copyShareUrl,
  endAudio,
  pause,
  playbackStarted,
  playOrPause,
  previousAudio,
  receiveVolumeData,
  playNextEpisodeOrReplay,
  replayStation,
  restartAudio,
  shareAction,
  startShare,
  stopShare,
} from '../../station';
import {
  fetchStatus,
  submitSupportersCheckoutForm,
  chooseProductId,
  changeBecomeASupporterScene,
  showSupportersModal,
  hideSupportersModal,
  setPaymentAsProcessing,
  setPaymentAsNotProcessing,
  trackListenerSupportEvent,
  hideProfilePaywallsModal,
} from '../../money';
import { Profile } from '../Profile';
import { setProfileColor } from '../../store/global/podcast/actions';
import { fetchSocialUrls } from '../../podcastEditor';

const mapStateToProps = (
  {
    money: {
      chosenProductId,
      becomeASupporterScene,
      isShowingSupportersModal,
      isPaymentProcessing,
      orderConfirmation,
      isShowingProfilePaywallsModal,
    },
    browser,
    episodePreview,
    episodePreview: { episodeEnclosureUrl },
    station,
    localStorage: { playbackSpeed },
    user,
    global: {
      podcast: {
        podcast: { profileColor },
      },
    },
    podcastEditor: { userSocialUrls },
  },
  { location }
) => {
  const query = getQueryFromLocation(location);
  return {
    ...getResponsivePropsFromBrowser(browser),
    browserWidth: browser.width,
    mediaType: browser.mediaType,
    episodePreview,
    episodeEnclosureUrl,
    isAndroidChrome: isAndroidChrome(),
    isDeepLinkable:
      location.action !== 'PUSH' && (isIOS() || isAndroidChrome()),
    isEmbedded: isEmbedRoute(location),
    isIOS: isIOS(),
    location,
    openInAppUrl: getOpenInAppUrl(`${location.pathname}${location.search}`),
    playbackSpeed,
    shareEmbedHtml: getV3ShareEmbedHtml(
      episodePreview,
      station.audios[station.activeIndex]
    ),
    episodeShareUrl: getV3ShareUrl(
      episodePreview,
      station.audios[station.activeIndex]
    ),
    shareUrl: getV3ShareUrl({ shareLinkPath: `/${station.vanitySlug}` }),
    station,
    user,
    hasLinkedEpisode: true,
    becomeASupporterScene,
    isShowingSupportersModal,
    isShowingProfilePaywallsModal,
    isPaymentProcessing,
    chosenProductId,
    orderConfirmation,
    referringPlatform: query.ref || query.referrer,
    defaultProfileHeaderColor: station.defaultProfileHeaderColor,
    profileColor,
    userSocialUrls,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: {
    endAudio: target => dispatch(endAudio(target)),
    fetchStatus: () => dispatch(fetchStatus()),
    fetchV3Episode: (episodeId, stationAudioId, autoStart = false) =>
      dispatch(fetchV3Episode('', episodeId, stationAudioId, autoStart)),
    fetchSocialUrls: webStationId => dispatch(fetchSocialUrls(webStationId)),
    pause: () => dispatch(pause()),
    playNextEpisodeOrReplayAndPause: () =>
      dispatch(playNextEpisodeOrReplay(false)),
    playOrPause: target => dispatch(playOrPause(target)),
    playbackStarted: () => dispatch(playbackStarted()),
    previousAudio: target => dispatch(previousAudio(target)),
    receiveVolumeData: data => dispatch(receiveVolumeData(data)),
    replayEpisodeAndPause: () => dispatch(replayStation(false)),
    restartAudio: target => dispatch(restartAudio(target)),
    startShare: () => dispatch(startShare()),
    stopShare: () => dispatch(stopShare()),
    setPlaybackSpeed: speed => dispatch(setPlaybackSpeed(speed)),
    setProfileColor: color => dispatch(setProfileColor(color)),
    onPressSendVoiceMessage: () => {
      const profileUrlPath = ownProps.location.pathname
        .split('/')
        .splice(0, 2)
        .join('/');
      dispatch(push(`${profileUrlPath}/message`));
    },
    onSubmitSupport: (
      {
        email,
        methodName, // optional
        name,
        perMonthSupportOptionId,
        referringPlatform,
        stationId,
        token,
      },
      metadata
    ) => {
      dispatch(setPaymentAsProcessing());
      const data = {
        email,
        name,
        methodName,
        referringPlatform,
        productId: perMonthSupportOptionId,
        stationId,
        token,
      };
      return dispatch(submitSupportersCheckoutForm(data, metadata))
        .then(() => {
          dispatch(setPaymentAsNotProcessing());
          dispatch(changeBecomeASupporterScene('share'));
        })
        .catch(() => {
          dispatch(setPaymentAsNotProcessing());
          return Promise.reject(err); // pass rejection
        });
    },
    onSelectPerMonthSupportOptionsChoice: (
      perMonthSupportOptionId,
      perMonthSupportOption
    ) => {
      dispatch(chooseProductId(perMonthSupportOptionId, perMonthSupportOption));
    },
    showSupportersModal: () => {
      dispatch(showSupportersModal());
    },
    onHideSupportersModal: () => {
      dispatch(hideSupportersModal());
      dispatch(changeBecomeASupporterScene('pay'));
    },
    hideProfilePaywallsModal: () => {
      dispatch(hideProfilePaywallsModal());
    },
    trackListenerSupportEvent: params =>
      dispatch(trackListenerSupportEvent(params)),
  },
  onClickCopyUrl: type => {
    // TODO: normalize
    if (type === 'URL') {
      trackEvent(
        'share_button_clicked',
        {
          type: 'url',
          location: 'profile',
        },
        { providers: [mParticle] }
      );
    }
    if (type === 'Embed URL') {
      trackEvent(
        'embed_code_clicked',
        {
          location: 'profile',
        },
        { providers: [mParticle] }
      );
    }
    dispatch(copyShareUrl(type));
  },
  onClickShare: type => {
    // TODO: normalize
    trackEvent(
      'share_button_clicked',
      {
        type,
        location: 'profile',
      },
      { providers: [mParticle] }
    );
    dispatch(shareAction(type));
  },
});

class ProfileEpisodeContainer extends Component {
  // Static SSR data function
  static fetchData({ store, baseUrl, match: { params } }) {
    const metadata = getMetadataFromParams(params);
    return store.dispatch(
      fetchV3Episode(baseUrl, metadata.episodeIdHash, metadata.audioIdHash)
    );
  }

  // note on data fetching: This component can involve route changes (e.g. new station)
  // https://github.com/ReactTraining/react-router/blob/master/docs/guides/ComponentLifecycle.md
  componentDidMount() {
    const {
      mediaType,
      actions,
      isEmbedded,
      match: { params },
      station: { episodeId },
    } = this.props;
    const metadata = getMetadataFromParams(params);
    const isMobileViewportSize = mediaType === 'extraSmall';
    const shouldAutoPlay =
      !isEmbedded &&
      episodeId !== metadata.episodeIdHash &&
      !isMobileViewportSize; // if it matches SSR state do not autoplay
    actions.fetchV3Episode(
      metadata.episodeIdHash,
      metadata.audioIdHash,
      shouldAutoPlay // if it matches SSR state do not autoplay
    );
  }

  componentDidUpdate(prevProps) {
    const {
      mediaType,
      actions: { fetchV3Episode },
      isEmbedded,
      match: { params },
    } = this.props;
    const isMobileViewportSize = mediaType === 'extraSmall';
    const shouldAutoPlay = isEmbedded ? false : !isMobileViewportSize;
    // || !isMobileViewportSize && !isEmbedded); // auto-play if going episode to episode
    // respond to parameter change in scenario 3
    if (
      episodeMetadataDiffers(params, prevProps.match.params) &&
      !this.ignoreLastFetch
    ) {
      const metadata = getMetadataFromParams(params);
      fetchV3Episode(
        metadata.episodeIdHash,
        metadata.audioIdHash,
        shouldAutoPlay
      );
    }
  }

  componentWillUnmount() {
    // allows us to ignore an inflight request in scenario 4
    this.ignoreLastFetch = true;
  }

  render() {
    const {
      location,
      user,
      station: {
        stationId,
        podcastMetadata: { podcastImage, podcastName },
      },
    } = this.props;

    if (stationId) {
      return (
        <React.Fragment>
          <Profile {...this.props} />
          <VoiceMessageCreationModalScreenContainer
            location={location}
            loggedInUserId={user && user.user && user.user.userId}
            stationWebId={stationId}
            podcastName={podcastName}
            podcastCoverartImageUrl={podcastImage}
          />
        </React.Fragment>
      );
    }
    return <Profile {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileEpisodeContainer);

function getResponsivePropsFromBrowser(browser) {
  const { mediaType } = browser;
  const HEIGHTS = {
    SMALL: 341,
    MEDIUM: 219,
  };
  return {
    extraSmall: {
      episodePlayIconSize: 27,
      maxCaptionLines: 2,
      maxEpisodeDescriptionLines: 1,
      maxEpisodeNameLines: 2,
      waveHeight: HEIGHTS.SMALL,
      doShowPlayer: true,
    },
    small: {
      episodePlayIconSize: 27,
      maxCaptionLines: 2,
      maxEpisodeDescriptionLines: 1,
      maxEpisodeNameLines: 2,
      waveHeight: HEIGHTS.SMALL,
      doShowPlayer: true,
    },
    medium: {
      episodePlayIconSize: 31,
      maxCaptionLines: 2,
      maxEpisodeDescriptionLines: 2,
      maxEpisodeNameLines: 1,
      waveHeight: HEIGHTS.MEDIUM,
      doShowPlayer: true,
    },
    large: {
      episodePlayIconSize: 31,
      maxCaptionLines: 2,
      maxEpisodeDescriptionLines: 2,
      maxEpisodeNameLines: 1,
      waveHeight: HEIGHTS.MEDIUM,
      doShowPlayer: true,
    },
    extraLarge: {
      episodePlayIconSize: 31,
      maxCaptionLines: 2,
      maxEpisodeDescriptionLines: 2,
      maxEpisodeNameLines: 1,
      waveHeight: HEIGHTS.MEDIUM,
      doShowPlayer: true,
    },
    infinity: {
      episodePlayIconSize: 31,
      maxCaptionLines: 2,
      maxEpisodeDescriptionLines: 2,
      maxEpisodeNameLines: 1,
      waveHeight: HEIGHTS.MEDIUM,
      doShowPlayer: true,
    },
  }[mediaType];
}

// less expensive comparison
function episodeMetadataDiffers(paramsA, paramsB) {
  if (paramsA.episodeHashBeforeHyphen !== paramsB.episodeHashBeforeHyphen) {
    return true;
  }
  if (paramsA.episodeHashAfterHyphen !== paramsB.episodeHashAfterHyphen) {
    return true;
  }
  return false;
}

function isEmbedRoute({ pathname }) {
  return pathname.indexOf('/embed') !== -1;
}

function getQueryFromLocation(location) {
  return (location && queryString.parse(location.search)) || {};
}
