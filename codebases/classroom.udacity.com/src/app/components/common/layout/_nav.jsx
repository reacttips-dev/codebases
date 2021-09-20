import {
  IconCareers,
  IconCompass,
  IconFile,
  IconHome,
  IconLogout,
  IconSettings,
} from '@udacity/veritas-icons';
import { Nav, NavGroup, NavItem } from '@udacity/ureact-app-layout';

import AnalyticsService from 'services/analytics-service';
import AuthenticationService from 'services/authentication-service';
import LifeRaftIcon from 'src/assets/images/icons/life-raft';
import NotificationBadgeContainer from 'components/common/notification-badge/notification-badge-container';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { browserHistory } from 'react-router';
import classnames from 'classnames';
import styles from './_nav.scss';

const getNavItems = (isSmallNav, onToggleHelpSidebar, root) => {
  return {
    help: {
      title: __('Help'),
      children: (
        <div className={styles['unread-badge-container']}>
          <LifeRaftIcon size="lg" />
          <div className={styles['unread-badge']}>
            <NotificationBadgeContainer />
          </div>
        </div>
      ),
      onClick: () => {
        AnalyticsService.trackNavLink(
          onToggleHelpSidebar,
          'Help Sidebar Clicked',
          root
        );
      },
    },

    careers: {
      title: isSmallNav ? __('Careers') : __('Career Services'),
      children: <IconCareers title={__('Careers')} size="lg" />,
      onClick: () =>
        AnalyticsService.trackNavLink(
          () => window.open(CONFIG.careerPortalUrl, '_self'),
          'Career Portal Nav Clicked',
          root
        ),
    },

    home: {
      title: __('Home'),
      children: <IconHome title={__('Home')} size="lg" />,
      onClick: () =>
        AnalyticsService.trackNavLink(
          () => browserHistory.push('/me'),
          'Home Nav Clicked',
          root
        ),
    },

    enterprise: {
      title: isSmallNav ? __('Transcript') : __('Enterprise Transcript'),
      children: <IconFile title={__('Enterprise Transcript')} size="lg" />,
      onClick: () =>
        AnalyticsService.trackNavLink(
          () => window.open('https://emc.udacity.com', '_self'),
          'Enterprise Nav Clicked',
          root
        ),
    },

    catalog: {
      title: __('Catalog'),
      children: <IconCompass title={__('Catalog')} size="lg" />,
      onClick: () =>
        AnalyticsService.trackNavLink(
          () => window.open('https://www.udacity.com/courses/all', '_self'),
          'Catalog Nav Clicked',
          root
        ),
    },

    settings: {
      title: __('Settings'),
      children: <IconSettings title={__('Settings')} size="lg" />,
      onClick: () =>
        AnalyticsService.trackNavLink(
          () => browserHistory.push('/settings'),
          'Settings Nav Clicked',
          root
        ),
    },

    logout: {
      title: __('Logout'),
      children: <IconLogout title={__('Logout')} size="lg" />,
      onClick: () =>
        AnalyticsService.trackNavLink(
          () => AuthenticationService.signOut(),
          'Logout Nav Clicked',
          root
        ),
    },
  };
};

export const ClassroomNav = ({
  isHelpSidebarOpen,
  onToggleHelpSidebar,
  isEnterprise,
  variant,
  root,
}) => {
  const navVariant = variant === 'dashboard' ? 'small' : variant;
  const isSmallNav = navVariant === 'small';
  const navItems = getNavItems(isSmallNav, onToggleHelpSidebar, root);

  return (
    <Nav variant={navVariant} isEnterpriseOnly={isEnterprise}>
      <div className={isSmallNav ? styles['nav-group-with-sidebar'] : ''}>
        <NavGroup>
          <NavItem {...navItems.home} />
          <NavItem
            className={classnames(styles.help, {
              [styles.inactive]: !isHelpSidebarOpen,
              [styles.active]: isHelpSidebarOpen,
              [styles.full]: !isSmallNav,
            })}
            {...navItems.help}
          />
          {isEnterprise && <NavItem {...navItems.enterprise} />}
          {!isEnterprise && <NavItem {...navItems.catalog} />}
        </NavGroup>
      </div>

      <div className={isSmallNav ? styles['nav-group-with-sidebar'] : ''}>
        <NavGroup>
          <NavItem {...navItems.settings} />
          <NavItem {...navItems.logout} />
        </NavGroup>
      </div>
    </Nav>
  );
};

ClassroomNav.propTypes = {
  root: PropTypes.object,
  isHelpSidebarOpen: PropTypes.bool,
  onToggleHelpSidebar: PropTypes.func,
  isEnterprise: PropTypes.bool,
  variant: PropTypes.oneOf(['small', 'large', 'dashboard']),
};

export default ClassroomNav;
