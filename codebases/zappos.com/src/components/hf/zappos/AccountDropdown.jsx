import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import { evNavigationClick, evTopLevelNavigationClick } from 'events/headerFooter';
import { IS_LOGIN_PAGE } from 'common/regex';
import PrimeLogo from 'components/icons/vipDashboard/PrimeLogo';
import VipOnlyLogo from 'components/icons/vipDashboard/VipOnlyLogo';
import Link from 'components/hf/HFLink';
import useFocusTrap from 'hooks/useFocusTrap';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { clearCartLocalStorage } from 'helpers/CartUtils';
import { track } from 'apis/amethyst';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/hf/zappos/accountDropdown.scss';

export const AccountDropdown = ({
  holmes,
  handleTopNavClick,
  handleTopNavCloseClick,
  isExpanded,
  isMobile,
  isRemote,
  openFederatedLoginModal,
  rewards: { rewardsInfo },
  areApisMocked,
  isInfluencer
}) => {

  const { testId, marketplace: { desktopBaseUrl, hasFederatedLogin, account: { vipDashboardUrl } } } = useMartyContext();

  const [showOutsideFavorites, setShowOutsideFavorites] = useState(false);

  useEffect(() => {
    const handleResize = debounce(() => {
      // move favorites and rewards outside of dropdown if room available
      const nav = document.querySelector('[data-headernav]');
      const acct = document.getElementById('headerMyAccountDropdownToggle');

      if (nav instanceof HTMLElement && acct instanceof HTMLElement) {
        const minDistanceFavorites = 350;
        const distance = acct.getBoundingClientRect().left - nav.getBoundingClientRect().right;
        const shouldShow = distance > minDistanceFavorites && !isMobile;
        setShowOutsideFavorites(shouldShow);
      }
    }, 100);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Change url to redirect back to where we started unless we're on a login page
  const makeLoginPathUrl = (pathname, search) => (!pathname.match(IS_LOGIN_PAGE) && !isRemote ? `/zap/preAuth/signin?openid.return_to=${pathname + encodeURIComponent(search)}` : '/login');

  const handleSignInClick = e => {
    e.preventDefault();

    if (hasFederatedLogin && !areApisMocked) {
      openFederatedLoginModal();
    } else {
      trackEvent('TE_HEADER_ACCOUNT_SIGNIN');
      trackLegacyEvent('Main-Nav', 'SignIn', 'LoginRegister');
      track(() => ([evTopLevelNavigationClick, {
        valueClicked: 'Sign In'
      }]));

      // Use `window` first because remote HF doesn't have its router synced up when remote.
      const { pathname, search } = window.location;
      const link = makeLoginPathUrl(pathname, search);
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    }
  };

  const handleSignOutClick = e => {
    e.preventDefault();
    clearCartLocalStorage();
    trackEvent('TE_HEADER_ACCOUNT_SIGNOUT');
    trackLegacyEvent('Main-Nav', 'Account', 'SignOut');
    track(() => ([
      evNavigationClick, {
        valueClicked: 'Sign Out',
        parentDropdown: 'My Account'
      }
    ]));
    window.location.href = `${desktopBaseUrl}/logout`;

  };

  const { canEnroll, consented, enrolled, prime } = rewardsInfo || {};
  const isRewardsMember = enrolled && consented;
  const canEnrollVerbiage = canEnroll && 'Sign up for Zappos VIP';
  const dashBoardLinkText = isRewardsMember ? 'VIP Dashboard' : canEnrollVerbiage;
  const focusRef = useFocusTrap({ active: isExpanded, shouldFocusFirstElement: true });

  if (holmes) {
    const { firstName } = holmes;
    return (
      <div className={css.accountInfo} data-test-id={testId('headerAccountDropdownContainer')}>
        {!isMobile && showOutsideFavorites && <Link
          data-test-id={testId('headerFavorites')}
          onClick={() => {
            trackEvent('TE_HEADER_ACCOUNT_FAVORITES');
            trackLegacyEvent('Main-Nav', 'Account', 'Favorites');
            track(() => ([
              evTopLevelNavigationClick, {
                valueClicked: 'Favorites'
              }
            ]));
          }}
          to="/account/favorites">Favorites</Link>}

        <Link
          className={css.toggleableHeaderIcon}
          id="headerMyAccountDropdownToggle"
          to="/account"
          data-test-id={testId('headerAccountToggle')}
          data-shyguy="headerMyAccountDropdownToggle"
          onClick={e => {
            handleTopNavClick(e);
            trackEvent('TE_HEADER_ACCOUNT_DROPDOWN');
            track(() => ([
              evTopLevelNavigationClick, {
                valueClicked: 'My Account'
              }
            ]));
          }}
          aria-label={`${isExpanded ? 'Close' : 'Open'} Account Menu`}
          aria-expanded={isExpanded}>
          {isMobile ? '' : 'My Account'}
        </Link>
        <div
          className={cn(css.dropdownContent, { [css.prime]: rewardsInfo && isRewardsMember && prime })}
          data-hfdropdown
          data-test-id={testId('headerMyAccountDropdown')}
          ref={focusRef}>
          <button
            type="button"
            data-test-id={testId('headerAccountClose')}
            data-close
            className={css.close}
            aria-label="Close My Account menu"
            onClick={handleTopNavCloseClick}/>
          <Link
            data-test-id={testId('headerWelcomeAccount')}
            className={css.heading}
            onClick={() => {
              trackEvent('TE_HEADER_ACCOUNT_WELCOME');
              track(() => ([
                evNavigationClick, {
                  valueClicked: 'Account Overview',
                  parentDropdown: 'My Account'
                }
              ]));
            }}
            to="/account">
            {firstName ?
              `Welcome back, ${decodeURIComponent(firstName)}!`
              : 'Welcome back!'
            }
          </Link>

          {
            rewardsInfo && (
              <p className={css.vipDashboard}>
                { consented && <VipOnlyLogo /> }
                { prime && <PrimeLogo fillColor="#01579b" /> }
              </p>
            )
          }

          {
            !!dashBoardLinkText && <Link
              data-test-id={testId('headerRewards')}
              onClick={() => {
                trackEvent('TE_HEADER_ACCOUNT_REWARDS');
                trackLegacyEvent('Main-Nav', 'Account', 'Rewards');
                track(() => ([
                  evNavigationClick, {
                    valueClicked: 'Rewards',
                    parentDropdown: 'My Account'
                  }
                ]));
              }}
              to={vipDashboardUrl}>{dashBoardLinkText}</Link>
          }

          {
            !rewardsInfo && <Link
              data-test-id={testId('headerRewards')}
              onClick={() => {
                trackEvent('TE_HEADER_ACCOUNT_REWARDS');
                trackLegacyEvent('Main-Nav', 'Account', 'Rewards');
                track(() => ([
                  evNavigationClick, {
                    valueClicked: 'Rewards',
                    parentDropdown: 'My Account'
                  }
                ]));
              }}
              to={vipDashboardUrl}>VIP Dashboard</Link>
          }
          <Link
            data-test-id={testId('headerOrderHistory')}
            onClick={() => {
              trackEvent('TE_HEADER_ACCOUNT_ORDER_HISTORY');
              trackLegacyEvent('Main-Nav', 'Account', 'OrderHistory');
              track(() => ([
                evNavigationClick, {
                  valueClicked: 'Order History',
                  parentDropdown: 'My Account'
                }
              ]));
            }}
            to="/orders">Order History</Link>

          <Link
            data-test-id={testId('headerAccountOverview')}
            onClick={() => {
              trackEvent('TE_HEADER_ACCOUNT_MYACCOUNT');
              trackLegacyEvent('Main-Nav', 'Account', 'MyAccount');
              track(() => ([
                evNavigationClick, {
                  valueClicked: 'Account Overview',
                  parentDropdown: 'My Account'
                }
              ]));
            }}
            to="/account">Account Overview</Link>
          {
            isInfluencer &&
            <Link
              data-test-id={testId('influencerHub')}
              onClick={() => {
                track(() => ([
                  evNavigationClick, {
                    valueClicked: 'Influencer Hub',
                    parentDropdown: 'My Account'
                  }
                ]));
              }}
              to="/influencer/hub">Influencer Hub</Link>
          }
          {!showOutsideFavorites && <Link
            data-test-id={testId('headerFavorites')}
            onClick={() => {
              trackEvent('TE_HEADER_ACCOUNT_FAVORITES');
              trackLegacyEvent('Main-Nav', 'Account', 'Favorites');
              track(() => ([
                evNavigationClick, {
                  valueClicked: 'Favorites',
                  parentDropdown: 'My Account'
                }
              ]));
            }}
            to="/account/favorites">Favorites</Link>}
          <Link
            data-test-id={testId('headerSignOut')}
            onClick={handleSignOutClick}
            to="/logout">{firstName && `Not ${firstName}? `}Sign Out</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={css.accountInfo}>
      <Link
        to="/login"
        data-test-id={testId('headerSignIn')}
        onClick={handleSignInClick}
        className={cn(css.heading, css.accountIcon)}
        aria-label="Sign In"
      >Sign In / Register
      </Link>
    </div>
  );
};

export default withErrorBoundary('AccountDropdown', AccountDropdown);
