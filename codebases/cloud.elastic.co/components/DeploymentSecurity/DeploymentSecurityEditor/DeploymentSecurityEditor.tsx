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
import { Link } from 'react-router-dom'

import { EuiCode, EuiDescribedFormGroup, EuiHorizontalRule, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiButton, CuiPermissibleControl } from '../../../cui'

import KibanaSecurityLink from './KibanaSecurityLink'
import RemoteClusterLink from './RemoteClusterLink'

import Keystore from '../Keystore'
import DeploymentTrafficFilterSection from '../DeploymentTrafficFilterSection'

import DeploymentTrustManagementECE from '../../../apps/adminconsole/components/DeploymentTrustManagement'
import DeploymentTrustManagementESS from '../../../apps/userconsole/components/DeploymentTrustManagement'

import DocLink from '../../DocLink'
import SaveDeploymentCredentialsModal from '../../Deployment/DeploymentGettingStarted/SaveDeploymentCredentialsModal'

import { kibanaUrl } from '../../../lib/urlBuilder'
import { gte } from '../../../lib/semver'
import { getClusterMetadata, isSystemOwned } from '../../../lib/stackDeployments'

import Permission from '../../../lib/api/v1/permissions'

import { ClusterCredentials } from '../../../lib/api/v1/types'

import {
  StackDeployment,
  ElasticsearchCluster,
  AsyncRequestState,
  KibanaCluster,
} from '../../../types'

export type Props = {
  deployment: StackDeployment
  cluster: ElasticsearchCluster
  resetPassword: (deployment: StackDeployment) => void
  resetPasswordStatus: AsyncRequestState
  fetchKibana: (regionId: string, kibanaId: string) => void
  fetchKibanaRequest: AsyncRequestState
  kibana: KibanaCluster | null
  kibanaId?: string | null
  isIpFilteringEnabled: boolean
  trafficFilteringEnabled: boolean
  crossEnvCcsCcrEnabled: boolean
  isEce: boolean
  credentials: ClusterCredentials | null
}

const DeploymentSecurityEditor: FunctionComponent<Props> = ({
  deployment,
  cluster,
  resetPassword,
  resetPasswordStatus,
  fetchKibana,
  fetchKibanaRequest,
  kibana,
  isIpFilteringEnabled,
  trafficFilteringEnabled,
  crossEnvCcsCcrEnabled,
  isEce,
  credentials,
}) => {
  const clusterMetadata = getClusterMetadata({ deployment })
  const systemOwned = isSystemOwned({ deployment })

  const showTrustManagement = crossEnvCcsCcrEnabled && !systemOwned

  return (
    <Fragment>
      <EuiDescribedFormGroup
        fullWidth={true}
        title={
          <h3>
            <FormattedMessage
              id='deployment-security-editor.settings-heading'
              defaultMessage='Settings'
            />
          </h3>
        }
        description={
          <FormattedMessage
            id='deployment-security-editor.settings-description'
            defaultMessage='Security settings can be tweaked in Kibana Manage.'
          />
        }
      >
        <div>
          {cluster.kibana.enabled ? (
            <KibanaSecurityLink
              deployment={deployment}
              cluster={cluster}
              kibana={kibana}
              fetchKibana={fetchKibana}
              fetchKibanaRequest={fetchKibanaRequest}
            />
          ) : (
            <FormattedMessage
              id='deployment-security-editor.enable-kibana'
              data-test-id='enable-kibana'
              defaultMessage='{enableKibana} to make security changes to this deployment.'
              values={{
                enableKibana: (
                  <Link to={kibanaUrl(cluster.stackDeploymentId!)}>
                    <FormattedMessage
                      id='deployment-security-editor.enable-kibana-link'
                      defaultMessage='Enable Kibana'
                    />
                  </Link>
                ),
              }}
            />
          )}
        </div>
      </EuiDescribedFormGroup>

      <EuiHorizontalRule />

      <EuiDescribedFormGroup
        fullWidth={true}
        title={
          <h3>
            <FormattedMessage
              id='deployment-security-editor.reset-password-heading'
              defaultMessage='Reset password'
            />
          </h3>
        }
        description={
          <FormattedMessage
            id='deployment-security-editor.reset-password-explanation'
            defaultMessage='Generates a new password for the {elasticUser} user.'
            values={{
              elasticUser: <EuiCode>elastic</EuiCode>,
            }}
          />
        }
      >
        <div>
          <CuiPermissibleControl permissions={Permission.updateEsClusterPlan}>
            <CuiButton
              color='primary'
              size='s'
              data-test-id='deploymentSecurity-resetPasswordBtn'
              onClick={() => {
                resetPassword(deployment)
              }}
              spin={resetPasswordStatus.inProgress}
              requiresSudo={true}
              fill={false}
              confirm={true}
              confirmModalProps={{
                title: (
                  <FormattedMessage
                    id='deployment-security-editor.confirm-to-reset-password'
                    defaultMessage='Reset your password?'
                  />
                ),
                confirm: (
                  <FormattedMessage
                    id='deployment-security-editor.confirm-to-reset-password.confirm'
                    defaultMessage='Reset'
                  />
                ),
              }}
            >
              <FormattedMessage
                id='cluster-delete-cluster.reset-password'
                defaultMessage='Reset password'
              />
            </CuiButton>
          </CuiPermissibleControl>

          {resetPasswordStatus.error && (
            <Fragment>
              <EuiSpacer size='m' />
              <CuiAlert type='error' data-test-id='reset-password-error'>
                {resetPasswordStatus.error}
              </CuiAlert>
            </Fragment>
          )}
        </div>
      </EuiDescribedFormGroup>

      <DeploymentTrafficFilterSection
        regionId={cluster.regionId}
        deploymentId={cluster.stackDeploymentId!}
        isIpFilteringEnabled={isIpFilteringEnabled}
        trafficFilteringEnabled={trafficFilteringEnabled}
        spacerBefore={true}
      />

      {cluster.plan.version && gte(cluster.plan.version, `6.4.0`) && (
        <Fragment>
          <EuiHorizontalRule />

          <Keystore deployment={deployment} systemOwned={systemOwned} />
        </Fragment>
      )}

      {showTrustManagement && (
        <Fragment>
          <Fragment>
            <EuiHorizontalRule />

            {isEce ? (
              <DeploymentTrustManagementECE deployment={deployment} />
            ) : (
              <DeploymentTrustManagementESS deployment={deployment} />
            )}
          </Fragment>

          {clusterMetadata && (
            <Fragment>
              <EuiHorizontalRule />

              <EuiDescribedFormGroup
                data-test-id='remote-cluster-params'
                fullWidth={true}
                title={
                  <h3>
                    <FormattedMessage
                      id='deployment-security-editor.remote-cluster-heading'
                      defaultMessage='Remote cluster parameters'
                    />
                  </h3>
                }
                description={
                  <FormattedMessage
                    id='deployment-security-editor.remote-cluster-explanation'
                    defaultMessage='Required for establishing a connection to a remote cluster. {docLink}'
                    values={{
                      docLink: (
                        <DocLink link='addCcrSettings'>
                          <FormattedMessage
                            id='deployment-security-editor.remote-cluster-explanation.learnmore'
                            defaultMessage='Learn more'
                          />
                        </DocLink>
                      ),
                    }}
                  />
                }
              >
                <Fragment>
                  <RemoteClusterLink
                    title={
                      <FormattedMessage
                        id='deployment-security-editor.remote-cluster-proxy-address-heading'
                        defaultMessage='Proxy address'
                      />
                    }
                    description={
                      <FormattedMessage
                        id='deployment-security-editor.remote-cluster-proxy-address-description'
                        defaultMessage='The endpoint of the remote connection used by Kibana.'
                      />
                    }
                    endpoint={`${clusterMetadata.endpoint}:${clusterMetadata.ports?.transport_passthrough}`}
                  />

                  <EuiSpacer />

                  <RemoteClusterLink
                    title={
                      <FormattedMessage
                        id='deployment-security-editor.remote-cluster-server-name-heading'
                        defaultMessage='Server name'
                      />
                    }
                    description={
                      <FormattedMessage
                        id='deployment-security-editor.remote-cluster-server-name-description'
                        defaultMessage='The host name string to use for remote connections.'
                      />
                    }
                    endpoint={clusterMetadata.endpoint!}
                  />
                </Fragment>
              </EuiDescribedFormGroup>
            </Fragment>
          )}
        </Fragment>
      )}
      {credentials && !resetPasswordStatus.inProgress && (
        <SaveDeploymentCredentialsModal deployment={deployment} />
      )}
    </Fragment>
  )
}

export default DeploymentSecurityEditor
