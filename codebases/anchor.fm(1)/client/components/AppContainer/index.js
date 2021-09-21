import { connect } from 'react-redux';
import AnchorErrorTracking from '../../modules/AnchorErrorTracking';
import { trackEvent } from '../../modules/analytics';
import { requestToLogOutUser } from '../../user';
import {
  fetchMyPodcastStatus,
  fetchMyPodcastImportStatus,
} from '../../podcast';
import {
  endEpisodeAudio,
  setIsPlaying,
} from '../../screens/EpisodeEditorScreen/duck';
import {
  fetchGeoRegion,
  setIsCookieBannerDismissed,
  UNKNOWN_GEO_REGION,
} from '../../compliance';
import { duckOperations as globalPodcastDuckOperations } from '../../store/global/podcast';
import App from '../App';

const ROUTE_TRANSITION = 'ROUTE_TRANSITION';

const mapStateToProps = (
  {
    compliance,
    money: {
      status: { isAllowedToAuthenticateStripe },
    },
    user: {
      user,
      stationId,
      hostName,
      menuMode,
      permissions,
      shareLinkPath,
      podcastNetwork,
    },
    pageMetadata,
    podcast,
    global: {
      podcast: {
        podcast: {
          profile: {
            podcastMetadata: { podcastName },
          },
          metadata: { podcastImage },
        },
      },
    },
  },
  routerProps
) => {
  const isEuropeanGeoRegion =
    compliance.geoRegion &&
    (compliance.geoRegion === 'EU' ||
      compliance.geoRegion === UNKNOWN_GEO_REGION);
  const isLoggedIn = !!user;
  if (isLoggedIn) {
    // side effect
    AnchorErrorTracking.identifyUser({ userId: user.userId });
  }
  return {
    compliance,
    campaign: pageMetadata.campaign,
    isAllowedToSeeMoneyNavItem: isAllowedToAuthenticateStripe,
    isEuropeanGeoRegion,
    location: routerProps.location,
    menuMode,
    permissions,
    podcast,
    stationId,
    user,
    shareLinkPath,
    podcastNetwork,
    hostName,
    isLoggedIn,
    podcastName,
    podcastImage,
  };
};

const mapDispatchToProps = dispatch => ({
  actions: {
    requestToLogOutUser: () => dispatch(requestToLogOutUser()),
    fetchMyPodcastImportStatus: () => dispatch(fetchMyPodcastImportStatus()),
    fetchMyPodcastStatus: () => dispatch(fetchMyPodcastStatus()),
    fetchGeoRegion: () => dispatch(fetchGeoRegion()),
    dispatchPageTransitionAction: location =>
      dispatch(pageTransitionAction(location)),
    stopEditorAudio: () => {
      dispatch(endEpisodeAudio());
      dispatch(setIsPlaying(false));
    },
    fetchPodcastAndSet: () => {
      dispatch(globalPodcastDuckOperations.fetchPodcastAndSet());
    },
  },
  onDismissCookieBanner: () => dispatch(setIsCookieBannerDismissed(true)),
  onClickNavItem: (name, attributes) => {
    trackEvent(name, attributes, { providers: [mParticle] });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

/**
 * Page transition in the redux-analytics format
 * (see middleware.js)
 */
function pageTransitionAction(location) {
  return {
    type: ROUTE_TRANSITION,
    meta: {
      analytics: {
        type: 'route-transition',
        payload: location,
      },
    },
  };
}
