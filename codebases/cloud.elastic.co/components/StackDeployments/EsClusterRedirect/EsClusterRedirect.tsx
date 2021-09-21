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

import { EuiLoadingContent } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import history from '../../../lib/history'
import { deploymentUrl } from '../../../lib/urlBuilder'

import { AsyncRequestState, ElasticsearchCluster } from '../../../types'

type Props = {
  regionId: string
  deploymentId: string
  splat?: string
  fetchCluster: (regionId: string, deploymentId: string) => void
  fetchClusterRequest: AsyncRequestState
  esCluster?: ElasticsearchCluster | null
}

class EsClusterRedirect extends Component<Props> {
  componentDidMount() {
    const { fetchCluster, regionId, deploymentId, esCluster } = this.props

    if (esCluster) {
      this.redirectToStackDeployment(esCluster)
    } else {
      fetchCluster(regionId, deploymentId)
    }
  }

  componentDidUpdate() {
    const { esCluster } = this.props

    if (esCluster) {
      this.redirectToStackDeployment(esCluster)
    }
  }

  render() {
    const { fetchClusterRequest } = this.props

    if (fetchClusterRequest.error) {
      return <CuiAlert type='error'>{fetchClusterRequest.error}</CuiAlert>
    }

    return <EuiLoadingContent />
  }

  redirectToStackDeployment(esCluster: ElasticsearchCluster) {
    const { splat } = this.props

    const { stackDeploymentId } = esCluster

    const baseUrl = deploymentUrl(stackDeploymentId!)
    const redirectUrl = splat ? `${baseUrl}/${splat}` : baseUrl

    history.replace(redirectUrl)
  }
}

export default EsClusterRedirect
