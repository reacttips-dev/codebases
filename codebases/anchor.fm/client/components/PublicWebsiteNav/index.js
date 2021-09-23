import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Link from '../Link';
import { AccountNavItems } from './components/AccountNavItems';
import { SignUpLoginNavItems } from './components/SignUpLoginNavItems';
import { HamburgerIcon } from './components/HamburgerIcon';
import { MobileNavContainer } from './components/MobileNav/MobileNavContainer';
import { NavLinks } from './components/NavLinks';
import { clickNavLink, clickedNavLinkGoogleAnalytics } from './events';
import { SIGNED_IN_LINKS, SIGNED_OUT_LINKS } from './constants';
import styles from './styles.sass';
import { useFeatureFlagsCtx } from '../../contexts/FeatureFlags';
import { getIsEPEnabled, getIsSaiOrVodcast } from '../../modules/FeatureFlags';
import { AnchorLogoWithWordmark } from '../svgs/AnchorLogoWithWordmark';
import { Button } from '../../shared/Button/NewButton';
import { SpotifyLogo } from '../svgs/SpotifyLogo';
import { useSponsorships } from '../../hooks/useSponsorships';
import { getCampaignsArray } from '../../screens/SupportersScreen/utils';
import { getIsSponsorshipsThresholdEnabled } from '../../screens/SupportersScreen/constants';

const cx = classnames.bind(styles);

const MARKETING_PAGE_PATHS = [
  '/',
  '/features',
  '/switch',
  '/switch/form',
  '/ads-by-anchor',
];

function getIsMarketingPage(matchedPathname) {
  return MARKETING_PAGE_PATHS.includes(matchedPathname);
}

const getIsACampaignAwaitingRecording = (campaigns = []) =>
  campaigns.some(campaign => campaign.campaignStatus === 'awaitingRecording');

const EPISODE_EDITOR_REGEX = /^\/dashboard\/episode\/([^/]+\/edit)?$/;
const isShowingNewEpisodeButton = currentPath =>
  currentPath !== '/dashboard/episode/new' &&
  !currentPath.match(EPISODE_EDITOR_REGEX);

const getNavLinks = ({
  user,
  campaigns,
  isAllowedToSeeMoneyNavItem,
  showNetworkLinks,
  isSaiOrVodcast,
  isEPEnabled,
}) => {
  if (!user) return SIGNED_OUT_LINKS;
  const displayNavLinks = [];
  for (const navLink of SIGNED_IN_LINKS) {
    const { key } = navLink;
    switch (key) {
      case 'money':
        if (isEPEnabled || isSaiOrVodcast) break;
        if (isAllowedToSeeMoneyNavItem)
          displayNavLinks.push({
            ...navLink,
            isShowingNotificationBadge: getIsACampaignAwaitingRecording(
              campaigns
            ),
          });
        break;
      case 'network':
        if (isEPEnabled) break;
        if (isSaiOrVodcast) break;
        if (showNetworkLinks) displayNavLinks.push(navLink);
        break;
      case 'dashboard':
        if (isSaiOrVodcast) break;
        displayNavLinks.push(navLink);
        break;
      default:
        displayNavLinks.push(navLink);
        break;
    }
  }
  return displayNavLinks;
};

/**
 * The ability to hard-refresh is a workaround for the case of client-side
 * navigating from the profile page to the dashboard; the isProfilePage boolean
 * doesn't update so the header becomes the wrong color. [TODO: https://anchorfm.atlassian.net/browse/WHEEL-419]
 * Implement a real fix for this.
 */
const Logo = ({ isSignedIn, isHardRefresh = false }) => {
  const url = isSignedIn ? '/dashboard' : '/';
  const linkProps = {
    [isHardRefresh ? 'href' : 'to']: url,
  };
  return (
    <Link
      {...linkProps}
      onClick={() => {
        clickedNavLinkGoogleAnalytics('Home');
        clickNavLink({ link: 'icon' });
      }}
    >
      <AnchorLogoWithWordmark
        ariaLabel="Anchor logo links to the homepage"
        includeSpotify={true}
      />
    </Link>
  );
};

const PublicWebsiteNav = ({
  isAllowedToSeeMoneyNavItem,
  onLogOut,
  user,
  shareLinkPath,
  podcastNetwork,
  onClickNavItem,
  pathname,
  isMobileNavVisible,
  toggleMobileWebsiteNavVisible,
  podcastName,
  podcastImage,
  profileColor,
  isProfilePage,
  showNetworkLinks,
}) => {
  const {
    state: { featureFlags, webStationId },
  } = useFeatureFlagsCtx();
  const isSponsorshipsThresholdEnabled = getIsSponsorshipsThresholdEnabled(
    webStationId
  );
  const {
    campaigns: campaignsObject,
    activationLifeCycleState,
  } = useSponsorships();
  const campaigns = campaignsObject ? getCampaignsArray(campaignsObject) : [];

  const isSaiOrVodcast = getIsSaiOrVodcast(featureFlags);
  // fallback to hostDomain is for server-side rendering; added to user session at login
  const isEPEnabled =
    getIsEPEnabled(featureFlags) || !!(user && user.hostDomain);
  /**
   * SPONSORSHIPS_THRESHOLD_FEATURE_POST_LAUNCH
   * replace `isAllowedToSeeMoneyNavItem` with:
   * `isAllowedToSeeMoneyNavItem: activationLifeCycleState !== 'ineligibleForSponsorshipsFeature'`
   */
  const navLinks = getNavLinks({
    user,
    campaigns,
    isAllowedToSeeMoneyNavItem: isSponsorshipsThresholdEnabled
      ? activationLifeCycleState !== 'ineligibleForSponsorshipsFeature'
      : isAllowedToSeeMoneyNavItem,
    showNetworkLinks,
    isSaiOrVodcast,
    isEPEnabled,
  });

  const isFeaturesPage = pathname === '/features';
  const isMarketingPage = getIsMarketingPage(pathname);
  const isSticky = isMarketingPage;
  const isTransparent = isMarketingPage;
  const isSignedIn = !!user;
  const isHardRefresh = isProfilePage;

  return (
    <nav
      className={cx({
        wrapper: true,
        centered: true,
        sticky: isSticky,
        transparent: isTransparent,
        shadow: !isFeaturesPage,
      })}
    >
      <div
        className={cx({
          contentBackground: true,
        })}
        style={{ backgroundColor: profileColor }}
      >
        <div
          className={cx({
            contentWrapper: true,
            isHidingPrimaryNav: isProfilePage && !user,
          })}
        >
          <div className={styles.mainNav}>
            <div className={styles.desktopNav}>
              <div className={styles.logoContainer}>
                {isEPEnabled ? (
                  <Link to="/dashboard" title="EP Home">
                    <SpotifyLogo fillColor="#fff" width="100px" height="40px" />
                  </Link>
                ) : (
                  <Logo isSignedIn={isSignedIn} isHardRefresh={isHardRefresh} />
                )}
              </div>
              <div className={styles.mainContent}>
                <NavLinks links={navLinks} pathname={pathname} />
              </div>
              <div className={styles.sideLinks}>
                {user ? (
                  <div className={styles.accountLinks}>
                    {isShowingNewEpisodeButton(pathname) && (
                      <Button
                        color="onDark"
                        kind="link"
                        href="/dashboard/episode/new"
                        onClick={() => clickNavLink({ link: 'new_episode' })}
                      >
                        New Episode
                      </Button>
                    )}
                    <AccountNavItems
                      showNetworkLinks={showNetworkLinks}
                      shareLinkPath={shareLinkPath}
                      onClickNavItem={onClickNavItem}
                      podcastNetwork={podcastNetwork}
                      onLogOut={onLogOut}
                      podcastName={podcastName}
                      podcastImage={podcastImage}
                      isSaiOrVodcast={isSaiOrVodcast}
                    />
                  </div>
                ) : (
                  <SignUpLoginNavItems pathname={pathname} />
                )}
              </div>
            </div>
            <div className={styles.mobileNav}>
              <Logo isSignedIn={isSignedIn} isHardRefresh={isHardRefresh} />
              <HamburgerIcon onClick={toggleMobileWebsiteNavVisible} />
              {isMobileNavVisible && (
                <MobileNavContainer
                  pathname={pathname}
                  links={navLinks}
                  isSignedIn={isSignedIn}
                  onClickClose={toggleMobileWebsiteNavVisible}
                  onLogOut={onLogOut}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

PublicWebsiteNav.propTypes = {
  onLogOut: PropTypes.func.isRequired,
  user: PropTypes.shape({
    imageUrl: PropTypes.string,
    userId: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  shareLinkPath: PropTypes.string,
  podcastNetwork: PropTypes.string,
  onClickNavItem: PropTypes.func.isRequired,
  pathname: PropTypes.string,
  isMobileNavVisible: PropTypes.bool,
  isAllowedToSeeMoneyNavItem: PropTypes.bool,
  toggleMobileWebsiteNavVisible: PropTypes.func.isRequired,
  podcastName: PropTypes.string,
  podcastImage: PropTypes.string,
};

PublicWebsiteNav.defaultProps = {
  podcastNetwork: null,
  shareLinkPath: null,
  user: null,
  pathname: null,
  isMobileNavVisible: false,
  isAllowedToSeeMoneyNavItem: false,
  podcastName: null,
  podcastImage: null,
};

export { PublicWebsiteNav as default, PublicWebsiteNav };
