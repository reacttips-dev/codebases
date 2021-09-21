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

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiLink, EuiToolTip } from '@elastic/eui'

import { CuiButtonIcon, CuiTable, CuiTableColumn } from '../../../../../cui'

import DeploymentTrustRelationshipFlyout from '../DeploymentTrustRelationshipFlyout'

import {
  createUpdateTrustRequestFromGetResponse,
  getAccountTrustRelationships,
  getExternalTrustRelationships,
  getTrustLevelLabel,
  getTrustRelationshipDisplayName,
  getTrustRelationshipId,
  isAccountRelationship,
  isExternalRelationship,
  isTrustRelationshipPossiblyDeleted,
} from '../../../../../lib/stackDeployments/trustRelationships'

import {
  AccountTrustRelationship,
  ExternalTrustRelationship,
  TrustRelationshipGetResponse,
} from '../../../../../lib/api/v1/types'
import { AllProps as Props } from './types'

class DeploymentTrustRelationshipTable extends Component<Props> {
  componentDidMount(): void {
    this.props.fetchCurrentAccount()
  }

  componentWillUnmount(): void {
    const { resetFetchCurrentAccount, resetUpdateStackDeployment } = this.props

    resetFetchCurrentAccount()
    resetUpdateStackDeployment()
  }

  render(): JSX.Element | null {
    const {
      currentAccount,
      deployment,
      trustRelationships,
      updateStackDeploymentRequest,
      fetchTrustRelationshipsRequest,
    } = this.props

    const localTrustRelationships = getAccountTrustRelationships({ deployment })
    const externalTrustRelationships = getExternalTrustRelationships({ deployment })

    // If the user doesn't have a local trust relationship, create a default one for them to edit
    if (!localTrustRelationships.length && currentAccount) {
      localTrustRelationships.push({
        account_id: currentAccount.id,
        trust_all: false,
      })
    }

    const columns: Array<CuiTableColumn<AccountTrustRelationship | ExternalTrustRelationship>> = [
      {
        label: (
          <FormattedMessage
            id='deploymentTrustManagement.table.name'
            defaultMessage='Environment name'
          />
        ),
        render: (trustRelationship) => (
          <DeploymentTrustRelationshipFlyout
            deployment={deployment}
            trustRelationships={trustRelationships}
            trustRelationship={trustRelationship}
          >
            {({ openFlyout }) => (
              <EuiLink onClick={openFlyout}>
                {getDisplayName({ trustRelationships, trustRelationship })}
                {isTrustRelationshipPossiblyDeleted(
                  trustRelationships,
                  getTrustRelationshipId({ trustRelationship }),
                ) && (
                  <EuiToolTip
                    position='bottom'
                    content={
                      <FormattedMessage
                        id='deploymentTrustManagement.table.possibly-deleted'
                        defaultMessage='This environment has been removed from your trusted environments, and will need to be removed from the deployment before making further changes.'
                      />
                    }
                  >
                    <EuiIcon type='alert' color='danger' />
                  </EuiToolTip>
                )}
              </EuiLink>
            )}
          </DeploymentTrustRelationshipFlyout>
        ),
      },
      {
        label: (
          <FormattedMessage
            id='deploymentTrustManagement.table.trustLevel'
            defaultMessage='Trust level'
          />
        ),
        render: ({ trust_all, trust_allowlist }) => {
          const count = trust_allowlist?.length

          if (!trust_all && count) {
            return (
              <FormattedMessage
                id='deploymentTrustManagement.trustLevelLabels.count'
                defaultMessage='Trust { count } {count, plural, one {deployment} other {deployments}}'
                values={{ count }}
              />
            )
          }

          return <FormattedMessage {...getTrustLevelLabel(trust_all ? `all` : `none`)} />
        },
      },
      {
        label: (
          <FormattedMessage id='deploymentTrustManagement.table.actions' defaultMessage='Actions' />
        ),
        actions: true,
        width: `75px`,
        render: (trustRelationship) => (
          <EuiFlexGroup gutterSize='xs'>
            <EuiFlexItem>
              <DeploymentTrustRelationshipFlyout
                deployment={deployment}
                trustRelationships={trustRelationships}
                trustRelationship={trustRelationship}
              >
                {({ openFlyout }) => (
                  <CuiButtonIcon
                    disabled={updateStackDeploymentRequest.inProgress}
                    iconType='pencil'
                    aria-label='edit'
                    onClick={openFlyout}
                  />
                )}
              </DeploymentTrustRelationshipFlyout>
            </EuiFlexItem>

            {isExternalRelationship(trustRelationship) && (
              <EuiFlexItem>
                <CuiButtonIcon
                  disabled={updateStackDeploymentRequest.inProgress}
                  iconType='cross'
                  aria-label='delete'
                  onClick={() => this.onDelete(trustRelationship)}
                  confirm={true}
                  confirmModalProps={{
                    body: (
                      <FormattedMessage
                        id='deploymentTrustManagement.table.actions.delete-confirmation'
                        defaultMessage='This will remove the relationship with the {name} environment.'
                        values={{
                          name: (
                            <strong>
                              {getDisplayName({ trustRelationships, trustRelationship })}
                            </strong>
                          ),
                        }}
                      />
                    ),
                  }}
                />
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        ),
      },
    ]

    return (
      <CuiTable<AccountTrustRelationship | ExternalTrustRelationship>
        rows={[...localTrustRelationships, ...externalTrustRelationships]}
        getRowId={(trustRelationship) => getTrustRelationshipId({ trustRelationship })}
        columns={columns}
        initialLoading={!fetchTrustRelationshipsRequest.isDone}
      />
    )
  }

  onDelete(trustRelationship: AccountTrustRelationship | ExternalTrustRelationship): void {
    const { deployment, updateStackDeployment } = this.props

    const id = getTrustRelationshipId({ trustRelationship })
    const isAccount = isAccountRelationship(trustRelationship)

    const trustRelationships: Array<AccountTrustRelationship | ExternalTrustRelationship> =
      isAccount
        ? getAccountTrustRelationships({ deployment })
        : getExternalTrustRelationships({ deployment })

    const payload = createUpdateTrustRequestFromGetResponse({
      deployment,
      trustRelationships: trustRelationships.filter(
        (_trustRelationship) =>
          getTrustRelationshipId({ trustRelationship: _trustRelationship }) !== id,
      ),
      type: isAccount ? `accounts` : `external`,
      replace: true,
    })

    updateStackDeployment(payload)
  }
}

function getDisplayName({
  trustRelationship,
  trustRelationships,
}: {
  trustRelationship: AccountTrustRelationship | ExternalTrustRelationship
  trustRelationships: TrustRelationshipGetResponse[]
}): string {
  return getTrustRelationshipDisplayName(
    trustRelationships,
    getTrustRelationshipId({ trustRelationship }),
  )
}

export default DeploymentTrustRelationshipTable
