import React from 'react';
import PropTypes from 'prop-types';

import { MobileNav } from './index';
import { removeMobileNavClasses } from '../../modules/removeMobileNavClasses';

class MobileNavContainer extends React.Component {
  componentWillUnmount() {
    removeMobileNavClasses();
  }

  render() {
    const { links, isSignedIn, onLogOut, pathname, onClickClose } = this.props;
    return (
      <MobileNav
        pathname={pathname}
        links={links}
        isSignedIn={isSignedIn}
        onClickClose={onClickClose}
        onLogOut={onLogOut}
      />
    );
  }
}

MobileNavContainer.defaultProps = {
  onLogOut: () => {},
  onClickClose: () => {},
  pathname: null,
};

MobileNavContainer.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string,
      to: PropTypes.string,
      isShowingNotificationBadge: PropTypes.bool,
      notificationBadge: PropTypes.string,
    })
  ).isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  onLogOut: PropTypes.func,
  onClickClose: PropTypes.func,
  pathname: PropTypes.string,
};

export { MobileNavContainer };
