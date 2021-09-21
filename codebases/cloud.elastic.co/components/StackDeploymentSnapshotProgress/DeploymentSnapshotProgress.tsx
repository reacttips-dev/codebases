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

import React, { Component } from 'react'

import SnapshotInProgress from '../Cluster/Snapshots/SnapshotInProgress'

import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'

import { StackDeployment, AsyncRequestState, ClusterSnapshot } from '../../types'

type Props = {
  deployment: StackDeployment
  fetchSnapshots: () => void
  fetchSnapshotsRequest: AsyncRequestState
  snapshot: ClusterSnapshot | null
}

export default class DeploymentSnapshotProgress extends Component<Props> {
  componentDidMount() {
    const { fetchSnapshots } = this.props
    fetchSnapshots()
  }

  render() {
    const { deployment, fetchSnapshotsRequest, snapshot } = this.props
    const esCluster = getFirstEsClusterFromGet({ deployment })!
    const { region, id } = esCluster
    const cluster = { regionId: region, id }

    if (fetchSnapshotsRequest.error) {
      return null
    }

    if (!snapshot) {
      return null
    }

    return <SnapshotInProgress cluster={cluster} snapshotName={snapshot.snapshot} />
  }
}
