import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { PublicWebsiteNav } from './index';
import { fetchStatus } from '../../money';
import { useNetworkRole } from '../../contexts/NetworkRole';
import { removeMobileNavClasses } from './modules/removeMobileNavClasses';

function PublicWebsiteNavWrapper({
  isAllowedToSeeMoneyNavItem,
  onLogOut,
  user,
  podcastNetwork,
  onClickNavItem,
  pathname,
  podcastName,
  podcastImage,
  profileColor,
  fetchMoneyStatus,
  isProfilePage,
}) {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);
  const isUserSet = Boolean(user && Object.keys(user).length > 0);

  const { networkRole, fetchNetworkRole, status } = useNetworkRole();
  useEffect(() => {
    if (status === 'idle' && isUserSet) {
      fetchNetworkRole();
    }
  }, [fetchNetworkRole, status, isUserSet]);

  const showNetworkLinks = networkRole === 'admin';

  useEffect(() => {
    if (isUserSet && fetchMoneyStatus) {
      fetchMoneyStatus();
    }
  }, [isUserSet, fetchMoneyStatus]);

  function toggleMobileNavVisible() {
    if (isMobileNavVisible) {
      removeMobileNavClasses();
    } else {
      document.body.classList.add('lockScroll');
      const appContent = document.getElementById('app-content');
      if (appContent) appContent.classList.add('hidden');
    }
    setIsMobileNavVisible(!isMobileNavVisible);
  }

  return (
    <PublicWebsiteNav
      showNetworkLinks={showNetworkLinks}
      pathname={pathname}
      isAllowedToSeeMoneyNavItem={isAllowedToSeeMoneyNavItem}
      user={user}
      onLogOut={onLogOut}
      podcastNetwork={podcastNetwork}
      onClickNavItem={onClickNavItem}
      toggleMobileWebsiteNavVisible={toggleMobileNavVisible}
      isMobileNavVisible={isMobileNavVisible}
      podcastName={podcastName}
      podcastImage={podcastImage}
      profileColor={profileColor}
      isProfilePage={isProfilePage}
    />
  );
}

PublicWebsiteNavWrapper.propTypes = {
  isAllowedToSeeMoneyNavItem: PropTypes.bool.isRequired,
  onLogOut: PropTypes.func.isRequired,
  user: PropTypes.shape({
    imageUrl: PropTypes.string,
    userId: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  podcastNetwork: PropTypes.string,
  onClickNavItem: PropTypes.func.isRequired,
  pathname: PropTypes.string,
  podcastName: PropTypes.string,
  podcastImage: PropTypes.string,
};

PublicWebsiteNavWrapper.defaultProps = {
  podcastNetwork: null,
  user: null,
  pathname: null,
  podcastName: null,
  podcastImage: null,
};

const PublicWebsiteNavContainer = connect(
  ({
    global: {
      podcast: {
        podcast: { profileColor },
      },
    },
    pageMetadata: { isProfilePage },
  }) => ({
    profileColor,
    isProfilePage,
  }),
  dispatch => ({
    fetchMoneyStatus: () => dispatch(fetchStatus()),
  })
)(PublicWebsiteNavWrapper);

export { PublicWebsiteNavContainer, removeMobileNavClasses };
