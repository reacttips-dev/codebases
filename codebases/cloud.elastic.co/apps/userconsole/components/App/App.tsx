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

/* global FS */

import React, { Component, ReactNode, Fragment, createRef, RefObject } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import {
  EuiErrorBoundary,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
} from '@elastic/eui'

import { sha256 } from 'js-sha256'

import TrialModal from '../TrialModal'
import UserconsoleChromeNavigation from '../UserconsoleChromeNavigation'
import HotWarmNotification from '../HotWarmNotification'
import NotificationBanner from '../../components/NotificationBanner'
import IntercomChat from '../IntercomChat'

import { AppRouterContext } from '../../../../components/AppRouter'
import AppLoadingRoot from '../../../../components/AppLoadingRoot'
import ChromeHeader from '../../../../components/ChromeHeader'
import PhoneHomeData from '../../../../components/PhoneHome/Data'
import { UnhandledApplicationLoadError } from '../../../../components/ApplicationLoadError'
import { BreadcrumbsContext } from '../../../../components/Breadcrumbs'

import scheduler from '../../../../lib/scheduler'
import { logoutUrl } from '../../../../lib/urlBuilder'
import { isElasticStaff } from '../../../../lib/validateEmail'

import LocalStorageKey from '../../../../constants/localStorageKeys'
import { AsyncRequestState, ProfileState, RootConfig } from '../../../../types'
import { AppConfig } from '../../../../../config/types'

export interface Props {
  config: AppConfig
  fetchProfileIfNeeded: () => Promise<any>
  fetchRootIfNeeded: (config: AppConfig) => Promise<any>
  fetchRootRequest: AsyncRequestState
  isFullStoryActivated: boolean
  isPortalRoute?: boolean
  isCreateUrl: boolean
  isRouteFSTraced?: boolean
  intercomChatFeature: boolean
  pollingInterval: number
  profile: ProfileState
  root: RootConfig
  children: ReactNode
  isGettingStartedUrl: boolean
}

interface State {
  scheduler: {
    start: () => void
    stop: () => void
  }
  initializedFullStory: boolean
  isTrialModalDismissed: boolean
}

class App extends Component<Props, State> {
  state: State = {
    scheduler: scheduler({
      interval: this.props.pollingInterval,
    }),
    initializedFullStory: false,
    isTrialModalDismissed:
      localStorage.getItem(LocalStorageKey.trialExperienceDismissed) === 'true',
  }

  breadcrumbsRef: RefObject<HTMLDivElement> | null = createRef<HTMLDivElement>()

  static childContextTypes: { scheduler: any }

  getChildContext() {
    return {
      scheduler: this.state.scheduler,
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const { profile, isFullStoryActivated } = nextProps
    const { initializedFullStory } = prevState

    if (profile != null && isFullStoryActivated && !initializedFullStory) {
      const hashedId = sha256(profile.user_id.toString())

      FS.identify(hashedId)
      FS.setUserVars({
        trial: profile.inTrial,
        hasExpiredTrial: profile.hasExpiredTrial,
        level: profile.level,
        isElasticStaff: isElasticStaff(profile.email),
      })

      return {
        initializedFullStory: true,
      }
    }

    return null
  }

  componentDidMount() {
    const { config, fetchRootIfNeeded, fetchProfileIfNeeded } = this.props

    fetchRootIfNeeded(config)
    fetchProfileIfNeeded()

    if (this.isPollingEnabled()) {
      this.state.scheduler.start()
    }
  }

  componentWillUnmount() {
    this.state.scheduler.stop()
  }

  render() {
    const {
      root,
      profile,
      fetchRootRequest,
      intercomChatFeature,
      isPortalRoute,
      isCreateUrl,
      isGettingStartedUrl,
    } = this.props
    const { isTrialModalDismissed } = this.state
    const isGettingStartedRoute = isCreateUrl || isGettingStartedUrl
    const inTrial = profile?.inTrial

    if (root.error && !fetchRootRequest.inProgress) {
      return (
        <UnhandledApplicationLoadError error={root.error}>
          <FormattedMessage
            id='app-index.fetching-the-root-resource-failed-link'
            defaultMessage='Fetching the root resource failed. {logOut}'
            values={{
              logOut: (
                <Link to={logoutUrl()}>
                  <FormattedMessage id='app-index.log-out' defaultMessage='Log out' />
                </Link>
              ),
            }}
          />
        </UnhandledApplicationLoadError>
      )
    }

    return (
      <Fragment>
        {profile && profile.hasExpiredTrial && !isTrialModalDismissed && (
          <TrialModal close={this.onDismissTrialModal} />
        )}

        {isPortalRoute || (
          <ChromeHeader
            showBreadcrumbs={inTrial ? !isGettingStartedRoute : true}
            ref={this.breadcrumbsRef}
            showHelp={true}
          />
        )}

        {isPortalRoute || <NotificationBanner />}

        {this.renderContent()}

        {intercomChatFeature && <IntercomChat />}
      </Fragment>
    )
  }

  renderContent() {
    const {
      root,
      profile,
      isPortalRoute,
      children,
      isCreateUrl,
      isGettingStartedUrl,
      isRouteFSTraced,
    } = this.props
    const isGettingStartedRoute = isCreateUrl || isGettingStartedUrl

    if (root.isFetching || root.hrefs === undefined || profile == null) {
      return <AppLoadingRoot />
    }

    const pageContents = (
      <Fragment>
        <HotWarmNotification />
        <PhoneHomeData />

        <EuiErrorBoundary>
          <BreadcrumbsContext.Provider value={{ breadcrumbsRef: this.breadcrumbsRef }}>
            {children}
          </BreadcrumbsContext.Provider>
        </EuiErrorBoundary>
      </Fragment>
    )

    // portal renders its own `<EuiPage>` frame
    if (isPortalRoute) {
      return pageContents
    }

    return (
      <EuiPage className={cx({ 'fs-unmask': isRouteFSTraced })}>
        {!isGettingStartedRoute && (
          <aside className='cloudSidebar'>
            <AppRouterContext.Consumer>
              {({ routes }) => <UserconsoleChromeNavigation routes={routes} />}
            </AppRouterContext.Consumer>
          </aside>
        )}

        <div
          className={cx('cloudContent', { createPage: isGettingStartedRoute })}
          id='cloudPortalPage'
        >
          <EuiPageBody>
            <EuiPageContent className='cloudContentBody' paddingSize='m'>
              <EuiPageContentBody data-app='appContentBody'>{pageContents}</EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </div>
      </EuiPage>
    )
  }

  isPollingEnabled() {
    return this.props.pollingInterval > 0
  }

  onDismissTrialModal = () => {
    localStorage.setItem(LocalStorageKey.trialExperienceDismissed, 'true')
    this.setState({ isTrialModalDismissed: true })
  }
}

App.childContextTypes = {
  scheduler: PropTypes.object.isRequired,
}

export default App
