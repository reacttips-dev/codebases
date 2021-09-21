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

import React, { PureComponent, Fragment, ReactElement } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiAlert } from '../../../../../cui'

import FormattedUnit from '../FormattedUnit'
import { CuiTable, CuiTableColumn } from '../../../../../cui/Table'
import PrivacySensitiveContainer from '../../../../../components/PrivacySensitiveContainer'
import CostColumnName from '../CostColumnName'

import { getDeploymentName } from '../lib'

import { DeploymentCosts } from '../../../../../lib/api/v1/types'
import { AsyncRequestState, AccountCosts, SelectedDeployment } from '../../../../../types'

import './deploymentCostsGrid.scss'

export interface Props extends WrappedComponentProps {
  accountCosts: AccountCosts
  fetchAccountCostsRequest: AsyncRequestState
  onClickDeploymentName: (deploymentId: string) => void
  isTrialConversionUser: boolean
  isPrepaidConsumptionUser: boolean
  filterBy: SelectedDeployment[]
}

const messages = defineMessages({
  name: {
    id: `portal-deployments-table.status-name`,
    defaultMessage: `Deployment name`,
  },
})

class DeploymentCostsGrid extends PureComponent<Props> {
  render() {
    const { accountCosts, fetchAccountCostsRequest, isTrialConversionUser } = this.props
    const columns = this.getGridColumns()
    const isLoading = !accountCosts || fetchAccountCostsRequest.inProgress

    if (fetchAccountCostsRequest.error) {
      return <CuiAlert type='error'>{fetchAccountCostsRequest.error}</CuiAlert>
    }

    const rows = this.getGridRows()

    return (
      <div className='deployment-costs-grid' data-test-id='deployment-costs-grid'>
        {!isLoading && rows && rows.length === 0 ? (
          <EuiEmptyPrompt
            title={
              <h4>
                <FormattedMessage
                  id='deployment-costs-grid.empty-title'
                  defaultMessage='Deployments breakdown'
                />
              </h4>
            }
            body={
              <FormattedMessage
                id='deployment-costs-grid.empty-body'
                defaultMessage='Breakdown of deployments costs will be here.'
              />
            }
          />
        ) : (
          <CuiTable<DeploymentCosts>
            getRowId={(item, rowIndex) => item.deployment_id || rowIndex.toString()}
            rows={rows}
            columns={columns.items}
            hasFooterRow={true}
            initialSort={columns.initialSort}
            initialSortDirection='desc'
            initialLoading={isLoading}
          />
        )}

        {isTrialConversionUser && (
          <Fragment>
            <EuiSpacer size='s' />

            <EuiFlexGroup gutterSize='xs' justifyContent='flexEnd'>
              <EuiFlexItem grow={false}>
                <sup>*</sup>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiText textAlign='right' size='xs' data-test-id='includes-free-trial-usage-info'>
                  <FormattedMessage
                    id='deployment-costs-grid.including-free-trial-usage'
                    defaultMessage='This amount includes your free trial usage, which gets removed from your final bill.'
                  />
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </Fragment>
        )}
      </div>
    )
  }

  renderDeploymentName(deploymentCosts: DeploymentCosts): ReactElement | string {
    const { onClickDeploymentName } = this.props
    const { deployment_id, deployment_name } = deploymentCosts
    /* In some cases system deployments have an Id of `` returned from the deployment costs API. In these cases,
    this is displayed as text rather than as a link because deployment cost details (products) cannot be queried/rendered
     */

    if (deployment_id) {
      return (
        <EuiLink
          onClick={() => onClickDeploymentName(deployment_id)}
          className='deployment-costs-grid-deployment-name-link'
        >
          {getDeploymentName(deploymentCosts)}
        </EuiLink>
      )
    }

    return deployment_name
  }

  getTotalCosts(key) {
    const { accountCosts } = this.props
    return accountCosts[key]
  }

  getGridRows(): DeploymentCosts[] {
    const { accountCosts, filterBy } = this.props

    if (!accountCosts) {
      return []
    }

    const { deployments } = accountCosts

    if (filterBy.length > 0) {
      const ids = filterBy.map((item) => item.id || item.label)
      return deployments.filter((item) => ids.includes(item.deployment_id || item.deployment_name))
    }

    return deployments
  }

  getGridColumns(): {
    items: Array<CuiTableColumn<any>>
    initialSort: CuiTableColumn<any>
  } {
    const nameColumn = this.getNameColumn()
    const totalCostColumn = this.getTotalCostColumn()

    return {
      initialSort: totalCostColumn,
      items: [
        nameColumn,
        {
          id: 'deployment-costs-grid.capacity',
          label: (
            <CostColumnName>
              <FormattedMessage id='deployment-costs-grid.capacity' defaultMessage='Capacity' />
            </CostColumnName>
          ),
          render: (deploymentCost: any) => {
            const { costs } = deploymentCost
            return <FormattedUnit withSymbol={false} value={costs.resources} dp={2} />
          },
          textOnly: false,
          width: `25%`,
          align: 'right',
          footer: {
            render: () => null,
          },
        },
        {
          id: 'deployment-costs-grid.data-transfer.storage',
          label: (
            <CostColumnName>
              <FormattedMessage
                id='deployment-costs-grid.data-transfer.storage'
                defaultMessage='Data transfer and storage'
              />
            </CostColumnName>
          ),
          render: (deploymentCost: any) => {
            const { costs } = deploymentCost
            return (
              <FormattedUnit withSymbol={false} value={costs.data_transfer_and_storage} dp={2} />
            )
          },
          textOnly: false,
          width: `175px`,
          align: 'right',
          footer: {
            render: () => null,
          },
        },
        totalCostColumn,
      ],
    }
  }

  getNameColumn(): CuiTableColumn<any> {
    const {
      intl: { formatMessage },
    } = this.props

    return {
      id: 'deployment-costs-grid-deployment.name',
      label: formatMessage(messages.name),
      render: (deploymentCost: DeploymentCosts) => (
        <PrivacySensitiveContainer className='deployment-costs-grid-privacy-container'>
          <div
            className='deployment-costs-grid-deployment-name'
            data-test-id='deployment-costs-grid-deployment-name'
          >
            {this.renderDeploymentName(deploymentCost)}
          </div>
        </PrivacySensitiveContainer>
      ),
      width: `30%`,
      textOnly: false,
      footer: {
        render: () => <FormattedMessage id='deployment-costs-grid.total' defaultMessage='Total' />,
      },
    }
  }

  getTotalCostColumn(): CuiTableColumn<any> {
    const { isTrialConversionUser } = this.props

    return {
      id: 'deployment-costs-grid.total-cost',
      label: (
        <CostColumnName>
          <FormattedMessage id='deployment-costs-grid.total-cost' defaultMessage='Total cost' />
        </CostColumnName>
      ),
      render: (deploymentCost: any) => {
        const { costs } = deploymentCost
        return (
          <EuiText size='s' className='cost-analysis-grid-no-wrap-text'>
            <FormattedUnit withSymbol={false} value={costs.total} dp={2} />
          </EuiText>
        )
      },
      sortKey: [`total_cost`],
      width: `130px`,
      textOnly: false,
      align: 'right',
      footer: {
        render: () => (
          <span data-test-id='cost-analysis-grid-total'>
            <FormattedUnit withSymbol={false} value={this.getTotalCosts('total_cost')} dp={2} />
            {isTrialConversionUser && <sup data-test-id='trial-conversion-info-annotation'>*</sup>}
          </span>
        ),
      },
    }
  }
}

export default injectIntl(DeploymentCostsGrid)
