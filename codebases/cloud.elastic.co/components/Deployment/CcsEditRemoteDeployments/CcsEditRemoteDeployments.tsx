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
import { FormattedMessage } from 'react-intl'

import { EuiFormHelpText, EuiFormLabel, EuiLoadingSpinner, EuiSpacer } from '@elastic/eui'

import CcsRemoteDeploymentsTable from '../../CcsRemoteDeploymentsTable'

import ExternalLink from '../../ExternalLink'

import { isFeatureActivated } from '../../../store'

import Feature from '../../../lib/feature'

import { kibanaRemoteClustersUrl } from '../../../lib/serviceProviderDeepLinks'

import { gte } from '../../../lib/semver'

import {
  getDisplayName,
  getFirstSliderClusterFromGet,
  getVersion,
} from '../../../lib/stackDeployments'
import { hasCrossClusterReplicationEnabled } from '../../../lib/stackDeployments/selectors'

import { KibanaResourceInfo, RemoteResourceRef, RemoteResources } from '../../../lib/api/v1/types'
import { AsyncRequestState, StackDeployment } from '../../../types'

type Props = {
  regionId: string
  deployment: StackDeployment
  ccsSettings: RemoteResources | null
  updateCcsSettingsRequest: AsyncRequestState
  fetchCcsSettingsRequest: AsyncRequestState
  updateCcsSettings: (settings: RemoteResources) => Promise<void>
  fetchCcsSettings: () => Promise<void>
  resetUpdateCcsSettingsRequest: () => void
}

class CcsEditRemoteDeployments extends Component<Props> {
  componentDidMount(): void {
    this.props.fetchCcsSettings()
  }

  render(): JSX.Element {
    const {
      deployment,
      fetchCcsSettingsRequest,
      updateCcsSettingsRequest,
      resetUpdateCcsSettingsRequest,
    } = this.props

    const remoteDeployments = this.getRemoteResources()

    // if we're rendering this deep, the version must be defined.
    const deploymentVersion = getVersion({ deployment })!

    const supportsRemoteClustersInKibana =
      isFeatureActivated(Feature.crossEnvCCSCCR) &&
      gte(deploymentVersion, `7.7.0`) &&
      hasCrossClusterReplicationEnabled({ deployment })

    const kibana = getFirstSliderClusterFromGet<KibanaResourceInfo>({
      deployment,
      sliderInstanceType: `kibana`,
    })

    return (
      <Fragment>
        <EuiFormLabel>
          <FormattedMessage
            id='edit-remote-deployments.label'
            defaultMessage='Cross cluster search deployments'
          />
        </EuiFormLabel>

        <EuiFormHelpText>
          <FormattedMessage
            id='edit-remote-deployments.description'
            defaultMessage='The {deploymentName} deployment can read data from other deployments. Manage the deployments that can be searched across.'
            values={{
              deploymentName: <strong>{getDisplayName({ deployment })}</strong>,
            }}
          />
        </EuiFormHelpText>

        {supportsRemoteClustersInKibana && (
          <EuiFormHelpText>
            <FormattedMessage
              id='edit-remote-deployments.kibana-configuration'
              defaultMessage='You can also {link}'
              values={{
                link: (
                  <ExternalLink href={kibanaRemoteClustersUrl({ resource: kibana })}>
                    <FormattedMessage
                      id='edit-remote-deployments.kibana-configuration-cta'
                      defaultMessage='configure your remote clusters in Kibana.'
                    />
                  </ExternalLink>
                ),
              }}
            />
          </EuiFormHelpText>
        )}

        {fetchCcsSettingsRequest.inProgress ? (
          <Fragment>
            <EuiSpacer size='m' />
            <EuiLoadingSpinner />
          </Fragment>
        ) : (
          <CcsRemoteDeploymentsTable
            deployment={deployment}
            deploymentVersion={deploymentVersion}
            remoteDeployments={remoteDeployments}
            onChange={this.updateRemoteResources}
            changeRequest={updateCcsSettingsRequest}
            resetChangeRequest={resetUpdateCcsSettingsRequest}
          />
        )}
      </Fragment>
    )
  }

  getRemoteResources(): RemoteResourceRef[] | null {
    const { ccsSettings } = this.props
    return ccsSettings?.resources || null
  }

  updateRemoteResources = (remoteResources: RemoteResourceRef[]): Promise<void> => {
    const { updateCcsSettings } = this.props
    return updateCcsSettings({ resources: remoteResources })
  }
}

export default CcsEditRemoteDeployments
