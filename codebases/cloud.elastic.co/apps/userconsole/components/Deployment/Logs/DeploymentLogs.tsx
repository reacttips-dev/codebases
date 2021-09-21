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

import React, { Component, ComponentType, Fragment } from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import invariant from 'invariant'
import { parse, stringify } from 'querystring'

import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiLoadingContent,
  EuiLoadingSpinner,
  EuiPagination,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiTable, CuiTableColumn } from '../../../../../cui'

import Search from './DeploymentLogsSearch'
import Monitoring from '../../../../../components/StackDeployments/Monitoring'
import PrivacySensitiveContainer from '../../../../../components/PrivacySensitiveContainer'

import { numericDateTime } from '../../../../../config/dates'
import { startPageActions } from '../../../../../lib/apm'
import history from '../../../../../lib/history'
import schedule from '../../../../../lib/schedule'
import { getFirstSliderClusterFromGet } from '../../../../../lib/stackDeployments'

import { ClusterLogs, ElasticsearchLogMessage } from '../../../reducers/logs/logTypes'
import { DeploymentUpdateRequest } from '../../../../../lib/api/v1/types'
import { AsyncRequestState, ElasticsearchId, RegionId, StackDeployment } from '../../../../../types'

type Params = {
  offset: number
  limit: number
  q: string
  filter: string[]
}

export type Props = {
  deployment: StackDeployment
  deploymentUpdate: DeploymentUpdateRequest
  clusterLogs: ClusterLogs | null
  fetchLogs: (regionId: RegionId, clusterId: ElasticsearchId, params: Params) => void
  fetchLogsRequest: AsyncRequestState
  queryParams: Params
  stackDeploymentId: string
}

export type FilterProps = {
  onClick: () => void
  content: string
}

const levelMap: Map<number, string> = new Map([
  [7, `DEBUG`],
  [6, `INFO`],
  [4, `WARN`],
  [3, `ERROR`],
  [0, `FATAL`],
])

export class DeploymentLogs extends Component<Props> {
  private startedTransaction = false

  componentDidUpdate() {
    if (!this.startedTransaction) {
      const { clusterLogs, fetchLogsRequest } = this.props

      if (clusterLogs != null || fetchLogsRequest.error) {
        startPageActions(`Cluster logs`)
        this.startedTransaction = true
      }
    }
  }

  render() {
    const { deployment, stackDeploymentId } = this.props

    if (!deployment) {
      return null
    }

    const { settings } = deployment
    const isLogsMonitoring = settings?.observability?.logging

    const cluster = getFirstSliderClusterFromGet({
      deployment,
      sliderInstanceType: `elasticsearch`,
    })

    if (!cluster) {
      return null
    }

    return (
      <Fragment>
        <Monitoring
          deployment={deployment}
          deploymentId={stackDeploymentId}
          regionId={cluster.region}
          clusterId={cluster.id}
        />

        <EuiSpacer size='xxl' />
        {isLogsMonitoring ? this.renderMonitoringMessage() : this.renderLogs()}
      </Fragment>
    )
  }

  renderLogs() {
    const {
      queryParams: { q },
    } = this.props

    return (
      <Fragment>
        <Search query={q} onSearch={this.setLogsQuery} />
        <EuiSpacer />
        {this.renderResults()}
      </Fragment>
    )
  }

  renderMonitoringMessage() {
    return (
      <Fragment>
        <EuiHorizontalRule margin='l' />

        <EuiSpacer />

        <EuiFlexGroup
          gutterSize='s'
          alignItems='center'
          justifyContent='spaceAround'
          direction='column'
        >
          <EuiFlexItem grow={false}>
            <EuiIcon type='logsApp' size='xl' />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiText color='subdued' size='xs'>
              <FormattedMessage
                id='deployment-logs.view-logs-message'
                defaultMessage='View logs via your chosen deployment'
              />
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>
    )
  }

  renderResults() {
    const {
      clusterLogs,
      fetchLogsRequest,
      queryParams: { limit, offset },
    } = this.props

    if (clusterLogs == null) {
      return <EuiLoadingContent lines={1} />
    }

    if (clusterLogs.total?.value === 0) {
      return (
        <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
          <EuiFlexItem grow={false}>
            <FormattedMessage id='deployment-logs.no-results' defaultMessage='No results' />
          </EuiFlexItem>

          {fetchLogsRequest.inProgress && (
            <EuiFlexItem grow={false}>
              <EuiLoadingSpinner size='m' />
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      )
    }

    const clusterLogsTotal = clusterLogs?.total?.value

    const tableColumns: Array<CuiTableColumn<ElasticsearchLogMessage>> = [
      {
        label: (
          <FormattedMessage id='deployment-logs.headings.timestamp' defaultMessage='Timestamp' />
        ),
        render: ({ timestamp }) => <FormattedDate value={timestamp} {...numericDateTime} />,
        width: '250px',
      },
      {
        label: <FormattedMessage id='deployment-logs.headings.level' defaultMessage='Level' />,
        render: ({ level }) => (
          <EuiButtonEmpty
            data-test-subj='levelFilterButton'
            flush='left'
            onClick={() => {
              const levelAsString = levelMap.get(level)

              if (levelAsString) {
                this.addLogsFilter(`level:${level}`)
              }
            }}
          >
            {levelMap.get(level)}
          </EuiButtonEmpty>
        ),
        width: '100px',
      },
      {
        label: (
          <FormattedMessage
            id='deployment-logs.headings.instance-zone'
            defaultMessage='Instance / Zone'
          />
        ),
        render: ({ instanceName, instanceId, isTiebreaker, zone }) => (
          <EuiButtonEmpty
            data-test-id='instanceNameFilterButton'
            flush='left'
            onClick={() => {
              if (zone.length > 0) {
                this.addLogsFilter(`instance_name:${instanceName}`)
              }
            }}
          >
            {`i${instanceId}${!isTiebreaker ? `@${zone}` : ``}`}
          </EuiButtonEmpty>
        ),
        width: '150px',
      },
      {
        label: <FormattedMessage id='deployment-logs.headings.message' defaultMessage='Message' />,
        render: ({ shortMessage }) => (
          <PrivacySensitiveContainer>{shortMessage}</PrivacySensitiveContainer>
        ),
      },
    ]

    return (
      <Fragment>
        <EuiText color='subdued' size='s'>
          <FormattedMessage
            id='deployment-logs.showing-results'
            defaultMessage='Showing {start, number} - {end, number} of {total, number} logs from the last 24 hours.'
            values={{
              start: clusterLogsTotal > 0 ? offset + 1 : 0,
              end: Math.min(offset + limit, clusterLogsTotal),
              total: clusterLogsTotal,
            }}
          />
          {` `}
          {fetchLogsRequest.inProgress ? <EuiLoadingSpinner size='m' /> : null}
        </EuiText>

        <EuiSpacer size='m' />

        <CuiTable rows={clusterLogs.entries} columns={tableColumns} />

        <EuiSpacer size='m' />

        {clusterLogsTotal > 0 &&
          this.renderPagination({ clusterLogsTotal, limit, offset, fetchLogsRequest })}
      </Fragment>
    )
  }

  renderPagination({ clusterLogsTotal, limit, offset, fetchLogsRequest }) {
    const pageCount = Math.ceil(clusterLogsTotal / limit)
    const activePage = Math.floor(offset / limit)

    // The key below is used to tell React to remove the pagination from
    // the DOM and re-add it. This is to avoid focused element highlighting
    // persisting beyond a pagination click, which is confusing.
    return (
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiPagination
            key={activePage + `-` + pageCount}
            pageCount={pageCount}
            activePage={activePage}
            onPageClick={this.setLogsPage}
          />
        </EuiFlexItem>

        <EuiFlexItem>{fetchLogsRequest.inProgress && <EuiLoadingSpinner size='m' />}</EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  updateParams(callback: (params: Params) => Params) {
    const { queryParams } = this.props
    const { pathname, search } = history.location
    const prevQuery = parse(search.slice(1))
    const nextQuery = callback(queryParams)
    const query = stringify({ ...prevQuery, ...nextQuery })

    history.replace(`${pathname}?${query}`)
  }

  setLogsPage = (page: number) => {
    invariant(page >= 0, `page must be >= 0`)

    this.updateParams((params) => ({
      ...params,
      offset: params.limit * page,
    }))
  }

  setLogsQuery = (query: string) => {
    this.updateParams((params) => ({
      ...params,
      q: query,
      offset: 0,
    }))
  }

  addLogsFilter = (item: string) => {
    this.updateParams((params) => {
      const newFilter = params.filter.concat(item)
      return {
        ...params,
        filter: newFilter,
        offset: 0,
      }
    })
  }

  removeLogsFilter = (item: string) => {
    this.updateParams((params) => {
      const newFilter = params.filter.filter((each) => each !== item)
      return {
        ...params,
        filter: newFilter,
        offset: 0,
      }
    })
  }
}

const scheduledComponent: ComponentType<Props> = schedule(
  DeploymentLogs,
  ({ fetchLogs, deployment, queryParams }) => {
    const cluster = getFirstSliderClusterFromGet({
      deployment,
      sliderInstanceType: `elasticsearch`,
    })

    if (cluster && cluster.region) {
      fetchLogs(cluster.region, cluster.id, queryParams)
    }
  },
  [`cluster.region`, `cluster.id`, `location.search`],
)

export default scheduledComponent
