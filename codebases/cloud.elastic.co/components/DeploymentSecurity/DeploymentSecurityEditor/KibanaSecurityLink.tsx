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
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'

import { EuiLoadingSpinner } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import ExternalLink from '../../../components/ExternalLink'

import { getFirstSliderClusterFromGet } from '../../../lib/stackDeployments'

import { kibanaSecurityManagementUrl } from '../../../lib/serviceProviderDeepLinks'

import { AsyncRequestState, KibanaCluster, Cluster, StackDeployment } from '../../../types'
import { KibanaResourceInfo } from '../../../lib/api/v1/types'

type Props = {
  deployment: StackDeployment
  cluster: Cluster
  kibana: KibanaCluster | null
  fetchKibana: (regionId: string, kibanaId: string) => void
  fetchKibanaRequest: AsyncRequestState
}

export default class KibanaSecurityLink extends Component<Props> {
  componentDidMount() {
    const { cluster, kibana, fetchKibana } = this.props

    // Only fetch Kibana if not already fetched
    if (kibana == null) {
      const kibanaId = get(cluster, [`kibana`, `id`])
      fetchKibana(cluster.regionId, kibanaId)
    }
  }

  render() {
    const { deployment, kibana, fetchKibanaRequest } = this.props

    if (fetchKibanaRequest.error) {
      return (
        <CuiAlert type='error' details={fetchKibanaRequest.error}>
          <FormattedMessage
            id='kibana-security-link.fetch-kibana-failed'
            defaultMessage='Fetching Kibana failed'
          />
        </CuiAlert>
      )
    }

    if (kibana == null) {
      return <EuiLoadingSpinner />
    }

    const resource = getFirstSliderClusterFromGet<KibanaResourceInfo>({
      deployment,
      sliderInstanceType: `kibana`,
    })

    return (
      <FormattedMessage
        id='kibana-security-link.make-changes'
        defaultMessage='Make security changes in {kibana}.'
        values={{
          kibana: (
            <ExternalLink
              href={kibanaSecurityManagementUrl({ resource })}
              data-test-id='kibana-security-link'
            >
              <FormattedMessage id='kibana-security-link.kibana-label' defaultMessage='Kibana' />
            </ExternalLink>
          ),
        }}
      />
    )
  }
}
