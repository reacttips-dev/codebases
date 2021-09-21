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

import { isEqual, xor } from 'lodash'

import React, { Fragment } from 'react'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'

import {
  EuiCheckbox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import {
  CuiFilterContext,
  CuiTable,
  CuiTableColumn,
  OnFilterChangeParams,
  nullQueryExecutor,
} from '../../../../../cui'

import StackDeploymentStatus from '../../../../../components/StackDeploymentStatus'

import { getSchema } from '../../../../../components/StackDeploymentSearch/DeploymentFilterContext/schema'

import { searchDeploymentsQuery } from '../../../../../lib/deploymentQuery'
import {
  getDisplayId,
  getDisplayName,
  getFirstEsClusterFromGet,
  getOwnerId,
} from '../../../../../lib/stackDeployments/selectors'

import { StackDeployment } from '../../../../../types'
import { AllProps, State } from './types'

const messages = defineMessages({
  filterDeploymentsPlaceholder: {
    id: 'deploymentTrustManagement.select-remotes.filterDeployments',
    defaultMessage: 'Filter deployments',
  },
  selectedLabel: {
    id: 'deploymentTrustManagement.select-remotes.deployments.selected',
    defaultMessage: 'Selected',
  },
  selectDeploymentsLabel: {
    id: 'deploymentTrustManagement.select-remotes.deployments.select-deployments',
    defaultMessage: 'Select deployments',
  },
  ownerLabel: {
    id: 'deploymentTrustManagement.select-remotes.deployments.owner',
    defaultMessage: 'Owner (user)',
  },
})

export type Props = AllProps & WrappedComponentProps

class SelectRemoteDeploymentsTable extends React.Component<Props, State> {
  state: State = {
    queryText: ``,
    queryResults: [],
  }

  componentDidMount(): void {
    this.searchEligibleRemoteDeployments()
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    const { queryText } = this.state

    if (!isEqual(queryText, prevState.queryText)) {
      this.searchEligibleRemoteDeployments()
    }
  }

  componentWillUnmount(): void {
    this.props.resetSearchCcsEligibleRemoteDeployments()
  }

  render(): JSX.Element {
    const {
      intl: { formatMessage },
      eligibleRemoteDeployments,
      searchEligibleRemoteDeploymentsRequest,
    } = this.props
    const { queryText, queryResults } = this.state

    const { schema } = getSchema()
    const isLoading = !searchEligibleRemoteDeploymentsRequest.isDone

    return (
      <Fragment>
        <EuiSpacer />

        <CuiFilterContext<StackDeployment>
          query={queryText}
          onChange={this.onFilter.bind(this)}
          records={eligibleRemoteDeployments}
          schema={schema}
          executeQuery={nullQueryExecutor}
          placeholder={formatMessage(messages.filterDeploymentsPlaceholder)}
          isLoading={isLoading}
          incremental={false}
        />

        <EuiSpacer />

        <CuiTable<StackDeployment>
          rows={queryResults}
          columns={this.getColumns()}
          initialLoading={isLoading}
          pageSize={5}
        />
      </Fragment>
    )
  }

  getColumns(): Array<CuiTableColumn<StackDeployment>> {
    const {
      intl: { formatMessage },
    } = this.props

    return [
      {
        mobile: {
          label: formatMessage(messages.selectedLabel),
        },
        render: (deployment) => {
          // This is safe to rely on, as the search query requires an ES resource
          const { id } = getFirstEsClusterFromGet({ deployment })!

          return (
            <EuiCheckbox
              id={id}
              checked={this.isDeploymentSelected(deployment)}
              onChange={() => this.toggleLocalTrustedDeployment(id)}
            />
          )
        },
        sortKey: (deployment) => this.isDeploymentSelected(deployment),
        textOnly: false,
        width: `30px`,
      },
      {
        label: formatMessage(messages.selectDeploymentsLabel),
        sortKey: [
          (deployment) => getDisplayName({ deployment }),
          (deployment) => getDisplayId({ deployment }),
        ],
        textOnly: false,
        render: (deployment) => (
          <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
            <EuiFlexItem grow={false}>
              <StackDeploymentStatus deployment={deployment} iconShape='dot' />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFormHelpText style={{ paddingTop: 0 }}>
                {getDisplayId({ deployment })}
              </EuiFormHelpText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText>{getDisplayName({ deployment })}</EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        ),
      },
      {
        label: formatMessage(messages.ownerLabel),
        render: (deployment) => getOwnerId({ deployment }),
        sortKey: (deployment) => getOwnerId({ deployment }),
        width: `110px`,
      },
    ]
  }

  isDeploymentSelected(deployment: StackDeployment): boolean {
    const { trustedClusterIds } = this.props

    // This is safe to rely on, as the search query requires an ES resource
    const { id } = getFirstEsClusterFromGet({ deployment })!

    return trustedClusterIds.includes(id)
  }

  toggleLocalTrustedDeployment(id: string): void {
    const { onChange, trustedClusterIds } = this.props

    onChange(xor(trustedClusterIds, [id]))
  }

  onFilter({ query: { text }, queryResults }: OnFilterChangeParams<StackDeployment>): void {
    this.setState({
      queryText: text,
      queryResults,
    })
  }

  searchEligibleRemoteDeployments = () => {
    const { searchEligibleRemoteDeployments } = this.props
    const { queryText } = this.state

    const query = searchDeploymentsQuery({
      searchValue: queryText,
    })

    searchEligibleRemoteDeployments(query)
  }
}

export default injectIntl(SelectRemoteDeploymentsTable)
