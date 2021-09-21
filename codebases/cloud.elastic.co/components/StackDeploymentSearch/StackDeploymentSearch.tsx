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

import { isEmpty, isEqual } from 'lodash'

import React, { Component, Fragment } from 'react'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiFilterButton, EuiIcon, EuiLoadingContent, EuiSpacer, EuiToolTip } from '@elastic/eui'

import {
  CuiAlert,
  getFilterQueryString,
  isEmptyQuery,
  setFilterQueryString,
  OnFilterChangeParams,
} from '../../cui'

import DeploymentFilterContext, { getEsQuery } from './DeploymentFilterContext'

import DeploymentList from './DeploymentList'
import DeploymentsSchedule from './DeploymentsSchedule'
import CreateDeploymentLink from './CreateDeploymentLink'
import CreateFirstDeployment from './CreateFirstDeployment'
import ExportDeploymentsModal from './ExportDeploymentsModal'
import IlmTemplateMigrationCallout from '../IlmMigration/IlmTemplateMigrationCallout'

import UnSubscribedMarketPlaceUserCallout from '../MarketPlace/UnSubscribedMarketPlaceUserCallout'

import TrialState from './TrialState'
import Header from '../Header'

import { deploymentsCrumbs } from '../../lib/crumbBuilder'

import {
  disableDeploymentButton,
  disableDeploymentCreation,
} from '../../lib/deployments/newDeployment'
import { startPageActions } from '../../lib/apm'
import { isMarketPlaceUser, isUnSubscribedMarketPlaceUser } from '../../lib/marketPlace'

import searchDeploymentsQuery from './searchDeploymentsQuery'

import LocalStorageKey from '../../constants/localStorageKeys'

import {
  DeploymentsSearchResponse,
  DeploymentSearchResponse,
  SearchRequest,
} from '../../lib/api/v1/types'

import { AsyncRequestState, ProfileState, UserSubscription } from '../../types'

type StateProps = {
  deletedDeploymentIds: string[]
  searchResults: DeploymentsSearchResponse | null
  searchResultsRequest: AsyncRequestState
  profile: ProfileState
  subscription?: UserSubscription
  hideCreateClusterButton: boolean
  exportDeployments: boolean
  showIlmMigrationCallout: boolean
  showTitle?: boolean
  showBreadcrumbs?: boolean
}

type DispatchProps = {
  searchDeployments: (query: SearchRequest) => void
}

type ConsumerProps = {
  storageKey?: string
}

export type Props = StateProps & DispatchProps & ConsumerProps & WrappedComponentProps

type State = {
  esQuery: any
  query: string | null
  queryUsedForSearch: string | null
  queryResults: DeploymentSearchResponse[]
  showExportModal: boolean
  displayMode: 'grid' | 'table'
}

const messages = defineMessages({
  displayGrid: {
    id: `displayMode-grid`,
    defaultMessage: `Switch to grid view`,
  },
  displayTable: {
    id: `displayMode-table`,
    defaultMessage: `Switch to table view`,
  },
  export: {
    id: `export-deployments`,
    defaultMessage: `Export deployments …`,
  },
})

const defaultEsQuery = {
  bool: {
    must: [
      {
        match: {
          stopped: { query: `n`, operator: `and` },
        },
      },
    ],
  },
}

class StackDeploymentSearch extends Component<Props, State> {
  startedTransaction = false

  static defaultProps = {
    storageKey: `StackDeploymentSearch`,
  }

  state: State = this.getInitialState()

  getInitialState(): State {
    const { storageKey } = this.props
    const queryString = getFilterQueryString({ storageKey })
    const esQuery = getEsQuery(queryString)
    const displayMode = getStoredDisplayMode()

    return {
      esQuery,
      query: queryString,
      queryResults: [],
      queryUsedForSearch: null,
      showExportModal: false,
      displayMode,
    }
  }

  componentDidMount() {
    this.search()
  }

  componentDidUpdate(_oldProps: Props, oldState: State) {
    const { searchResultsRequest, searchResults } = this.props
    const { esQuery } = this.state

    if (
      !this.startedTransaction &&
      (searchResultsRequest.error || (searchResults && searchResults.deployments))
    ) {
      this.startedTransaction = true

      startPageActions(`Deployment search`)
    }

    if (!isEqual(esQuery, oldState.esQuery)) {
      this.search()
    }
  }

  render() {
    const {
      searchResults,
      searchResultsRequest,
      profile,
      subscription,
      showIlmMigrationCallout,
      showTitle = true,
      showBreadcrumbs = true,
    } = this.props

    const deployments =
      searchResults && searchResults.deployments ? searchResults.deployments : null

    const trialUser = profile && profile.inTrial

    return (
      <div id='deployments'>
        {!subscription && profile && trialUser && (
          <TrialState deployments={deployments} profile={profile} />
        )}

        {profile && isMarketPlaceUser(profile) && isUnSubscribedMarketPlaceUser(profile) && (
          <UnSubscribedMarketPlaceUserCallout profile={profile} />
        )}

        {showIlmMigrationCallout && <IlmTemplateMigrationCallout displayLink={true} />}

        {showTitle && (
          <Header
            name={<FormattedMessage id='deployments.title' defaultMessage='Deployments' />}
            breadcrumbs={showBreadcrumbs ? deploymentsCrumbs() : []}
          />
        )}

        <DeploymentsSchedule search={this.search} busy={searchResultsRequest.inProgress} />

        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const {
      intl: { formatMessage },
      hideCreateClusterButton,
      profile,
      searchResults,
      searchResultsRequest,
      exportDeployments,
    } = this.props

    if (!searchResults) {
      return <EuiLoadingContent />
    }

    const { query, queryUsedForSearch, displayMode } = this.state

    const deployments = searchResults ? searchResults.deployments : []

    const isLoading = searchResultsRequest.inProgress
    const hasDeployments = !isEmpty(deployments)
    const showCreateFirstDeployment = isEmpty(deployments) && isDefaultEsQuery(queryUsedForSearch)
    const createDisabled = disableDeploymentCreation({ profile, hasDeployments })
    let restartTrial = false
    let disableCreateButton = false

    if (profile) {
      restartTrial = profile.canRestartTrial
      disableCreateButton = disableDeploymentButton({ profile })
    }

    if (!hideCreateClusterButton && showCreateFirstDeployment) {
      if (!searchResults && isLoading) {
        // show a loading spinner because of indeterminate state
        return <EuiLoadingContent />
      }

      return (
        <CreateFirstDeployment
          createDisabled={createDisabled}
          disabled={disableCreateButton}
          restartTrial={restartTrial}
        />
      )
    }

    const actions = hideCreateClusterButton ? null : (
      <CreateDeploymentLink
        key='create-deployment'
        disabled={disableCreateButton}
        createDisabled={createDisabled}
        restartTrial={restartTrial}
      />
    )

    const tools = [
      displayMode === `table` ? (
        <EuiFilterButton
          key='display-mode-grid'
          style={{ width: `40px` }}
          onClick={this.toggleDisplayMode}
          aria-label={formatMessage(messages.displayGrid)}
        >
          <EuiToolTip content={formatMessage(messages.displayGrid)}>
            <EuiIcon type='grid' />
          </EuiToolTip>
        </EuiFilterButton>
      ) : (
        <EuiFilterButton
          key='display-mode-table'
          style={{ width: `40px` }}
          onClick={this.toggleDisplayMode}
          aria-label={formatMessage(messages.displayTable)}
        >
          <EuiToolTip content={formatMessage(messages.displayTable)}>
            <EuiIcon type='visTable' />
          </EuiToolTip>
        </EuiFilterButton>
      ),
    ]

    if (exportDeployments) {
      tools.unshift(
        <EuiFilterButton
          key='import-action'
          style={{ width: `40px` }}
          onClick={this.showExportModal}
          aria-label={formatMessage(messages.export)}
          data-test-id='deploymentExportButton'
        >
          <EuiToolTip content={formatMessage(messages.export)}>
            <EuiIcon type='importAction' />
          </EuiToolTip>
        </EuiFilterButton>,
      )
    }

    const filterContext = (
      <DeploymentFilterContext
        query={query}
        onChange={this.onChange}
        deployments={deployments}
        isLoading={isLoading}
        actions={actions}
        tools={tools}
      />
    )

    return (
      <Fragment>
        {filterContext}

        {searchResultsRequest.error && (
          <Fragment>
            <EuiSpacer size='l' />
            <CuiAlert type='error'>{searchResultsRequest.error}</CuiAlert>
          </Fragment>
        )}

        {this.renderDeploymentList()}
        {this.renderExportModal()}
      </Fragment>
    )
  }

  renderDeploymentList() {
    const { queryResults, displayMode } = this.state

    if (isEmpty(queryResults)) {
      return null
    }

    const { searchResults, deletedDeploymentIds } = this.props
    const { match_count = null, return_count = null } = searchResults || {}
    const deployments = queryResults.filter(
      (deployment) => !deletedDeploymentIds.includes(deployment.id),
    )

    return (
      <Fragment>
        <EuiSpacer size='l' />

        <DeploymentList
          displayMode={displayMode}
          deployments={deployments}
          shownCount={return_count}
          matchCount={match_count}
        />
      </Fragment>
    )
  }

  renderExportModal() {
    const { queryResults = [], showExportModal } = this.state

    if (!showExportModal) {
      return null
    }

    return <ExportDeploymentsModal deployments={queryResults} close={this.hideExportModal} />
  }

  onChange = ({
    query,
    queryText,
    queryResults,
  }: OnFilterChangeParams<DeploymentSearchResponse>) => {
    const { storageKey } = this.props

    this.setState({
      esQuery: getEsQuery(query),
      query: queryText,
      queryResults,
    })

    setFilterQueryString({ storageKey, queryText })
  }

  search = ({ size }: { size?: number } = {}) => {
    const { searchDeployments, deletedDeploymentIds } = this.props
    const { esQuery } = this.state

    const query = searchDeploymentsQuery({
      esQuery,
      deletedDeploymentIds,
      size,
    })

    this.setState({ queryUsedForSearch: esQuery })

    searchDeployments(query)
  }

  showExportModal = () => {
    this.search({ size: 2500 })
    this.setState({ showExportModal: true })
  }

  hideExportModal = () => {
    this.setState({ showExportModal: false })
  }

  toggleDisplayMode = () => {
    const { displayMode } = this.state
    const newDisplayMode = displayMode === `grid` ? `table` : `grid`

    this.setState({ displayMode: newDisplayMode })
    localStorage.setItem(LocalStorageKey.deploymentDisplayMode, newDisplayMode)
  }
}

export default injectIntl(StackDeploymentSearch)

function isDefaultEsQuery(query) {
  const emptyEsQuery = isEmptyQuery(query)

  if (emptyEsQuery) {
    return true
  }

  return isEqual(query, defaultEsQuery)
}

function getStoredDisplayMode(): 'grid' | 'table' {
  const displayMode = localStorage.getItem(LocalStorageKey.deploymentDisplayMode)

  if (displayMode != null && displayMode === 'table') {
    return 'table'
  }

  return 'grid'
}
