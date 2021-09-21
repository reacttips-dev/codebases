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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiSpacer, EuiText } from '@elastic/eui'

import { blobStorageMultiplier } from '../../../Topology/DeploymentTemplates/components/DeploymentInfrastructure/TopologyElement/helpers'

import prettySize from '../../../../lib/prettySize'
import { byteToMegabyte } from '../../../../lib/numbers'

import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'
import { NodeStats, StackDeployment } from '../../../../types'

import '../NodeInstanceStatsDisplay/nodeInstanceStatsDisplay.scss'

interface Props {
  instance: ClusterInstanceInfo
  deployment: StackDeployment
  nodeStats: NodeStats | undefined
}

const FrozenNodeUsage: FunctionComponent<Props> = ({ instance, nodeStats }) => {
  const { disk } = instance

  if (!disk) {
    return null
  }

  const availableSearchableStorage =
    (disk.disk_space_available! / disk.storage_multiplier!) * blobStorageMultiplier

  const frozenUsageInMegabytes = nodeStats
    ? byteToMegabyte(nodeStats.indices.store.total_data_set_size_in_bytes)
    : null

  return (
    <Fragment>
      {nodeStats && (
        <Fragment>
          <div>
            <EuiText size='xs' color='subdued' data-test-id='frozen-stats-searchable-storage'>
              <FormattedMessage
                id='frozen-node-usage.searchable-storage'
                defaultMessage='Searchable object storage'
              />
            </EuiText>
            <FormattedMessage
              id='frozen-node-usage.searchable-storage.values'
              defaultMessage='{used} of at least {available}'
              values={{
                used: prettySize(frozenUsageInMegabytes),
                available: prettySize(availableSearchableStorage),
              }}
            />
          </div>
          <EuiSpacer size='m' />
        </Fragment>
      )}

      <div>
        <EuiText size='xs' color='subdued' data-test-id='frozen-stats-disk-cache'>
          <FormattedMessage id='frozen-node-usage.disk-cache' defaultMessage='Disk cache' />
        </EuiText>
        <div>{prettySize(disk.disk_space_available)}</div>
      </div>
    </Fragment>
  )
}

export default FrozenNodeUsage
