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

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiButton, EuiDescribedFormGroup, EuiSpacer, EuiToolTip } from '@elastic/eui'

import { CuiLink } from '../../../../cui'

import DeploymentTrustRelationshipFlyout from './DeploymentTrustRelationshipFlyout'
import DeploymentTrustRelationshipTable from './DeploymentTrustRelationshipTable'

import DocLink from '../../../../components/DocLink'

import EnableCrossClusterReplicationCallout from '../../../../components/CrossClusterReplication/EnableCrossClusterReplicationCallout'

import { getDeploymentSettingsFromGet, getRegionId } from '../../../../lib/stackDeployments'
import { platformTrustManagementUrl } from '../../../../lib/urlBuilder'

import { TrustRelationshipGetResponse } from '../../../../lib/api/v1/types'
import { AllProps as Props, State } from './types'

class DeploymentTrustManagement extends React.Component<Props, State> {
  componentDidMount(): void {
    this.props.fetchTrustRelationships()
  }

  componentWillUnmount(): void {
    this.props.resetFetchTrustRelationships()
  }

  render(): JSX.Element {
    const { deployment } = this.props

    const regionId = getRegionId({ deployment })!

    const title = (
      <h3>
        <FormattedMessage id='deploymentTrustManagement.title' defaultMessage='Trust management' />
      </h3>
    )

    const description = (
      <Fragment>
        <p>
          <FormattedMessage
            id='deploymentTrustManagement.description'
            defaultMessage='Configure trust with deployments from this environment and from other Elastic Cloud Enterprise (ECE) environments. They can be configured for cross-cluster search and cross-cluster replication. {docLink}'
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
        <p>
          <FormattedMessage
            id='deploymentTrustManagement.description-action'
            defaultMessage='Add new environments in {link}.'
            values={{
              link: (
                <CuiLink to={platformTrustManagementUrl(regionId)}>
                  <FormattedMessage
                    id='deploymentTrustManagement.description-action-link'
                    defaultMessage='trust management'
                  />
                </CuiLink>
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

  renderEditButton(): JSX.Element {
    const { deployment, fetchTrustRelationshipsRequest, trustRelationships } = this.props

    const isDisabled =
      fetchTrustRelationshipsRequest.isDone && !this.hasTrustRelationshipOptionsForDeployment()

    const allEnvironmentsConfigured =
      trustRelationships.filter(({ local }) => !local).length &&
      !this.hasTrustRelationshipOptionsForDeployment()

    const disabledMessage = allEnvironmentsConfigured ? (
      <FormattedMessage
        id='deploymentTrustManagement.addButton-disabled-tooltip-all-envs-used'
        defaultMessage='All available environments have been configured.'
      />
    ) : (
      <FormattedMessage
        id='deploymentTrustManagement.addButton-disabled-tooltip-no-envs'
        defaultMessage='No environments have been configured.'
      />
    )

    return (
      <DeploymentTrustRelationshipFlyout
        deployment={deployment}
        trustRelationships={trustRelationships}
      >
        {({ openFlyout }) => {
          const button = (
            <EuiButton
              size='s'
              disabled={isDisabled}
              onClick={() => openFlyout()}
              data-test-id='add-trusted-environment-button'
            >
              <FormattedMessage
                id='deploymentTrustManagement.addButton'
                defaultMessage='Add trusted environment'
              />
            </EuiButton>
          )

          return isDisabled ? (
            <EuiToolTip position='right' content={disabledMessage}>
              {button}
            </EuiToolTip>
          ) : (
            button
          )
        }}
      </DeploymentTrustRelationshipFlyout>
    )
  }

  renderDetails(): JSX.Element {
    const { deployment, fetchTrustRelationshipsRequest, trustRelationships } = this.props

    return (
      <DeploymentTrustRelationshipTable
        deployment={deployment}
        trustRelationships={trustRelationships}
        fetchTrustRelationshipsRequest={fetchTrustRelationshipsRequest}
      />
    )
  }

  getTrustRelationshipOptionsForDeployment(): TrustRelationshipGetResponse[] {
    const { deployment, trustRelationships } = this.props

    const settings = getDeploymentSettingsFromGet({ deployment })
    const externalTrustRelationships = settings?.trust?.external || []

    // We only display options that aren't already trusted by default,
    // and ones that aren't already configured for this deployment.
    return trustRelationships.filter(
      (trustRelationship) =>
        !trustRelationship.trust_by_default &&
        !trustRelationship.local &&
        externalTrustRelationships.every(
          ({ trust_relationship_id }) => trust_relationship_id !== trustRelationship.id,
        ),
    )
  }

  hasTrustRelationshipOptionsForDeployment(): boolean {
    return Boolean(this.getTrustRelationshipOptionsForDeployment().length)
  }
}

export default DeploymentTrustManagement
