import React, { Component, useEffect } from 'react';
import styled from '@emotion/styled';
import { renderRoutes } from 'react-router-config';
import Icon from 'client/shared/Icon';
import { CloseButton } from 'client/shared/Modal/styles';
import { PublicWebsiteNavContainer } from '../PublicWebsiteNav/PublicWebsiteNavContainer';
import {
  isEmbedPath,
  isRWFPath,
  windowUndefined,
} from '../../../helpers/serverRenderingUtils';
import {
  initializeBraze,
  initializeMParticle,
  initializeWithUser,
} from '../../modules/analytics';
import { editorPaths } from '../../utils';
import Link from '../Link';
import ScrollToTop from '../ScrollToTop';
import styles from './styles.sass';
import { JumpToContent } from './styles';
import { useCurrentUserCtx } from '../../contexts/CurrentUser';
import {
  firePathUpdateEvent,
  fetchMaintenanceModeStatus,
  shouldHandleWarningMode,
} from './util';
import { WarningBanner } from '../../screens/WarningBanner';

const CloseButtonWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

class AppClassComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.state = {
      didFetchPodcastStatus: false,
      serveWarningBanner: '',
      serveWarningScreen: false,
    };
  }

  componentDidMount() {
    const {
      location,
      actions: { fetchGeoRegion, fetchPodcastAndSet },
      compliance: { isSessionRetrieved, geoRegion, geoCountry },
      isLoggedIn,
    } = this.props;

    this.fetchPodcastStatus();
    if (isLoggedIn) fetchPodcastAndSet();
    // Send initial page view for app startup
    this.handleRouteChange(location);
    // geo-detection
    if (isSessionRetrieved && (!geoRegion || !geoCountry)) {
      fetchGeoRegion();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      user,
      actions,
      compliance: { isSessionRetrieved, geoCountry, geoRegion },
    } = this.props;

    // switching accounts, edge case
    if (user !== prevProps.user) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        didFetchPodcastStatus: false,
      });
      return; // fetch on next update
    }
    if (prevProps.location && location !== prevProps.location) {
      this.handleRouteChange(location, prevProps.location);
    }
    if (
      isSessionRetrieved &&
      isSessionRetrieved !== prevProps.compliance.isSessionRetrieved &&
      (!geoRegion || !geoCountry)
    ) {
      actions.fetchGeoRegion();
    }
    this.fetchPodcastStatus();
  }

  fetchPodcastStatus() {
    const { didFetchPodcastStatus } = this.state;
    const {
      actions: { fetchMyPodcastStatus, fetchMyPodcastImportStatus },
      isLoggedIn,
    } = this.props;
    // just authenticated / logged in as a new user
    if (isLoggedIn && !didFetchPodcastStatus) {
      this.setState({
        didFetchPodcastStatus: true,
      });
      fetchMyPodcastStatus().then((response = {}) => {
        if (response.podcastExternalSource) {
          // then check if external podcast, confirm status of import
          fetchMyPodcastImportStatus();
        }
      });
    }
  }

  handleLogOut(evt) {
    evt.preventDefault();
    const {
      actions: { requestToLogOutUser },
    } = this.props;
    evt.preventDefault();
    requestToLogOutUser();
  }

  // For general state cleanup on client-side route changes
  // TODO: how to delegate this to reducers? But we cannot dispatch from a reducer, that is impure
  handleRouteChange(currentLocation, previousLocation) {
    const {
      actions: { dispatchPageTransitionAction, stopEditorAudio },
    } = this.props;
    dispatchPageTransitionAction(currentLocation);
    firePathUpdateEvent((currentLocation || {}).pathname);
    fetchMaintenanceModeStatus().then((response = {}) => {
      this.setState({
        serveWarningScreen: response.show_warning_page === '1',
        serveWarningBanner:
          response.show_warning_page === '0' && response.warning_banner_content
            ? response.warning_banner_content
            : '',
      });
    });

    if (!previousLocation) {
      return;
    }

    if (
      (!currentLocation.pathname.match(editorPaths.editEpisodePattern) ||
        !previousLocation.pathname.match(editorPaths.editEpisodePattern)) &&
      (currentLocation.pathname.indexOf(editorPaths.newEpisodeBasePath) !== 0 ||
        previousLocation.pathname.indexOf(editorPaths.newEpisodeBasePath) !== 0)
    ) {
      stopEditorAudio();
    }
  }

  render() {
    const { serveWarningBanner, serveWarningScreen } = this.state;
    const {
      route: { routes },
      compliance,
      context,
      isAllowedToSeeMoneyNavItem,
      isEuropeanGeoRegion,
      location,
      user,
      shareLinkPath,
      podcastNetwork,
      onDismissCookieBanner,
      onClickNavItem,
      podcastName,
      podcastImage,
    } = this.props;

    // If Fastly says we need to serve the WarningScreen, we need to do a window reload
    // which will be caught by Fastly that will serve the WarningScreen for all routes
    if (
      shouldHandleWarningMode((location || {}).pathname) &&
      serveWarningScreen &&
      !windowUndefined()
    ) {
      window.location.reload();
    }

    return (
      <ScrollToTop>
        <JumpToContent href="#app-content">Skip to main content</JumpToContent>
        <div>
          {!isEmbedPath(location.pathname) && !isRWFPath(location.pathname) && (
            <PublicWebsiteNavContainer
              pathname={location.pathname}
              isAllowedToSeeMoneyNavItem={isAllowedToSeeMoneyNavItem}
              user={user}
              onLogOut={this.handleLogOut}
              shareLinkPath={shareLinkPath}
              podcastNetwork={podcastNetwork}
              onClickNavItem={onClickNavItem}
              podcastName={podcastName}
              podcastImage={podcastImage}
              serveWarningScreen={serveWarningScreen}
            />
          )}
          <main className={styles.appChildrenContainer} id="app-content">
            {shouldHandleWarningMode((location || {}).pathname) &&
            serveWarningBanner ? (
              <WarningBanner bannerText={serveWarningBanner} />
            ) : null}
            {renderRoutes(routes, { context })}
          </main>
          {!isEmbedPath(location.pathname) &&
          isEuropeanGeoRegion &&
          !compliance.isCookieBannerDismissed ? (
            <div className="cookieBanner">
              <CloseButtonWrapper>
                <CloseButton
                  className="closeButton"
                  onClick={onDismissCookieBanner}
                  type="button"
                  aria-label="Close"
                >
                  <Icon type="x" fillColor="#C9CBCD" />
                </CloseButton>
              </CloseButtonWrapper>
              This website uses cookies to understand your use of our website
              and give you a better experience. By continuing to use the site or
              closing this banner, you agree to our use of cookies. To find out
              more about cookies and how to change your choices, please go to
              our <Link to="/privacy">Privacy Policy</Link>.
            </div>
          ) : null}
        </div>
      </ScrollToTop>
    );
  }
}

const App = props => {
  const {
    state: {
      partnerIds: { mparticle },
      userId,
    },
  } = useCurrentUserCtx();

  useEffect(() => {
    if (mparticle) {
      if (window.__MPARTICLE_API_KEY__) {
        const optimizelyUserId = window.optimizelyClientInstance
          ? window.optimizelyClientInstance.user.id
          : '';
        initializeMParticle(window.__MPARTICLE_API_KEY__).then(() => {
          initializeWithUser(!!userId, mparticle, optimizelyUserId);
          initializeBraze(mparticle);
        });
      }
    }
  }, [mparticle, userId]);

  return <AppClassComponent {...props} />;
};

export default App;
