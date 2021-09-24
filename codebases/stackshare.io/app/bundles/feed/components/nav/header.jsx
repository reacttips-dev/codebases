import React, {useState, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import MobileHeader, {Separator} from '../../../../shared/library/menus/mobile-header';
import MenuItem from '../../../../shared/library/menus/shared/menu-item';
import {SIGN_IN_PATH} from '../../constants/utils';
import HeaderNotice from '../../../site/components/header-notice';
import glamorous from 'glamorous';
import {SCORE, WHITE} from '../../../../shared/style/colors';
import TOSUpdate from '../../../site/components/tos-update';

const Pill = glamorous.span({
  color: WHITE,
  background: SCORE,
  fontSize: '12px',
  padding: '3px 5px',
  borderRadius: 6,
  marginLeft: 5
});

const renderUserMenu = path =>
  path ? (
    <React.Fragment>
      <MenuItem url={path}>Profile</MenuItem>
      <MenuItem url="/settings/email">Email Settings</MenuItem>
      <Separator />
      <MenuItem
        url="/users/logout"
        onClick={event => {
          event.preventDefault();
          if (window.analytics) {
            window.analytics.reset();
          }
          window.location = event.target.href;
        }}
      >
        Sign Out
      </MenuItem>
    </React.Fragment>
  ) : (
    <MenuItem url={SIGN_IN_PATH}>Signup / Login</MenuItem>
  );

const Header = ({path, contentRef, privateMode, currentUser}) => {
  // eslint-disable-next-line no-unused-vars
  const [headerOffset, setHeaderOffset] = useState();
  const [stickyNavbar, setStickyNavbar] = useState(false);

  useEffect(() => {
    if (window) setStickyNavbar(window.location.pathname === '/');
  }, []);

  return (
    <Fragment>
      {currentUser && currentUser.showTosModal && <TOSUpdate />}
      {!privateMode && !stickyNavbar && (
        <HeaderNotice mobile={true} setHeaderOffset={setHeaderOffset} />
      )}
      <MobileHeader contentRef={contentRef} headerOffset={headerOffset} stickyNavbar={stickyNavbar}>
        {!privateMode && (
          <MenuItem url="/private">
            Private StackShare<Pill>NEW</Pill>
          </MenuItem>
        )}
        <MenuItem url="/feed">{path ? 'Home' : 'Feed'}</MenuItem>
        <MenuItem url="/stacks">{privateMode ? 'Browse Public Stacks' : 'Browse Stacks'}</MenuItem>
        <MenuItem url="/tools/trending">Explore Tools</MenuItem>
        <MenuItem url="/api">API</MenuItem>
        {!privateMode && <MenuItem url="/jobs">Jobs</MenuItem>}
        <Separator />
        {renderUserMenu(path)}
      </MobileHeader>
    </Fragment>
  );
};
Header.propTypes = {
  path: PropTypes.string,
  contentRef: PropTypes.any,
  privateMode: PropTypes.any,
  currentUser: PropTypes.object
};

export {Header as default};
