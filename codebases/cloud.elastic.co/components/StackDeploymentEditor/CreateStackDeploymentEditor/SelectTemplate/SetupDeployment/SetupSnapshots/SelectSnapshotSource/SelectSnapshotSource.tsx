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

import { defineMessages, FormattedDate, FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import { find, partition } from 'lodash'

import {
  EuiDescriptionList,
  EuiFormControlLayout,
  EuiFormLabel,
  EuiSpacer,
  EuiCallOut,
} from '@elastic/eui'

import { CuiClusterPicker, getClusterPickerLabel } from '../../../../../../../cui'

import SelectSnapshot from './SelectSnapshot'

import { createQuery } from './selectSnapshotSourceQuery'

import { getPlatform } from '../../../../../../../lib/platform'

import sortOn from '../../../../../../../lib/sortOn'
import { filterSearchableSnapshots } from '../../../../../../../lib/stackDeployments'

import {
  AsyncRequestState,
  ElasticsearchCluster,
  RegionId,
  RestoreSnapshot,
  VersionNumber,
  ClusterSnapshot,
} from '../../../../../../../types'

import { SearchRequest } from '../../../../../../../lib/api/v1/types'

import './selectSnapshotSource.scss'

const messages = defineMessages({
  deploymentsWithSnapshots: {
    id: 'select-snapshot-source.deployments-with-snapshots',
    defaultMessage: 'Deployments with snapshots',
  },
  deploymentsWithoutSnapshots: {
    id: 'select-snapshot-source.deployments-without-snapshots',
    defaultMessage: 'Deployments without snapshots',
  },
})

type ClusterSearchResults = {
  totalCount: number
  record: ElasticsearchCluster[]
}

type Props = {
  intl: IntlShape
  asRestoreForm?: boolean
  clusterSearchResults?: ClusterSearchResults | null
  fetchSnapshots: (cluster: ElasticsearchCluster) => void
  fetchSnapshotsRequest: (regionId: string, id: string) => AsyncRequestState
  forceLastSnapshot: boolean
  getClusterSnapshots: (regionId: string, id: string) => ClusterSnapshot[] | null | undefined
  onChange: (value?: ElasticsearchCluster | null) => void
  onRestoreSnapshot?: () => any
  onSearch: (request: SearchRequest, regionId: RegionId) => void
  onSelectSnapshot?: (snapshot: ClusterSnapshot | null, id: string) => void
  onUpdateIndexRestore?: (payload: unknown) => void
  regionId: string | null
  restoreSnapshotRequest?: AsyncRequestState
  searchClusterRequest: AsyncRequestState
  showRegion: boolean
  snapshotRestoreSettings: RestoreSnapshot | undefined
  version: VersionNumber
}

type State = {
  selectedDeployment: ElasticsearchCluster | null
}

type Option = {
  label: string
  value: ElasticsearchCluster
  disabled: boolean
}

class SelectSnapshotSource extends Component<Props, State> {
  state: State = {
    selectedDeployment: null,
  }

  render() {
    const { searchClusterRequest } = this.props
    const { selectedDeployment } = this.state
    const options = this.getOptions()

    return (
      <Fragment>
        {this.renderShardRoutingWarning()}
        <EuiFormControlLayout
          fullWidth={true}
          prepend={
            <EuiFormLabel style={{ width: `180px` }}>
              <FormattedMessage defaultMessage='Restore from' id='select-snapshot-source-label' />
            </EuiFormLabel>
          }
        >
          <CuiClusterPicker
            fullWidth={true}
            data-test-id='select-snapshot-source-combo'
            searchClusters={this.searchClusters}
            searchClustersRequest={searchClusterRequest}
            options={options}
            value={selectedDeployment}
            onChange={(value) => this.onSelectCluster(value)}
          />
        </EuiFormControlLayout>
        {this.renderSelectSnapshot()}
      </Fragment>
    )
  }

  renderShardRoutingWarning() {
    const { selectedDeployment } = this.state

    if (selectedDeployment === null) {
      return null
    }

    const { deploymentTemplateId } = selectedDeployment

    if (
      !deploymentTemplateId ||
      !(deploymentTemplateId.endsWith('hot-warm') || deploymentTemplateId === 'hot.warm')
    ) {
      return null
    }

    return (
      <Fragment>
        <EuiCallOut data-test-id='hot-warm-snapshot-restore-warning' color='warning'>
          <FormattedMessage
            id='snapshot-source.hot-warm-warning'
            defaultMessage='Restoring from hot/warm deployments ignores any shard allocation routing applied by {routing}. Data will be distributed across all cluster nodes, and you might need to manually allocate existing indices to the appropriate data tier.'
            values={{
              routing: <code>index.routing.allocation.require</code>,
            }}
          />
        </EuiCallOut>

        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderSelectSnapshot() {
    const { selectedDeployment } = this.state
    const {
      asRestoreForm,
      forceLastSnapshot,
      fetchSnapshotsRequest,
      getClusterSnapshots,
      onSelectSnapshot,
      onRestoreSnapshot,
      restoreSnapshotRequest,
      onUpdateIndexRestore,
      snapshotRestoreSettings,
    } = this.props

    if (snapshotRestoreSettings && selectedDeployment == null) {
      const deployment = this.findSnapshotClusterById(snapshotRestoreSettings.source_cluster_id)

      if (deployment == null) {
        return
      }

      const {
        // tslint:disable-next-line:no-shadowed-variable
        regionId = ``,
        displayId = ``,
        snapshots: {
          status: { latestSuccessAt: snapshotDate = `` },
        },
      } = deployment

      this.setState({ selectedDeployment: deployment })

      return this.renderSelectedDeployment({
        regionId,
        displayId,
        snapshotDate,
      })
    }

    if (forceLastSnapshot && selectedDeployment !== null) {
      const snapshotDate = selectedDeployment.snapshots.status.latestSuccessAt || ``

      const {
        displayId = ``,

        // tslint:disable-next-line:no-shadowed-variable
        regionId = ``,
      } = selectedDeployment

      return this.renderSelectedDeployment({
        regionId,
        displayId,
        snapshotDate,
      })
    }

    const regionId = selectedDeployment?.regionId
    const id = selectedDeployment?.id

    let searchSnapshotResult = regionId && id ? getClusterSnapshots(regionId, id) : []

    if (selectedDeployment && selectedDeployment.settings.snapshot?.slm && searchSnapshotResult) {
      searchSnapshotResult = filterSearchableSnapshots(searchSnapshotResult)
    }

    const snapshotsRequest = regionId && id ? fetchSnapshotsRequest(regionId, id) : null

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <SelectSnapshot
          asRestoreForm={asRestoreForm}
          selectedDeployment={selectedDeployment}
          searchResults={searchSnapshotResult}
          onSelectSnapshot={onSelectSnapshot}
          fetchSnapshotsRequest={snapshotsRequest}
          onRestoreSnapshot={onRestoreSnapshot}
          onUpdateIndexRestore={onUpdateIndexRestore}
          restoreSnapshotRequest={restoreSnapshotRequest}
          selectedSnapshot={
            snapshotRestoreSettings ? snapshotRestoreSettings.snapshot_name : undefined
          }
        />
      </Fragment>
    )
  }

  renderSelectedDeployment(deployment) {
    const listItems = [
      {
        title: (
          <FormattedMessage
            id='select-snapshot-source.deployment-title'
            defaultMessage='Deployment:'
          />
        ),
        description: deployment.displayId,
      },
    ]

    if (deployment.snapshotDate) {
      listItems.push({
        title: (
          <FormattedMessage
            id='select-snapshot-source.latest-snapshot-title'
            defaultMessage='Latest snapshot:'
          />
        ),
        description: (
          <FormattedDate
            value={deployment.snapshotDate}
            year='numeric'
            month='short'
            day='numeric'
            hour='2-digit'
            minute='2-digit'
          />
        ),
      })
    }

    if (this.props.showRegion) {
      listItems.push(
        {
          title: (
            <FormattedMessage
              id='select-snapshot-source.platform-title'
              defaultMessage='Platform:'
            />
          ),
          description: getPlatform(deployment.regionId).toUpperCase(),
        },
        {
          title: (
            <FormattedMessage id='select-snapshot-source.region-title' defaultMessage='Region:' />
          ),
          description: deployment.regionId,
        },
      )
    }

    return (
      <Fragment>
        <EuiSpacer size='s' />
        <EuiDescriptionList
          className='selectSnapshotSource--snapshotDetails'
          type='column'
          compressed={true}
          listItems={listItems}
        />
      </Fragment>
    )
  }

  getOptions() {
    const {
      intl: { formatMessage },
      clusterSearchResults,
    } = this.props

    const options: Option[] = mapResultsToOptions()
    const [noSnapshots, withSnapshots] = partition(options, `disabled`)

    const optionGroups = [
      {
        label: formatMessage(messages.deploymentsWithSnapshots),
        options: withSnapshots.sort(sortOn('label')),
      },
      {
        label: formatMessage(messages.deploymentsWithoutSnapshots),
        options: noSnapshots.sort(sortOn('label')),
      },
    ]

    return optionGroups

    function mapResultsToOptions() {
      if (clusterSearchResults == null) {
        return []
      }

      return clusterSearchResults.record.map((deployment) => {
        const { snapshots } = deployment
        const hasSnapshotToRestoreFrom = snapshots.enabled && snapshots.status.totalCount > 0

        return {
          label: getClusterPickerLabel(deployment),
          value: deployment,
          disabled: !hasSnapshotToRestoreFrom,
        }
      })
    }
  }

  searchClusters = (userInput: string) => {
    const { onSearch, regionId, version } = this.props

    if (!regionId) {
      return null
    }

    const query = createQuery({
      userInput,
      version,
    })

    onSearch(query, regionId)
  }

  onSelectCluster(selectedDeployment: ElasticsearchCluster | null) {
    const { onChange, forceLastSnapshot, fetchSnapshots } = this.props

    this.setState({ selectedDeployment })

    onChange(selectedDeployment)

    if (selectedDeployment === null) {
      return
    }

    if (!forceLastSnapshot) {
      fetchSnapshots(selectedDeployment)
    }
  }

  findSnapshotClusterById(snapshotId) {
    const { clusterSearchResults } = this.props

    if (!clusterSearchResults) {
      return undefined
    }

    const { record } = clusterSearchResults
    const selectedDeployment = find(record, { id: snapshotId })
    return selectedDeployment
  }
}

export default injectIntl(SelectSnapshotSource)
