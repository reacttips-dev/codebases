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

import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFormRow } from '@elastic/eui'

import { CuiClusterPicker } from '../../../../../cui'

import PrivacySensitiveContainer from '../../../../../components/PrivacySensitiveContainer'

import { createClusterQuery } from '../../../../../lib/clusterQuery'

import { getHerokuCluster } from '../../../../../lib/heroku'

import { AsyncRequestState, ElasticsearchCluster } from '../../../../../types'
import { SearchRequest } from '../../../../../lib/api/v1/types'

type Props = {
  error?: ReactNode
  onDeploymentChosen: (deploymentId: string | null) => void
  search: (query: SearchRequest) => void
  searchRequest: AsyncRequestState
  searchResults?: {
    matchCount: number
    totalCount: number
    record: ElasticsearchCluster[]
  }
}

type State = {
  selectedDeployment: ElasticsearchCluster | null
}

class SearchDeployments extends Component<Props, State> {
  state: State = {
    selectedDeployment: null,
  }

  componentDidMount() {
    const herokuCluster = getHerokuCluster()

    if (herokuCluster) {
      // @ts-ignore: for pre-selection cases it's fine to cast, we only need the ID
      this.selectDeployment(herokuCluster as ElasticsearchCluster)
    }
  }

  render() {
    const { selectedDeployment } = this.state
    const { searchResults, searchRequest, error } = this.props

    const label = (
      <FormattedMessage
        id='help.deployment-search'
        defaultMessage='Deployment you need help with'
      />
    )

    return (
      <PrivacySensitiveContainer>
        <EuiFormRow label={label} isInvalid={Boolean(error)} error={error}>
          <CuiClusterPicker
            searchClusters={this.searchClusters}
            searchClustersRequest={searchRequest}
            clusters={searchResults ? searchResults.record : []}
            value={selectedDeployment}
            onChange={this.selectDeployment}
          />
        </EuiFormRow>
      </PrivacySensitiveContainer>
    )
  }

  selectDeployment = (deployment: ElasticsearchCluster | null) => {
    this.setState({
      selectedDeployment: deployment,
    })
    this.props.onDeploymentChosen(deployment ? deployment.id : null)
  }

  searchClusters = (userInput: string) => {
    const { search } = this.props

    const query = createClusterQuery({
      matchQuery: userInput,
      excludeStopped: false,
    })

    search(query)
  }
}

export default SearchDeployments
