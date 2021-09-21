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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiLink, EuiSpacer, EuiTitle } from '@elastic/eui'

import RequiresSudo from '../../../../../components/RequiresSudo'

import ClusterSlainNodes from '../../../../../components/Cluster/SlainEvents'
import ClusterShards from '../../../../../components/Cluster/ClusterShards'

import SliderAppLinks from '../../../../../components/StackDeploymentSlider/SliderAppLinks'
import StackDeploymentNodesVisualization from '../../../../../components/StackDeployments/StackDeploymentNodesVisualization'

import { getFirstEsClusterFromGet } from '../../../../../lib/stackDeployments'
import { getRecentSlainEvents } from '../../../../../lib/deployments/events'
import { isClusterActive } from '../../../../../lib/clusters'
import schedule from '../../../../../lib/schedule'

import { WithStackDeploymentRouteParamsProps } from '../../../../../components/StackDeploymentEditor'

import { ElasticsearchCluster, KibanaCluster } from '../../../../../types'
import { DeploymentGetResponse } from '../../../../../lib/api/v1/types'

export type Props = WithStackDeploymentRouteParamsProps & {
  deployment: DeploymentGetResponse
  cluster: ElasticsearchCluster
  kibana?: KibanaCluster | null
  saasClusterMetrics: boolean
  showNativeMemoryPressure: boolean
  fetchKibana: (regionId: string, kibanaId: string, esConvertedToDnt?: boolean) => void
}

export const ClusterOverview: FunctionComponent<Props> = ({
  deployment,
  cluster,
  saasClusterMetrics,
  showNativeMemoryPressure,
}) => {
  const { instances } = cluster

  if (!isClusterActive(cluster)) {
    return null
  }

  const esResource = getFirstEsClusterFromGet({ deployment })!
  const slainEvents = getRecentSlainEvents(cluster)

  return (
    <div>
      <EuiSpacer size='s' />

      <SliderAppLinks
        sliderInstanceType='elasticsearch'
        deployment={deployment}
        resource={esResource}
        saasClusterMetrics={saasClusterMetrics}
      />

      <EuiSpacer size='l' />

      {instances.record.length === 0 || (
        <StackDeploymentNodesVisualization
          title={
            <EuiTitle size='s'>
              <h3 data-test-id='deploymentOverview-zonesAndNodes'>
                <FormattedMessage
                  id='userconsole-deployment-overview.instances'
                  defaultMessage='Instances'
                />
              </h3>
            </EuiTitle>
          }
          deployment={deployment}
          sliderInstanceType='elasticsearch'
          showNativeMemoryPressure={showNativeMemoryPressure}
        />
      )}

      <EuiSpacer size='xl' />

      {!cluster.isStopped && (
        <Fragment>
          <EuiTitle size='s'>
            <h3>
              <FormattedMessage
                id='userconsole-deployment-overview.shards'
                defaultMessage='Shards'
              />
            </h3>
          </EuiTitle>

          <EuiSpacer size='m' />

          <RequiresSudo
            color='primary'
            buttonType={EuiLink}
            to={
              <FormattedMessage
                id='userconsole-deployment-overview.reveal-shard-counts-and-statuses'
                defaultMessage='Reveal shard counts and statuses'
              />
            }
            helpText={false}
            actionPrefix={false}
          >
            <ClusterShards deployment={deployment} />
          </RequiresSudo>

          <EuiSpacer size='l' />
        </Fragment>
      )}

      {slainEvents.length > 0 && <ClusterSlainNodes events={slainEvents} />}
    </div>
  )
}

export default schedule(
  ClusterOverview,
  ({ fetchKibana, cluster }) => {
    if (cluster.kibana.id) {
      fetchKibana(cluster.regionId, cluster.kibana.id)
    }
  },
  [
    [`cluster`, `regionId`],
    [`cluster`, `id`],
    [`cluster`, `kibana`, `id`],
  ],
)
