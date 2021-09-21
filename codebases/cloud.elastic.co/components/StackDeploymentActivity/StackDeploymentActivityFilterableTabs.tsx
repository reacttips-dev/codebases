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

import { filter, groupBy, mapValues, map } from 'lodash'
import React, { Component, Fragment, ReactNode } from 'react'

import { EuiSpacer } from '@elastic/eui'

import {
  ControlledFilterQuery,
  CuiJsonBlobDownloadButton,
  executeReplacedQuery,
  OnFilterChangeParams,
} from '../../cui'

import DeploymentActivityFilterContext, {
  getSchema,
  getQueryExecutor,
} from './DeploymentActivityFilterContext'

import StackDeploymentActivityTabs, {
  ActivityTabId,
  getAllPlanAttempts,
} from './StackDeploymentActivityTabs'

import { getFileTimestamp } from '../../lib/prettyTime'

import { ResourceChangeAttempt, StackDeployment } from '../../types'

export type ActivityTab = {
  id: ActivityTabId
  title: ReactNode
  content: ReactNode
}

type Props = {
  deployment: StackDeployment
  showTab?: (tab: ActivityTabId) => boolean
  selectedTab: ActivityTabId
  onTabSelect: (tab: ActivityTabId) => void
  initialQuery?: ControlledFilterQuery
  onQueryChange?: (params: { queryText: ControlledFilterQuery }) => void
  downloadActivityFeature?: boolean
}

type DefaultProps = {
  showTab: (tab: ActivityTabId) => boolean
}

type State = {
  query: ControlledFilterQuery
  queryResults: ResourceChangeAttempt[]
}

class StackDeploymentActivityFilterableTabs extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps = {
    showTab: () => true,
  }

  state: State = {
    query: this.props.initialQuery || ``,
    queryResults: [],
  }

  render() {
    const { deployment, downloadActivityFeature } = this.props
    const { query } = this.state

    const planAttempts = getAllPlanAttempts({ deployment })
    const downloadablePlans = this.getPlanAttemptsForDownload()

    const tools = downloadActivityFeature
      ? [
          <CuiJsonBlobDownloadButton
            data={downloadablePlans}
            fileName={`activity-${deployment.id.slice(0, 6)}-${getFileTimestamp()}.json`}
            key='download-activity-button-json'
          />,
        ]
      : null

    return (
      <Fragment>
        <DeploymentActivityFilterContext
          query={query}
          onChange={this.onChange}
          planAttempts={planAttempts}
          tools={tools}
        />

        {this.renderTabs()}
      </Fragment>
    )
  }

  renderTabs() {
    const { deployment, selectedTab, onTabSelect, showTab } = this.props
    const { queryResults } = this.state

    return (
      <Fragment>
        <EuiSpacer size='l' />

        <StackDeploymentActivityTabs
          deployment={deployment}
          planAttempts={queryResults}
          showTab={showTab}
          selectedTab={selectedTab}
          onTabSelect={onTabSelect}
          filterByPlanAttempt={this.filterByPlanAttempt}
        />
      </Fragment>
    )
  }

  onChange = ({ queryText, queryResults }: OnFilterChangeParams<ResourceChangeAttempt>) => {
    const { onQueryChange } = this.props

    this.setState({
      query: queryText,
      queryResults,
    })

    if (onQueryChange) {
      onQueryChange({ queryText })
    }
  }

  setQuery = ({ queryText }) => {
    const { deployment } = this.props
    const { schema } = getSchema()
    const executeQuery = getQueryExecutor()
    const planAttempts = getAllPlanAttempts({ deployment })

    const replaceQuery = executeReplacedQuery<ResourceChangeAttempt>({
      executeQuery,
      queryText,
      records: planAttempts,
      schema,
    })

    this.onChange(replaceQuery)
  }

  filterByPlanAttempt = (planAttemptId: string) => {
    this.setQuery({ queryText: planAttemptId })
  }

  getPlanAttemptsForDownload = () => {
    const { selectedTab } = this.props
    const { queryResults } = this.state

    if (selectedTab !== `_all`) {
      return prettifyForDownload(
        filter<ResourceChangeAttempt>(queryResults, { resourceType: selectedTab }),
      )
    }

    return prettifyForDownload(queryResults)

    function prettifyForDownload(plans: ResourceChangeAttempt[]) {
      const groups = groupBy(plans, `resourceType`)
      const prettifiedGroups = mapValues(groups, (g) => map(g, `planAttempt`))

      return prettifiedGroups
    }
  }
}

export default StackDeploymentActivityFilterableTabs
