import React from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';
import Link from '../../../Link';
import { IconBadge } from '../../../IconBadge';

import { clickedNavLinkGoogleAnalytics } from '../../events';

import styles from './styles.sass';
import Icon from '../../../../shared/Icon';
import { MarketingButton } from '../../../MarketingPagesShared/MarketingButton';
import { SECONDARY_MOBILE_LINKS } from '../../constants';
import { MarketingAppButtons } from '../../../MarketingPagesShared/MarketingAppButtons';

const getMobileAccountLinks = () => [
  { label: 'Update settings', to: '/dashboard/podcast/edit' },
  {
    label: 'Podcast availability',
    to: '/dashboard/podcast/distribution',
  },
];

const MobileNav = ({ links, isSignedIn, onLogOut, onClickClose, pathname }) => (
  <div className={styles.container}>
    <div className={styles.contentWrapper}>
      <div className={styles.topSection}>
        <Link
          to={isSignedIn ? '/dashboard' : '/'}
          aria-label="Anchor logo that navigates back to Home"
          className={styles.iconLink}
          onClick={() => {
            onClickClose();
            clickedNavLinkGoogleAnalytics('Home');
          }}
        >
          <Icon type="anchor_logo" fillColor="white" />
        </Link>
        <button
          className={styles.closeButton}
          on="tap:sidebar.close"
          type="button"
          tabIndex="0"
          onClick={onClickClose}
        >
          <span className={`${styles.closeLine} ${styles.closeLineOne}`} />
          <span className={`${styles.closeLine} ${styles.closeLineTwo}`} />
        </button>
      </div>
      <Content>
        <Nav>
          {links.map(
            ({
              label,
              href,
              to,
              openInNewTab,
              isShowingNotificationBadge,
              notificationBadge,
            }) => (
              <PrimaryLink
                key={label}
                isActive={pathname === (to || href)}
                onClick={() => {
                  onClickClose();
                  clickedNavLinkGoogleAnalytics(label);
                }}
                href={href}
                to={to}
                target={openInNewTab ? '_blank' : undefined}
              >
                <AnchorWrapper>
                  {label}
                  {isShowingNotificationBadge && (
                    <BadgeContainer>
                      <IconBadge
                        backgroundColor="green"
                        iconColor="#24203F"
                        width={10}
                        type={notificationBadge}
                      />
                    </BadgeContainer>
                  )}
                </AnchorWrapper>
              </PrimaryLink>
            )
          )}

          {isSignedIn &&
            getMobileAccountLinks().map(({ label, href, to, target }) => (
              <SecondaryLink
                to={to}
                key={label}
                href={href}
                onClick={!target ? onClickClose : () => {}}
                target={target}
                isActive={pathname === (to || href)}
              >
                {label}
              </SecondaryLink>
            ))}

          {(SECONDARY_MOBILE_LINKS || []).map(({ label, href, to, target }) => (
            <SecondaryLink
              key={label}
              isActive={pathname === (to || href)}
              onClick={() => {
                onClickClose();
                clickedNavLinkGoogleAnalytics(label);
              }}
              target={target}
              href={href}
              to={to}
            >
              {label}
            </SecondaryLink>
          ))}
        </Nav>
      </Content>

      {isSignedIn ? (
        <div className={styles.buttonContainer}>
          <MarketingButton kind="button" color="onDark" onClick={onLogOut}>
            Sign out
          </MarketingButton>
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <MarketingAppButtonsContainer>
            <MarketingAppButtons
              clickEventLocation="Menu"
              isRenderForMobileOnly={true}
            />
          </MarketingAppButtonsContainer>
          <MarketingButton
            kind="link"
            href="/signup"
            onClick={() => {
              onClickClose();
              clickedNavLinkGoogleAnalytics('Sign Up');
            }}
          >
            Sign up
          </MarketingButton>

          <MarketingButton
            kind="link"
            href="/login"
            color="onDark"
            onClick={() => {
              onClickClose();
              clickedNavLinkGoogleAnalytics('Log In');
            }}
          >
            Sign in
          </MarketingButton>
        </div>
      )}
    </div>
  </div>
);

const SMALL_WINDOW_HEIGHT = 500;

const MarketingAppButtonsContainer = styled.div`
  margin-bottom: 2vh;
  @media (max-height: ${SMALL_WINDOW_HEIGHT}px) {
    display: none;
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 0;
  right: -10px;
`;

const PrimaryLink = styled(Link)`
  color: white;
  line-height: 1.2;
  font-size: 2.8rem;
  font-weight: bold;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.8)};

  &:active,
  &:focus,
  &:hover,
  &:focus:active {
    color: white;
    text-decoration: none;
    opacity: 1;
  }
`;

const AnchorWrapper = styled.span`
  position: relative;
`;

const SecondaryLink = styled(PrimaryLink)`
  font-size: 2rem;
  font-weight: normal;
`;

const Nav = styled.nav`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 2vh;

  @media (max-height: ${SMALL_WINDOW_HEIGHT}px) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    a {
      margin-right: 10px;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin: 20px 0;
`;

MobileNav.defaultProps = {
  onLogOut: () => {},
  onClickClose: () => {},
  pathname: null,
};

MobileNav.propTypes = {
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

export { MobileNav };
