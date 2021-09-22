import React, { Component, Fragment } from 'react'
import { Skeleton, Box, Icon, Action } from '@invisionapp/helios-one-web'
import PropTypes from 'prop-types'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import { SPACE_PERMISSIONS_WARNING_MODAL } from '../../constants/modal-types'
import { APP_SIDEBAR_OPENED, APP_SIDEBAR_CONDENSED } from '../../constants/tracking-events'

import Logo from './Logo'
import Links from './Links'
import Spaces from './Spaces'
import TeamSwitcher from './TeamSwitcher'

import PortalModal from './PortalModal'

import ProjectSidebar from '../project-sidebar/'

import styles from './css/sidebar.css'
import { hasSidebarTeamsPages } from '../../utils/appShell'

class Sidebar extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    hidden: PropTypes.bool,
    modal: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    rootHidden: PropTypes.bool,
    selected: PropTypes.object,
    serverActions: PropTypes.object.isRequired,
    sidebar: PropTypes.object.isRequired,
    style: PropTypes.object,
    width: PropTypes.string.isRequired,
    enablePaginatedSpacesSidebarListing: PropTypes.bool
  };

  static defaultProps = {
    rootHidden: false,
    style: {}
  };

  state = {
    closeTeamSwitcher: false,
    isHovered: false,
    shouldShowHiddenUI: false
  };

  componentDidMount () {
    // Make necessary server requests
    if (this.props.account.isLoading) { this.props.serverActions.getAccount.request() }
    if (this.props.permissions.isLoading) { this.props.serverActions.getPermissions.request() }
    if (this.props.config.isLoading) { this.props.serverActions.getConfig.request() }
    if (this.props.subscription.isLoading) { this.props.serverActions.getSubscription.request() }
    window.addEventListener('popstate', this.forceRender)
  }

  componentDidUpdate (prevProps) {
    if (this.props.showModal && this.props.showModal !== prevProps.showModal) {
      this.props.actions.showModal(this.props.showModal, this.props.modalData)
    }

    // check flag change enablePaginatedSpacesSidebar
    const prevEnablePaginatedSpacesSidebarFlag = prevProps.account.flags.enablePaginatedSpacesSidebarListing
    const currentEnablePaginatedSpacesSidebarFlag = this.props.account.flags.enablePaginatedSpacesSidebarListing
    if (prevEnablePaginatedSpacesSidebarFlag !== currentEnablePaginatedSpacesSidebarFlag) {
      if (this.props.spaces.isLoading && currentEnablePaginatedSpacesSidebarFlag === false) {
        this.props.serverActions.getMySpaces.request()
      }
    }

    const didSubscriptionFinishLoading = !this.props.subscription.isLoading && prevProps.subscription.isLoading
    const didAccountFinishLoading = !this.props.account.isLoading && prevProps.account.isLoading

    // Freehand only users should see a collapsed sidebar by default. The sidebar defaults to expanded
    // for all users. This code will toggle that.
    if (didAccountFinishLoading && this.props.isFreeHandOnlySeat) {
      this.toggleCondensedSidebar()
    } else if (didSubscriptionFinishLoading && this.props.isFreeHandOnlyTeam) {
      this.toggleCondensedSidebar()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('popstate', this.forceRender)
  }

  forceRender = () => {
    // This is to get the new window.history.location in render, so it updates the active
    // link when the route changes
    this.forceUpdate()
  };

  toggleSidebar = () => {
    this.props.actions.trackEvent(APP_SIDEBAR_OPENED, {
      closing: this.props.sidebar.open
    })

    this.props.actions.toggleSidebar()
  };

  closeSidebar = () => {
    const {
      sidebar: { open }
    } = this.props
    if (open) {
      this.props.actions.trackEvent(APP_SIDEBAR_OPENED, {
        closing: true
      })
      this.props.actions.toggleSidebar()
    }
  };

  toggleCondensedSidebar = () => {
    const { sidebar: { isCondensed } } = this.props
    this.props.actions.trackEvent(APP_SIDEBAR_CONDENSED, {
      closing: isCondensed
    })

    this.props.actions.toggleCondensedSidebar()

    if (isCondensed === false) {
      this.setState(() => ({
        isHovered: false,
        shouldShowHiddenUI: false
      }))
    }
    this.setState({ closeTeamSwitcher: true }, () => {
      this.setState({ closeTeamSwitcher: false })
    })
  };

  handleMoveToSpace = (selected, space) => {
    const { hasPublic, hasPrivate } = this.props.selected
    if ((space.isPublic && hasPrivate) || (!space.isPublic && hasPublic)) {
      this.props.actions.showModal(SPACE_PERMISSIONS_WARNING_MODAL, { space })
    } else {
      this.props.serverActions.moveDocumentsToSpace.request(selected, space.id)
    }
  };

  handleMoveToProject = (selected, space, projectId, projectTitle) => {
    const { hasPublic, hasPrivate } = this.props.selected
    if ((space.isPublic && hasPrivate) || (!space.isPublic && hasPublic)) {
      this.props.actions.showModal(SPACE_PERMISSIONS_WARNING_MODAL, { space, projectId, projectTitle, moveToProject: true })
    } else {
      this.props.serverActions.moveDocumentsToProject.request(selected, space, projectId, projectTitle)
    }
  };

  handleOverlayClick = () => {
    if (!this.state.closeTeamSwitcher) {
      this.setState({ closeTeamSwitcher: true }, () => {
        this.setState({ closeTeamSwitcher: false })
      })
    }
    this.props.actions.toggleSidebar()
  };

  handleScroll = (_) => {
    this.setState({
      onScroll: true
    })
    this.debounceScroll()
  };

  debounceScroll = debounce((_) => {
    this.setState({
      onScroll: false
    })
  }, 600);

  handleMouseEnter = () => {
    this.setState({
      isHovered: true,
      shouldShowHiddenUI: true
    })
  }

  handleFocus = () => {
    this.setState({
      isHovered: true,
      shouldShowHiddenUI: true
    })
  }

  handleMouseLeave = () => {
    const {
      sidebar: { isCondensed }
    } = this.props
    this.setState({
      isHovered: false,
      shouldShowHiddenUI: false,
      closeTeamSwitcher: isCondensed
    }, () => {
      this.setState({ closeTeamSwitcher: false })
    })
  }

  render () {
    // Hide sidebar until account data is loaded. For now, that is because
    // freehand only users should default to a collapsed sidebar
    if (this.props.account.isLoading) {
      return null
    }

    const {
      actions,
      account,
      config,
      hidden,
      modal,
      permissions,
      selected,
      serverActions,
      sidebar: { location, open, teamSettingsOpen, isCondensed },
      spaces: { error, isLoading },
      width
    } = this.props

    const { closeTeamSwitcher, isHovered, shouldShowHiddenUI } = this.state
    const { linkClicked } = actions
    const { enablePaginatedSpacesSidebarListing } = account.flags

    const { appShell } = window.inGlobalContext

    const links = [
      {
        label: 'Documents',
        icon: <Icon name='Documents' size='24' color='surface-100' isDecorative />,
        href: '/',
        as: 'a',
        external: false
      },
      {
        label: 'Spaces',
        icon: <Icon name='Spaces' size='24' color='surface-100' isDecorative />,
        href: '/spaces',
        as: 'a',
        external: false
      },
      {
        label: 'Design Systems',
        icon: <Icon name='DesignSystems' size='24' color='surface-100' isDecorative />,
        href: '/dsm',
        as: 'a',
        external: true
      }
    ]
    if (hasSidebarTeamsPages() && !account.team.isGuest) {
      links.push({
        label: 'People',
        icon: <Icon name='Teams' size='24' color='surface-100' isDecorative />,
        href: '/teams/people/members',
        as: 'a',
        external: false
      })
    }

    return (
      <Fragment>
        <PortalModal
          {...this.props}
          account={account}
          config={config}
          closeModal={actions.closeModal}
          createdSpaceData={modal.createdSpaceData}
          createdProjectData={modal.createdProjectData}
          error={modal.error}
          errorCode={modal.errorCode}
          handleTrackEvent={actions.trackEvent}
          isCreating={modal.isCreating}
          open={modal.open}
          modalData={modal.modalData}
          serverActions={serverActions}
          type={modal.type}
        />

        <Box
          className={cx(styles.root, {
            [styles.isHovered]: isHovered,
            [styles.hidden]: hidden,
            [styles.visible]: open && !hidden,
            [styles.isCondensed]: isCondensed,
            [styles.transitioning]: this.props.transitioning
          })}
          style={{ width, ...this.props.style }}
          flexDirection='col'
          alignItems='stretch'
          flexWrap='no-wrap'
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onFocus={this.handleFocus}
        >
          <Action
            as='a'
            href={`#app-shell:feature-root:${appShell.currentApp.getFeatureContext().featureName}`}
            className={styles.skipLink}
          >
            Skip to main content
          </Action>
          <Logo
            open={open}
            linkClicked={linkClicked}
            teamSettingsOpen={teamSettingsOpen}
            toggleSidebar={this.toggleSidebar}
            toggleCondensedSidebar={this.toggleCondensedSidebar}
            isCondensed={isCondensed}
            isHovered={isHovered}
          />

          <div
            className={cx(styles.linksWrap, {
              [styles.withScrollbar]: enablePaginatedSpacesSidebarListing === false && this.state && this.state.onScroll, // TODO: remove feature flag when ready
              [styles.linksWrapCurrentScroll]: enablePaginatedSpacesSidebarListing === false // TODO: remove feature flag when ready
            })}
            onScroll={enablePaginatedSpacesSidebarListing === false ? this.handleScroll : null}
          >
            <Links
              account={account}
              handleTrackEvent={actions.trackEvent}
              linkClicked={linkClicked}
              links={links}
              location={location}
              open={open}
              closeSidebar={this.closeSidebar}
              isCondensed={isCondensed}
              shouldShowHiddenUI={shouldShowHiddenUI}
            />

            {hasSidebarTeamsPages() && account.isLoading && (
              <div className={styles.peopleLinkSkeleton}>
                <Skeleton height={16} />
                <Skeleton height={16} />
              </div>
            )}

            <Spaces
              canCreateSpaces={permissions.createSpaces}
              enableProjectsSupport={account.flags.spaceProjectsEnabled}
              permissionsLoading={permissions.isLoading}
              closeSidebar={this.closeSidebar}
              error={error}
              handleTrackEvent={actions.trackEvent}
              showProjectInSpace={actions.showProjectInSpace}
              isLoading={isLoading}
              linkClicked={linkClicked}
              linkCount={links.length}
              location={location}
              moveDocumentsToSpace={this.handleMoveToSpace}
              moveDocumentsToProject={this.handleMoveToProject}
              open={open}
              loadSpaces={enablePaginatedSpacesSidebarListing === true ? serverActions.getSpaceResources.request : serverActions.getMySpaces.request}
              loadProjects={serverActions.getProjects.request}
              selected={selected}
              showCreateSpaceModal={actions.showCreateSpaceModal}
              showCreateProjectModal={actions.showCreateProjectModal}
              enablePaginatedSpacesSidebarListing={enablePaginatedSpacesSidebarListing}
              isCondensed={isCondensed}
              shouldShowHiddenUI={shouldShowHiddenUI}
              projectsPrototypeUIEnabled={account.flags.projectsPrototypeUIEnabled}
            />
          </div>

          <div className={styles.spacer} />

          {!this.props.rootHidden && (
            <TeamSwitcher
              account={account}
              closeTeamSwitcher={closeTeamSwitcher}
              handleTrackEvent={actions.trackEvent}
              initiallyOpen={teamSettingsOpen}
              linkClicked={linkClicked}
              location={location}
              toggleTeamSettings={actions.toggleTeamSettings}
              transitioning={this.props.transitioning}
              isCondensed={isCondensed}
              isHovered={isHovered}
              shouldShowHiddenUI={shouldShowHiddenUI}
            />
          )}
        </Box>

        { this.props.projectSidebarId !== '' &&
          <ProjectSidebar projectId={this.props.projectSidebarId} />
        }

        {!this.props.rootHidden && !this.props.hidden && (
          <div
            className={`${styles.overlay} ${open ? styles.active : ''}`}
            onClick={this.handleOverlayClick}
          />
        )}
      </Fragment>
    )
  }
}

export default Sidebar
