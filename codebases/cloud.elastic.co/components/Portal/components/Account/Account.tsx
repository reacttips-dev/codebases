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

import React, { Fragment, PureComponent, ReactElement } from 'react'
import { RouteComponentProps } from 'react-router'
import { FormattedMessage } from 'react-intl'
import cx from 'classnames'

import { EuiSpacer, EuiTabbedContentTab } from '@elastic/eui'

import PortalPage from '../PortalPage'
import Billing from '../../../../apps/userconsole/components/Billing'
import BillingHistory from '../../../../apps/userconsole/components/BillingHistory'
import CostAnalysis from '../../../../apps/userconsole/components/CostAnalysis'
import AccountDetails from '../../../../apps/userconsole/components/AccountDetails'

import {
  accountContactsCrumbs,
  accountBillingCrumbs,
  accountBillingHistoryCrumbs,
  accountActivityCrumbs,
  costAnalysisCrumbs,
} from '../../../../lib/crumbBuilder'

import { UserProfile, RoutableBreadcrumb } from '../../../../types'

import './account.scss'

interface Props extends RouteComponentProps {
  location: RouteComponentProps['location']
  profile: UserProfile
  showAccountActivityTab: boolean
  showBillingTab: boolean
  isRouteFSTraced?: boolean
}

interface State {
  breadcrumbs: RoutableBreadcrumb[]
  initialSelectedTab?: EuiTabbedContentTab
  tabs: EuiTabbedContentTab[]
}

class Account extends PureComponent<Props, State> {
  state = {
    breadcrumbs: [],
    initialSelectedTab: undefined,
    tabs: [],
  }

  componentDidMount(): void {
    this.setTabsAndBreadcrumbs()
  }

  render(): ReactElement | null {
    const { isRouteFSTraced } = this.props
    const { breadcrumbs, tabs, initialSelectedTab } = this.state

    if (!initialSelectedTab) {
      return null
    }

    return (
      <PortalPage
        breadcrumbs={breadcrumbs}
        className={cx({ 'fs-unmask': isRouteFSTraced }, 'cloud-portal-account')}
        contentHeader={
          <FormattedMessage id='cloud.account.title' defaultMessage='Account and Billing' />
        }
        tabbedContent={{ tabs, initialSelectedTab: initialSelectedTab! }}
      />
    )
  }

  renderTabContent(content: ReactElement): ReactElement {
    return (
      <Fragment>
        <EuiSpacer size='m' />
        {content}
      </Fragment>
    )
  }

  getTabs(): { tabs: EuiTabbedContentTab[]; initialSelectedTab: EuiTabbedContentTab } {
    const { location, showAccountActivityTab, showBillingTab } = this.props
    const tabs: EuiTabbedContentTab[] = []

    if (showAccountActivityTab) {
      tabs.push({
        id: 'usage',
        name: 'Usage',
        content: this.renderTabContent(<CostAnalysis data-test-id='account-index-usage-link' />),
      })
    }

    if (showBillingTab) {
      tabs.unshift({
        id: 'billing',
        name: 'Overview',
        content: this.renderTabContent(<Billing data-test-id='account-index-billing-link' />),
      })

      tabs.push({
        id: 'billing-history',
        name: 'Billing history',
        content: this.renderTabContent(
          <BillingHistory data-test-id='account-index-billing-history-link' />,
        ),
      })
    }

    tabs.push({
      id: 'contacts',
      name: 'Contacts',
      content: this.renderTabContent(<AccountDetails data-test-id='account-index-contacts-link' />),
    })

    const initialSelectedTab = tabs.filter(
      (tab) => tab.id === location.pathname.split('/').pop(),
    )[0]

    return { tabs, initialSelectedTab: initialSelectedTab ? initialSelectedTab : tabs[0] }
  }

  getBreadcrumbs(initialSelectedTab: EuiTabbedContentTab): RoutableBreadcrumb[] {
    const crumbs = {
      contacts: accountContactsCrumbs,
      usage: costAnalysisCrumbs,
      billing: accountBillingCrumbs,
      'billing-history': accountBillingHistoryCrumbs,
      activity: accountActivityCrumbs,
    }

    return crumbs[initialSelectedTab.id]()
  }

  setTabsAndBreadcrumbs(): void {
    const { tabs, initialSelectedTab } = this.getTabs()

    this.setState({
      tabs,
      initialSelectedTab,
      breadcrumbs: this.getBreadcrumbs(initialSelectedTab),
    })
  }
}

export default Account
