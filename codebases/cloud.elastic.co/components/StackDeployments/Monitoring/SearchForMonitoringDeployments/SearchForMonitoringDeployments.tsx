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
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import { CuiDeploymentPicker, CuiRouterLinkButton, withErrorBoundary } from '../../../../cui'

import { searchDeploymentsQuery } from '../../../../lib/deploymentQuery'
import { getOrganizationId, getRegionId, getVersion } from '../../../../lib/stackDeployments'

import { DeploymentsSearchResponse, SearchRequest } from '../../../../lib/api/v1/types'
import { AsyncRequestState, StackDeployment } from '../../../../types'
import { createDeploymentUrl } from '../../../../lib/urlBuilder'

export interface Props extends WrappedComponentProps {
  deployment: StackDeployment
  searchDeployments: (query: SearchRequest) => void
  onChange: (deployment: StackDeployment | null) => void
  searchResults: DeploymentsSearchResponse | null
  searchResultsRequest: AsyncRequestState
  selectedDeployment: StackDeployment | null
}

class SearchForMonitoringDeployments extends Component<Props> {
  componentDidMount() {
    this.searchDeploymentsList({ searchValue: null })
  }

  render() {
    const { deployment, searchResultsRequest, searchResults, selectedDeployment } = this.props

    return (
      <EuiFlexGroup gutterSize='m' alignItems='flexStart'>
        <EuiFlexItem grow={true}>
          <div style={{ width: `350px`, maxWidth: `100%` }}>
            <CuiDeploymentPicker
              data-test-id='deployment-picker-dropdown'
              deployment={deployment}
              searchDeploymentsRequest={searchResultsRequest}
              searchDeploymentList={this.searchDeploymentsList}
              searchResults={searchResults}
              onChange={(value) => this.onSelectDeployment(value)}
              value={selectedDeployment}
            />
          </div>
        </EuiFlexItem>
        {searchResults && searchResults?.deployments.length <= 1 && (
          <EuiFlexItem>
            <CuiRouterLinkButton
              data-test-id='create-deployment-link'
              to={createDeploymentUrl()}
              fill={false}
            >
              <FormattedMessage
                id='deployment-monitoring-enable.create-monitoring-deployment'
                defaultMessage='Create monitoring deployment'
              />
            </CuiRouterLinkButton>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    )
  }

  onSelectDeployment = (deployment: StackDeployment | null) => {
    this.props.onChange(deployment)
  }

  searchDeploymentsList = ({ searchValue }: { searchValue: string | null }) => {
    const { deployment, searchDeployments } = this.props

    const regionId = getRegionId({ deployment })!
    const version = getVersion({ deployment })!
    const matchOrganizationId = getOrganizationId({ deployment })

    const query = searchDeploymentsQuery({ regionId, version, searchValue, matchOrganizationId })

    searchDeployments(query)
  }
}

export default injectIntl(withErrorBoundary(SearchForMonitoringDeployments))
