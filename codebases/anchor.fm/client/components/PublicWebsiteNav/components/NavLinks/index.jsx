import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styled from '@emotion/styled';
import Link from '../../../Link';
import { IconBadge } from '../../../IconBadge';
import { clickNavLink, clickedNavLinkGoogleAnalytics } from '../../events';

import LinkStyles from '../../LinkStyles.sass';

const cx = classnames.bind(LinkStyles);

const Nav = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 26px;
`;

const Badge = styled.div`
  position: absolute;
  top: 0;
  right: -10px;
`;

const NavLinks = ({ links, pathname }) => (
  <Nav>
    {links.map(
      ({
        label,
        key,
        to,
        href,
        isShowingNotificationBadge,
        notificationBadge,
        openInNewTab,
      }) => (
        <Link
          key={key}
          to={to}
          href={href}
          aria-label={`${label}${
            openInNewTab ? ' (navigates to a new site)' : ''
          }`}
          onClick={() => {
            clickNavLink({ link: key });
            clickedNavLinkGoogleAnalytics(label);
          }}
          className={cx({ link: true, linkActive: pathname === to })}
          // If we send "_self" instead of undefined, React Router will not
          // clientside navigate in cases where we want it to.
          target={openInNewTab ? '_blank' : undefined}
        >
          <span>
            {label}
            {isShowingNotificationBadge && (
              <Badge>
                <IconBadge
                  backgroundColor="green"
                  iconColor="#292F36"
                  width={10}
                  padding={1}
                  type={notificationBadge}
                />
              </Badge>
            )}
          </span>
        </Link>
      )
    )}
  </Nav>
);

NavLinks.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
      to: PropTypes.string,
      isShowingNotificationBadge: PropTypes.bool,
      notificationBadge: PropTypes.string,
    })
  ).isRequired,
  pathname: PropTypes.string.isRequired,
};

export { NavLinks };
