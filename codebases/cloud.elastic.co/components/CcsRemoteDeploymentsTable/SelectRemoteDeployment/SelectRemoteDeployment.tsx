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

import { CuiDeploymentPicker } from '../../../cui'

import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

import { AllProps as Props } from './types'

class SelectRemoteDeployment extends Component<Props> {
  componentDidMount(): void {
    this.props.searchDeployments()
  }

  render(): JSX.Element {
    const {
      deploymentSearchResults,
      onChange,
      searchDeploymentsRequest,
      searchDeployments,
      selectedDeployment,
    } = this.props

    return (
      <CuiDeploymentPicker
        searchDeploymentList={searchDeployments}
        searchDeploymentsRequest={searchDeploymentsRequest}
        searchResults={deploymentSearchResults}
        value={selectedDeployment}
        onChange={(deployment: DeploymentSearchResponse | null) => onChange(deployment)}
      />
    )
  }
}

export default SelectRemoteDeployment
