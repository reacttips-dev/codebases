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

import {
  EuiButton,
  EuiCode,
  EuiDescribedFormGroup,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHealth,
  EuiLoadingSpinner,
  EuiLoadingContent,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiDeploymentName } from '../../../../cui'

import DeploymentTrustRelationshipFlyout from './DeploymentTrustRelationshipFlyout'

import DocLink from '../../../../components/DocLink'
import EnableCrossClusterReplicationCallout from '../../../../components/CrossClusterReplication/EnableCrossClusterReplicationCallout'

import { getFirstEsClusterFromGet, getOrganizationId } from '../../../../lib/stackDeployments/'

import {
  getAccountTrustRelationships,
  getTrustLevelFromRelationship,
  getTrustLevelLabel,
} from '../../../../lib/stackDeployments/trustRelationships'

import { AccountResponse, AccountTrustRelationship } from '../../../../lib/api/v1/types'

import { AllProps as Props, State } from './types'

const LoadingDeployment: FunctionComponent = () => (
  <EuiFlexGroup gutterSize='s' alignItems='center' data-test-id='trusted-deployment-loading'>
    <EuiFlexItem grow={false}>
      <EuiLoadingSpinner size='s' />
    </EuiFlexItem>

    <EuiFlexItem>
      <EuiLoadingContent lines={1} />
    </EuiFlexItem>
  </EuiFlexGroup>
)

const DeletedDeployment: FunctionComponent<{ clusterId: string }> = ({ clusterId }) => (
  <EuiHealth color='subdued'>
    <EuiFlexGroup gutterSize='s' alignItems='center' data-test-id='trusted-deployment-deleted'>
      <EuiFlexItem grow={false}>
        <EuiCode>{clusterId.slice(0, 6)}</EuiCode>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiText color='subdued' size='s'>
          (
          <FormattedMessage id='deploymentTrustManagement.ess.deleted' defaultMessage='deleted' />)
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiHealth>
)

class DeploymentTrustManagement extends React.Component<Props, State> {
  state: State = {
    requestedClusterIds: new Set(),
  }

  componentDidMount(): void {
    this.props.fetchCurrentAccount()
  }

  componentDidUpdate(): void {
    const { allowlistDeploymentsRequest } = this.props
    const { requestedClusterIds } = this.state

    const accountRelationship = this.getLocalAccountRelationshipFromDeployment()

    if (!accountRelationship?.trust_allowlist?.length || allowlistDeploymentsRequest.inProgress) {
      return
    }

    const hasFetchedDeployments = accountRelationship.trust_allowlist.every((id) =>
      requestedClusterIds.has(id),
    )

    if (!hasFetchedDeployments) {
      this.searchForTrustedDeployments(accountRelationship.trust_allowlist)
    }
  }

  componentWillUnmount(): void {
    this.props.resetFetchCurrentAccount()
  }

  render(): JSX.Element {
    const { deployment } = this.props

    const title = (
      <h3>
        <FormattedMessage id='deploymentTrustManagement.title' defaultMessage='Trust management' />
      </h3>
    )

    const description = (
      <Fragment>
        <p>
          <FormattedMessage
            id='deploymentTrustManagement.ess.description'
            defaultMessage='The trust level that your deployment has with other deployments from this account. Trusted deployments can be configured for cross-cluster search and cross-cluster replication. {docLink}'
            values={{
              docLink: (
                <DocLink link='trustManagement'>
                  <FormattedMessage
                    id='deploymentTrustManagement.description-doclink'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </p>
      </Fragment>
    )
    return (
      <Fragment>
        <EuiDescribedFormGroup
          fullWidth={true}
          title={title}
          description={description}
          data-test-id='trust-management'
        >
          <div>
            <EnableCrossClusterReplicationCallout deployment={deployment} />
            {this.renderEditButton()}
            <EuiSpacer />
            {this.renderDetails()}
          </div>
        </EuiDescribedFormGroup>
      </Fragment>
    )
  }

  renderEditButton(): JSX.Element | null {
    const { deployment } = this.props

    const trustRelationship = this.getLocalAccountRelationshipFromDeployment()

    if (!trustRelationship) {
      return null
    }

    return (
      <DeploymentTrustRelationshipFlyout
        deployment={deployment}
        trustRelationship={trustRelationship}
      >
        {({ openFlyout }) => (
          <EuiButton
            size='s'
            onClick={() => openFlyout()}
            data-test-id='edit-deployment-trust-button'
          >
            <FormattedMessage id='deploymentTrustManagement.ess.editButton' defaultMessage='Edit' />
          </EuiButton>
        )}
      </DeploymentTrustRelationshipFlyout>
    )
  }

  renderDetails(): JSX.Element {
    const trustRelationship = this.getLocalAccountRelationshipFromDeployment()
    const trustLevel = trustRelationship
      ? getTrustLevelFromRelationship(trustRelationship)
      : (`none` as const)

    return (
      <EuiFormRow
        label={
          <FormattedMessage
            id='deploymentTrustManagement.ess.trustLevel'
            defaultMessage='Trust level'
          />
        }
      >
        <Fragment>
          <EuiText data-test-id={`deployment-trust-level-${trustLevel}`}>
            <FormattedMessage {...getTrustLevelLabel(trustLevel)} />
          </EuiText>

          {this.renderAllowlistDeployments()}
        </Fragment>
      </EuiFormRow>
    )
  }

  renderAllowlistDeployments(): JSX.Element | null {
    const { allowlistDeployments, allowlistDeploymentsRequest } = this.props

    const trustRelationship = this.getLocalAccountRelationshipFromDeployment()

    if (!trustRelationship) {
      return null
    }

    const trustLevel = getTrustLevelFromRelationship(trustRelationship)

    if (trustLevel !== `specific` || !trustRelationship?.trust_allowlist?.length) {
      return null
    }

    return (
      <EuiFlexGroup gutterSize='s' direction='column'>
        <EuiSpacer size='s' />

        {trustRelationship.trust_allowlist.map((clusterId) => {
          const trustedDeployment = allowlistDeployments.find((_deployment) => {
            const esCluster = getFirstEsClusterFromGet({ deployment: _deployment })
            return esCluster?.id === clusterId
          })

          const deploymentFallback = allowlistDeploymentsRequest.inProgress ? (
            <LoadingDeployment />
          ) : (
            <DeletedDeployment clusterId={clusterId} />
          )

          return (
            <EuiFlexItem
              key={clusterId}
              data-test-id={`trusted-deployment-${clusterId}`}
              grow={false}
            >
              {trustedDeployment ? (
                <CuiDeploymentName deployment={trustedDeployment} linkify={false} />
              ) : (
                deploymentFallback
              )}
            </EuiFlexItem>
          )
        })}
      </EuiFlexGroup>
    )
  }

  searchForTrustedDeployments(allowlist: string[]): void {
    const { searchForAllowlistDeployments } = this.props
    const { requestedClusterIds } = this.state

    searchForAllowlistDeployments(allowlist)

    this.setState({
      requestedClusterIds: new Set([...requestedClusterIds, ...allowlist]),
    })
  }

  getLocalAccountRelationshipFromDeployment(): AccountTrustRelationship | null {
    const { currentAccount, deployment } = this.props

    const organizationId = getOrganizationId({ deployment })
    const accountTrustRelationships = getAccountTrustRelationships({ deployment })
    const accountTrustRelationship = accountTrustRelationships.find(
      ({ account_id }) => account_id === organizationId,
    )

    if (!accountTrustRelationship) {
      return currentAccount ? this.createDefaultEntry(currentAccount) : null
    }

    return accountTrustRelationship
  }

  createDefaultEntry({ id }: AccountResponse): AccountTrustRelationship {
    return {
      account_id: id,
      trust_all: false,
    }
  }
}

export default DeploymentTrustManagement
