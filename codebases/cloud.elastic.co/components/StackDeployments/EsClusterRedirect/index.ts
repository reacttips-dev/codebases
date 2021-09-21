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

import { connect } from 'react-redux'

import EsClusterRedirect from './EsClusterRedirect'

import { fetchCluster } from '../../../actions/clusters'

import { fetchClusterRequest, getCluster } from '../../../reducers'

import { AsyncRequestState, ElasticsearchCluster } from '../../../types'

type StateProps = {
  regionId: string
  deploymentId: string
  splat?: string
  esCluster?: ElasticsearchCluster | null
  fetchClusterRequest: AsyncRequestState
}

type DispatchProps = {
  fetchCluster: (regionId: string, deploymentId: string) => void
}

type ConsumerProps = {
  match: {
    params: {
      regionId: string
      deploymentId: string
      splat: string
    }
  }
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { regionId, deploymentId, ...splat },
    },
  }: ConsumerProps,
): StateProps => ({
  regionId,
  deploymentId,
  splat: Object.values(splat)
    .filter((v) => v)
    .join(`/`),
  esCluster: getCluster(state, regionId, deploymentId),
  fetchClusterRequest: fetchClusterRequest(state, regionId, deploymentId),
})

const mapDispatchToProps: DispatchProps = {
  fetchCluster,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(EsClusterRedirect)
