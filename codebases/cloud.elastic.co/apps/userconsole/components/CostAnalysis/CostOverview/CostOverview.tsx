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

import React, { PureComponent, ReactElement } from 'react'

import { EuiFlexGroup, EuiFlexItem, EuiLoadingContent, EuiPanel } from '@elastic/eui'

import { CuiAlert } from '../../../../../cui'

import TrialNotStarted from '../TrialNotStarted'
import TrialStarted from '../TrialStarted'
import CostAnalysisWhenSubscribed from '../CostAnalysisWhenSubscribed'

import { isTrialNotStartedUser, isTrialUser } from '../../../../../lib/billing'

import {
  AccountCosts,
  AccountCostsSummary,
  AsyncRequestState,
  UserProfile,
} from '../../../../../types'

interface Props {
  accountCosts: AccountCosts
  accountCostOverview: AccountCostsSummary
  fetchAccountCostOverviewIfNeeded: ({ organizationId }: { organizationId: string }) => void
  fetchAccountCostOverviewRequest: AsyncRequestState
  fetchAccountCostsRequest: AsyncRequestState
  fetchProfileRequest: AsyncRequestState
  profile: UserProfile
}

class CostOverview extends PureComponent<Props> {
  componentDidMount(): void {
    const { fetchAccountCostOverviewIfNeeded, profile } = this.props
    const { organization_id } = profile

    if (!isTrialNotStartedUser(profile)) {
      fetchAccountCostOverviewIfNeeded({ organizationId: organization_id! })
    }
  }

  render(): ReactElement {
    const { accountCostOverview, fetchAccountCostOverviewRequest, fetchProfileRequest, profile } =
      this.props
    const { inTrial } = profile

    if (fetchAccountCostOverviewRequest.error) {
      return <CuiAlert type='error'>{fetchAccountCostOverviewRequest.error}</CuiAlert>
    }

    if (
      fetchProfileRequest.inProgress ||
      fetchAccountCostOverviewRequest.inProgress ||
      (!accountCostOverview && !isTrialNotStartedUser(profile))
    ) {
      return (
        <EuiFlexGroup gutterSize='l'>
          <EuiFlexItem>{this.renderPanelLoading()}</EuiFlexItem>
          <EuiFlexItem>{this.renderPanelLoading()}</EuiFlexItem>
          {!inTrial && <EuiFlexItem>{this.renderPanelLoading()}</EuiFlexItem>}
        </EuiFlexGroup>
      )
    }

    return this.renderUserContextOverview()
  }

  renderPanelLoading(): ReactElement {
    return (
      <EuiPanel paddingSize='m'>
        <EuiLoadingContent lines={3} />
      </EuiPanel>
    )
  }

  renderUserContextOverview(): ReactElement {
    const { accountCostOverview, profile } = this.props

    if (isTrialUser(profile)) {
      if (isTrialNotStartedUser(profile)) {
        return <TrialNotStarted />
      }

      return this.renderTrialStartedView()
    }

    if (accountCostOverview.isTrialConversionUser) {
      return this.renderTrialStartedView()
    }

    return (
      <CostAnalysisWhenSubscribed accountCostOverview={accountCostOverview} profile={profile} />
    )
  }

  renderTrialStartedView(): ReactElement {
    const { accountCostOverview, accountCosts } = this.props

    return (
      <TrialStarted
        deployments={accountCosts && accountCosts.deployments}
        accountCostOverview={accountCostOverview}
      />
    )
  }
}

export default CostOverview
