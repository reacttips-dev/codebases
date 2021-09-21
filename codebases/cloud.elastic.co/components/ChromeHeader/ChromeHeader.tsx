/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import React, { Component, Fragment } from 'react'
import { FormattedMessage, defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import cx from 'classnames'

import {
  EuiAvatar,
  EuiButtonEmpty,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiHorizontalRule,
  EuiIcon,
  EuiPopover,
  EuiSkipLink,
} from '@elastic/eui'

import { CuiRouterLinkButtonEmpty } from '../../cui'

import Help from './Help'
import HeaderNavigation from './HeaderNavigation'

import SearchAnythingBox from '../SearchAnythingBox'
import UserSudoModal from '../UserSudoModal'
import CustomerProfile from '../CustomerProfile'
import { BreadcrumbsContainer } from '../Breadcrumbs'

import TrialBadge from '../CustomerProfile/TrialBadge'
import TrialModal from '../../apps/userconsole/components/TrialModal'

import { accountUrl } from '../../apps/userconsole/urls'
import { loginUrl, logoutUrl, userSettingsUrl } from '../../lib/urlBuilder'

import { hasPermission } from '../../lib/requiresPermission'
import { getUsername } from '../../lib/profile'

import Permission from '../../lib/api/v1/permissions'

import { ForwardedRefProps } from '../../lib/connectAndForwardRef'
import { CloudAppName, ProfileState, Theme } from '../../types'
import { DeploymentGetResponse } from '../../lib/api/v1/types'

import './chromeHeader.scss'

export interface Props extends ForwardedRefProps {
  loggedIn: boolean
  sudoFeature: boolean
  hasSudo: boolean
  hasUserSettings: boolean
  theme: Theme
  appName: CloudAppName
  profile: ProfileState
  setTheme: (theme: Theme) => void
  hideTrialIndicator?: boolean
  showHelp?: boolean
  getStackDeploymentById: (id: string) => DeploymentGetResponse | null
  isHeroku: boolean
  cloudPortalEnabled: boolean
  showBreadcrumbs?: boolean
  usernameFromToken: string | null
  userIdFromToken: string | null
}

interface State {
  isUserMenuOpen: boolean
  isSudoModalOpen: boolean
  isTrialModalOpen: boolean
}

const ariaMessages = defineMessages({
  ariaDarkMode: {
    id: 'chrome-header.aria-night-mode',
    defaultMessage: 'night mode',
  },
  ariaLightMode: {
    id: 'chrome-header.aria-day-mode',
    defaultMessage: 'day mode',
  },
  ariaSudo: {
    id: 'chrome-header.aria-sudo',
    defaultMessage: 'sudo',
  },
  ariaUserMenu: {
    id: 'chrome-header.aria-user-menu',
    defaultMessage: 'user menu',
  },
  ariaUserSettings: {
    id: 'chrome-header.aria-user-settings',
    defaultMessage: 'user-settings',
  },
  ariaLogout: {
    id: 'chrome-header.aria-log-out',
    defaultMessage: 'Log out',
  },
  ariaLogin: {
    id: 'chrome-header.aria-log-in',
    defaultMessage: 'Log in',
  },
})

/* !IMPORTANT: this component renders for logged out users too,
 * for example when the "Not Found" page renders for them.
 * As such, any components that render in here should be "logged in aware"
 * You can check whether the user is logged in via code like this:
 *
 * ```
 * const loggedIn: boolean = SAD_hasUnexpiredSession(state)
 * ```
 *
 * `SAD_hasUnexpiredSession` is exported from `lib/auth`.
 */
class ChromeHeader extends Component<Props & WrappedComponentProps, State> {
  state: State = {
    isUserMenuOpen: false,
    isSudoModalOpen: false,
    isTrialModalOpen: false,
  }

  render() {
    const { hasSudo, sudoFeature, forwardedRef, showBreadcrumbs = true } = this.props
    const { isSudoModalOpen, isTrialModalOpen } = this.state

    const headerClasses = cx({
      'chromeHeader--hasSudo': hasSudo && sudoFeature,
    })

    return (
      <header>
        <EuiSkipLink
          position='fixed'
          color='ghost'
          onClick={(e) => this.skipLink(e)}
          destinationId='cloudPortalPage'
        >
          <FormattedMessage
            id='cloud-header-nav.skip-links'
            defaultMessage='Skip to main content'
          />
        </EuiSkipLink>

        <EuiHeader className={headerClasses} data-test-id='page-header' theme='dark'>
          <HeaderNavigation />

          <EuiHeaderSection side='right'>
            {this.renderLoggedInSections()}

            <EuiHeaderSectionItem>{this.renderUserMenu()}</EuiHeaderSectionItem>
          </EuiHeaderSection>
        </EuiHeader>

        {showBreadcrumbs && <BreadcrumbsContainer ref={forwardedRef} />}

        {isSudoModalOpen && <UserSudoModal close={this.closeSudoModal} />}

        {isTrialModalOpen && <TrialModal close={this.closeTrialModal} />}
      </header>
    )
  }

  renderLoggedInSections() {
    const { appName, hideTrialIndicator, loggedIn, profile, showHelp } = this.props

    const showSearch = appName === 'adminconsole' && hasPermission(Permission.searchAllocators)
    const inTrial = profile && (profile.inTrial || profile.hasExpiredTrial)
    const hasExpiredTrial = profile && profile.hasExpiredTrial
    const trialDaysRemaining = profile && profile.trialDaysRemaining

    // Users that have not started their trial will have `trialDaysRemaining` be undefined
    const currentTrialUser = inTrial && trialDaysRemaining !== undefined

    if (!loggedIn) {
      return null
    }

    return (
      <Fragment>
        {showSearch && (
          <EuiHeaderSectionItem>
            <div data-test-id='headerSearchBar'>
              <SearchAnythingBox onBeforeExpand={() => this.closeUserMenu()} />
            </div>
          </EuiHeaderSectionItem>
        )}

        {currentTrialUser && !hideTrialIndicator && (
          <EuiHeaderSectionItem className='chromeHeader-trialUser'>
            <EuiButtonEmpty
              data-test-id='headerTrialBadgeButton'
              onClick={() => this.openTrialModal()}
            >
              <TrialBadge
                className='trialBadgeButton'
                hasExpiredTrial={hasExpiredTrial!}
                trialDaysRemaining={trialDaysRemaining!}
              />
            </EuiButtonEmpty>
          </EuiHeaderSectionItem>
        )}

        {showHelp && (
          <EuiHeaderSectionItem>
            <Help />
          </EuiHeaderSectionItem>
        )}
      </Fragment>
    )
  }

  renderUserMenu() {
    const {
      cloudPortalEnabled,
      hasUserSettings,
      intl: { formatMessage },
      loggedIn,
      setTheme,
      sudoFeature,
      theme,
    } = this.props

    const { isUserMenuOpen } = this.state

    return (
      <EuiPopover
        id='chromeHeader-userMenuPopover'
        anchorPosition='downCenter'
        panelPaddingSize='none'
        panelClassName='chromeHeader-userMenuPopover'
        ownFocus={true}
        isOpen={isUserMenuOpen}
        closePopover={() => this.closeUserMenu()}
        button={
          <EuiHeaderSectionItemButton
            onClick={() => this.toggleUserPopover()}
            data-test-id='userMenuButton'
            aria-label={formatMessage(ariaMessages.ariaUserMenu)}
          >
            {loggedIn ? (
              <EuiAvatar size='s' name={this.renderUsername()} />
            ) : (
              <EuiIcon type='glasses' size='m' />
            )}
          </EuiHeaderSectionItemButton>
        }
      >
        <div className='chromeHeader-popoverItem-header'>
          <CustomerProfile />
        </div>

        <EuiHorizontalRule margin='none' />

        {loggedIn && (hasUserSettings || cloudPortalEnabled) && (
          <CuiRouterLinkButtonEmpty
            to={userSettingsUrl()}
            onClick={() => {
              this.closeUserMenu()
            }}
            color='text'
            className='chromeHeaderLink'
            data-test-id='SettingsButton'
            iconType='user'
            aria-label={formatMessage(ariaMessages.ariaUserSettings)}
          >
            <span>
              <FormattedMessage id='chrome-header.settings' defaultMessage='Profile' />
            </span>
          </CuiRouterLinkButtonEmpty>
        )}

        {loggedIn && cloudPortalEnabled && (
          <div>
            <CuiRouterLinkButtonEmpty
              to={accountUrl()}
              onClick={() => {
                this.closeUserMenu()
              }}
              color='text'
              className='chromeHeaderLink'
              data-test-id='accountsBillingsButton'
              iconType='gear'
              aria-label={formatMessage(ariaMessages.ariaUserSettings)}
            >
              <span>
                <FormattedMessage
                  id='chrome-header.account-billing'
                  defaultMessage='Account & Billing'
                />
              </span>
            </CuiRouterLinkButtonEmpty>
          </div>
        )}

        {theme === `light` ? (
          <div>
            <EuiButtonEmpty
              onClick={() => {
                setTheme(`dark`)
                this.closeUserMenu()
              }}
              color='text'
              className='chromeHeaderLink'
              iconType='moon'
              aria-label={formatMessage(ariaMessages.ariaDarkMode)}
            >
              <FormattedMessage id='chrome-header.night-mode' defaultMessage='Night mode' />
            </EuiButtonEmpty>
          </div>
        ) : (
          <div>
            <EuiButtonEmpty
              onClick={() => {
                setTheme(`light`)
                this.closeUserMenu()
              }}
              color='text'
              className='chromeHeaderLink'
              iconType='moon'
              aria-label={formatMessage(ariaMessages.ariaLightMode)}
            >
              <span>
                <FormattedMessage id='chrome-header.light-mode' defaultMessage='Day mode' />
              </span>
            </EuiButtonEmpty>
          </div>
        )}

        {loggedIn && sudoFeature && (
          <div>
            <EuiButtonEmpty
              onClick={() => this.openSudoModal()}
              color='text'
              className='chromeHeaderLink'
              iconType='bolt'
              aria-label={formatMessage(ariaMessages.ariaSudo)}
            >
              <span>
                <FormattedMessage id='chrome-header.sudo' defaultMessage='Sudo' />
              </span>
            </EuiButtonEmpty>
          </div>
        )}

        {loggedIn ? (
          <div>
            <CuiRouterLinkButtonEmpty
              to={logoutUrl()}
              onClick={() => this.closeUserMenu()}
              color='text'
              className='chromeHeaderLink'
              data-test-id='LogoutButton'
              iconType='exit'
              aria-label={formatMessage(ariaMessages.ariaLogout)}
            >
              <span>
                <FormattedMessage id='chrome-header.log-out' defaultMessage='Log out' />
              </span>
            </CuiRouterLinkButtonEmpty>
          </div>
        ) : (
          <div>
            <CuiRouterLinkButtonEmpty
              to={loginUrl()}
              onClick={() => this.closeUserMenu()}
              color='text'
              className='chromeHeaderLink'
              data-test-id='LoginButton'
              iconType='user'
              aria-label={formatMessage(ariaMessages.ariaLogin)}
            >
              <span>
                <FormattedMessage id='chrome-header.log-in' defaultMessage='Log in' />
              </span>
            </CuiRouterLinkButtonEmpty>
          </div>
        )}
      </EuiPopover>
    )
  }

  renderUsername() {
    const {
      profile,
      userIdFromToken,
      usernameFromToken,
      isHeroku,
      intl: { formatMessage },
    } = this.props

    const avatarName = getUsername({ isHeroku, profile, userIdFromToken, usernameFromToken })

    if (!avatarName) {
      return formatMessage({
        id: 'customer-profile.unauthenticated',
        defaultMessage: 'Unauthenticated',
      })
    }

    return avatarName.toUpperCase()
  }

  skipLink(e) {
    e.preventDefault()

    // @ts-ignore
    if (document.querySelector('#cloudPortalPage')) {
      // @ts-ignore
      document
        .querySelector('#cloudPortalPage')
        .scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
  }

  toggleUserPopover() {
    const { isUserMenuOpen } = this.state
    this.setState({ isUserMenuOpen: !isUserMenuOpen })
  }

  openSudoModal = () => {
    this.setState({ isSudoModalOpen: true })
    this.closeUserMenu()
  }

  closeSudoModal = () => {
    this.setState({ isSudoModalOpen: false })
  }

  openTrialModal = () => {
    this.setState({ isTrialModalOpen: true })
    this.closeUserMenu()
  }

  closeTrialModal = () => {
    this.setState({ isTrialModalOpen: false })
  }

  closeUserMenu() {
    this.setState({ isUserMenuOpen: false })
  }
}

export default injectIntl(ChromeHeader)
